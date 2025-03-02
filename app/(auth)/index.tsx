// app/(auth)/index.tsx
import { AuthContext } from "@/context/auth-context";
import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Photo } from "@/types/photo";

export default function Home() {
  const { signOut, session } = useContext(AuthContext);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const uploadPhotos = async () => {
    if (!session?.user.id) {
      alert("Please sign in to upload photos");
      return;
    }

    const familyId = "xiefamily";
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
