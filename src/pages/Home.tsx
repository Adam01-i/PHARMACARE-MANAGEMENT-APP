import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Truck, Clock, Shield, Pill, Heart, Phone, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name)
        `)
        .limit(6);

      if (error) throw error;
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      toast.error('Erreur lors du chargement des produits');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche');
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=2000"
            alt="Pharmacy"
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/70" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl font-bold text-white mb-6"
            >
              Votre santé, notre priorité
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-emerald-50 mb-8"
            >
              Découvrez notre large gamme de produits pharmaceutiques et bénéficiez de conseils personnalisés par nos professionnels de santé.
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white rounded-lg shadow-xl p-4"
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un médicament, un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ml-2 flex-1 outline-none text-gray-700"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="ml-4 px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"
                  >
                    Rechercher
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                    >
                    {searchResults.map((product: any) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                      >
                        <Link
                          to={`/catalog?product=${product.slug}`}
                          className="block p-4 border-b last:border-b-0"
                        >
                        <div className="flex items-center">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.categories.name}</p>
                            <p className="text-sm font-medium text-emerald-600">
                              {product.price.toFixed(2)}€
                            </p>
                          </div>
                        </div>
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div whileHover={{ backgroundColor: '#f9fafb' }}>
                      <Link
                      to={`/catalog?search=${searchQuery}`}
                      className="block p-4 text-center text-emerald-600 hover:bg-gray-50 font-medium"
                    >
                      Voir tous les résultats
                      </Link>
                    </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Produits populaires
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product: any, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link to={`/catalog?product=${product.slug}`}>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-emerald-600">
                    {product.price.toFixed(2)}€
                  </span>
                  {product.requires_prescription && (
                    <span className="text-sm text-yellow-600 font-medium">
                      Sur ordonnance
                    </span>
                  )}
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Truck className="h-8 w-8 text-emerald-600" />,
              title: "Livraison rapide",
              description: "Livraison à domicile sous 24h pour les commandes passées avant 15h. Service disponible dans toute la France métropolitaine."
            },
            {
              icon: <Clock className="h-8 w-8 text-emerald-600" />,
              title: "Click & Collect",
              description: "Commandez en ligne et retirez en pharmacie sous 2h. Un service gratuit pour plus de flexibilité dans vos achats."
            },
            {
              icon: <Shield className="h-8 w-8 text-emerald-600" />,
              title: "Sécurité garantie",
              description: "Paiement sécurisé et données personnelles protégées. Tous nos produits sont authentiques et contrôlés."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white p-8 rounded-xl shadow-md transition-all duration-300"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mb-6"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Nos catégories
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              to: "/catalog?category=medicaments-sans-ordonnance",
              image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
              alt: "Médicaments sans ordonnance",
              icon: <Pill className="h-8 w-8 text-white mb-2" />,
              title: "Médicaments sans ordonnance"
            },
            {
              to: "/catalog?category=materiel-medical",
              image: "https://images.unsplash.com/photo-1583912267550-d6c2ac4b0154?auto=format&fit=crop&q=80&w=800",
              alt: "Matériel médical",
              icon: <Heart className="h-8 w-8 text-white mb-2" />,
              title: "Matériel médical"
            },
            {
              to: "/catalog?category=bebe-et-maternite",
              image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
              alt: "Bébé et maternité",
              icon: <Phone className="h-8 w-8 text-white mb-2" />,
              title: "Bébé et maternité"
            }
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group relative h-64 rounded-xl overflow-hidden"
            >
              <Link to={category.to}>
            <img
                  src={category.image}
                  alt={category.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
                <motion.div 
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6"
                >
              <div>
                    {category.icon}
                    <h3 className="text-xl font-semibold text-white">{category.title}</h3>
              </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-emerald-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Besoin d'un conseil ?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 mb-8"
            >
              Nos pharmaciens sont à votre écoute pour vous accompagner dans vos choix
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
              to="/catalog"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Découvrir nos produits
              <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}