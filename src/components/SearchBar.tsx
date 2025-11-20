import React, { useState, useEffect, useRef } from 'react';
import { Search, History, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import toast from 'react-hot-toast';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  category: { name: string };
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('query')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSearchHistory(data.map(item => item.query));
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const saveSearchQuery = async (query: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('search_history')
        .insert({ user_id: user.id, query });

      if (error) throw error;
      fetchSearchHistory();
    } catch (error) {
      console.error('Error saving search query:', error);
    }
  };

  const clearSearchHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setSearchHistory([]);
      toast.success('Historique de recherche effacé');
    } catch (error) {
      console.error('Error clearing search history:', error);
      toast.error('Erreur lors de l\'effacement de l\'historique');
    }
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories (name)
        `)
        .textSearch('name', searchQuery)
        .limit(5);

      if (error) throw error;
      setResults(data);
      setIsOpen(true);
      saveSearchQuery(searchQuery);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Erreur lors de la recherche');
    }
  };

  const handleResultClick = (productId: string) => {
    setIsOpen(false);
    navigate(`/catalog?product=${productId}`);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) handleSearch(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Rechercher un médicament, un produit..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {query ? (
            results.length > 0 ? (
              <div className="divide-y">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.id)}
                    className="w-full p-4 hover:bg-gray-50 text-left flex items-center space-x-4"
                  >
                    {result.image_url && (
                      <img
                        src={result.image_url}
                        alt={result.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{result.name}</h4>
                      <p className="text-sm text-gray-500">{result.category.name}</p>
                      <p className="text-sm font-medium text-emerald-600">
                        {result.price.toFixed(2)}€
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Aucun résultat trouvé
              </div>
            )
          ) : searchHistory.length > 0 ? (
            <div className="p-2">
              <div className="flex justify-between items-center px-2 py-1">
                <span className="text-sm font-medium text-gray-700">
                  Recherches récentes
                </span>
                <button
                  onClick={clearSearchHistory}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Effacer
                </button>
              </div>
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(query);
                    handleSearch(query);
                  }}
                  className="w-full px-2 py-1 text-left flex items-center space-x-2 hover:bg-gray-50 rounded"
                >
                  <History className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{query}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}