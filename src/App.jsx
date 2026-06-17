import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import Dashboard from './components/Dashboard';
import MovieDetailsPage from './components/MovieDetailsPage';
import CreateReviewPage from './components/CreateReviewPage';
import Watchlist from './components/Watchlist';
import Auth from './components/Auth';
import UpdatePassword from './components/UpdatePassword';

export default function App() {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'my-reviews', 'watchlist', 'details', 'create'
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (window.location.pathname.includes('update-password')) {
      setCurrentView('update-password');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setCurrentView('update-password');
      }
    });
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await supabase.auth.signOut();
  };

  const navigateToDashboard = () => {
    setSelectedMediaId(null);
    setCurrentView('dashboard');
    setRefreshKey(prev => prev + 1);
  };

  const navigateToMyReviews = () => {
    setSelectedMediaId(null);
    setCurrentView('my-reviews');
    setIsDropdownOpen(false);
  };

  const navigateToWatchlist = () => {
    setSelectedMediaId(null);
    setCurrentView('watchlist');
    setIsDropdownOpen(false);
  };

  if (currentView === 'update-password') {
    return <UpdatePassword />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Auth />
      </div>
    );
  }

  const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || "Usuario";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-black text-gray-900 tracking-tighter cursor-pointer hover:text-blue-600 transition-colors" 
            onClick={navigateToDashboard}
          >
            HAL<span className="text-blue-600">9000</span>
          </h1>
          
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => { setCurrentView('create'); setIsDropdownOpen(false); }} 
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm"
            >
              + Nueva Reseña
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-gray-200"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {username}
                <span className="text-xs text-gray-400 font-normal">{isDropdownOpen ? '▲' : '▼'}</span>
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 origin-top-right transition-all">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400 font-medium">Conexión activa</p>
                      <p className="text-sm font-bold text-gray-700 truncate">{session.user.email}</p>
                    </div>
                    
                    <button 
                      onClick={navigateToMyReviews}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors"
                    >
                      📂 Mis reseñas (Biblioteca)
                    </button>
                    
                    <button 
                      onClick={navigateToWatchlist}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors"
                    >
                      ⏳ Películas pendientes
                    </button>
                    
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors"
                      >
                        🚪 Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard key={refreshKey} onViewMovie={(id) => { setSelectedMediaId(id); setCurrentView('details'); }} />
        )}
        
        {currentView === 'my-reviews' && (
          <Dashboard 
            key="my-library" 
            userIdFilter={session.user.id} 
            onViewMovie={(id) => { setSelectedMediaId(id); setCurrentView('details'); }} 
            onBack={navigateToDashboard} 
          />
        )}

        {currentView === 'watchlist' && (
          <Watchlist 
            onViewMovie={(id) => { setSelectedMediaId(id); setCurrentView('details'); }} 
            userId={session.user.id} 
            onBack={navigateToDashboard} 
          />
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