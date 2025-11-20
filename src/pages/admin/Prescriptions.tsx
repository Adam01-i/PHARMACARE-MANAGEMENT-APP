import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { Prescription } from '../../types/database';

export function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          profiles:users!prescriptions_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions(data);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des ordonnances');
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrescriptionStatus = async (
    prescriptionId: string,
    status: 'validated' | 'rejected',
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({
          status,
          notes,
          validated_by: status === 'validated' ? supabase.auth.getUser() : null,
          valid_until:
            status === 'validated'
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : null,
        })
        .eq('id', prescriptionId);

      if (error) throw error;
      
      toast.success('Ordonnance mise à jour avec succès');
      fetchPrescriptions();
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour de l\'ordonnance');
      console.error('Error updating prescription:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Validation des ordonnances
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {prescriptions.map((prescription: any) => (
          <div
            key={prescription.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">
                    Patient: {prescription.profiles.first_name}{' '}
                    {prescription.profiles.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(prescription.created_at).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      prescription.status === 'validated'
                        ? 'text-green-600'
                        : prescription.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {prescription.status === 'validated'
                      ? 'Validée'
                      : prescription.status === 'rejected'
                      ? 'Rejetée'
                      : 'En attente'}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href={prescription.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Voir l'ordonnance
                  </a>
                </div>
              </div>

              {prescription.status === 'pending' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes (optionnel)
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      rows={3}
                      placeholder="Ajouter des notes..."
                      onChange={(e) => prescription.notes = e.target.value}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        updatePrescriptionStatus(
                          prescription.id,
                          'validated',
                          prescription.notes
                        )
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() =>
                        updatePrescriptionStatus(
                          prescription.id,
                          'rejected',
                          prescription.notes
                        )
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              )}

              {prescription.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">Notes:</p>
                  <p className="text-sm text-gray-600">{prescription.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}