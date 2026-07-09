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

  // Contadores para el header
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

  const addMovie = async (movieData, format) => {
    if (!userId) return;
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
      notify('success', `¡"${movieData.title}" añadida como ${format === '4k' ? '4K' : 'Blu-ray'}!`);
      setSearchResults([]);
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
        <DetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* HEADER CON CONTADORES */}
      <div className="bg-slate-950 border border-blue-900/40 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="h-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 flex items-center justify-center text-[9px] font-black tracking-[0.3em] text-white uppercase shadow-inner">
          ✦ Videoteca Digital ✦
        </div>
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-black tracking-wider flex items-center gap-2 uppercase text-cyan-400">
              💿 Mi Colección
            </h2>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">Total: <strong className="text-white">{library.length}</strong></span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-1 rounded-md border border-blue-800">Blu-ray: <strong className="text-white">{blurayCount}</strong></span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-1 rounded-md border border-cyan-800">4K: <strong className="text-white">{fourKCount}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="bg-slate-950 border border-blue-900/40 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar títulos..."
            className="flex-1 bg-blue-950/60 border border-blue-800/80 rounded-xl px-4 py-3 text-xs text-cyan-100 placeholder:text-blue-500/70 focus:outline-none focus:border-cyan-400 transition-all font-medium"
          />
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-wider">
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </div>

      {/* RESULTADOS */}
      {searchResults.length > 0 && (
        <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-5 shadow-2xl">
          <div className="flex justify-between items-center border-b border-blue-900/40 pb-2 mb-4">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-widest">Coincidencias</h3>
            <button onClick={() => setSearchResults([])} className="text-[10px] bg-blue-950 hover:bg-blue-900 text-blue-400 px-2.5 py-1 rounded-lg">Cerrar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-2 bg-blue-950/30 border border-blue-900/30 rounded-xl">
                <img src={m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : 'https://via.placeholder.com/92x138?text=Sin+Poster'} className="w-10 aspect-[2/3] object-cover rounded-md" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-white truncate">{m.title}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => addMovie(m, 'bluray')} className="px-2 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-[9px] font-bold text-white uppercase transition-colors">BR</button>
                  <button onClick={() => addMovie(m, '4k')} className="px-2 py-2 bg-slate-800 hover:bg-black border border-slate-600 rounded-lg text-[9px] font-bold text-white uppercase transition-colors">4K</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REJILLA DE PELÍCULAS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {paginatedLibrary.map((movie, index) => (
          <div 
            key={movie.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleItemDragEnter(e, index)}
            onDragOver={(e) => e.preventDefault()} 
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedMovie(movie)}
            className="relative group bg-slate-950 rounded-xl flex flex-col overflow-hidden border border-blue-900/50 transition-all duration-300 hover:border-cyan-500/50 hover:scale-[1.02]"
          >
            <div className={`h-5 flex items-center justify-center text-[7px] font-black uppercase tracking-widest ${movie.format === '4k' ? 'bg-black text-white' : 'bg-gradient-to-b from-blue-500 to-blue-700 text-white'}`}>
              {movie.format === '4k' ? '4K ULTRA HD' : 'Blu-ray Disc'}
            </div>
            
            <div className="aspect-[2/3] relative w-full overflow-hidden flex-1">
              <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Ficha+Sin+Imagen'} className="w-full h-full object-cover" />
              <button 
                onClick={(e) => deleteMovie(movie.id, e)}
                className="absolute top-2 right-2 bg-red-600/90 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all"
              >
                🗑️
              </button>
            </div>
            <div className="p-2.5 bg-slate-950 border-t border-blue-950">
              <h4 className="font-bold text-xs text-cyan-100 truncate">{movie.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-blue-950/60">
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
    </div>
  );
}