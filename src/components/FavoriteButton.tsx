import React from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  productId: string;
  isFavorite: boolean;
  onToggle: (isFavorite: boolean) => void;
}

export function FavoriteButton({ productId, isFavorite, onToggle }: FavoriteButtonProps) {
  const { user } = useAuthStore();

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter des favoris');
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        onToggle(false);
        toast.success('Retiré des favoris');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;
        onToggle(true);
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Heart
        className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`}
      />
    </button>
  );
}