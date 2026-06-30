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
      // 1. Usamos 'multi' para buscar películas y series
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`
      );
      const data = await res.json();
      
      // 2. Filtramos para excluir personas y solo mostrar 'movie' o 'tv'
      const filtered = (data.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv');
      setResults(filtered);
    } catch (error) {
      console.error("Error buscando en TMDB:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* CORRECCIÓN RESPONSIVE: flex-col para móvil y sm:flex-row para pantallas mayores */}
      <form onSubmit={searchMedia} className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
        <input 
          className="flex-1 min-w-0 p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Busca películas o series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-auto shrink-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      <div className="grid gap-2 max-h-96 overflow-y-auto border-t pt-2">
        {results.length === 0 && !loading && <p className="text-gray-400 text-sm italic">Escribe algo para empezar a buscar...</p>}
        {results.map((item) => {
          // 3. Normalizamos datos (título/nombre y fecha)
          const title = item.title || item.name;
          const date = item.release_date || item.first_air_date;
          
          return (
            <button 
              key={item.id}
              className="flex items-center gap-4 p-2 border rounded hover:bg-blue-50 text-left transition-colors"
              onClick={() => onSelect({ 
                id: item.id, 
                title: title, 
                poster_path: item.poster_path, 
                media_type: item.media_type // Enviamos el tipo para que CreateReview lo guarde
              })}
            >
              {item.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                  alt={title} 
                  className="w-12 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-16 bg-gray-200 flex items-center justify-center text-[8px] text-gray-500">Sin img</div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-sm">{title}</span>
                <span className="text-xs text-gray-500">
                  {item.media_type === 'tv' ? 'Serie' : 'Película'} • {date?.split('-')[0] || 'N/A'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}