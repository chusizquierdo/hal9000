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

  // Control de buscadores y vistas
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showExternalSearch, setShowExternalSearch] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPageButton, setHoveredPageButton] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [draggedIndexState, setDraggedIndexState] = useState(null);
  const draggedIndexRef = useRef(null);
  const libraryRef = useRef([]);
  const dragTimeoutRef = useRef(null);

  // Contadores para el header incluyendo DVD
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
      
      let formatLabel = 'Blu-ray';
      if (format === '4k') formatLabel = '4K';
      if (format === 'dvd') formatLabel = 'DVD';
      
      notify('success', `¡"${movieData.title}" añadida como ${formatLabel}!`);
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

  // Filtrado local en tiempo real por título
  const filteredLibrary = libraryRef.current.filter(movie =>
    movie.title.toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLibrary.length / ITEMS_PER_PAGE);
  const paginatedLibrary = filteredLibrary.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    const targetItem = paginatedLibrary[index];
    const realIndex = libraryRef.current.findIndex(m => m.id === targetItem.id);
    setDraggedIndex(realIndex);
  };

  const handleItemDragEnter = (e, index) => {
    e.preventDefault();
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

      {/* NOTIFICACIONES DE ESTADO */}
      {status.text && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl font-bold text-xs shadow-2xl transition-all animate-fadeIn ${
          status.type === 'success' ? 'bg-emerald-600 text-white' : 
          status.type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
        }`}>
          {status.text}
        </div>
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
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">Total: <strong className="text-white">{library.length}</strong></span>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-700">DVD: <strong className="text-white">{dvdCount}</strong></span>
              <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-1 rounded-md border border-blue-800">Blu-ray: <strong className="text-white">{blurayCount}</strong></span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-1 rounded-md border border-cyan-800">4K: <strong className="text-white">{fourKCount}</strong></span>
            </div>
          </div>
          <button 
            onClick={() => setShowExternalSearch(true)} 
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs py-3 px-6 rounded-xl transition-all uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 w-full sm:w-auto justify-center"
          >
            <span>+</span> Añadir película
          </button>
        </div>
      </div>

      {/* BUSCADOR DE TMDB (SE DESPLIEGA AL DARLE A AÑADIR PELÍCULA) */}
      {showExternalSearch && (
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
              className="flex-1 bg-blue-950/60 border border-blue-800/80 rounded-xl px-4 py-3 text-xs text-cyan-100 placeholder:text-blue-500/70 focus:outline-none focus:border-cyan-400 transition-all font-medium"
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
                  // Comprobamos si la película ya existe en la videoteca guardada por su api_id
                  const matchedLibraryMovie = library.find(libMovie => String(libMovie.api_id) === String(m.id));

                  return (
                    <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-blue-950/30 border border-blue-900/30 rounded-xl">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img src={m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : 'https://via.placeholder.com/92x138?text=Sin+Poster'} className="w-10 aspect-[2/3] object-cover rounded-md flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-white truncate">{m.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0 justify-end sm:justify-start">
                        {matchedLibraryMovie ? (
                          // Si ya está guardada, ocultamos los formatos y mostramos el botón rojo de eliminar
                          <button 
                            onClick={(e) => deleteMovie(matchedLibraryMovie.id, e)} 
                            className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center shadow-md"
                            title="Eliminar de la videoteca"
                          >
                            🗑️
                          </button>
                        ) : (
                          // Si no está añadida, se muestran las tres opciones de formato clásico
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

      {/* BUSCADOR FILTRO INTERNO (DESAPARECE SI SE ABRE EL BUSCADOR EXTERNO DE AÑADIR) */}
      {!showExternalSearch && (
        <div className="bg-slate-950 border border-blue-900/40 rounded-2xl p-6 shadow-xl space-y-2 animate-fadeIn">
          <label className="text-xs font-black uppercase text-cyan-400 tracking-widest block">
            Filtrar mi Videoteca
          </label>
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => {
              setLocalSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Escribe para buscar dentro de tus películas guardadas..."
            className="w-full bg-blue-950/60 border border-blue-800/80 rounded-xl px-4 py-3 text-xs text-cyan-100 placeholder:text-blue-500/70 focus:outline-none focus:border-cyan-400 transition-all font-medium"
          />
        </div>
      )}

      {/* REJILLA DE PELÍCULAS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:grid-cols-3 sm:gap-6">
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

          return (
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
              <div className={`h-5 flex items-center justify-center text-[7px] font-black uppercase tracking-widest ${labelClasses}`}>
                {labelText}
              </div>
              
              <div className="aspect-[2/3] relative w-full overflow-hidden flex-1">
                <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Ficha+Sin+Imagen'} className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => deleteMovie(movie.id, e)}
                  className="absolute top-2 right-2 bg-red-600/90 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                >
                  🗑️
                </button>
              </div>
              <div className="p-2.5 bg-slate-950 border-t border-blue-950">
                <h4 className="font-bold text-xs text-cyan-100 truncate">{movie.title}</h4>
              </div>
            </div>
          );
        })}
      </div>

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
    </div>
  );
}