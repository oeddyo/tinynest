import { supabase } from "@/utils/supabase";
import { Database, Tables } from "@/types/database.types";

const fetchFamilyMembers = async (): Promise<
  Database["public"]["Tables"]["family_memberships"]["Row"][]
> => {
  const { data, error } = await supabase.from("family_memberships").select("*");

  if (error) {
    throw error;
  }

  return data;
};

export { fetchFamilyMembers };
