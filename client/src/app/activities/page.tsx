"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';



interface Activity {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  duration: number;
  students: {
    first_name: string;
    last_name: string;
  }[];
}

export default function Activities() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [error, setError] = useState('');



  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    fetchActivities();
  }, [isAuthenticated, router, loading]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/activities', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des activités');
      }

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setActivitiesLoading(false);
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };
  

  
  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l&apos;authentification...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col p-8 relative">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Activités</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {activitiesLoading ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Chargement des activités...</div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Aucune activité disponible</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom de l&apos;activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiants
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(activity.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(activity.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(activity.duration)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {activity.students.length > 0 ? (
                        <div className="max-h-20 overflow-y-auto">
                          {activity.students.map((student, index) => (
                            <div key={index} className="text-xs">
                              {student.first_name} {student.last_name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Aucun étudiant</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
