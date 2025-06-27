"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './challenges.module.css';



interface Challenge {
  _id: string;
  title: string;
  description: string;
  language: string;
  working_files: {
    filename: string;
    path: string;
  }[];
  tester: string;
}

interface ChallengeFormData {
  title: string;
  description: string;
  language: string;
  working_files: File[];
  tester: File | null;
}



export default function ManageChallenges() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: '',
    description: '',
    language: '',
    working_files: [],
    tester: null
  });
  const [formLoading, setFormLoading] = useState(false);



  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user && !['teacher', 'admin'].includes(user.role)) {
      router.push('/activities');
      return;
    }
    
    fetchChallenges();
  }, [isAuthenticated, user, router, loading]);

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/challenges', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des challenges');
      }

      const data = await response.json();
      setChallenges(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setChallengesLoading(false);
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (e.target.name === 'working_files') {
        setFormData({
          ...formData,
          working_files: Array.from(files)
        });
      } else if (e.target.name === 'tester' && files[0]) {
        setFormData({
          ...formData,
          tester: files[0]
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      language: '',
      working_files: [],
      tester: null
    });
  };

  const handleAddChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('language', formData.language);
      
      // Ajouter les fichiers de travail
      formData.working_files.forEach((file) => {
        formDataToSend.append('working_files', file);
      });
      
      // Ajouter le fichier tester
      if (formData.tester) {
        formDataToSend.append('tester', formData.tester);
      }

      const response = await fetch('http://localhost:3001/api/challenges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du challenge');
      }

      await fetchChallenges();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setFormLoading(false);
    }
  };



  const openAddModal = () => {
    resetForm();
    setError('');
    setShowAddModal(true);
  };

  const openEditModal = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      language: challenge.language,
      working_files: [],
      tester: null
    });
    setError('');
    setShowEditModal(true);
  };



  const handleEditChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge) return;
    
    setFormLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Créer un objet avec seulement les champs modifiés
      if (formData.title !== editingChallenge.title) {
        formDataToSend.append('title', formData.title);
      }
      if (formData.description !== editingChallenge.description) {
        formDataToSend.append('description', formData.description);
      }
      if (formData.language !== editingChallenge.language) {
        formDataToSend.append('language', formData.language);
      }
      
      // Ajouter les nouveaux fichiers de travail s'ils existent
      if (formData.working_files.length > 0) {
        formData.working_files.forEach((file) => {
          formDataToSend.append('working_files', file);
        });
      }
      
      // Ajouter le nouveau fichier tester s'il existe
      if (formData.tester) {
        formDataToSend.append('tester', formData.tester);
      }

      const response = await fetch(`http://localhost:3001/api/challenges/${editingChallenge._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification du challenge');
      }

      await fetchChallenges();
      setShowEditModal(false);
      resetForm();
      setEditingChallenge(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteChallenge = async (challengeId: string, challengeTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le challenge "${challengeTitle}" ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/challenges/${challengeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du challenge');
      }

      await fetchChallenges();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Vérification de l&apos;authentification...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!['teacher', 'admin'].includes(user.role)) {
    return null;
  }

  return (
    <main className={styles.container}>
      <div className={styles.maxWidth}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gérer les challenges</h1>
          <button 
            onClick={openAddModal}
            className={styles.newButton}
          >
            Nouveau challenge
          </button>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {!showAddModal && (
          <>
            {challengesLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingText}>Chargement des challenges...</div>
              </div>
            ) : challenges.length === 0 ? (
              <div className={styles.emptyContainer}>
                <div className={styles.emptyText}>Aucun challenge disponible</div>
              </div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th className={styles.tableHeaderCell}>
                        Titre
                      </th>
                      <th className={styles.tableHeaderCell}>
                        Langage
                      </th>
                      <th className={styles.tableHeaderCell}>
                        Description
                      </th>
                      <th className={styles.tableHeaderCell}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {challenges.map((challenge) => (
                      <tr key={challenge._id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          {challenge.title}
                        </td>
                        <td className={styles.tableCellSecondary}>
                          {challenge.language}
                        </td>
                        <td className={styles.tableCellTruncate}>
                          {challenge.description || 'Aucune description'}
                        </td>
                        <td className={styles.tableCellActions}>
                          <div className={styles.actionsContainer}>
                            <button 
                              onClick={() => openEditModal(challenge)}
                              className={styles.editButton}
                            >
                              Modifier
                            </button>
                            <button 
                              onClick={() => handleDeleteChallenge(challenge._id, challenge.title)}
                              className={styles.deleteButton}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Form d'ajout */}
        {showAddModal && (
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Nouveau challenge</h2>
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleAddChallenge} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Titre
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Nom du challenge"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Langage
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Sélectionner un langage</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={styles.textarea}
                  placeholder="Description du challenge..."
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Fichiers de travail
                </label>
                <input
                  type="file"
                  name="working_files"
                  onChange={handleFileChange}
                  multiple
                  accept="*"
                  className={styles.fileInput}
                />
                <p className={styles.helpText}>
                  Sélectionnez les fichiers de code source
                </p>
                {formData.working_files.length > 0 && (
                  <div className={styles.fileList}>
                    <p className={styles.fileListTitle}>Fichiers sélectionnés:</p>
                    <ul className={styles.fileListItems}>
                      {formData.working_files.map((file, index) => (
                        <li key={index} className={styles.fileListItem}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Fichier de test (ZIP)
                </label>
                <input
                  type="file"
                  name="tester"
                  onChange={handleFileChange}
                  accept=".zip"
                  required
                  className={styles.fileInput}
                />
                <p className={styles.helpText}>
                  Fichier ZIP contenant les tests pour ce challenge
                </p>
                {formData.tester && (
                  <p className={styles.fileSelected}>
                    Fichier sélectionné: {formData.tester.name}
                  </p>
                )}
              </div>
              
              <div className={styles.buttonGrid}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setError('');
                  }}
                  className={styles.cancelButton}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className={styles.submitButton}
                >
                  {formLoading ? 'Création...' : 'Créer le challenge'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Form de modification */}
        {showEditModal && editingChallenge && (
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Modifier le challenge</h2>
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleEditChallenge} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Titre
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                    placeholder="Nom du challenge"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Langage
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Sélectionner un langage</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={styles.textarea}
                  placeholder="Description du challenge..."
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Fichiers de travail actuels
                </label>
                {editingChallenge.working_files && editingChallenge.working_files.length > 0 ? (
                  <div className={styles.fileList}>
                    <p className={styles.fileListTitle}>Fichiers actuels:</p>
                    <ul className={styles.fileListItems}>
                      {editingChallenge.working_files.map((file, index) => (
                        <li key={index} className={styles.fileListItem}>• {file.filename}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className={styles.helpText}>Aucun fichier de travail</p>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nouveaux fichiers de travail (optionnel)
                </label>
                <input
                  type="file"
                  name="working_files"
                  onChange={handleFileChange}
                  multiple
                  accept=".txt,.js,.py,.java,.c,.cpp,.php,.rb,.go"
                  className={styles.fileInput}
                />
                <p className={styles.helpText}>
                  Sélectionnez de nouveaux fichiers pour remplacer les actuels (formats acceptés: .txt, .js, .py, .java, .c, .cpp, .php, .rb, .go)
                </p>
                {formData.working_files.length > 0 && (
                  <div className={styles.fileList}>
                    <p className={styles.fileListTitle}>Nouveaux fichiers sélectionnés:</p>
                    <ul className={styles.fileListItems}>
                      {formData.working_files.map((file, index) => (
                        <li key={index} className={styles.fileListItem}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Nouveau fichier de test ZIP (optionnel)
                </label>
                <input
                  type="file"
                  name="tester"
                  onChange={handleFileChange}
                  accept=".zip"
                  className={styles.fileInput}
                />
                <p className={styles.helpText}>
                  Fichier ZIP contenant les nouveaux tests pour ce challenge
                </p>
                {formData.tester && (
                  <p className={styles.fileSelected}>
                    Nouveau fichier sélectionné: {formData.tester.name}
                  </p>
                )}
              </div>
              
              <div className={styles.buttonGrid}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setError('');
                    resetForm();
                    setEditingChallenge(null);
                  }}
                  className={styles.cancelButton}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className={styles.submitButton}
                >
                  {formLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
