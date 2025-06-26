import React, { useState, useEffect } from 'react';
import { Trophy, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import authService from './authService';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialiser le service d'authentification
    authService.init();
    
    // Vérifier si l'utilisateur est connecté
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
    }
    
    setLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100