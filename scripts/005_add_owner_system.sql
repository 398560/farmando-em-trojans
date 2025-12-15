-- Add owner system and update for Portuguese version

-- Add configuration for owner email
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default owner email (should be changed via env var or admin panel)
INSERT INTO site_config (key, value) VALUES
  ('owner_email', 'owner@farmandoemtrojans.com')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS on site_config
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Only owner can view and modify site config
CREATE POLICY "Only owner can view site config"
  ON site_config FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'owner'
  ));

CREATE POLICY "Only owner can update site config"
  ON site_config FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'owner'
  ));

-- Function to check if user is owner based on email
CREATE OR REPLACE FUNCTION is_owner_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  owner_email_config TEXT;
BEGIN
  SELECT value INTO owner_email_config FROM site_config WHERE key = 'owner_email';
  RETURN email = owner_email_config;
END;
$$;

-- Update handle_new_user to auto-assign owner role based on email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if email matches owner email
  IF is_owner_email(new.email) THEN
    user_role := 'owner';
  ELSE
    user_role := 'user';
  END IF;

  INSERT INTO public.profiles (id, display_name, avatar_url, role, last_login)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    user_role,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET last_login = NOW();

  -- Create default accessibility settings
  INSERT INTO public.user_accessibility_settings (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- Add owner-specific permissions to all tables
-- Owner can do everything, bypassing all restrictions

-- Update games policies for owner
DROP POLICY IF EXISTS "Admins can insert games" ON games;
CREATE POLICY "Admins and owner can insert games"
  ON games FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'owner')
    )
  );

DROP POLICY IF EXISTS "Admins can update games" ON games;
CREATE POLICY "Admins and owner can update games"
  ON games FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'owner')
    )
  );

DROP POLICY IF EXISTS "Admins can delete games" ON games;
CREATE POLICY "Admins and owner can delete games"
  ON games FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'owner')
    )
  );

-- Owner can view and modify any profile
CREATE POLICY "Owner can modify any profile"
  ON profiles FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() 
    AND p.role = 'owner'
  ));

-- Owner can insert logs
CREATE POLICY "Owner can insert admin logs"
  ON admin_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'owner'
  ));

-- Create function for owner to change owner email
CREATE OR REPLACE FUNCTION update_owner_email(new_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only owner can execute this
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Only owner can update owner email';
  END IF;

  UPDATE site_config SET value = new_email, updated_at = NOW() WHERE key = 'owner_email';
  
  -- Log the action
  INSERT INTO admin_logs (admin_id, action, details)
  VALUES (auth.uid(), 'update_owner_email', jsonb_build_object('new_email', new_email));
END;
$$;
