import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Dashboard from './components/Dashboard';
import MovieDetailsPage from './components/MovieDetailsPage';
import CreateReviewPage from './components/CreateReviewPage';
import Auth from './components/Auth';

export default function App() {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navegación extendida a todo el ancho */}
      <nav className="bg-white p-4 shadow-sm mb-6">
        <div className="flex justify-between items-center px-4 md:px-8">
          <h1 
            className="text-3xl font-bold cursor-pointer" 
            onClick={navigateToDashboard}
          >
            HAL 9000
          </h1>
          
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setCurrentView('create')} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-bold"
            >
              + Nueva Reseña
            </button>
            <button 
              onClick={handleLogout} 
              className="text-gray-600 hover:text-red-600 text-sm font-semibold"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal centrado */}
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