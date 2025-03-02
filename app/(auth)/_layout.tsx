// app/(auth)/_layout.tsx
import { AuthContext } from "@/context/auth-context";
import { Redirect, Tabs } from "expo-router";
import { useContext } from "react";
import { Text } from "react-native";

const AuthLayout = () => {
  const { session, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default AuthLayout;
