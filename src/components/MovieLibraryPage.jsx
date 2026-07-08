import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient'; 
import DetailModal from './DetailModal';

const API_KEY = "8005d659cd2756fbe0a09eaba113b878";
const ITEMS_PER_PAGE = 30;

export default function MovieLibraryPage() {
  const [userId, setUserId] = useState(null);
  const [library, setLibrary] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPageButton, setHoveredPageButton] = useState(null); 
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [draggedIndexState, setDraggedIndexState] = useState(null);
  const draggedIndexRef = useRef(null);
  const libraryRef = useRef([]);
  const dragTimeoutRef = useRef(null);

  const updateLibraryState = (newLib) => {
    libraryRef.current = newLib;
    setLibrary(newLib);
  };

  const setDraggedIndex = (idx) => {
    setDraggedIndexState(idx);
    draggedIndexRef.current = idx;
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        notify('error', 'Debes iniciar sesión.');
      }
    };
    getUser();
  }, []);

  const fetchLibrary = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('videoteca')
      .select('*')
      .eq('user_id', userId)
      .order('display_order', { ascending: true });

    if (error) {
      notify('error', 'Error al cargar tu videoteca.');
    } else {
      updateLibraryState(data || []);
    }
  };

  useEffect(() => {
    if (userId) fetchLibrary();
  }, [userId]);

  // --- LÓGICA DE AUTOSCROLL GLOBAL ---
  useEffect(() => {
    const handleGlobalDragOver = (e) => {
      const scrollThreshold = 120; 
      if (e.clientY < scrollThreshold) {
        window.scrollBy(0, -15);
      } else if (e.clientY > window.innerHeight - scrollThreshold) {
        window.scrollBy(0, 15);
      }
    };

    window.addEventListener('dragover', handleGlobalDragOver);
    return () => window.removeEventListener('dragover', handleGlobalDragOver);
  }, []);

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

  const addMovie = async (movieData) => {
    if (!userId) return;
    const newMovie = {
      user_id: userId,
      api_id: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      release_date: movieData.release_date,
      display_order: 0
    };

    const { data, error } = await supabase.from('videoteca').insert([newMovie]).select();
    if (error) {
      notify('error', 'No se pudo guardar.');
    } else {
      const updatedList = [data[0], ...libraryRef.current];
      await persistOrder(updatedList);
      setCurrentPage(1);
      notify('success', `¡"${movieData.title}" añadida al principio!`);
    }
  };

  const deleteMovie = async (id, e = null) => {
    if (e) e.stopPropagation();
    const { error } = await supabase.from('videoteca').delete().eq('id', id).eq('user_id', userId);
    if (error) {
      notify('error', 'Error al eliminar.');
    } else {
      const updated = libraryRef.current.filter(m => m.id !== id);
      persistOrder(updated);
      notify('info', 'Película eliminada.');
    }
  };

  const toggleMovieStatus = (movieData) => {
    const isAlreadyInLibrary = libraryRef.current.find(m => m.api_id === movieData.id);
    if (isAlreadyInLibrary) {
      deleteMovie(isAlreadyInLibrary.id);
    } else {
      addMovie(movieData);
    }
  };

  const totalPages = Math.ceil(libraryRef.current.length / ITEMS_PER_PAGE);
  const paginatedLibrary = libraryRef.current.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const changePage = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHoveredPageButton(null);
  };

  const handlePageDragEnter = (e, direction) => {
    e.preventDefault();
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
    setHoveredPageButton(null);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
  };

  const handleDragStart = (e, index) => {
    const realIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
    setDraggedIndex(realIndex);
  };

  // Ahora usamos DragEnter en vez de DragOver para evitar colapsos visuales
  const handleItemDragEnter = (e, index) => {
    e.preventDefault();

    const realIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
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
    if (draggedIndexRef.current !== null) {
      persistOrder(libraryRef.current);
      setDraggedIndex(null);
    }
    setHoveredPageButton(null);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
  };

  return (
    <div className="space-y-6 pb-12 px-4 max-w-7xl mx-auto mt-6 animate-fadeIn text-slate-100 min-h-screen">
      
      {selectedMovie && (
        <DetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Mi Videoteca
        </h1>
        <div className="bg-blue-950 border border-cyan-500/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-cyan-950/20">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">
            {libraryRef.current.length} Películas totales
          </span>
        </div>
      </div>

      <div className="bg-slate-950 border border-blue-900/50 rounded-2xl p-5 shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca películas para añadir..."
            className="flex-1 bg-blue-950/40 border border-blue-800 rounded-xl px-4 py-3 text-xs text-cyan-100"
          />
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-xl font-bold text-xs uppercase text-white">
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase text-cyan-400">Resultados</h3>
            <button onClick={() => setSearchResults([])} className="text-xs bg-red-900/20 text-red-400 px-3 py-1 rounded-lg">Cerrar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map((m) => {
              const isInLibrary = libraryRef.current.some(lib => lib.api_id === m.id);
              return (
                <div key={m.id} className="flex items-center gap-3 p-2 bg-blue-950/30 border border-blue-900/30 rounded-xl">
                  <img src={m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : 'https://via.placeholder.com/92x138'} className="w-10 h-14 object-cover rounded-md" />
                  <p className="flex-1 text-xs font-bold truncate">{m.title}</p>
                  <button 
                    onClick={() => toggleMovieStatus(m)} 
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold ${isInLibrary ? 'bg-red-600 hover:bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500'} text-white`}
                  >
                    {isInLibrary ? '🗑️ Eliminar' : '➕ Añadir'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {paginatedLibrary.map((movie, index) => (
          <div 
            key={movie.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleItemDragEnter(e, index)}
            onDragOver={(e) => e.preventDefault()} // Imprescindible para que el navegador permita soltar (drop)
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedMovie(movie)}
            className="relative bg-slate-950 rounded-xl border border-blue-900/50 overflow-hidden cursor-pointer group"
          >
            <div className="aspect-[2/3] relative w-full overflow-hidden">
              <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'} className="w-full h-full object-cover" />
              <button 
                onClick={(e) => deleteMovie(movie.id, e)}
                className="absolute top-2 right-2 bg-red-600/80 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                🗑️
              </button>
            </div>
            <div className="p-2 border-t border-blue-950">
              <h4 className="font-bold text-[10px] text-cyan-100 truncate">{movie.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-8">
          <button 
            onClick={() => changePage(currentPage - 1)}
            onDragEnter={(e) => handlePageDragEnter(e, 'prev')}
            onDragLeave={handlePageDragLeave}
            onDragOver={(e) => e.preventDefault()} 
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 text-xs font-bold uppercase transition-all duration-300
              ${hoveredPageButton === 'prev' ? 'bg-cyan-600 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-blue-900 hover:bg-blue-800'}`}
          >
            Anterior
          </button>
          
          <span className="text-cyan-400 font-bold">
            Página {currentPage} de {totalPages}
          </span>
          
          <button 
            onClick={() => changePage(currentPage + 1)}
            onDragEnter={(e) => handlePageDragEnter(e, 'next')}
            onDragLeave={handlePageDragLeave}
            onDragOver={(e) => e.preventDefault()}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 text-xs font-bold uppercase transition-all duration-300
              ${hoveredPageButton === 'next' ? 'bg-cyan-600 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-blue-900 hover:bg-blue-800'}`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}