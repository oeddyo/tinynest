CREATE TABLE families (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE family_memberships (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL, -- e.g., 'admin' or 'member'
  can_upload boolean NOT NULL DEFAULT false,
  can_download boolean NOT NULL DEFAULT true,
  -- You can add more permission columns as needed:
  -- can_edit boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  -- To ensure each user is only added once per family:
  UNIQUE(family_id, user_id)
);

CREATE TABLE photos (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  uploader_id uuid NOT NULL REFERENCES auth.users(id),
  file_url text NOT NULL,  -- URL in Supabase Storage
  caption text,
  created_at timestamptz DEFAULT now()
);

