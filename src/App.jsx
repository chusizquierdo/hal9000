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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación moderna con estilo glass-light */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-black text-gray-900 tracking-tighter cursor-pointer hover:text-blue-600 transition-colors" 
            onClick={navigateToDashboard}
          >
            HAL<span className="text-blue-600">9000</span>
          </h1>
          
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setCurrentView('create')} 
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              + Nueva Reseña
            </button>
            <button 
              onClick={handleLogout} 
              className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors px-3 py-2"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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