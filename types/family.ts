

export type Family = {
  id: string;
  name: string;
  created_at: string;
};

export type FamilyMembership = {
  id: string;
  family_id: string;
  user_id: string;
  role: "admin" | "member" | "viewer";
  can_upload: boolean;
  can_view: boolean;
  created_at: string;
  family: Family;
};

