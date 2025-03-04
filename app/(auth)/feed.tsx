import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";

import { AuthContext } from "@/context/auth-context";
import { supabase } from "@/utils/supabase";

interface MediaItem {
  id: string;
  uri: string;
  caption: string | null;
}

const FeedPage = () => {
  const { session } = useContext(AuthContext);
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
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("uploader_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        throw error;
      }

      // Generate signed URLs for each media item
      const mediaWithUrls = await Promise.all(
        (data || []).map(async (item) => {
          // Get a signed URL for the media item
          const { data: urlData } = await supabase.storage
            .from("family-media") // Make sure this matches your bucket name
            .createSignedUrl(item.storage_path, 3600); // 1 hour expiration

          return {
            ...item,
            uri: urlData?.signedUrl || "",
          };
        })
      );

      return mediaWithUrls;
    },
  });

  // Render a media item
  const renderMediaItem = ({ item }: { item: MediaItem }) => {
    return (
      <View style={styles.mediaItemContainer}>
        <Image
          source={{ uri: item.uri }}
          style={styles.mediaItem}
          resizeMode="cover"
        />
        {item.caption && <Text style={styles.caption}>{item.caption}</Text>}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading media...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Error loading media:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </View>
    );
  }

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No media-items found. Upload some photos to see them here!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your media</Text>
      <FlatList
        data={mediaItems}
        renderItem={renderMediaItem}
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
  mediaItemContainer: {
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
  mediaItem: {
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
