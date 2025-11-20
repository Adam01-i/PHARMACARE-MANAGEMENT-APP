import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                +33 1 23 45 67 89
              </p>
              <p className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2" />
                contact@pharmacare.fr
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Horaires</h3>
            <div className="flex items-start space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <div>
                <p>Lundi - Vendredi: 9h - 19h</p>
                <p>Samedi: 9h - 17h</p>
                <p>Dimanche: Fermé</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Livraison à domicile</li>
              <li>Conseil pharmaceutique</li>
              <li>Renouvellement d'ordonnance</li>
              <li>Click & Collect</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-500">
          <p>&copy; 2024 PharmaCare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}