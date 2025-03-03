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


CREATE TYPE media_type_enum AS ENUM ('photo', 'video');
CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES auth.users(id),
  media_type media_type_enum NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Common metadata
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  thumbnail_path TEXT
  
  -- Media-specific metadata (nullable)

  -- photo fields
  width INTEGER,
  height INTEGER,

  -- video fields
  duration_seconds FLOAT,
);

