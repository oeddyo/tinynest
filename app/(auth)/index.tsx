import { useMutation, useQuery } from "@tanstack/react-query"
import { Link } from "expo-router"
import React, { useContext, useState } from "react"
import { Button, StyleSheet, Text, TextInput, View } from "react-native"

import { createFamily, getFamiliesForUser, getFamilyMembers } from "@/api/api"
import { AuthContext } from "@/context/auth-context"

const FamilyListPage = () => {
  const { session } = useContext(AuthContext)
  const { data } = useQuery({
    queryKey: ["families", session?.user.id],
    queryFn: () => getFamiliesForUser(session?.user.id as string),
  })

  const [familyName, setFamilyName] = useState("")

  const { mutate } = useMutation({
    mutationFn: (name: string) =>
      createFamily(name, session?.user.id as string),
  })

  return (
    <View>
      <Text>Family Member Ids</Text>
      {data?.map((family) => {
        return (
          <Link href={`/family/${family.id}`} key={family.id}>
            <Text>{family.name}</Text>
          </Link>
        )
      })}

      <TextInput
        value={familyName}
        onChangeText={setFamilyName}
        placeholder="Family Name"
      />
      <Button title="Create Family" onPress={() => mutate(familyName)} />
    </View>
  )
}

export default FamilyListPage

const styles = StyleSheet.create({})
