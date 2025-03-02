// app/(auth)/index.tsx
import { AuthContext } from "@/context/auth-context";
import React, { useContext } from "react";
import { View, Text, Button } from "react-native";

export default function Profile() {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Protected Home Screen</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}
