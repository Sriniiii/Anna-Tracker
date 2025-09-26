/*
# [Initial Schema Setup - Idempotent]
This script sets up the initial database schema for the BiteWise application, including tables for profiles, inventory, waste logs, and marketplace listings. It also establishes roles, Row Level Security (RLS), and triggers for user management. This version is idempotent and can be run safely on a new or partially created database.

## Query Description: This operation is structural and safe to run. It uses "IF NOT EXISTS" and "DROP/CREATE" patterns to avoid errors on re-runs. It will create tables and security policies if they are missing, ensuring the database schema is correctly configured without affecting existing data in a destructive way.

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: false

## Structure Details:
- Tables created: `profiles`, `inventory_items`, `waste_logs`, `marketplace_listings`
- Types created: `user_role`
- Functions created: `handle_new_user`, `is_admin`
- Triggers created: `on_auth_user_created` on `auth.users`

## Security Implications:
- RLS Status: Enabled on all new tables.
- Policy Changes: Yes, policies are defined for all tables to restrict data access based on user roles (user vs. admin).
- Auth Requirements: Policies are linked to `auth.uid()`.

## Performance Impact:
- Indexes: Primary keys and foreign keys create indexes.
- Triggers: A trigger is added to `auth.users` to run after new user creation.
- Estimated Impact: Low. The trigger is lightweight and only runs on user sign-up.
*/

-- Create user_role type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('user', 'admin');
    END IF;
END$$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Stores public user profile information.';

-- Add role column to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role public.user_role NOT NULL DEFAULT 'user';
    END IF;
END$$;

-- Create inventory_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  expiration_date DATE,
  purchase_price NUMERIC,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.inventory_items IS 'Tracks individual food items in a user''s inventory.';

-- Create waste_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.waste_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  reason TEXT,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.waste_logs IS 'Records instances of food waste for tracking and analysis.';

-- Create marketplace_listings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  original_price NUMERIC,
  discounted_price NUMERIC NOT NULL,
  quantity TEXT,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.marketplace_listings IS 'Listings of surplus food available for sale or donation.';

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Drop and recreate the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create helper function to check for admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = user_id AND profiles.role = 'admin'
  );
END;
$$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Define RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all profiles." ON public.profiles;
CREATE POLICY "Admins can manage all profiles." ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));

-- Define RLS policies for inventory_items
DROP POLICY IF EXISTS "Users can manage their own inventory." ON public.inventory_items;
CREATE POLICY "Users can manage their own inventory." ON public.inventory_items FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all inventory." ON public.inventory_items;
CREATE POLICY "Admins can view all inventory." ON public.inventory_items FOR SELECT USING (public.is_admin(auth.uid()));

-- Define RLS policies for waste_logs
DROP POLICY IF EXISTS "Users can manage their own waste logs." ON public.waste_logs;
CREATE POLICY "Users can manage their own waste logs." ON public.waste_logs FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all waste logs." ON public.waste_logs;
CREATE POLICY "Admins can view all waste logs." ON public.waste_logs FOR SELECT USING (public.is_admin(auth.uid()));

-- Define RLS policies for marketplace_listings
DROP POLICY IF EXISTS "All users can view active marketplace listings." ON public.marketplace_listings;
CREATE POLICY "All users can view active marketplace listings." ON public.marketplace_listings FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Users can manage their own listings." ON public.marketplace_listings;
CREATE POLICY "Users can manage their own listings." ON public.marketplace_listings FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all listings." ON public.marketplace_listings;
CREATE POLICY "Admins can manage all listings." ON public.marketplace_listings FOR ALL USING (public.is_admin(auth.uid()));
