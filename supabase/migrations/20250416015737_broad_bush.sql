/*
  # Additional seed data for dashboards

  This migration adds more realistic data for testing dashboard functionalities
*/

-- Insert more products
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
  'Vitamine D3 1000UI',
  'vitamine-d3-1000ui',
  'Complément alimentaire pour maintenir la santé des os et du système immunitaire',
  8.90,
  false,
  150,
  30,
  'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'parapharmacie'
UNION ALL
SELECT
  c.id,
  'Tensiomètre automatique',
  'tensiometre-automatique',
  'Appareil de mesure de la tension artérielle précis et facile à utiliser',
  49.90,
  false,
  20,
  5,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'materiel-medical'
UNION ALL
SELECT
  c.id,
  'Oméprazole 20mg',
  'omeprazole-20mg',
  'Médicament contre les reflux gastro-œsophagiens',
  15.90,
  true,
  60,
  15,
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
FROM categories c
WHERE c.slug = 'medicaments'
ON CONFLICT (slug) DO NOTHING;

-- Insert test users
INSERT INTO auth.users (id, email)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'staff@pharmacare.com'),
  ('22222222-2222-2222-2222-222222222222', 'customer@pharmacare.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, role, first_name, last_name, phone, address)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'staff',
    'Marie',
    'Dubois',
    '+33612345678',
    '45 Avenue des Pharmaciens, 75002 Paris'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'customer',
    'Jean',
    'Martin',
    '+33698765432',
    '12 Rue du Commerce, 75015 Paris'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert test prescriptions
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
    '22222222-2222-2222-2222-222222222222',
    'https://example.com/prescription1.pdf',
    'validated',
    '00000000-0000-0000-0000-000000000000',
    NOW() + INTERVAL '30 days',
    'Ordonnance validée pour traitement chronique'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'https://example.com/prescription2.pdf',
    'pending',
    NULL,
    NULL,
    NULL
  )
ON CONFLICT DO NOTHING;

-- Insert test orders
INSERT INTO orders (
  user_id,
  status,
  total_amount,
  prescription_id,
  shipping_address
)
VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    'delivered',
    25.80,
    NULL,
    '12 Rue du Commerce, 75015 Paris'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'preparing',
    45.70,
    NULL,
    '12 Rue du Commerce, 75015 Paris'
  )
ON CONFLICT DO NOTHING;

-- Insert order items
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
WHERE p.name = 'Paracétamol 1000mg'
AND o.status = 'delivered'
UNION ALL
SELECT
  o.id,
  p.id,
  1,
  p.price
FROM orders o
CROSS JOIN products p
WHERE p.name = 'Ibuprofène 400mg'
AND o.status = 'preparing'
ON CONFLICT DO NOTHING;