// Configuration de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  // Initialiser le service (à appeler au démarrage de l'app)
  init() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (error) {
          console.error('Erreur parsing user data:', error);
          this.clearAuth();
        }
      }
    }
  }

  // Connexion
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }

      const data = await response.json();
      
      // Stocker le token et les infos utilisateur
      this.token = data.token;
      this.user = data.user;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      return { success: true, user: this.user };
    } catch (error) {
      console.error('Erreur login:', error);
      return { success: false, error: error.message };
    }
  }

  // Inscription
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur d\'inscription');
      }

      const data = await response.json();
      return { success: true, user: data };
    } catch (error) {
      console.error('Erreur register:', error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer les infos du profil actuel
  async getProfile() {
    if (!this.token) {
      return { success: false, error: 'Non authentifié' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          return { success: false, error: 'Session expirée' };
        }
        throw new Error('Erreur récupération profil');
      }

      const userData = await response.json();
      this.user = userData;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      return { success: true, user: this.user };
    } catch (error) {
      console.error('Erreur getProfile:', error);
      return { success: false, error: error.message };
    }
  }

  // Mettre à jour le profil
  async updateProfile(updateData) {
    if (!this.token) {
      return { success: false, error: 'Non authentifié' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          return { success: false, error: 'Session expirée' };
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur mise à jour profil');
      }

      const userData = await response.json();
      this.user = userData;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      return { success: true, user: this.user };
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      return { success: false, error: error.message };
    }
  }

  // Déconnexion
  logout() {
    this.clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Nettoyer les données d'authentification
  clearAuth() {
    this.token = null;
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser() {
    return this.user;
  }

  // Récupérer le token
  getToken() {
    return this.token;
  }

  // Vérifier le rôle de l'utilisateur
  hasRole(role) {
    return this.user && this.user.role === role;
  }

  // Vérifier si l'utilisateur a au moins un certain niveau de rôle
  hasMinRole(minRole) {
    if (!this.user) return false;
    
    const roleHierarchy = {
      'student': 1,
      'teacher': 2,
      'admin': 3
    };
    
    const userLevel = roleHierarchy[this.user.role] || 0;
    const minLevel = roleHierarchy[minRole] || 0;
    
    return userLevel >= minLevel;
  }

  // Faire une requête authentifiée
  async authenticatedRequest(url, options = {}) {
    if (!this.token) {
      return { success: false, error: 'Non authentifié' };
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        ...defaultOptions,
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return { success: false, error: 'Session expirée' };
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Erreur requête authentifiée:', error);
      return { success: false, error: error.message };
    }
  }
}

// Instance singleton
const authService = new AuthService();

export default authService;