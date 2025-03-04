import { useQuery } from "@tanstack/react-query"
import React, { useContext } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native"
import { FlashList } from "@shopify/flash-list"
import {
  GestureHandlerRootView,
  FlingGestureHandler,
  Directions,
  State,
} from "react-native-gesture-handler"
import Modal from "react-native-modal"

import { AuthContext } from "@/context/auth-context"
import { supabase } from "@/utils/supabase"

interface MediaItem {
  id: string
  uri: string
  caption: string | null
}

const PhotoDetail = ({
  item,
  isVisible,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: {
  item: MediaItem | null
  isVisible: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
}) => {
  if (!item) return null

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.END && hasNext) {
              onNext()
            }
          }}
        >
          <FlingGestureHandler
            direction={Directions.RIGHT}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END && hasPrevious) {
                onPrevious()
              }
            }}
          >
            <View style={styles.photoDetailContainer}>
              <Image
                source={{ uri: item.uri }}
                style={styles.photoDetailImage}
                resizeMode="contain"
              />
              {item.caption && (
                <Text style={styles.photoDetailCaption}>{item.caption}</Text>
              )}
            </View>
          </FlingGestureHandler>
        </FlingGestureHandler>
      </GestureHandlerRootView>
    </Modal>
  )
}

const MediaItemComponent = ({
  item,
  onPress,
}: {
  item: MediaItem
  onPress: () => void
}) => {
  return (
    <Pressable onPress={onPress} style={styles.mediaItemContainer}>
      <Image
        source={{ uri: item.uri }}
        style={styles.mediaItem}
        resizeMode="cover"
      />
      {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
    </Pressable>
  )
}

const FeedPage = () => {
  const { session } = useContext(AuthContext)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState<
    number | null
  >(null)
  const {
    data: mediaItems,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["feedMediaItems", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) {
        throw new Error("User not authenticated")
      }

      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("uploader_id", session.user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error)
        throw error
      }

      // Generate signed URLs for each media item
      const mediaWithUrls = await Promise.all(
        (data || []).map(async (item) => {
          // Get a signed URL for the media item
          const { data: urlData } = await supabase.storage
            .from("family-media") // Make sure this matches your bucket name
            .createSignedUrl(item.storage_path, 3600) // 1 hour expiration

          return {
            ...item,
            uri: urlData?.signedUrl || "",
          }
        })
      )

      return mediaWithUrls
    },
  })

  const renderMediaItem = ({
    item,
    index,
  }: {
    item: MediaItem
    index: number
  }) => {
    return (
      <MediaItemComponent
        item={item}
        onPress={() => setSelectedPhotoIndex(index)}
      />
    )
  }

  const handleNext = () => {
    if (
      selectedPhotoIndex !== null &&
      mediaItems &&
      selectedPhotoIndex < mediaItems.length - 1
    ) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading media...</Text>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error loading media:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </View>
    )
  }

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No media-items found. Upload some photos to see them here!</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your media</Text>
      <FlashList
        data={mediaItems}
        renderItem={renderMediaItem}
        estimatedItemSize={150}
        numColumns={3}
        keyExtractor={(item) => item.id ?? ""}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
      <PhotoDetail
        item={
          selectedPhotoIndex !== null && mediaItems
            ? mediaItems[selectedPhotoIndex]
            : null
        }
        isVisible={selectedPhotoIndex !== null}
        onClose={() => setSelectedPhotoIndex(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={
          selectedPhotoIndex !== null && mediaItems
            ? selectedPhotoIndex < mediaItems.length - 1
            : false
        }
        hasPrevious={
          selectedPhotoIndex !== null ? selectedPhotoIndex > 0 : false
        }
      />
    </View>
  )
}

export default FeedPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  mediaItemContainer: {
    flex: 1,
    margin: 2,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    aspectRatio: 1,
  },
  mediaItem: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  caption: {
    padding: 12,
    fontSize: 16,
  },
  timestamp: {
    padding: 12,
    paddingTop: 0,
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  photoDetailContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  photoDetailImage: {
    width: "100%",
    height: "100%",
  },
  photoDetailCaption: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
  },
})
