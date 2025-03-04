-- Create the family_media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('family_media', 'family_media', false)
ON CONFLICT (id) DO NOTHING;

-- Allow only admin users to upload files to their family folders
CREATE POLICY "Only admin users can upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'family_media' AND
  EXISTS (
    SELECT 1 FROM family_memberships fm
    WHERE fm.user_id = auth.uid()
    AND fm.family_id = (storage.foldername(name))[1]::uuid
    AND fm.role = 'admin'
  )
);

-- Allow all family members to view files in their family folders
CREATE POLICY "Family members can view files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'family_media' AND
  EXISTS (
    SELECT 1 FROM family_memberships fm
    WHERE fm.user_id = auth.uid()
    AND fm.family_id = (storage.foldername(name))[1]::uuid
  )
);

-- Allow admin users to update files in their family folders
CREATE POLICY "Admin users can update files" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'family_media' AND
  EXISTS (
    SELECT 1 FROM family_memberships fm
    WHERE fm.user_id = auth.uid()
    AND fm.family_id = (storage.foldername(name))[1]::uuid
    AND fm.role = 'admin'
  )
);

-- Allow admin users to delete files in their family folders
CREATE POLICY "Admin users can delete files" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'family_media' AND
  EXISTS (
    SELECT 1 FROM family_memberships fm
    WHERE fm.user_id = auth.uid()
    AND fm.family_id = (storage.foldername(name))[1]::uuid
    AND fm.role = 'admin'
  )
);
