import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Media } from "@/types/photo";
import { supabase } from "@/utils/supabase";

const FeedPage = () => {
  const { session } = useContext(AuthContext);
  const {
    data: photos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Media[]>({
    queryKey: ["feedPhotos", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("uploader_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const photosWithSignedUrls = await Promise.all(
        data.map(async (photo: Media) => {
          console.log("before sign url = ", photo.file_url);
          const { data: signedUrlData, error: signError } =
            await supabase.storage
              .from("photos")
              .createSignedUrl(photo.file_url, 60);

          if (signError) {
            console.error(signError.message);
            throw signError;
          }
          return {
            ...photo,
            file_url: signedUrlData.signedUrl,
          };
        })
      );
      return photosWithSignedUrls || [];
    },
  });

  // Render a photo item
  const renderPhotoItem = ({ item }: { item: Media }) => {
    console.log("so url = ", item.file_url);
    return (
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: item.file_url }}
          style={styles.photo}
          resizeMode="cover"
          onLoad={() => console.log("Image loaded:", item.file_url)}
          onError={(error) =>
            console.log("Image error:", error.nativeEvent.error, item.file_url)
          }
        />
        {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading photos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error loading photos:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </View>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No photos found. Upload some photos to see them here!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Photos</Text>
      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id ?? ""}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </View>
  );
};

export default FeedPage;

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
  photoContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photo: {
    width: "100%",
    height: 300,
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
});
