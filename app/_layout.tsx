// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Redirect, Slot } from "expo-router"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"

import { AuthProvider, useAuth } from "@/context/auth-context"

const queryClient = new QueryClient()

// This component handles the initial routing based on auth state
function InitialLayout() {
  const { session, isLoading } = useAuth()
  const [isFirstLaunch, setIsFirstLaunch] = useState(true)

  // Check if this is the first launch
  useEffect(() => {
    // If we have session data (loading complete), we're no longer in first launch state
    if (!isLoading) {
      setIsFirstLaunch(false)
    }
  }, [isLoading])

  // Show loading indicator while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  // If it's the first launch and no session, redirect to welcome
  if (isFirstLaunch && !session) {
    return <Redirect href="/welcome" />
  }

  // Otherwise, render the requested route
  return <Slot />
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </QueryClientProvider>
  )
}
