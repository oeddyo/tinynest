// app/index.tsx
import { router } from "expo-router"
import { useContext, useState } from "react"
import { Text, View, Button, TextInput } from "react-native"

import { AuthContext } from "@/context/auth-context"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // When session exists, navigate to the protected home page

  const { signIn } = useContext(AuthContext)

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
        title="Sign In"
        onPress={async () => {
          await signIn(email, password)
          // redirect
          router.replace("/")
        }}
      />
    </View>
  )
}

export default LoginPage
