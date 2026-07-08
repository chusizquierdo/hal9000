import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import DetailModal from './DetailModal';

const API_KEY = "8005d659cd2756fbe0a09eaba113b878";

export default function MovieLibraryPage() {
  const [userId, setUserId] = useState(null);
  const [library, setLibrary] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

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
      setLibrary(data || []);
    }
  };

  useEffect(() => {
    if (userId) fetchLibrary();
  }, [userId]);

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
    setLibrary(newLibrary);
    for (let i = 0; i < newLibrary.length; i++) {
      const movie = newLibrary[i];
      await supabase
        .from('videoteca')
        .update({ display_order: i })
        .eq('id', movie.id)
        .eq('user_id', userId);
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
      const updatedList = [data[0], ...library];
      await persistOrder(updatedList);
      notify('success', `¡"${movieData.title}" añadida al principio!`);
    }
  };

  const deleteMovie = async (id, e = null) => {
    if (e) e.stopPropagation();
    const { error } = await supabase.from('videoteca').delete().eq('id', id).eq('user_id', userId);
    if (error) {
      notify('error', 'Error al eliminar.');
    } else {
      const updated = library.filter(m => m.id !== id);
      persistOrder(updated);
      notify('info', 'Película eliminada.');
    }
  };

  const toggleMovieStatus = (movieData) => {
    const isAlreadyInLibrary = library.find(m => m.api_id === movieData.id);
    if (isAlreadyInLibrary) {
      deleteMovie(isAlreadyInLibrary.id);
    } else {
      addMovie(movieData);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedLibrary = [...library];
    const draggedItem = updatedLibrary[draggedIndex];
    updatedLibrary.splice(draggedIndex, 1);
    updatedLibrary.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setLibrary(updatedLibrary);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      persistOrder(library);
      setDraggedIndex(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 px-4 max-w-7xl mx-auto mt-6 animate-fadeIn text-slate-100">
      
      {selectedMovie && (
        <DetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      {/* CABECERA CON CONTADOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Mi Videoteca
        </h1>
        <div className="bg-blue-950 border border-cyan-500/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-cyan-950/20">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">
            {library.length} Películas totales
          </span>
        </div>
      </div>

      <div className="bg-slate-950 border border-blue-900/50 rounded-2xl p-5 shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar nueva película..."
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
              const isInLibrary = library.some(lib => lib.api_id === m.id);
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
        {library.map((movie, index) => (
          <div 
            key={movie.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
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
    </div>
  );
}