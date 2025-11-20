/*
  # Seed Initial Data for Pharmacy Management System

  1. Data Creation
    - Create admin user
    - Create product categories
    - Create sample products
*/

-- Insert admin user
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@pharmacare.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, first_name, last_name, phone, address)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin',
  'Admin',
  'PharmaCare',
  '+33123456789',
  '123 Rue de la Pharmacie, 75001 Paris'
)
ON CONFLICT (id) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug, description)
VALUES
  ('Médicaments', 'medicaments', 'Médicaments sur ordonnance et en vente libre'),
  ('Parapharmacie', 'parapharmacie', 'Produits de soins et de bien-être'),
  ('Matériel médical', 'materiel-medical', 'Équipement et matériel médical')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (
  category_id,
  name,
  slug,
  description,
  price,
  requires_prescription,
  stock_quantity,
  low_stock_threshold,
  image_url
)
SELECT
  c.id,
  'Paracétamol 1000mg',
  'paracetamol-1000mg',
  'Antalgique et antipyrétique pour le traitement de la douleur et de la fièvre',
  5.90,
  false,
  100,
  20,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'medicaments'
UNION ALL
SELECT
  c.id,
  'Ibuprofène 400mg',
  'ibuprofene-400mg',
  'Anti-inflammatoire non stéroïdien pour le traitement de la douleur et de l''inflammation',
  6.90,
  false,
  80,
  15,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'medicaments'
UNION ALL
SELECT
  c.id,
  'Amoxicilline 500mg',
  'amoxicilline-500mg',
  'Antibiotique de la famille des bêta-lactamines',
  12.90,
  true,
  50,
  10,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'medicaments'
UNION ALL
SELECT
  c.id,
  'Crème hydratante',
  'creme-hydratante',
  'Crème hydratante pour le visage et le corps',
  15.90,
  false,
  30,
  5,
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'parapharmacie'
UNION ALL
SELECT
  c.id,
  'Thermomètre digital',
  'thermometre-digital',
  'Thermomètre digital précis et facile à utiliser',
  19.90,
  false,
  25,
  5,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'materiel-medical'
ON CONFLICT (slug) DO NOTHING;