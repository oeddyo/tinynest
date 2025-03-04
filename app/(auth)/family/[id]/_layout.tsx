import { Tabs } from "expo-router"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

const Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Upload" }} />
      <Tabs.Screen name="feed" options={{ title: "Feed" }} />
    </Tabs>
  )
}

export default Layout

const styles = StyleSheet.create({})
