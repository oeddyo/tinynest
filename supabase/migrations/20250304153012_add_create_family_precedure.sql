CREATE OR REPLACE FUNCTION create_family_with_admin(
  p_name TEXT,
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  v_family RECORD;
BEGIN
  -- Insert the family and get its details
  INSERT INTO families (name)
  VALUES (p_name)
  RETURNING id, name, created_at INTO v_family;

  -- Create the admin membership
  INSERT INTO family_memberships (
    family_id,
    user_id,
    role,
    can_upload,
    can_view
  ) VALUES (
    v_family.id,
    p_user_id,
    'admin',
    true,
    true
  );

  -- Return the created family
  RETURN NEXT v_family;
END;
$$ LANGUAGE plpgsql;