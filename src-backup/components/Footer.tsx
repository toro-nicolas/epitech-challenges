import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center space-x-8 mb-4">
          <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
            À propos
          </a>
          <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
            Contact
          </a>
          <a href="/help" className="text-gray-600 hover:text-blue-600 transition-colors">
            Aide
          </a>
          <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
            Confidentialité
          </a>
        </div>
        <div className="text-center text-sm text-gray-500">
          © 2025 EPITECH CHALLENGES. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;