// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Slot } from "expo-router"

import { AuthProvider } from "@/context/auth-context"
const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  )
}
