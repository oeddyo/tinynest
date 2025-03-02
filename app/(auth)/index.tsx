// app/(auth)/index.tsx
import { AuthContext } from "@/context/auth-context";
import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Home() {
  const { signOut } = useContext(AuthContext);
  const [photos, setPhotos] = useState<string[]>([]);

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
      setPhotos(result.assets.map((asset) => asset.uri));

      console.log("now selected photos = ", photos.length);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Sign out" onPress={signOut} />
      <View>
        <Text>Add Your First Photo</Text>
        <Button title="Add Photo" onPress={pickImage} />
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
