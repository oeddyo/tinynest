import { useQuery } from "@tanstack/react-query"
import { Link } from "expo-router"
import React, { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"

import { getFamiliesForUser, getFamilyMembers } from "@/api/api"
import { AuthContext } from "@/context/auth-context"

const FamilyListPage = () => {
  const { session } = useContext(AuthContext)
  const { data } = useQuery({
    queryKey: ["families", session?.user.id],
    queryFn: () => getFamiliesForUser(session?.user.id as string),
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
    </View>
  )
}

export default FamilyListPage

const styles = StyleSheet.create({})
