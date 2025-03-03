
import { supabase } from "@/utils/supabase";
import { FamilyMembership } from "@/types/family";

export async function getUserFamilies(): Promise<FamilyMembership[]> {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from("family_memberships")
    .select(`
      id,
      family_id,
      user_id,
      role,
      can_upload,
      can_view,
      created_at,
      family:families(id, name, created_at)
    `)
    .eq("user_id", user.user.id);
  
  if (error) {
    console.error("Error fetching user families:", error);
    throw error;
  }
  
  return data as FamilyMembership[];
}

