import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

const  RootLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("new session = ", session)
      // Immediate navigation on session change
    });

    return () => data.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!initialized) return;
    
    const inAuthGroup = segments[0] === "(auth)";

    if (session && !inAuthGroup) {
      // Redirect authenticated users to the list page
      router.replace('/(auth)/');
    } else if (!session) {
      // Redirect unauthenticated users to the login page
      console.log("going to logged out page")
      router.replace('/');
    }
  }, [initialized, router, segments, session])

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "hi" }} />
    </Stack>
  );
}

export default RootLayout;

