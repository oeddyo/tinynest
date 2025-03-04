import { router } from "expo-router"
import { useState } from "react"
import { Text, View, Button, TextInput } from "react-native"

import { supabase } from "@/utils/supabase"

const SignUpPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      alert(error.message)
      return
    }
    // On successful signup, redirect to login
    alert("Check your email to confirm your account!")
    router.replace("/login")
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign Up"
        onPress={async () => {
          await signUp(email, password)
        }}
      />
      <Button
        title="Already have an account? Login"
        onPress={() => router.push("/login")}
      />
    </View>
  )
}

export default SignUpPage
