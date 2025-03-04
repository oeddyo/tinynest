import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { getFamilyMembers } from "@/api/api";

const FamilyPage = () => {
  const { session } = useContext(AuthContext);
  const { data } = useQuery({
    queryKey: ["family-members", session?.user.id],
    queryFn: getFamilyMembers,
  });

  return (
    <View>
      <Text>Family Member Ids</Text>
      {data?.map((member) => {
        return <Text>{member.id}</Text>;
      })}
    </View>
  );
};

export default FamilyPage;

const styles = StyleSheet.create({});
