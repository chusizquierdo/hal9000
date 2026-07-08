import { useState, useEffect } from 'react';

// CONFIGURACIONES GLOBALES
const API_KEY = "8005d659cd2756fbe0a09eaba113b878";
const CURRENT_USER_ID = "user_123"; 
const MOVIES_PER_PAGE = 24; 

function AddMovieModal({ onSearchTitle, onClose }) {
  const [movieTitle, setMovieTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movieTitle.trim()) {
      onSearchTitle(movieTitle.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 select-none animate-fadeIn">
      <div className="relative bg-slate-950 border border-cyan-500/30 rounded-2xl overflow-hidden max-w-md w-full shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col">
        <div className="h-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 flex items-center justify-center text-[9px] font-black tracking-[0.3em] text-white uppercase shadow-inner">
          ✦ Blu-ray Disc Authoring ✦
        </div>
        <div className="p-5 border-b border-blue-900/40 flex justify-between items-center bg-slate-950">
          <div>
            <h3 className="font-black text-sm tracking-wider uppercase text-cyan-400">
              Añadir Nuevo Metraje
            </h3>
            <p className="text-[10px] text-blue-300/60 mt-0.5">Introduce el título para indexar la carátula</p>
          </div>
          <button 
            onClick={onClose} 
            className="bg-blue-950 hover:bg-blue-900 border border-blue-800 px-2.5 py-1 text-xs rounded-lg font-bold text-cyan-400 transition-colors"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-slate-950/50">
          <div className="text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-500/70 block mb-1.5">
              Título oficial o palabra clave:
            </label>
            <input
              type="text"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="Ej. Interstellar, El Caballero Oscuro..."
              className="w-full bg-blue-950/60 border border-blue-800/80 rounded-xl px-4 py-2.5 text-xs text-cyan-100 placeholder:text-blue-800/70 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all font-medium"
              autoFocus
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent hover:bg-blue-950 text-blue-400 font-bold text-xs py-2.5 rounded-xl border border-blue-900 transition-colors uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!movieTitle.trim()}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:bg-blue-950 disabled:text-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all uppercase tracking-wider shadow-[0_4px_12px_rgba(6,182,212,0.25)]"
            >
              Consultar Red
            </button>
          </div>
        </form>
        <div className="p-2.5 bg-blue-950/40 border-t border-blue-900/30 text-center text-blue-400/40 text-[8px] font-mono uppercase tracking-widest">
          Conexión directa con servidores TMDB activada
        </div>
      </div>
    </div>
  );
}

export default function MovieLibraryPage() {
  const [isAdmin, setIsAdmin] = useState(true); 
  const [library, setLibrary] = useState([]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // ✅ EFECTO PARA AUTO-SCROLL AL CAMBIAR DE PÁGINA
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    if (!isAdmin) return;
    try {
      const data = localStorage.getItem(`blu_ray_lib_${CURRENT_USER_ID}`);
      if (data) setLibrary(JSON.parse(data));
    } catch (e) {
      console.error("[Estantería Errores]", e);
    }
  }, [isAdmin]);

  const saveToStorage = (newLib) => {
    setLibrary(newLib);
    try {
      localStorage.setItem(`blu_ray_lib_${CURRENT_USER_ID}`, JSON.stringify(newLib));
    } catch (e) {
      console.error("[Almacenamiento Errores]", e);
    }
  };

  const notify = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus({ type: '', text: '' }), 5000);
  };

  const handleWizardLaunch = async (title) => {
    setWizardOpen(false);
    setSearchQuery(title);
    setLoading(true);
    notify('info', `Buscando registros y carátulas para "${title}"...`);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(title)}&page=1`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("[Estantería Error Red]", err);
      notify('error', 'Fallo de conexión con la base de datos cinematográfica.');
    } finally {
      setLoading(false);
    }
  };

  const addMovie = (movieData) => {
    if (library.some(m => m.id === movieData.id)) {
      notify('warning', `"${movieData.title}" ya descansa en tu colección.`);
      return;
    }
    const newMovie = {
      id: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      release_date: movieData.release_date,
      addedAt: new Date().toLocaleDateString('es-ES')
    };
    const updated = [newMovie, ...library];
    saveToStorage(updated);
    notify('success', `¡"${movieData.title}" empaquetada en su estuche Blu-ray!`);
  };

  const deleteMovie = (id) => {
    const updated = library.filter(m => m.id !== id);
    saveToStorage(updated);
    notify('info', 'Película descatalogada de la colección.');
    const totalPages = Math.ceil(updated.length / MOVIES_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  };

  const handleDragStart = (e, indexInCurrentPage) => {
    const globalIndex = (currentPage - 1) * MOVIES_PER_PAGE + indexInCurrentPage;
    setDraggedIndex(globalIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, indexInCurrentPage) => {
    e.preventDefault();
    const globalIndex = (currentPage - 1) * MOVIES_PER_PAGE + indexInCurrentPage;
    if (draggedIndex === null || draggedIndex === globalIndex) return;
    const updatedLibrary = [...library];
    const draggedItem = updatedLibrary[draggedIndex];
    updatedLibrary.splice(draggedIndex, 1);
    updatedLibrary.splice(globalIndex, 0, draggedItem);
    setDraggedIndex(globalIndex);
    setLibrary(updatedLibrary);
  };

  const handleDragEnd = () => {
    saveToStorage(library);
    setDraggedIndex(null);
  };

  const totalPages = Math.ceil(library.length / MOVIES_PER_PAGE);
  const indexOfLastMovie = currentPage * MOVIES_PER_PAGE;
  const indexOfFirstMovie = indexOfLastMovie - MOVIES_PER_PAGE;
  const currentMovies = library.slice(indexOfFirstMovie, indexOfLastMovie);

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 select-none">
        <div className="bg-slate-950 border border-red-900/50 rounded-2xl p-8 max-w-md text-center shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <span className="text-4xl block mb-3 animate-pulse">🔒</span>
          <h3 className="text-red-400 font-black text-sm uppercase tracking-widest">Área Restringida</h3>
          <p className="text-xs text-blue-300/50 mt-2 leading-relaxed">
            Este panel de catalogación física es de uso exclusivo para cuentas con credenciales de **Administrador**.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-4 max-w-7xl mx-auto mt-6 select-none animate-fadeIn text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950 p-6 rounded-2xl text-white border border-blue-900/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div>
          <h2 className="text-lg font-black tracking-wider flex items-center gap-2 uppercase text-cyan-400">
            💿 Almacén de Colecciones Físicas
          </h2>
          <p className="text-xs text-blue-300/60 mt-1">
            Custodiando <strong className="text-cyan-400 font-mono text-sm">{library.length}</strong> ediciones en total.
          </p>
        </div>
        <button 
          onClick={() => { setSearchResults([]); setSearchQuery(''); setWizardOpen(true); }}
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] transition-all uppercase tracking-wider text-white"
        >
          ➕ Catalogar Nueva Película
        </button>
      </div>

      {status.text && (
        <div className={`p-3.5 rounded-xl font-bold text-xs border text-center transition-all ${
          status.type === 'success' ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400' :
          status.type === 'warning' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400' :
          status.type === 'error' ? 'bg-red-950/40 border-red-500/40 text-red-400' : 
          'bg-blue-950/60 border-blue-500/40 text-cyan-300'
        }`}>
          {status.text}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-5 space-y-3 shadow-2xl">
          <div className="flex justify-between items-center border-b border-blue-900/40 pb-2">
            <h3 className="text-xs font-black uppercase text-cyan-400 tracking-widest">Coincidencias encontradas</h3>
            <button onClick={() => { setSearchResults([]); setSearchQuery(''); }} className="text-[10px] bg-blue-950 hover:bg-blue-900 text-blue-400 px-2.5 py-1 rounded-lg">Limpiar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {searchResults.map((m) => {
              const isAlreadyAdded = library.some(movie => movie.id === m.id);
              return (
                <div key={m.id} className="flex items-center gap-3 p-2 bg-blue-950/30 border border-blue-900/30 rounded-xl">
                  <img src={m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : 'https://via.placeholder.com/92x138?text=Sin+Poster'} className="w-10 aspect-[2/3] object-cover rounded-md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-white truncate">{m.title}</p>
                    <p className="text-[10px] text-blue-400/60">{m.release_date?.split('-')[0]}</p>
                  </div>
                  {isAlreadyAdded ? (
                    <button onClick={() => deleteMovie(m.id)} className="px-3 py-2 bg-red-700 text-white rounded-xl text-[10px] font-bold">✕ Eliminar</button>
                  ) : (
                    <button onClick={() => addMovie(m)} className="px-3 py-2 bg-cyan-600 text-white rounded-xl text-[10px] font-bold">➕ Añadir</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {library.length === 0 ? (
        <div className="text-center py-24 bg-slate-950/40 border border-blue-900/20 rounded-2xl">
          <p className="text-3xl">💿</p>
          <h4 className="font-bold text-blue-400/50 text-xs mt-3">Estantería limpia y vacía</h4>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {currentMovies.map((movie, index) => {
              const globalIndex = (currentPage - 1) * MOVIES_PER_PAGE + index;
              return (
                <div 
                  key={movie.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group bg-slate-950 rounded-xl flex flex-col overflow-hidden border transition-all duration-300 ${draggedIndex === globalIndex ? 'opacity-50 border-cyan-400' : 'border-blue-900/50'}`}
                >
                  <div className="h-5 bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center text-[7px] font-black uppercase">Blu-ray Disc</div>
                  <div className="aspect-[2/3] relative w-full overflow-hidden flex-1">
                    <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Ficha+Sin+Imagen'} alt={movie.title} className="w-full h-full object-cover" />
                    <button onClick={() => deleteMovie(movie.id)} className="absolute top-2 right-2 bg-red-600/90 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all">🗑️</button>
                  </div>
                  <div className="p-2.5 bg-slate-950 border-t border-blue-950">
                    <h4 className="font-bold text-xs text-cyan-100 truncate">{movie.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-blue-950/60">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-2 bg-slate-950 border border-blue-900/40 rounded-xl text-xs font-bold text-cyan-400">◀ Ant</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setCurrentPage(n)} className={`w-9 h-9 rounded-xl font-bold text-xs ${currentPage === n ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-blue-400'}`}>{n}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-2 bg-slate-950 border border-blue-900/40 rounded-xl text-xs font-bold text-cyan-400">Sig ▶</button>
            </div>
          )}
        </>
      )}

      {wizardOpen && <AddMovieModal onSearchTitle={handleWizardLaunch} onClose={() => setWizardOpen(false)} />}
    </div>
  );
}