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
  v_family_id UUID;
BEGIN
  -- Insert the family and get its ID
  INSERT INTO families (name)
  VALUES (p_name)
  RETURNING id INTO v_family_id;

  -- Create the admin membership
  INSERT INTO family_memberships (
    family_id,
    user_id,
    role,
    can_upload,
    can_view
  ) VALUES (
    v_family_id,
    p_user_id,
    'admin',
    true,
    true
  );

  -- Return the created family
  RETURN QUERY
  SELECT f.id, f.name, f.created_at
  FROM families f
  WHERE f.id = v_family_id;
END;
$$ LANGUAGE plpgsql;