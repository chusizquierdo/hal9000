import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import DetailModal from './DetailModal';

const API_KEY = "8005d659cd2756fbe0a09eaba113b878";
const ITEMS_PER_PAGE = 30;

export default function MovieLibraryPage() {
  const [userId, setUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Evita parpadeos mientras se comprueba la sesión
  const [library, setLibrary] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  // Control de buscadores, vistas y filtros de formato
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showExternalSearch, setShowExternalSearch] = useState(false);
  const [activeFormatFilter, setActiveFormatFilter] = useState('all'); // 'all', 'dvd', 'bluray', '4k'

  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPageButton, setHoveredPageButton] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [draggedIndexState, setDraggedIndexState] = useState(null);
  const draggedIndexRef = useRef(null);
  const libraryRef = useRef([]);
  const dragTimeoutRef = useRef(null);

  // Control de arrastre táctil en móviles y tolerancia a micro-movimientos
  const touchTimeoutRef = useRef(null);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const isTouchDraggingRef = useRef(false);
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  // 👥 ESTADOS NUEVOS PARA "OTRAS BIBLIOTECAS"
  const [selectedLibraryUser, setSelectedLibraryUser] = useState(null); // null = propia biblioteca, o { id, username, avatar_url }
  const [profiles, setProfiles] = useState([]);
  const [showProfilesModal, setShowProfilesModal] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [profileSearch, setProfileSearch] = useState('');

  // Contadores para el header
  const dvdCount = library.filter(m => m.format === 'dvd').length;
  const blurayCount = library.filter(m => m.format === 'bluray').length;
  const fourKCount = library.filter(m => m.format === '4k').length;

  const updateLibraryState = (newLib) => {
    libraryRef.current = newLib;
    setLibrary(newLib);
  };

  const setDraggedIndex = (idx) => {
    setDraggedIndexState(idx);
    draggedIndexRef.current = idx;
  };

  // CONTROL DE SESIÓN EN TIEMPO REAL
  useEffect(() => {
    // 1. Comprobación de estado inicial en la carga
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (err) {
        console.error("Error comprobando autenticación:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    getUser();

    // 2. Suscripción en tiempo real a los cambios de sesión (Navbar, logout, registros, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
      setAuthLoading(false);
    });

    return () => {
      document.body.style.overflow = '';
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      // Cancelamos la suscripción al desmontar para evitar fugas de memoria
      subscription?.unsubscribe();
    };
  }, []);

  // 👥 Obtener perfiles de usuarios de la tabla "profiles"
  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .order('username', { ascending: true });

    if (error) {
      notify('error', 'Error al cargar los usuarios.');
    } else {
      setProfiles(data || []);
    }
    setLoadingProfiles(false);
  };

  useEffect(() => {
    if (showProfilesModal && userId) {
      fetchProfiles();
    }
  }, [showProfilesModal, userId]);

  // 👥 Carga la biblioteca correspondiente (del usuario actual o del seleccionado)
  const fetchLibrary = async () => {
    const targetUserId = selectedLibraryUser ? selectedLibraryUser.id : userId;
    if (!targetUserId) return;

    const { data, error } = await supabase
      .from('videoteca')
      .select('*')
      .eq('user_id', targetUserId)
      .order('display_order', { ascending: true });

    if (error) {
      notify('error', 'Error al cargar la videoteca.');
    } else {
      updateLibraryState(data || []);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLibrary();
    }
  }, [userId, selectedLibraryUser]);

  useEffect(() => {
    const handleGlobalDragOver = (e) => {
      if (selectedLibraryUser) return; // Deshabilitado en modo lectura
      const scrollThreshold = 120;
      if (e.clientY < scrollThreshold) {
        window.scrollBy(0, -15);
      } else if (e.clientY > window.innerHeight - scrollThreshold) {
        window.scrollBy(0, 15);
      }
    };

    window.addEventListener('dragover', handleGlobalDragOver);
    return () => window.removeEventListener('dragover', handleGlobalDragOver);
  }, [selectedLibraryUser]);

  const notify = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus({ type: '', text: '' }), 5000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(searchQuery)}&page=1`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      notify('error', 'Fallo de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const persistOrder = async (newLibrary) => {
    if (selectedLibraryUser) return; // Deshabilitado en modo lectura
    updateLibraryState(newLibrary);
    const updates = newLibrary.map((movie, index) => ({
      ...movie,
      display_order: index
    }));

    const { error } = await supabase
      .from('videoteca')
      .upsert(updates, { onConflict: 'id' });

    if (error) {
      console.error('Error de Supabase:', error);
      notify('error', 'Error al guardar el nuevo orden.');
    }
  };

  const addMovie = async (movieData, format) => {
    if (!userId || selectedLibraryUser) return; // Deshabilitado en modo lectura
    const newMovie = {
      user_id: userId,
      api_id: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      release_date: movieData.release_date,
      format: format,
      display_order: 0
    };

    const { data, error } = await supabase.from('videoteca').insert([newMovie]).select();
    if (error) {
      notify('error', 'No se pudo guardar.');
    } else {
      const updatedList = [data[0], ...libraryRef.current];
      await persistOrder(updatedList);
      setCurrentPage(1);
      
      let formatLabel = 'Blu-ray';
      if (format === '4k') formatLabel = '4K';
      if (format === 'dvd') formatLabel = 'DVD';
      
      notify('success', `¡"${movieData.title}" añadida como ${formatLabel}!`);
    }
  };

  const deleteMovie = async (id, e = null) => {
    if (e) e.stopPropagation();
    if (selectedLibraryUser) return; // Deshabilitado en modo lectura
    const { error } = await supabase.from('videoteca').delete().eq('id', id).eq('user_id', userId);
    if (error) {
      notify('error', 'Error al eliminar.');
    } else {
      const updated = libraryRef.current.filter(m => m.id !== id);
      persistOrder(updated);
      notify('info', 'Película eliminada.');
    }
  };

  const changeFilter = (format) => {
    setActiveFormatFilter(format);
    setCurrentPage(1);
  };

  const handleViewOtherLibrary = (profile) => {
    setSelectedLibraryUser(profile);
    setShowProfilesModal(false);
    setCurrentPage(1);
    setLocalSearchQuery('');
    setShowExternalSearch(false);
    setSearchResults([]);
  };

  const filteredLibrary = libraryRef.current.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(localSearchQuery.toLowerCase());
    const matchesFormat = activeFormatFilter === 'all' || movie.format === activeFormatFilter;
    return matchesSearch && matchesFormat;
  });

  const totalPages = Math.ceil(filteredLibrary.length / ITEMS_PER_PAGE);
  const paginatedLibrary = filteredLibrary.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const changePage = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHoveredPageButton(null);
  };

  const handlePageDragEnter = (e, direction) => {
    e.preventDefault();
    if (selectedLibraryUser) return; // Deshabilitado en modo lectura
    setHoveredPageButton(direction);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    dragTimeoutRef.current = setTimeout(() => {
      setHoveredPageButton(null);
      const currentIndex = draggedIndexRef.current;
      if (currentIndex === null) return;
      let newPage = currentPage;
      let targetIndex = currentIndex;
      if (direction === 'next' && currentPage < totalPages) {
        newPage = currentPage + 1;
        targetIndex = newPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE;
      } else if (direction === 'prev' && currentPage > 1) {
        newPage = currentPage - 1;
        targetIndex = newPage * ITEMS_PER_PAGE - 1;
      }
      if (newPage !== currentPage) {
        const updated = [...libraryRef.current];
        const draggedItem = updated[currentIndex];
        updated.splice(currentIndex, 1);
        updated.splice(targetIndex, 0, draggedItem);
        updateLibraryState(updated);
        setDraggedIndex(targetIndex);
        changePage(newPage);
      }
    }, 1500);
  };

  const handlePageDragLeave = (e) => {
    e.preventDefault();
    if (selectedLibraryUser) return;
    setHoveredPageButton(null);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
  };

  const handleDragStart = (e, index) => {
    if (selectedLibraryUser) { e.preventDefault(); return; } // Deshabilitado en modo lectura
    const targetItem = paginatedLibrary[index];
    const realIndex = libraryRef.current.findIndex(m => m.id === targetItem.id);
    setDraggedIndex(realIndex);
  };

  const handleItemDragEnter = (e, index) => {
    e.preventDefault();
    if (selectedLibraryUser) return; // Deshabilitado en modo lectura
    const targetItem = paginatedLibrary[index];
    const realIndex = libraryRef.current.findIndex(m => m.id === targetItem.id);
    const currentIndex = draggedIndexRef.current;
    if (currentIndex === null || currentIndex === realIndex) return;
    const updatedLibrary = [...libraryRef.current];
    const draggedItem = updatedLibrary[currentIndex];
    updatedLibrary.splice(currentIndex, 1);
    updatedLibrary.splice(realIndex, 0, draggedItem);
    setDraggedIndex(realIndex);
    updateLibraryState(updatedLibrary);
  };

  const handleDragEnd = () => {
    if (selectedLibraryUser) return;
    if (draggedIndexRef.current !== null) {
      persistOrder(libraryRef.current);
      setDraggedIndex(null);
    }
    setHoveredPageButton(null);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
  };

  const handleTouchStart = (e, index) => {
    if (selectedLibraryUser) return; // Deshabilitado en modo lectura
    if (e.target.closest('button')) return;

    const targetItem = paginatedLibrary[index];
    const realIndex = libraryRef.current.findIndex(m => m.id === targetItem.id);
    
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    
    touchTimeoutRef.current = setTimeout(() => {
      setDraggedIndex(realIndex);
      isTouchDraggingRef.current = true;
      setIsTouchDragging(true);
      document.body.style.overflow = 'hidden'; 
      if (navigator.vibrate) navigator.vibrate(50); // Feedback háptico
    }, 400);
  };

  const handleTouchMove = (e) => {
    if (selectedLibraryUser) return;
    const touch = e.touches[0];

    if (!isTouchDraggingRef.current) {
      const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(touchTimeoutRef.current);
      }
      return;
    }

    if (e.cancelable) e.preventDefault();

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const card = element.closest('[data-index]');
    if (!card) return;

    const targetIndex = parseInt(card.getAttribute('data-index'), 10);
    const targetItem = paginatedLibrary[targetIndex];
    if (!targetItem) return;

    const realTargetIndex = libraryRef.current.findIndex(m => m.id === targetItem.id);
    const currentIndex = draggedIndexRef.current;

    if (currentIndex !== null && currentIndex !== realTargetIndex) {
      const updatedLibrary = [...libraryRef.current];
      const draggedItem = updatedLibrary[currentIndex];
      updatedLibrary.splice(currentIndex, 1);
      updatedLibrary.splice(realTargetIndex, 0, draggedItem);
      setDraggedIndex(realTargetIndex);
      updateLibraryState(updatedLibrary);
    }
  };

  const handleTouchEnd = (e) => {
    if (selectedLibraryUser) return;
    clearTimeout(touchTimeoutRef.current);
    if (isTouchDraggingRef.current) {
      persistOrder(libraryRef.current);
      setDraggedIndex(null);
      isTouchDraggingRef.current = false;
      setIsTouchDragging(false);
      document.body.style.overflow = '';
      
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const filteredProfiles = profiles.filter(prof => 
    (prof.username || '').toLowerCase().includes(profileSearch.toLowerCase())
  );

  // ==========================================
  // 1. GESTIÓN DE PANTALLAS DE CARGA Y AUTENTICACIÓN
  // ==========================================
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-cyan-400">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-500">Iniciando videoteca premium...</p>
        </div>
      </div>
    );
  }

  // Si no está registrado o logueado, se le bloquea totalmente la interfaz (SIN BOTÓN DUPLICADO)
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
        <div className="max-w-md w-full bg-slate-900/80 border border-red-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.15)] space-y-6">
          <div className="w-20 h-20 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center justify-center text-4xl mx-auto shadow-inner select-none">
            🔒
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">Acceso Restringido</h2>
            <p className="text-slate-400 text-sm leading-relaxed font-semibold text-cyan-400">
              Para ver o gestionar la videoteca tienes que estar registrado.
            </p>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Utiliza el botón de inicio de sesión o registro en el menú superior (navbar) para acceder de forma segura a tus datos y empezar a gestionar tu colección.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. RENDERIZADO NORMAL (USUARIOS AUTENTICADOS)
  // ==========================================
  return (
    <div className="space-y-6 pb-12 px-4 max-w-7xl mx-auto mt-6 animate-fadeIn text-slate-100 min-h-screen">
      
      {/* INYECCIÓN DE ANIMACIÓN CSS NATIVA PARA EL DESTELLO BLANCO EN MÓVIL Y CUSTOM SCROLLBAR */}
      <style>{`
        @keyframes customWhiteFlash {
          0% { opacity: 0; }
          40% { opacity: 0.6; }
          100% { opacity: 0; }
        }
        .animate-flash-glow {
          animation: customWhiteFlash 0.35s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0891b2;
        }
      `}</style>

      {selectedMovie && (
        <DetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* NOTIFICACIONES DE ESTADO */}
      {status.text && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl font-bold text-xs shadow-2xl transition-all animate-fadeIn ${
          status.type === 'success' ? 'bg-emerald-600 text-white' : 
          status.type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
        }`}>
          {status.text}
        </div>
      )}

      {/* HEADER CON CONTADORES INTERACTIVOS Y NUEVO BOTÓN "OTRAS COLECCIONES" */}
      <div className="bg-slate-950 border border-blue-900/40 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="h-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 flex items-center justify-center text-[9px] font-black tracking-[0.3em] text-white uppercase shadow-inner">
          ✦ Videoteca Digital ✦
        </div>
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-black tracking-wider flex items-center gap-2 uppercase text-cyan-400">
              {selectedLibraryUser ? `💿 Colección de ${selectedLibraryUser.username}` : '💿 Mi Colección'}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <button 
                onClick={() => changeFilter('all')}
                className={`text-[10px] px-2.5 py-1 rounded-md border transition-all font-medium uppercase ${
                  activeFormatFilter === 'all' 
                    ? 'bg-slate-700 text-white border-slate-400 ring-2 ring-slate-500/50 scale-105 font-bold' 
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                Total: <strong className="text-white ml-0.5">{library.length}</strong>
              </button>

              <button 
                onClick={() => changeFilter('dvd')}
                className={`text-[10px] px-2.5 py-1 rounded-md border transition-all font-medium uppercase ${
                  activeFormatFilter === 'dvd' 
                    ? 'bg-zinc-700 text-white border-zinc-400 ring-2 ring-zinc-500/50 scale-105 font-bold' 
                    : 'bg-zinc-800/40 text-zinc-400 border-zinc-800/60 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                DVD: <strong className="text-white ml-0.5">{dvdCount}</strong>
              </button>

              <button 
                onClick={() => changeFilter('bluray')}
                className={`text-[10px] px-2.5 py-1 rounded-md border transition-all font-medium uppercase ${
                  activeFormatFilter === 'bluray' 
                    ? 'bg-blue-900 text-white border-blue-400 ring-2 ring-blue-500/50 scale-105 font-bold' 
                    : 'bg-blue-950/40 text-blue-400 border-blue-900/40 hover:text-blue-200 hover:bg-blue-950'
                }`}
              >
                Blu-ray: <strong className="text-white ml-0.5">{blurayCount}</strong>
              </button>

              <button 
                onClick={() => changeFilter('4k')}
                className={`text-[10px] px-2.5 py-1 rounded-md border transition-all font-medium uppercase ${
                  activeFormatFilter === '4k' 
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-400 ring-2 ring-cyan-500/50 scale-105 font-bold' 
                    : 'bg-cyan-950/20 text-cyan-400 border-cyan-950 hover:text-cyan-200 hover:bg-cyan-950/60'
                }`}
              >
                4K: <strong className="text-white ml-0.5">{fourKCount}</strong>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowProfilesModal(true)} 
              className="bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-900/60 font-bold text-xs py-3 px-5 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
              👥 Otras colecciones
            </button>

            {!selectedLibraryUser && (
              <button 
                onClick={() => setShowExternalSearch(true)} 
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 w-full sm:w-auto justify-center"
              >
                <span>+</span> Añadir película
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BANNER INFORMATIVO EN MODO LECTURA */}
      {selectedLibraryUser && (
        <div className="bg-cyan-950/40 border border-cyan-500/20 text-cyan-200 px-4 py-3 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            {selectedLibraryUser.avatar_url ? (
              <img src={selectedLibraryUser.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-cyan-500/30 object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center font-black text-xs text-cyan-300">
                {selectedLibraryUser.username ? selectedLibraryUser.username[0].toUpperCase() : '?'}
              </div>
            )}
            <span className="text-xs">
              Viendo la videoteca de <strong className="text-white uppercase font-black tracking-wider">{selectedLibraryUser.username || 'Usuario'}</strong>. Las opciones de edición están desactivadas.
            </span>
          </div>
          <button 
            onClick={() => setSelectedLibraryUser(null)}
            className="text-[10px] bg-red-950/60 hover:bg-red-900/80 border border-red-900/50 text-red-200 font-bold px-3 py-1.5 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap"
          >
            Regresar a mi colección ✕
          </button>
        </div>
      )}

      {/* BUSCADOR DE TMDB */}
      {showExternalSearch && !selectedLibraryUser && (
        <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl relative animate-fadeIn space-y-4">
          <button 
            onClick={() => {
              setShowExternalSearch(false);
              setSearchResults([]);
              setSearchQuery('');
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-sm bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-xl w-8 h-8 flex items-center justify-center transition-all"
          >
            ✕
          </button>
          
          <div className="pr-8">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-widest mb-1">Añadir Nueva Película</h3>
            <p className="text-[11px] text-slate-400">Busca títulos en la base de datos global para incorporarlos a tu catálogo.</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full max-w-4xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escribe el título de la película a buscar..."
              className="flex-1 bg-blue-950/60 border border-blue-800/80 rounded-xl px-4 py-3 text-base sm:text-xs text-cyan-100 placeholder:text-blue-500/70 focus:outline-none focus:border-cyan-400 transition-all font-medium"
            />
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-wider whitespace-nowrap">
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {/* RESULTADOS DE BÚSQUEDA EXTERNA */}
          {searchResults.length > 0 && (
            <div className="mt-4 border-t border-blue-900/40 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] font-black uppercase text-cyan-500 tracking-widest">Coincidencias Encontradas</h4>
                <button onClick={() => setSearchResults([])} className="text-[10px] bg-blue-950 hover:bg-blue-900 text-blue-400 px-2.5 py-1 rounded-lg">Limpiar Resultados</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.map((m) => {
                  const matchedLibraryMovie = library.find(libMovie => String(libMovie.api_id) === String(m.id));

                  return (
                    <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-blue-950/30 border border-blue-900/30 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img src={m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : 'https://via.placeholder.com/92x138?text=Sin+Poster'} className="w-10 aspect-[2/3] object-cover rounded-md flex-shrink-0 pointer-events-none select-none" draggable="false" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-white truncate">{m.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0 justify-end sm:justify-start">
                        {matchedLibraryMovie ? (
                          <button 
                            onClick={(e) => deleteMovie(matchedLibraryMovie.id, e)} 
                            className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center shadow-md animate-fadeIn"
                            title="Eliminar de la videoteca"
                          >
                            🗑️
                          </button>
                        ) : (
                          <>
                            <button onClick={() => addMovie(m, 'dvd')} className="px-2 py-2 bg-zinc-600 hover:bg-zinc-500 rounded-lg text-[9px] font-bold text-white uppercase transition-colors">DVD</button>
                            <button onClick={() => addMovie(m, 'bluray')} className="px-2 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-[9px] font-bold text-white uppercase transition-colors">BR</button>
                            <button onClick={() => addMovie(m, '4k')} className="px-2 py-2 bg-slate-800 hover:bg-black border border-slate-600 rounded-lg text-[9px] font-bold text-white uppercase transition-colors">4K</button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BUSCADOR FILTRO INTERNO */}
      {(!showExternalSearch || selectedLibraryUser) && library.length > 1 && (
        <div className="bg-slate-950 border border-blue-900/40 rounded-2xl p-6 shadow-xl space-y-2 animate-fadeIn">
          <label className="text-xs font-black uppercase text-cyan-400 tracking-widest block">
            {activeFormatFilter === 'all' 
              ? (selectedLibraryUser ? `Filtrar Videoteca de ${selectedLibraryUser.username}` : 'Filtrar mi Videoteca')
              : `Filtrar películas en ${activeFormatFilter.toUpperCase()}`
            }
          </label>
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => {
              setLocalSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Escribe para buscar dentro de las películas guardadas..."
            className="w-full bg-blue-950/60 border border-blue-800/80 rounded-xl px-4 py-3 text-base sm:text-xs text-cyan-100 placeholder:text-blue-500/70 focus:outline-none focus:border-cyan-400 transition-all font-medium"
          />
        </div>
      )}

      {/* REJILLA DE PELÍCULAS */}
      {paginatedLibrary.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {paginatedLibrary.map((movie, index) => {
            let labelClasses = "bg-gradient-to-b from-blue-500 to-blue-700 text-white";
            let labelText = "Blu-ray Disc";
            
            if (movie.format === '4k') {
              labelClasses = "bg-black text-white border-b border-zinc-900";
              labelText = "4K ULTRA HD";
            } else if (movie.format === 'dvd') {
              labelClasses = "bg-gradient-to-b from-zinc-500 via-zinc-600 to-zinc-700 text-zinc-100 tracking-wider font-semibold";
              labelText = "DVD VIDEO";
            }

            const isCurrentlyDragged = draggedIndexState === libraryRef.current.findIndex(m => m.id === movie.id);

            let dragStyles = "border-blue-900/50 hover:scale-[1.02]";
            if (isCurrentlyDragged) {
              if (isTouchDragging) {
                dragStyles = "scale-105 border-white ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.7)] z-50 pointer-events-none";
              } else {
                dragStyles = "opacity-40 border-cyan-500 scale-95 shadow-[0_0_15px_rgba(34,211,238,0.3)]";
              }
            }

            return (
              <div 
                key={movie.id} 
                data-index={index}
                draggable={!selectedLibraryUser}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleItemDragEnter(e, index)}
                onDragOver={(e) => e.preventDefault()} 
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onContextMenu={(e) => e.preventDefault()} 
                onClick={() => {
                  if (!isTouchDraggingRef.current) {
                    setSelectedMovie(movie);
                  }
                }}
                className={`relative group bg-slate-950 rounded-xl flex flex-col overflow-hidden border transition-all duration-300 hover:border-cyan-500/50 touch-none select-none [-webkit-touch-callout:none] ${dragStyles}`}
              >
                {isCurrentlyDragged && isTouchDragging && (
                  <div className="absolute inset-0 bg-white pointer-events-none animate-flash-glow z-50 mix-blend-screen" />
                )}

                <div className={`h-5 flex items-center justify-center text-[7px] font-black uppercase tracking-widest pointer-events-none select-none text-center px-1 truncate w-full shadow-md ${labelClasses}`}>
                  {labelText}
                </div>
                
                <div className="aspect-[2/3] relative w-full overflow-hidden flex-1 pointer-events-none select-none">
                  <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Ficha+Sin+Imagen'} 
                    className="w-full h-full object-cover pointer-events-none select-none" 
                    loading="lazy" 
                    draggable="false"
                  />
                  
                  {!selectedLibraryUser && (
                    <button 
                      onClick={(e) => deleteMovie(movie.id, e)}
                      className="absolute top-2 right-2 bg-red-600/90 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all shadow-md z-20 pointer-events-auto"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <div className="p-2.5 bg-slate-950 border-t border-blue-950 pointer-events-none select-none">
                  <h4 className="font-bold text-xs text-cyan-100 truncate">{movie.title}</h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 border border-dashed border-blue-900/30 rounded-2xl bg-slate-950/20">
          No hay películas que coincidan con los filtros aplicados.
        </div>
      )}

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-blue-950/60 flex-wrap">
          <button 
            onClick={() => changePage(currentPage - 1)}
            onDragEnter={(e) => handlePageDragEnter(e, 'prev')}
            onDragLeave={handlePageDragLeave}
            onDragOver={(e) => e.preventDefault()}
            disabled={currentPage === 1}
            className={`px-3 py-2 bg-slate-950 border border-blue-900/40 rounded-xl text-xs font-bold text-cyan-400 ${hoveredPageButton === 'prev' ? 'bg-cyan-900' : ''}`}
          >
            ◀ Ant
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => changePage(n)} className={`w-9 h-9 rounded-xl font-bold text-xs ${currentPage === n ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-blue-400 border border-blue-900/40'}`}>{n}</button>
          ))}
          
          <button 
            onClick={() => changePage(currentPage + 1)}
            onDragEnter={(e) => handlePageDragEnter(e, 'next')}
            onDragLeave={handlePageDragLeave}
            onDragOver={(e) => e.preventDefault()}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 bg-slate-950 border border-blue-900/40 rounded-xl text-xs font-bold text-cyan-400 ${hoveredPageButton === 'next' ? 'bg-cyan-900' : ''}`}
          >
            Sig ▶
          </button>
        </div>
      )}

      {/* 👥 MODAL FLOTANTE DE OTRAS COLECCIONES */}
      {showProfilesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-blue-900/50 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[80vh]">
            
            <div className="h-14 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-between px-4 text-xs font-black tracking-widest text-white uppercase">
              <span className="flex items-center gap-2">👥 Colecciones de Usuarios</span>
              <button 
                onClick={() => setShowProfilesModal(false)}
                className="text-white hover:text-red-200 text-sm font-bold bg-black/20 hover:bg-black/40 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col min-h-0 space-y-4">
              <p className="text-[11px] text-slate-400">Selecciona un usuario de la comunidad para echar un vistazo a su catálogo físico.</p>
              
              <input
                type="text"
                placeholder="Buscar usuario..."
                className="w-full bg-blue-950/40 border border-blue-900 rounded-xl px-3 py-2.5 text-xs text-cyan-100 placeholder:text-blue-500/70 focus:outline-none focus:border-cyan-400 transition-all font-medium"
                onChange={(e) => setProfileSearch(e.target.value)}
                value={profileSearch}
              />

              {loadingProfiles ? (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-12">
                  Cargando usuarios de la comunidad...
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[45vh]">
                  {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((prof) => (
                      <button
                        key={prof.id}
                        onClick={() => handleViewOtherLibrary(prof)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                          selectedLibraryUser?.id === prof.id
                            ? 'bg-cyan-950/60 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                            : 'bg-slate-900/40 border-blue-950 text-slate-300 hover:bg-blue-950/30 hover:border-blue-900/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {prof.avatar_url ? (
                            <img src={prof.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-blue-900/50 object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-900/50 flex items-center justify-center font-black text-xs text-cyan-400">
                              {prof.username ? prof.username[0].toUpperCase() : '?'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-xs">{prof.username || 'Usuario sin nombre'}</p>
                            {prof.id === userId && (
                              <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded-md mt-0.5 inline-block">Mi cuenta</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Ver ➜</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No se encontraron usuarios con ese nombre.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}