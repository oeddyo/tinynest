import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFamilies } from "@/api/family";

const ManageFamilyPage = () => {
  const { data: families } = useQuery({
    queryKey: ["families"],
    queryFn: getUserFamilies,
  });
  return (
    <View>
      <Text>ManageFamilyPage</Text>
      {families?.map((family) => (
        <Text key={family.id}>{family.family.name}</Text>
      ))}
    </View>
  );
};

export default ManageFamilyPage;

const styles = StyleSheet.create({});
