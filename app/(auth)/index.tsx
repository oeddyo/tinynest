// app/(auth)/index.tsx
import { AuthContext } from "@/context/auth-context";
import React, { useContext, useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Home() {
  const { signOut } = useContext(AuthContext);
  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    console.log("Picking image");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });

    console.log(result);

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Main page... you can sign out...</Text>
      <Button title="Sign out" onPress={signOut} />

      <View>
        <Text>Selected Photo</Text>
        {photo && <Image source={{ uri: photo }} style={styles.image} />}
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
