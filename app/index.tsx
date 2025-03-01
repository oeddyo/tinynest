import { Text, View, Button } from "react-native";

export default function Page() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
        title="Click me twice3"
        onPress={() => alert('Button pressed!')}
      />
    </View>
  );
}
