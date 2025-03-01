import { supabase } from "@/utils/supabase";
import { useState } from "react";
import { Text, View, Button, TextInput, Alert } from "react-native";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUpPress = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    }
    console.log(data);
  };

  const onSignInPress = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert(error.message);
    }
  };

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
        secureTextEntry={true}
      />
      <Button title="Sign Up" onPress={onSignUpPress} />
      <Button title="Sign In" onPress={onSignInPress} />
    </View>
  );
}
