-- Fix infinite recursion in RLS policies by using a direct auth check
-- The issue: policies that check profiles table create infinite recursion

-- Drop all problematic policies first
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Owner can modify any profile" ON profiles;
DROP POLICY IF EXISTS "Admins and owner can insert games" ON games;
DROP POLICY IF EXISTS "Admins and owner can update games" ON games;
DROP POLICY IF EXISTS "Admins and owner can delete games" ON games;
DROP POLICY IF EXISTS "Users can view games based on restrictions" ON games;
DROP POLICY IF EXISTS "Users can view their own badges" ON user_badges;
DROP POLICY IF EXISTS "Users can view their own access requests" ON access_requests;
DROP POLICY IF EXISTS "Admins can update access requests" ON access_requests;
DROP POLICY IF EXISTS "Admins can view logs" ON admin_logs;
DROP POLICY IF EXISTS "Admins can insert logs" ON admin_logs;
DROP POLICY IF EXISTS "Owner can insert admin logs" ON admin_logs;
DROP POLICY IF EXISTS "Only owner can update global settings" ON global_settings;
DROP POLICY IF EXISTS "Only owner can view site config" ON site_config;
DROP POLICY IF EXISTS "Only owner can update site config" ON site_config;

-- Create helper function that uses SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = user_id;
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- Recreate profiles policies WITHOUT referencing profiles in USING clause
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (get_user_role(auth.uid()) IN ('admin', 'owner', 'mod'));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('admin', 'owner'));

-- Recreate games policies
CREATE POLICY "Anyone can view non-restricted games"
  ON games FOR SELECT
  USING (
    status != 'restricted' OR
    get_user_role(auth.uid()) IN ('admin', 'owner', 'tester') OR
    EXISTS (
      SELECT 1 FROM user_library 
      WHERE user_library.game_id = games.id 
      AND user_library.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert games"
  ON games FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'owner'));

CREATE POLICY "Admins can update games"
  ON games FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('admin', 'owner'));

CREATE POLICY "Admins can delete games"
  ON games FOR DELETE
  USING (get_user_role(auth.uid()) IN ('admin', 'owner'));

-- Recreate user_badges policies
CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  USING (
    auth.uid() = user_id OR 
    get_user_role(auth.uid()) IN ('admin', 'owner')
  );

-- Recreate access_requests policies
CREATE POLICY "Users can view their own access requests"
  ON access_requests FOR SELECT
  USING (
    auth.uid() = user_id OR 
    get_user_role(auth.uid()) IN ('admin', 'owner')
  );

CREATE POLICY "Admins can update access requests"
  ON access_requests FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('admin', 'owner'));

-- Recreate admin_logs policies
CREATE POLICY "Admins can view logs"
  ON admin_logs FOR SELECT
  USING (get_user_role(auth.uid()) IN ('admin', 'owner'));

CREATE POLICY "Admins can insert logs"
  ON admin_logs FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'owner'));

-- Recreate global_settings policies
CREATE POLICY "Owner can update global settings"
  ON global_settings FOR UPDATE
  USING (get_user_role(auth.uid()) = 'owner');

-- Recreate site_config policies
CREATE POLICY "Owner can view site config"
  ON site_config FOR SELECT
  USING (get_user_role(auth.uid()) = 'owner');

CREATE POLICY "Owner can update site config"
  ON site_config FOR UPDATE
  USING (get_user_role(auth.uid()) = 'owner');
