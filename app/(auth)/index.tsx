// app/(auth)/index.tsx
import { AuthContext } from "@/context/auth-context";
import React, { useContext } from "react";
import { View, Text, Button } from "react-native";

export default function Home() {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Main page... you can sign out...</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}
