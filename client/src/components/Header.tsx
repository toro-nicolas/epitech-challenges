"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';



export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();


  const handleLogout = () => {
    logout();
  };


  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Navigation au centre (en gros, les pages) */}
          {isAuthenticated && user && (
            <nav className="flex items-center space-x-6">
              <Link
                href="/activities"
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Activités
              </Link>
              {['teacher', 'admin'].includes(user.role) && (
                <>
                  <Link
                    href="/manage-activities"
                    className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
                  >
                    Gérer les activités
                  </Link>
                  <Link
                    href="/manage-challenges"
                    className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
                  >
                    Gérer les challenges
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link
                  href="/manage-accounts"
                  className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
                >
                  Gérer les comptes
                </Link>
              )}
            </nav>
          )}

          {/* Navigation à droite (la connexion) */}
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
              <div className="flex items-center space-x-4">
                {user && (
                  <span className="text-sm text-gray-600">
                    {user.prenom} {user.nom} ({user.role})
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
