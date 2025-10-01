-- Run this SQL in your Supabase SQL Editor to fix the permissions issue

-- First, let's check if the table exists and has RLS enabled
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'business_contacts';

-- Temporarily disable RLS to fix permissions
ALTER TABLE IF EXISTS public.business_contacts DISABLE ROW LEVEL SECURITY;

-- Grant all necessary permissions to authenticated users
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure the authenticated role exists and has proper permissions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated;
  END IF;
END $$;

-- Re-enable RLS
ALTER TABLE IF EXISTS public.business_contacts ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view their own contacts" ON public.business_contacts;
DROP POLICY IF EXISTS "Users can create their own contacts" ON public.business_contacts;
DROP POLICY IF EXISTS "Users can update their own contacts" ON public.business_contacts;
DROP POLICY IF EXISTS "Users can delete their own contacts" ON public.business_contacts;

-- Create simple, working policies
CREATE POLICY "authenticated_select" ON public.business_contacts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "authenticated_insert" ON public.business_contacts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_update" ON public.business_contacts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "authenticated_delete" ON public.business_contacts
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create a simple function to insert contacts
CREATE OR REPLACE FUNCTION public.insert_contact(
  contact_name TEXT,
  contact_company TEXT DEFAULT NULL,
  contact_phone TEXT DEFAULT NULL,
  contact_email TEXT DEFAULT NULL,
  contact_website TEXT DEFAULT NULL,
  contact_address TEXT DEFAULT NULL,
  contact_notes TEXT DEFAULT NULL,
  contact_tags TEXT[] DEFAULT '{}'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_contact business_contacts;
BEGIN
  -- Insert the new contact
  INSERT INTO business_contacts (
    user_id, name, company, phone, email, website, address, notes, tags
  ) VALUES (
    auth.uid(), contact_name, contact_company, contact_phone, 
    contact_email, contact_website, contact_address, contact_notes, contact_tags
  ) RETURNING * INTO new_contact;
  
  -- Return as JSON
  RETURN row_to_json(new_contact);
END;
$$;
