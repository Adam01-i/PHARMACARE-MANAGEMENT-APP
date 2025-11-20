/*
  # Add email credentials for profiles

  1. Changes
    - Add email credentials for existing profiles
    - Set common password for all accounts
*/

-- Update admin user
UPDATE auth.users 
SET email = 'admin@pharmacare.com',
    encrypted_password = crypt('Passer123', gen_salt('bf'))
WHERE id = '00000000-0000-0000-0000-000000000000';

-- Update staff users
UPDATE auth.users 
SET email = 'pharmacist@pharmacare.com',
    encrypted_password = crypt('Passer123', gen_salt('bf'))
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE auth.users 
SET email = 'doctor@pharmacare.com',
    encrypted_password = crypt('Passer123', gen_salt('bf'))
WHERE id = '44444444-4444-4444-4444-444444444444';

-- Update customer users
UPDATE auth.users 
SET email = 'patient1@pharmacare.com',
    encrypted_password = crypt('Passer123', gen_salt('bf'))
WHERE id = '55555555-5555-5555-5555-555555555555';

UPDATE auth.users 
SET email = 'patient2@pharmacare.com',
    encrypted_password = crypt('Passer123', gen_salt('bf'))
WHERE id = '66666666-6666-6666-6666-666666666666';