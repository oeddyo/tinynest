import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button title="Sign out" onPress={handleSignOut}></Button>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
