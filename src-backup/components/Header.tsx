import React, { useState } from 'react';
import { User, LogOut, Settings, Code } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <Code className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">EPITECH CHALLENGES</span>
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <a href="/activities" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Activités
                </a>
                
                {(user.role === 'teacher' || user.role === 'admin') && (
                  <>
                    <a href="/manage-activities" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Gérer les activités
                    </a>
                    <a href="/manage-challenges" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Gérer les challenges
                    </a>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <a href="/manage-accounts" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Gérer les comptes
                  </a>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <User className="h-5 w-5 mr-1" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                        <div className="text-gray-500">{user.email}</div>
                        <div className="text-xs text-blue-600 capitalize">{user.role}</div>
                      </div>
                      <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="inline h-4 w-4 mr-2" />
                        Mon profil
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Déconnexion
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Se connecter
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;