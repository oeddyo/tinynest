import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext({
  session: null,
  signIn: async (email: string, password: string) => {},
  signOut: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from current session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) Alert.alert(error.message);
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) Alert.alert(error.message);
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
