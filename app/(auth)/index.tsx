// app/(auth)/index.tsx
import { AuthContext } from "@/context/auth-context";
import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Photo } from "@/types/photo";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/utils/supabase";
import { decode } from "base64-arraybuffer";

export default function Home() {
  const { signOut, session } = useContext(AuthContext);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhotos = async () => {
    if (!session?.user.id) {
      alert("Please sign in to upload photos");
      return;
    }

    const familyId = "ff7a4faf-806a-4573-bc54-ba0543c6126f";
    setIsUploading(true);

    try {
      // upload to storage
      const uploadPromises = photos.map(async (photo) => {
        const filePath = photo.name;
        const fileUri = photo.uri;
        // Read file as base64
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // uplod to supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, decode(fileBase64), {
            contentType: photo.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Upload error: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("photos")
          .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;
        console.log("public url = ", publicUrl);
        const { data: photoRecord, error: insertError } = await supabase
          .from("photos")
          .insert({
            family_id: familyId,
            uploader_id: session.user.id,
            file_url: publicUrl,
            caption: photo.caption || null,
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(`Database error: ${insertError.message}`);
        }

        return photoRecord;
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      setIsUploading(false);
      alert(`Successfully uploaded ${uploadedPhotos.length} photos!`);
    } catch (err) {
      console.log(err);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      alert(
        "We need your permission to show the photos library. Please go to settings and grant permission."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const photos: Photo[] = result.assets.map((asset) => {
        const uriParts = asset.uri.split("/");
        const name = uriParts[uriParts.length - 1];
        return {
          uri: asset.uri,
          name,
          type: "image/jpeg",
        };
      });
      setPhotos(photos);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Sign out" onPress={signOut} />
      <View>
        <Text>Add Your First Photo</Text>
        <Button title="Add Photo" onPress={pickImage} />
        <Text>You Have {photos.length} Selected Photos</Text>
        <Button title="Upload" onPress={uploadPhotos} />
        <Text>{`Is Uploading: ${isUploading}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});
