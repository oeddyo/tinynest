import { Database } from "@/types/database.types";
import { supabase } from "@/utils/supabase";


const getFamilyMembers = async (): Promise<Database["public"]["Tables"]["family_memberships"]["Row"][]> => {
  const { data, error } = await supabase.from("family_memberships").select("*");

  if (error) {
    throw error;
  }
  return data
};
