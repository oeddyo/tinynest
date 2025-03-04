import { router } from "expo-router"
import React from "react"
import { StyleSheet, Text, View, Button, Image } from "react-native"

const WelcomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TinyNest</Text>
      <Text style={styles.subtitle}>
        Share and preserve your family moments in one secure place
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={() => router.push("/login")} />
        <View style={styles.buttonSpacer} />
        <Button title="Create Account" onPress={() => router.push("/signup")} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#666",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  buttonSpacer: {
    height: 16,
  },
})

export default WelcomePage
