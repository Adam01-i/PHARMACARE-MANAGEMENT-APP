import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { 
  X, Mail, Lock, User, Phone, MapPin, UserPlus, LogIn,
  Stethoscope, UserCog, ShieldCheck, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRole = 'customer' | 'staff' | 'admin';

interface RoleOption {
  value: UserRole;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    value: 'customer',
    label: 'Patient',
    icon: <User className="h-6 w-6 text-blue-500" />,
    description: 'Accédez à nos services en tant que patient'
  },
  {
    value: 'staff',
    label: 'Professionnel de santé',
    icon: <Stethoscope className="h-6 w-6 text-emerald-500" />,
    description: 'Médecin, infirmier ou autre professionnel de santé'
  }
];

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setUser = useAuthStore((state) => state.setUser);
  
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setAddress('');
    setRole('customer');
    setStep('role');
    setError(null);
  };

  const validateForm = () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return false;
      }

      if (password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return false;
      }

      if (!firstName || !lastName || !phone || !address) {
        setError('Veuillez remplir tous les champs obligatoires');
        return false;
      }

      // Validate international phone number format with any country code
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        setError('Numéro de téléphone invalide (format: +XX XXXXXXXXX)');
        return false;
      }
    }

    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        setUser(data.user);
        toast.success('Connexion réussie');
      } else {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              first_name: firstName,
              last_name: lastName,
              phone,
              address,
              role,
            });
          
          if (profileError) throw profileError;
          setUser(authData.user);
          toast.success('Inscription réussie');
        }
      }
      
      resetForm();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  const renderRoleSelection = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <UserCog className="mx-auto h-12 w-12 text-emerald-600" />
        </motion.div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Choisissez votre profil
        </h2>
        <p className="mt-2 text-gray-600">
          Sélectionnez le type de compte que vous souhaitez créer
        </p>
      </div>

      <div className="grid gap-4">
        {roleOptions.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setRole(option.value);
              setStep('form');
            }}
            className={`p-4 border-2 rounded-lg text-left transition-colors
              ${role === option.value
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
              }`}
          >
            <div className="flex items-center">
              {option.icon}
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">{option.label}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLogin(true)}
          className="text-sm text-emerald-600 hover:text-emerald-500"
        >
          Déjà un compte ? Se connecter
        </motion.button>
      </div>
    </motion.div>
  );
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => {
          resetForm();
          onClose();
        }}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </motion.button>
        
        {!isLogin && step === 'role' ? (
          renderRoleSelection()
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block p-3 rounded-full bg-emerald-100 mb-4"
              >
                {isLogin ? (
                  <LogIn className="h-8 w-8 text-emerald-600" />
                ) : (
                  <UserPlus className="h-8 w-8 text-emerald-600" />
                )}
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Bienvenue' : 'Créer un compte'}
              </h2>
              <p className="mt-2 text-gray-600">
                {isLogin
                  ? 'Connectez-vous pour accéder à votre compte'
                  : role === 'staff'
                  ? 'Créez votre compte professionnel de santé'
                  : 'Inscrivez-vous pour commencer vos achats'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </motion.div>

                {!isLogin && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="relative"
                    >
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <motion.div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Prénom"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </motion.div>
                      <motion.div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Nom"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="relative"
                    >
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Téléphone (ex: +33 612345678)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="relative"
                    >
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <textarea
                        placeholder="Adresse"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </motion.div>

                    {role === 'staff' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 }}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <div className="flex items-start">
                          <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-blue-800">
                              Vérification professionnelle
                            </h4>
                            <p className="mt-1 text-sm text-blue-600">
                              Votre compte sera vérifié par notre équipe. Vous recevrez un email de confirmation une fois votre compte validé.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="ml-3 text-sm text-red-600">{error}</p>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
              >
                {loading
                  ? 'Chargement...'
                  : isLogin
                  ? 'Se connecter'
                  : 'Créer un compte'}
              </motion.button>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="ml-1 font-medium text-emerald-600 hover:text-emerald-500"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </motion.button>
            </p>
          </motion.div>
        )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}