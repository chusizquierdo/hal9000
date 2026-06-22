import { useEffect, useState } from 'react';

export default function SuggestionsPage({ onViewMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ 
    genre: '', 
    year: '', 
    personId: '',
    personQuery: '' 
  });

  // Ampliamos el rango a 15 páginas para tener un pool masivo de 300 películas distintas
  const getRandomPage = () => Math.floor(Math.random() * 15) + 1;

  // Al montar el componente seleccionamos una página aleatoria
  useEffect(() => {
    setPage(getRandomPage());
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    // URL con filtros obligatorios (Nota ≥ 6, +50 votos, Streaming en España)
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&sort_by=popularity.desc&vote_average.gte=6&vote_count.gte=50&primary_release_date.lte=${today}&watch_region=ES&with_watch_monetization_types=flatrate&page=${page}`;
    
    if (filters.genre) url += `&with_genres=${filters.genre}`;
    if (filters.year) url += `&primary_release_year=${filters.year}`;
    if (filters.personId) url += `&with_people=${filters.personId}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      
      const filteredResults = (data.results || []).filter(m => {
        const releaseDate = m.release_date || '9999-12-31';
        return releaseDate <= today;
      });
      
      // Control de seguridad por si una página alta se queda vacía por culpa de filtros exigentes
      if (filteredResults.length === 0 && page > 1) {
        setPage(1);
        return;
      }
      
      // ALGORITMO SHUFFLE: Mezclamos el array de películas aleatoriamente.
      // Esto garantiza que incluso si se repite la misma página por azar, el orden en la cuadrícula
      // será totalmente caótico y diferente, dando la sensación de novedad absoluta.
      const shuffledResults = filteredResults.sort(() => Math.random() - 0.5);
      
      setMovies(shuffledResults);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Escucha cambios tanto de página como de filtros.
  // Al cambiar de pestaña, si el componente se mantiene vivo, el cambio de filtros/página forzará el re-fetch.
  useEffect(() => {
    fetchMovies();
  }, [page, filters.genre, filters.year, filters.personId]);

  const handlePersonSearch = async () => {
    if (!filters.personQuery) {
      setFilters(prev => ({ ...prev, personId: '' }));
      return;
    }
    const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=8005d659cd2756fbe0a09eaba113b878&query=${encodeURIComponent(filters.personQuery)}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      setFilters(prev => ({ ...prev, personId: data.results[0].id }));
      setPage(getRandomPage()); 
    }
  };

  return (
    <div className="space-y-6 pb-12 px-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <select 
          value={filters.genre} 
          onChange={(e) => {setFilters(p => ({...p, genre: e.target.value})); setPage(getRandomPage());}} 
          className="p-2 border rounded-xl bg-gray-50 outline-none w-full"
        >
          <option value="">Todos los géneros</option>
          <option value="28">Acción</option><option value="12">Aventura</option><option value="16">Animación</option>
          <option value="35">Comedia</option><option value="80">Crimen</option><option value="18">Drama</option>
          <option value="14">Fantasía</option><option value="27">Terror</option><option value="10749">Romance</option>
          <option value="878">Ciencia Ficción</option><option value="53">Thriller</option>
        </select>
        
        <input 
          type="number" 
          placeholder="Año (ej: 2020)" 
          value={filters.year} 
          onChange={(e) => {setFilters(p => ({...p, year: e.target.value})); setPage(getRandomPage());}} 
          className="p-2 border rounded-xl bg-gray-50 outline-none w-full" 
        />
        
        <input 
          type="text" 
          placeholder="Actor/Director" 
          value={filters.personQuery} 
          onChange={(e) => setFilters(p => ({...p, personQuery: e.target.value}))} 
          onKeyDown={(e) => e.key === 'Enter' && handlePersonSearch()}
          className="p-2 border rounded-xl bg-gray-50 outline-none w-full" 
        />
        
        <div className="flex gap-2">
          <button 
            onClick={handlePersonSearch}
            className="flex-1 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
          <button 
            onClick={() => {setFilters({ genre: '', year: '', personId: '', personQuery: '' }); setPage(getRandomPage());}} 
            className="px-4 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            X
          </button>
        </div>
      </div>

      {/* Criterios Obligatorios */}
      <div className="flex flex-wrap gap-2 items-center text-xs font-bold text-gray-500 bg-gray-100/80 p-3 rounded-xl border border-gray-200/50">
        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide">Criterios</span>
        <span>• Nota TMDb ≥ 6.0</span>
        <span>• Mínimo 50 votos</span>
        <span>• Disponible en plataformas (España)</span>
        <span className="text-blue-600 ml-auto flex items-center gap-1">🎲 Mezcla aleatoria en tiempo real</span>
      </div>

      {/* Grid de Películas */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400 animate-pulse">Buscando recomendaciones...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map(m => (
            <div 
              key={m.id} 
              onClick={() => onViewMovie(m.id)} 
              className="cursor-pointer bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 relative group"
            >
              {/* Badge de nota */}
              {m.vote_average && (
                <div className="absolute top-2 right-2 z-10 bg-black/75 text-white px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 backdrop-blur-sm shadow-sm border border-white/10">
                  <span>⭐</span>
                  <span>{m.vote_average.toFixed(1)}</span>
                </div>
              )}
              
              <img 
                src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/500x750?text=Sin+Imagen'} 
                alt={m.title} 
                className="w-full aspect-[2/3] object-cover" 
              />
              <div className="p-3 bg-white">
                <h3 className="font-bold text-sm truncate text-gray-900 group-hover:text-blue-600 transition-colors">{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Paginación */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(prev => Math.max(1, prev - 1))} 
          className="px-6 py-2 bg-gray-100 rounded-xl font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors"
        >
          Anterior
        </button>
        <span className="font-bold self-center text-gray-600">Página {page}</span>
        <button 
          onClick={() => setPage(prev => prev + 1)} 
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}