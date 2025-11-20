import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useCartStore, useAuthStore } from '../lib/store';
import { SearchBar } from '../components/SearchBar';
import { FavoriteButton } from '../components/FavoriteButton';
import toast from 'react-hot-toast';
import type { Product, Category } from '../types/database';

interface ProductWithFavorite extends Product {
  is_favorite: boolean;
}

export function Catalog() {
  const [products, setProducts] = useState<ProductWithFavorite[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(100);
  const addToCart = useCartStore((state) => state.addItem);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [user]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Erreur lors du chargement des catégories');
      return;
    }

    setCategories(data);
  };

  const fetchProducts = async () => {
    try {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .order('name');

      if (productsError) throw productsError;

      // If user is authenticated, fetch their favorites
      let favorites: Set<string> = new Set();
      if (user) {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', user.id);

        if (favoritesError) throw favoritesError;
        favorites = new Set(favoritesData.map(f => f.product_id));
      }

      // Combine products with favorite status
      const productsWithFavorites = products.map(product => ({
        ...product,
        is_favorite: favorites.has(product.id)
      }));

      setProducts(productsWithFavorites);
    } catch (error) {
      toast.error('Erreur lors du chargement des produits');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category_id);
    const matchesPrice = product.price <= priceRange;
    return matchesCategory && matchesPrice;
  });

  const handleAddToCart = (product: Product) => {
    if (product.requires_prescription) {
      toast.error(
        'Ce produit nécessite une ordonnance. Veuillez la télécharger dans votre profil.'
      );
      return;
    }

    addToCart(product);
    toast.success('Produit ajouté au panier');
  };

  const handleFavoriteToggle = (productId: string, isFavorite: boolean) => {
    setProducts(products.map(product =>
      product.id === productId
        ? { ...product, is_favorite: isFavorite }
        : product
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Catalogue des produits
        </motion.h1>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white p-6 rounded-lg shadow-md h-fit"
        >
          <h2 className="text-lg font-semibold mb-4">Filtres</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Catégories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="rounded text-emerald-600"
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Prix maximum: {priceRange}€</h3>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0€</span>
                <span>100€</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="md:col-span-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      productId={product.id}
                      isFavorite={product.is_favorite}
                      onToggle={(isFavorite) => handleFavoriteToggle(product.id, isFavorite)}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.description}
                  </p>
                  {product.requires_prescription && (
                    <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Ordonnance requise
                    </span>
                  )}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-emerald-600">
                      {product.price.toFixed(2)}€
                    </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                    >
                      Ajouter
                      </motion.button>
                  </div>
                </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}