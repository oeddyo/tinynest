import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { getFamiliesForUser, getFamilyMembers } from "@/api/api";

const FamilyPage = () => {
  const { session } = useContext(AuthContext);
  const { data } = useQuery({
    queryKey: ["families", session?.user.id],
    queryFn: () => getFamiliesForUser(session?.user.id as string),
  });

  return (
    <View>
      <Text>Family Member Ids</Text>
      {data?.map((family) => {
        return <Text>{family.name}</Text>;
      })}
    </View>
  );
};

export default FamilyPage;

const styles = StyleSheet.create({});
