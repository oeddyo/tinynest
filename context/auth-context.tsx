import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

type AuthContextType = {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  signIn: async () => {},
  signOut: async () => {},
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from current session
  useEffect(() => {
    // Get the current session and update state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoading(true);
        setSession(session);
        setIsLoading(false);
      }
    );

    // Clean up the subscription when the component unmounts
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) Alert.alert(error.message);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
