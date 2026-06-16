import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Dashboard from './components/Dashboard';
import MovieDetailsPage from './components/MovieDetailsPage';
import CreateReviewPage from './components/CreateReviewPage';
import Auth from './components/Auth'; // Tu componente de autenticación

export default function App() {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. Detectar si el usuario está logueado al cargar la app
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navigateToDashboard = () => {
    setSelectedMediaId(null);
    setCurrentView('dashboard');
    setRefreshKey(prev => prev + 1);
  };

  // 2. Si NO hay sesión, mostramos el componente Auth
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  // 3. Si SÍ hay sesión, mostramos la App completa
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white p-4 shadow-sm mb-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold cursor-pointer" onClick={navigateToDashboard}>
            HAL 9000
          </h1>
          <div className="flex gap-4 items-center">
            <button onClick={() => setCurrentView('create')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-bold">
              + Nueva Reseña
            </button>
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 text-sm font-semibold">
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4">
        {currentView === 'dashboard' && (
          <Dashboard key={refreshKey} onViewMovie={(id) => { setSelectedMediaId(id); setCurrentView('details'); }} />
        )}
        {currentView === 'details' && (
          <MovieDetailsPage mediaId={selectedMediaId} onBack={navigateToDashboard} />
        )}
        {currentView === 'create' && (
          <CreateReviewPage onReviewCreated={navigateToDashboard} />
        )}
      </main>
    </div>
  );
}