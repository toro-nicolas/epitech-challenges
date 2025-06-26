import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import authService from './authService';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // États pour le formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // États pour le formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Initialiser le service d'authentification
    authService.init();
    
    // Rediriger si déjà connecté
    if (authService.isAuthenticated()) {
      window.location.href = '/activities';
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    // Validation basique
    if (!loginData.email || !loginData.password) {
      setMessage({ type: 'error', content: 'Veuillez remplir tous les champs' });
      setLoading(false);
      return;
    }

    const result = await authService.login(loginData.email, loginData.password);
    
    if (result.success) {
      setMessage({ type: 'success', content: 'Connexion réussie ! Redirection...' });
      setTimeout(() => {
        window.location.href = '/activities';
      }, 1500);
    } else {
      setMessage({ type: 'error', content: result.error });
    }
    
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    // Validation
    if (!registerData.email || !registerData.first_name || !registerData.last_name || !registerData.password) {
      setMessage({ type: 'error', content: 'Veuillez remplir tous les champs obligatoires' });
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'error', content: 'Les mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setMessage({ type: 'error', content: 'Le mot de passe doit contenir au moins 6 caractères' });
      setLoading(false);
      return;
    }

    const result = await authService.register({
      email: registerData.email,
      first_name: registerData.first_name,
      last_name: registerData.last_name,
      password: registerData.password
    });
    
    if (result.success) {
      setMessage({ type: 'success', content: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
      setIsLogin(true);
      setRegisterData({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: ''
      });
    } else {
      setMessage({ type: 'error', content: result.error });
    }
    
    setLoading(false);
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} onLogout={() => {}} />
      
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {isLogin ? 'Connexion' : 'Inscription'}
              </h2>
              <p className="mt-2 text-gray-600">
                {isLogin 
                  ? 'Connectez-vous à votre compte Epitech'
                  : 'Créez votre compte Epitech Challenges'
                }
              </p>
            </div>

            {/* Messages */}
            {message.content && (
              <div className={`mb-4 p-3 rounded-md flex items-center ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 mr-2" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                {message.content}
              </div>
            )}

            {/* Formulaire de connexion */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Epitech
                  </label>
                  <div className="relative">
                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre.nom@epitech.eu"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre mot de passe"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            ) : (
              /* Formulaire d'inscription */
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required
                      value={registerData.first_name}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      value={registerData.last_name}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Epitech *
                  </label>
                  <div className="relative">
                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre.nom@epitech.eu"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Au moins 6 caractères"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Répétez le mot de passe"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
              </form>
            )}

            {/* Basculer entre connexion et inscription */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage({ type: '', content: '' });
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin 
                  ? 'Pas encore de compte ? S\'inscrire'
                  : 'Déjà un compte ? Se connecter'
                }
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;