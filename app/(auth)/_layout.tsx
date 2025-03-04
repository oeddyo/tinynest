// app/(auth)/_layout.tsx
import { Redirect, Tabs } from "expo-router"
import { useContext } from "react"
import { Text } from "react-native"

import { AuthContext } from "@/context/auth-context"

const AuthLayout = () => {
  const { session, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (!session) {
    return <Redirect href="/login" />
  }

  return (
    <Tabs>
      <Tabs.Screen name="feed" options={{ title: "Feed" }} />
      <Tabs.Screen name="index" options={{ title: "Add Photo" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="family" options={{ title: "Family" }} />
    </Tabs>
  )
}

export default AuthLayout
