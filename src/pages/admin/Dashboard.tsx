import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, FileText, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    prescriptions: 0,
    users: 0,
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: products },
        { count: orders },
        { count: prescriptions },
        { count: users },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('prescriptions').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      
      setStats({
        products: products || 0,
        orders: orders || 0,
        prescriptions: prescriptions || 0,
        users: users || 0,
      });
    };
    
    fetchStats();
  }, []);
  
  const cards = [
    {
      title: 'Produits',
      count: stats.products,
      icon: Package,
      link: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Commandes',
      count: stats.orders,
      icon: ShoppingCart,
      link: '/admin/orders',
      color: 'bg-green-500',
    },
    {
      title: 'Ordonnances',
      count: stats.prescriptions,
      icon: FileText,
      link: '/admin/prescriptions',
      color: 'bg-yellow-500',
    },
    {
      title: 'Utilisateurs',
      count: stats.users,
      icon: Users,
      link: '/admin/users',
      color: 'bg-purple-500',
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Tableau de bord administrateur
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className={`inline-block p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {card.title}
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {card.count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}