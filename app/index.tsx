import { Redirect } from "expo-router"
import { useAuth } from "@/context/auth-context"

export default function Index() {
  const { session } = useAuth()

  // If user is authenticated, go to the auth area
  if (session) {
    return <Redirect href="/(auth)" />
  }

  // Otherwise, go to welcome page
  return <Redirect href="/welcome" />
}
