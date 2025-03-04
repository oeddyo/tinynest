import { Database } from "@/types/database.types"
import { supabase } from "@/utils/supabase"

const getFamilyMembers = async (): Promise<
  Database["public"]["Tables"]["family_memberships"]["Row"][]
> => {
  const { data, error } = await supabase.from("family_memberships").select("*")

  if (error) {
    throw error
  }
  return data
}

const getFamiliesForUser = async (
  userId: string
): Promise<Database["public"]["Tables"]["families"]["Row"][]> => {
  const { data, error } = await supabase
    .from("family_memberships")
    .select(
      `
    id,
    role,
    can_upload,
    can_view,
    families:family_id (
      id,
      name,
      created_at
    )
  `
    )
    .eq("user_id", userId)

  if (error) {
    throw error
  }
  // Extract just the families from the results
  return data?.map((membership) => membership.families) || []
}

const createFamily = async (
  name: string,
  userId: string
): Promise<Database["public"]["Tables"]["families"]["Row"]> => {
  const { data, error } = await supabase.rpc("create_family_with_admin", {
    p_name: name,
    p_user_id: userId,
  })

  if (error) {
    throw error
  }
  return data
}

export { getFamilyMembers, getFamiliesForUser, createFamily }
