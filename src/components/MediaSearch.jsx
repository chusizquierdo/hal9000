import { useState } from 'react';

export default function MediaSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const TMDB_API_KEY = '8005d659cd2756fbe0a09eaba113b878';

  const searchMedia = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error buscando en TMDB:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={searchMedia} className="flex gap-2 mb-4">
        <input 
          className="flex-1 p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Busca una película..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      <div className="grid gap-2 max-h-96 overflow-y-auto border-t pt-2">
        {results.length === 0 && !loading && <p className="text-gray-400 text-sm italic">Escribe algo para empezar a buscar...</p>}
        {results.map((movie) => (
          <button 
            key={movie.id}
            className="flex items-center gap-4 p-2 border rounded hover:bg-blue-50 text-left transition-colors"
            onClick={() => onSelect({ id: movie.id, title: movie.title, poster_path: movie.poster_path })}
          >
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                alt={movie.title} 
                className="w-12 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-16 bg-gray-200 flex items-center justify-center text-[8px] text-gray-500">Sin img</div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-sm">{movie.title}</span>
              <span className="text-xs text-gray-500">{movie.release_date?.split('-')[0] || 'N/A'}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}