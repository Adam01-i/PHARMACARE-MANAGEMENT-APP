/*
  # Add realistic pharmacy data

  1. New Data
    - Add more realistic product categories
    - Add comprehensive list of medications and medical supplies
    - Add realistic prices and descriptions
    - Add proper stock quantities and thresholds
*/

-- Insert more detailed categories
INSERT INTO categories (name, slug, description)
VALUES
  ('Médicaments sans ordonnance', 'medicaments-sans-ordonnance', 'Médicaments disponibles sans prescription médicale'),
  ('Médicaments sur ordonnance', 'medicaments-sur-ordonnance', 'Médicaments nécessitant une prescription médicale'),
  ('Premiers secours', 'premiers-secours', 'Matériel et produits de premiers soins'),
  ('Soins du corps', 'soins-du-corps', 'Produits pour l''hygiène et le soin du corps'),
  ('Vitamines et compléments', 'vitamines-et-complements', 'Compléments alimentaires et vitamines'),
  ('Matériel médical', 'materiel-medical', 'Équipements et appareils médicaux'),
  ('Orthopédie', 'orthopedie', 'Produits et supports orthopédiques'),
  ('Bébé et maternité', 'bebe-et-maternite', 'Produits pour bébés et futures mamans')
ON CONFLICT (slug) DO NOTHING;

-- Insert realistic products
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
  'Doliprane 1000mg',
  'doliprane-1000mg',
  'Paracétamol pour le traitement de la douleur et de la fièvre. Boîte de 8 comprimés.',
  2.95,
  false,
  150,
  30,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'medicaments-sans-ordonnance'
UNION ALL
SELECT
  c.id,
  'Advil 400mg',
  'advil-400mg',
  'Anti-inflammatoire non stéroïdien. Boîte de 14 comprimés.',
  4.90,
  false,
  120,
  25,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'medicaments-sans-ordonnance'
UNION ALL
SELECT
  c.id,
  'Amoxicilline 1g',
  'amoxicilline-1g',
  'Antibiotique à large spectre. Boîte de 14 comprimés.',
  8.50,
  true,
  80,
  20,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'medicaments-sur-ordonnance'
UNION ALL
SELECT
  c.id,
  'Levothyrox 100µg',
  'levothyrox-100',
  'Hormone thyroïdienne de synthèse. Boîte de 30 comprimés.',
  3.95,
  true,
  60,
  15,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'medicaments-sur-ordonnance'
UNION ALL
SELECT
  c.id,
  'Kit premiers secours basic',
  'kit-premiers-secours-basic',
  'Kit complet avec pansements, compresses, ciseaux et antiseptique.',
  24.90,
  false,
  40,
  10,
  'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'premiers-secours'
UNION ALL
SELECT
  c.id,
  'Compresses stériles',
  'compresses-steriles',
  'Lot de 10 compresses stériles 10x10cm.',
  3.50,
  false,
  200,
  50,
  'https://images.unsplash.com/photo-1583912267550-d6c2ac4b0154?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'premiers-secours'
UNION ALL
SELECT
  c.id,
  'Gel douche surgras',
  'gel-douche-surgras',
  'Gel douche hydratant pour peaux sensibles. 400ml.',
  8.90,
  false,
  75,
  15,
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'soins-du-corps'
UNION ALL
SELECT
  c.id,
  'Crème mains réparatrice',
  'creme-mains-reparatrice',
  'Crème réparatrice pour mains très sèches. 75ml.',
  6.90,
  false,
  60,
  12,
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'soins-du-corps'
UNION ALL
SELECT
  c.id,
  'Vitamine D3 1000UI',
  'vitamine-d3-1000ui',
  'Complément en vitamine D3. Flacon de 90 capsules.',
  12.90,
  false,
  100,
  20,
  'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'vitamines-et-complements'
UNION ALL
SELECT
  c.id,
  'Magnésium B6',
  'magnesium-b6',
  'Complément en magnésium et vitamine B6. Boîte de 60 gélules.',
  9.90,
  false,
  85,
  20,
  'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'vitamines-et-complements'
UNION ALL
SELECT
  c.id,
  'Tensiomètre électronique',
  'tensiometre-electronique',
  'Tensiomètre automatique pour mesure de la tension artérielle.',
  49.90,
  false,
  30,
  5,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'materiel-medical'
UNION ALL
SELECT
  c.id,
  'Thermomètre frontal',
  'thermometre-frontal',
  'Thermomètre infrarouge sans contact.',
  39.90,
  false,
  25,
  5,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'materiel-medical'
UNION ALL
SELECT
  c.id,
  'Genouillère élastique',
  'genouillere-elastique',
  'Genouillère de maintien taille L.',
  19.90,
  false,
  40,
  8,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'orthopedie'
UNION ALL
SELECT
  c.id,
  'Semelles orthopédiques',
  'semelles-orthopediques',
  'Semelles orthopédiques universelles.',
  29.90,
  false,
  35,
  7,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'orthopedie'
UNION ALL
SELECT
  c.id,
  'Lait infantile 1er âge',
  'lait-infantile-1er-age',
  'Lait en poudre pour nourrissons 0-6 mois. 800g.',
  19.90,
  false,
  50,
  15,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'bebe-et-maternite'
UNION ALL
SELECT
  c.id,
  'Couches nouveau-né',
  'couches-nouveau-ne',
  'Pack de 24 couches taille 1 (2-5kg).',
  9.90,
  false,
  100,
  20,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'bebe-et-maternite'
ON CONFLICT (slug) DO NOTHING;

-- Insert test users with different roles
INSERT INTO auth.users (id, email)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'pharmacist@pharmacare.com'),
  ('44444444-4444-4444-4444-444444444444', 'doctor@pharmacare.com'),
  ('55555555-5555-5555-5555-555555555555', 'patient1@pharmacare.com'),
  ('66666666-6666-6666-6666-666666666666', 'patient2@pharmacare.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, first_name, last_name, phone, address)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    'staff',
    'Sophie',
    'Lambert',
    '+33612345678',
    '15 Rue de la Pharmacie, 75003 Paris'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'staff',
    'Pierre',
    'Bernard',
    '+33623456789',
    '28 Avenue des Médecins, 75006 Paris'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'customer',
    'Emma',
    'Petit',
    '+33634567890',
    '42 Rue du Commerce, 75015 Paris'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'customer',
    'Lucas',
    'Moreau',
    '+33645678901',
    '7 Avenue Montaigne, 75008 Paris'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample prescriptions
INSERT INTO prescriptions (
  user_id,
  file_url,
  status,
  validated_by,
  valid_until,
  notes
)
VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    'https://example.com/prescription1.pdf',
    'validated',
    '33333333-3333-3333-3333-333333333333',
    NOW() + INTERVAL '30 days',
    'Traitement antibiotique - 7 jours'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'https://example.com/prescription2.pdf',
    'pending',
    NULL,
    NULL,
    NULL
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'https://example.com/prescription3.pdf',
    'validated',
    '44444444-4444-4444-4444-444444444444',
    NOW() + INTERVAL '90 days',
    'Traitement chronique - Renouvellement trimestriel'
  )
ON CONFLICT DO NOTHING;

-- Insert sample orders
INSERT INTO orders (
  user_id,
  status,
  total_amount,
  prescription_id,
  shipping_address
)
VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    'delivered',
    35.80,
    NULL,
    '42 Rue du Commerce, 75015 Paris'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'preparing',
    89.70,
    (SELECT id FROM prescriptions WHERE user_id = '55555555-5555-5555-5555-555555555555' AND status = 'validated' LIMIT 1),
    '42 Rue du Commerce, 75015 Paris'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'confirmed',
    129.60,
    (SELECT id FROM prescriptions WHERE user_id = '66666666-6666-6666-6666-666666666666' AND status = 'validated' LIMIT 1),
    '7 Avenue Montaigne, 75008 Paris'
  )
ON CONFLICT DO NOTHING;

-- Insert order items with realistic quantities
INSERT INTO order_items (
  order_id,
  product_id,
  quantity,
  unit_price
)
SELECT
  o.id,
  p.id,
  2,
  p.price
FROM orders o
CROSS JOIN products p
WHERE p.name = 'Doliprane 1000mg'
AND o.status = 'delivered'
UNION ALL
SELECT
  o.id,
  p.id,
  1,
  p.price
FROM orders o
CROSS JOIN products p
WHERE p.name = 'Amoxicilline 1g'
AND o.status = 'preparing'
UNION ALL
SELECT
  o.id,
  p.id,
  1,
  p.price
FROM orders o
CROSS JOIN products p
WHERE p.name = 'Tensiomètre électronique'
AND o.status = 'confirmed'
ON CONFLICT DO NOTHING;