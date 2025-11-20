/*
  # Add favorites system and search improvements

  1. New Tables
    - `favorites` for storing user product favorites
    - `search_history` for tracking user searches
  
  2. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create favorites table
CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create search history table
CREATE TABLE search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  query text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Search history policies
CREATE POLICY "Users can manage their own search history"
  ON search_history FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better search performance
CREATE INDEX products_name_search_idx ON products USING gin(to_tsvector('french', name));
CREATE INDEX products_description_search_idx ON products USING gin(to_tsvector('french', coalesce(description, '')));