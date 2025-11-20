import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import type { Profile as ProfileType } from '../types/database';

export function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `prescriptions/${fileName}`;
      
      try {
        setLoading(true);
        
        const { error: uploadError } = await supabase.storage
          .from('prescriptions')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('prescriptions')
          .getPublicUrl(filePath);
        
        const { error: prescriptionError } = await supabase
          .from('prescriptions')
          .insert({
            user_id: user?.id,
            file_url: data.publicUrl,
          });
        
        if (prescriptionError) throw prescriptionError;
        
        toast.success('Ordonnance envoyée avec succès');
        fetchPrescriptions();
      } catch (error: any) {
        toast.error('Erreur lors de l\'envoi de l\'ordonnance');
        console.error('Prescription upload error:', error);
      } finally {
        setLoading(false);
      }
    },
  });
  
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPrescriptions();
    }
  }, [user]);
  
  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const fetchPrescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPrescriptions(data);
    } catch (error: any) {
      console.error('Error fetching prescriptions:', error);
    }
  };
  
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!profile) return null;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Mon profil</h2>
            
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={profile.first_name || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, first_name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={profile.last_name || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, last_name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <textarea
                  value={profile.address || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Prescriptions */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Mes ordonnances</h2>
            
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer"
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                Glissez une ordonnance ici ou cliquez pour en sélectionner une
              </p>
              <p className="text-xs text-gray-500 mt-2">
                PDF, PNG ou JPG uniquement
              </p>
            </div>
            
            <div className="mt-6 space-y-4">
              {prescriptions.map((prescription: any) => (
                <div
                  key={prescription.id}
                  className="bg-gray-50 rounded-md p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(prescription.created_at).toLocaleDateString()}
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
                    <a
                      href={prescription.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      Voir
                    </a>
                  </div>
                  {prescription.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      {prescription.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}