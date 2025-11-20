import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCartStore, useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Cart() {
  const navigate = navigate();
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const { user, profile } = useAuthStore();
  
  const handleCheckout = async () => {
    try {
      // Check if any product requires prescription
      const requiresPrescription = items.some(
        (item) => item.product.requires_prescription
      );
      
      if (requiresPrescription) {
        // Check if user has valid prescription
        const { data: prescriptions } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('user_id', user?.id)
          .eq('status', 'validated')
          .gte('valid_until', new Date().toISOString());
        
        if (!prescriptions?.length) {
          toast.error(
            'Certains produits nécessitent une ordonnance valide. Veuillez en télécharger une dans votre profil.'
          );
          return;
        }
      }
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          total_amount: total,
          shipping_address: profile?.address,
          prescription_id: requiresPrescription ? prescriptions[0].id : null,
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart and redirect to orders page
      clearCart();
      toast.success('Commande effectuée avec succès !');
      navigate('/orders');
    } catch (error: any) {
      toast.error('Une erreur est survenue lors de la commande.');
      console.error('Checkout error:', error);
    }
  };
  
  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="text-center">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold text-gray-900"
          >
            Votre panier est vide
          </motion.h2>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-gray-600"
          >
            Découvrez notre catalogue de produits pour commencer vos achats.
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/catalog')}
            className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700"
          >
            Voir le catalogue
          </motion.button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        Mon panier
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <motion.div 
            layout
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.li 
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                    className="p-6"
                  >
                  <div className="flex items-center">
                    {item.product.image_url && (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.product.description}
                      </p>
                      <div className="mt-2 flex items-center">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product.id, parseInt(e.target.value))
                          }
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="ml-4 text-gray-600">
                          {(item.product.price * item.quantity).toFixed(2)}€
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.product.id)}
                          className="ml-4 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-lg shadow-md p-6 h-fit"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Récapitulatif
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
            >
              Commander
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}