"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo à gauche */}
          <Link href="/" className="flex items-center">
            <Image
              src="/favicon.ico"
              alt="EPITECH Challenges Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <span className="font-bold text-xl text-blue-700">EPITECH Challenges</span>
          </Link>

          {/* Navigation à droite */}
          <nav className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-700 font-medium transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 font-medium transition-colors"
                >
                  Créer un compte
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
              >
                Déconnexion
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
