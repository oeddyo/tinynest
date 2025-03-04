// app/(auth)/_layout.tsx
import { Redirect, Stack, Tabs } from "expo-router"
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
    <Stack>
      <Stack.Screen name="index" options={{ title: "Family" }} />
      <Stack.Screen
        name="family/[id]"
        options={{
          gestureEnabled: false, // Disable swipe back gesture
          headerBackVisible: false, // Hide back button
          headerShown: false,
        }}
      />
    </Stack>
  )
}

export default AuthLayout
