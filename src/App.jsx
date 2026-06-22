import { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import Dashboard from './components/Dashboard';
import MovieDetailsPage from './components/MovieDetailsPage';
import CreateReviewPage from './components/CreateReviewPage';
import Watchlist from './components/Watchlist';
import ProfileSettings from './components/ProfileSettings';
import Auth from './components/Auth';
import UpdatePassword from './components/UpdatePassword';

// NUEVOS COMPONENTES IMPORTADOS
import AdminUserPanel from './components/AdminUserPanel';
import UserLeaderboard from './components/UserLeaderboard';
import NavbarTabs from './components/NavbarTabs';

export default function App() {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [navigationStack, setNavigationStack] = useState([]); // NUEVO: Historial de navegación
  const [activeTab, setActiveTab] = useState('feed'); 
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({ username: 'Usuario', avatar_url: '' });
  
  const [isAdmin, setIsAdmin] = useState(false);

  // NUEVO: Lógica para cambiar de vista guardando el historial
  const navigateTo = (view, params = {}) => {
    setNavigationStack(prev => [...prev, { view: currentView, tab: activeTab, mediaId: selectedMediaId }]);
    if (params.mediaId) setSelectedMediaId(params.mediaId);
    setCurrentView(view);
  };

  // NUEVO: Lógica para volver atrás
  const goBack = () => {
    if (navigationStack.length > 0) {
      const last = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      setActiveTab(last.tab);
      setSelectedMediaId(last.mediaId);
      setCurrentView(last.view);
    } else {
      navigateToDashboard();
    }
  };

  useEffect(() => {
    if (window.location.pathname.includes('update-password')) {
      setCurrentView('update-password');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSession(session);
      } else {
        setSession(null);
        setIsAdmin(false);
      }
      if (event === 'PASSWORD_RECOVERY') {
        setCurrentView('update-password');
      }
    });
  }, []);

  useEffect(() => {
    if (session?.user && !session.isGuest) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    if (!session?.user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url, role')
      .eq('id', session.user.id)
      .maybeSingle();

    if (data) {
      setProfile({
        username: data.username || session.user.email.split('@')[0],
        avatar_url: data.avatar_url || ''
      });
      setIsAdmin(data.role === 'admin');
    } else {
      setProfile({
        username: session.user.email.split('@')[0],
        avatar_url: ''
      });
      setIsAdmin(false);
    }
  };

  const handleGuestLogin = () => {
    setSession({
      isGuest: true,
      user: { id: 'guest-user', email: 'invitado@hal9000.com' }
    });
    setProfile({ username: 'Invitado', avatar_url: '' });
    setIsAdmin(false);
    setCurrentView('dashboard');
    setNavigationStack([]);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsAdmin(false);
    if (session?.isGuest) {
      setSession(null);
    } else {
      await supabase.auth.signOut();
      setSession(null);
    }
    setActiveTab('feed');
    setCurrentView('dashboard');
    setNavigationStack([]);
  };

  const navigateToDashboard = () => {
    setSelectedMediaId(null);
    setActiveTab('feed');
    setCurrentView('dashboard');
    setNavigationStack([]);
    setRefreshKey(prev => prev + 1);
  };

  const navigateToMyReviews = () => {
    if (session?.isGuest) return;
    setSelectedMediaId(null);
    setActiveTab('feed');
    setCurrentView('my-reviews');
    setNavigationStack([]);
    setIsDropdownOpen(false);
  };

  const navigateToWatchlist = () => {
    if (session?.isGuest) return;
    setSelectedMediaId(null);
    setCurrentView('watchlist');
    setNavigationStack([]);
    setIsDropdownOpen(false);
  };

  const navigateToSettings = () => {
    if (session?.isGuest) return;
    setSelectedMediaId(null);
    setCurrentView('settings');
    setNavigationStack([]);
    setIsDropdownOpen(false);
  };

  const navigateToAdminPanel = () => {
    if (!isAdmin) return;
    setSelectedMediaId(null);
    setCurrentView('admin-panel');
    setNavigationStack([]);
    setIsDropdownOpen(false);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSelectedMediaId(null);
    setCurrentView('dashboard');
    setNavigationStack([]);
  };

  if (currentView === 'update-password') {
    return <UpdatePassword />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Auth onGuestLogin={handleGuestLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <nav className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1 sm:gap-2" onClick={navigateToDashboard}>
              HAL<span className="text-blue-600">9000</span>
              {isAdmin && <span className="hidden sm:inline text-[10px] bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide">Admin</span>}
            </h1>
            <div className="flex gap-2 sm:gap-4 items-center">
              {!session.isGuest && (
                <button onClick={() => { navigateTo('create'); setIsDropdownOpen(false); }} className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-5 py-2 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all shadow-md hover:shadow-lg text-[11px] sm:text-sm tracking-tight border border-blue-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  <span>Nueva Reseña</span>
                </button>
              )}
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full focus:outline-none transition-all duration-200 border-2 border-transparent hover:border-blue-500 hover:shadow-md">
                  {profile.avatar_url ? <img src={profile.avatar_url} alt="User Avatar" className="w-full h-full rounded-full object-cover" /> : <div className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-black uppercase tracking-wider shadow-inner">{profile.username[0]}</div>}
                </button>
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 origin-top-right transition-all">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex items-center gap-3">
                        {profile.avatar_url ? <img src={profile.avatar_url} alt="User Avatar Large" className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-sm" /> : <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center text-base font-black uppercase">{profile.username[0]}</div>}
                        <div className="overflow-hidden">
                          <p className="text-sm font-black text-gray-900 truncate">{profile.username}</p>
                          <p className="text-xs text-gray-400 truncate font-medium">{session.isGuest ? 'Modo de lectura' : session.user.email}</p>
                        </div>
                      </div>
                      {!session.isGuest ? (
                        <>
                          <button onClick={navigateToSettings} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-bold flex items-center gap-2 transition-colors mt-1">⚙️ Configurar Perfil</button>
                          <button onClick={navigateToMyReviews} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">📂 Mis reseñas (Biblioteca)</button>
                          <button onClick={navigateToWatchlist} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">⏳ Películas pendientes</button>
                          {isAdmin && <button onClick={navigateToAdminPanel} className="w-full text-left px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 font-black flex items-center gap-2 transition-colors border-t border-gray-100 pt-2">👑 Panel de Admin</button>}
                          <div className="border-t border-gray-100 mt-2 pt-1.5"><button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors">🚪 Cerrar sesión</button></div>
                        </>
                      ) : (
                        <div className="p-1 mt-1 flex flex-col gap-1"><button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 bg-blue-50/50 hover:bg-blue-600 hover:text-white font-bold flex items-center gap-2 transition-colors rounded-xl">🚪 Salir / Iniciar Sesión</button></div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <NavbarTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard key={refreshKey} isAdmin={isAdmin} activeTab={activeTab} onViewMovie={(id) => navigateTo('details', { mediaId: id })} />
        )}
        {currentView === 'my-reviews' && !session.isGuest && (
          <Dashboard key="my-library" isAdmin={isAdmin} activeTab={activeTab} userIdFilter={session.user.id} onViewMovie={(id) => navigateTo('details', { mediaId: id })} onBack={goBack} />
        )}
        {currentView === 'watchlist' && !session.isGuest && (
          <Watchlist onViewMovie={(id) => navigateTo('details', { mediaId: id })} userId={session.user.id} onBack={goBack} />
        )}
        {currentView === 'details' && (
          <MovieDetailsPage mediaId={selectedMediaId} isAdmin={isAdmin} onBack={goBack} />
        )}
        {currentView === 'create' && !session.isGuest && (
          <CreateReviewPage onReviewCreated={navigateToDashboard} />
        )}
        {currentView === 'settings' && !session.isGuest && (
          <ProfileSettings session={session} onBack={goBack} onProfileUpdated={fetchUserProfile} />
        )}
        {currentView === 'leaderboard' && (
          <UserLeaderboard />
        )}
        {currentView === 'admin-panel' && (
          <AdminUserPanel isAdmin={isAdmin} />
        )}
      </main>
    </div>
  );
}