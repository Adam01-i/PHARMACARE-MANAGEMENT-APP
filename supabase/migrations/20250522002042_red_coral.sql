/*
  # Add notifications system

  1. New Tables
    - `notifications`
      - Store user notifications for orders, prescriptions, etc.
    - `stock_alerts`
      - Track low stock alerts for products
    
  2. Security
    - Enable RLS on new tables
    - Add appropriate policies for staff and customers
*/

-- Create notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create stock alerts table
CREATE TABLE stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  triggered_at timestamptz DEFAULT now(),
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

-- Stock alerts policies
CREATE POLICY "Staff can view and manage stock alerts"
  ON stock_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

-- Functions for notifications
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS trigger AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    NEW.user_id,
    CASE NEW.status
      WHEN 'confirmed' THEN 'Commande confirmée'
      WHEN 'preparing' THEN 'Commande en préparation'
      WHEN 'ready' THEN 'Commande prête'
      WHEN 'delivered' THEN 'Commande livrée'
      WHEN 'cancelled' THEN 'Commande annulée'
      ELSE 'Mise à jour de la commande'
    END,
    CASE NEW.status
      WHEN 'confirmed' THEN 'Votre commande a été confirmée et sera bientôt préparée.'
      WHEN 'preparing' THEN 'Votre commande est en cours de préparation.'
      WHEN 'ready' THEN 'Votre commande est prête à être récupérée ou livrée.'
      WHEN 'delivered' THEN 'Votre commande a été livrée avec succès.'
      WHEN 'cancelled' THEN 'Votre commande a été annulée.'
      ELSE 'Le statut de votre commande a été mis à jour.'
    END,
    'order'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_prescription_notification()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'validated' THEN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Ordonnance validée',
      'Votre ordonnance a été validée et est maintenant active.',
      'prescription'
    );
  ELSIF NEW.status = 'rejected' THEN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Ordonnance rejetée',
      COALESCE(NEW.notes, 'Votre ordonnance n''a pas pu être validée.'),
      'prescription'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER order_notification_trigger
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_notification();

CREATE TRIGGER prescription_notification_trigger
  AFTER UPDATE OF status ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION create_prescription_notification();