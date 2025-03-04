import { Database } from "@/types/database.types";
import { supabase } from "@/utils/supabase";

const getFamilyMembers = async (): Promise<
  Database["public"]["Tables"]["family_memberships"]["Row"][]
> => {
  const { data, error } = await supabase.from("family_memberships").select("*");

  if (error) {
    throw error;
  }
  return data;
};

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
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
  // Extract just the families from the results
  return data?.map((membership) => membership.families) || [];
};

export { getFamilyMembers, getFamiliesForUser };
