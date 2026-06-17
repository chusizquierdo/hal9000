import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Watchlist({ onViewMovie, userId, onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    const { data: watchlistData } = await supabase
      .from('watchlist')
      .select(`id, media_item_id, media_items (*)`)
      .eq('user_id', userId);

    if (watchlistData) {
      const hydratedItems = await Promise.all(watchlistData.map(async (row) => {
        const m = row.media_items;
        let year = 0;
        let title = m.title;
        let genres = [];

        try {
          const type = m.media_type === 'tv' ? 'tv' : 'movie';
          const res = await fetch(`https://api.themoviedb.org/3/${type}/${m.api_id}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
          const data = await res.json();
          const date = data.release_date || data.first_air_date;
          year = date ? parseInt(date.substring(0, 4)) : 0;
          title = data.title || data.name;
          genres = data.genres ? data.genres.map(g => g.name) : [];
        } catch (e) { console.error("Error obteniendo datos de TMDB"); }

        return { watchlistRowId: row.id, ...m, year, title, genres };
      }));
      setItems(hydratedItems);
    }
    setLoading(false);
  };

  const removeFromWatchlist = async (e, watchlistRowId) => {
    e.stopPropagation();
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('id', watchlistRowId);

    if (!error) {
      setItems(prev => prev.filter(item => item.watchlistRowId !== watchlistRowId));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-mono animate-pulse">Sincronizando con HAL9000...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Botón de retorno chulo para la Watchlist */}
      {onBack && (
        <div className="mb-4">
          <button 
            onClick={onBack} 
            className="group inline-flex items-center gap-2 bg-white text-gray-600 hover:text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 shadow-sm hover:shadow transition-all"
          >
            <span className="inline-block transform group-hover:-translate-x-1 transition-transform">←</span> 
            Volver al Feed Principal
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Películas Pendientes</h1>
        <p className="text-gray-500 text-sm mt-1">Tu lista de seguimiento personal y títulos por reseñar.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No tienes ninguna película o serie pendiente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(m => (
            <div key={m.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col relative" onClick={() => onViewMovie(m.id)}>
              <div className="relative h-64">
                <img src={m.poster_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl" />
                <div className="absolute top-3 left-3 flex justify-between w-[calc(100%-24px)] items-center">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {m.media_type === 'tv' ? 'Serie' : 'Película'}
                  </span>
                  <button 
                    onClick={(e) => removeFromWatchlist(e, m.watchlistRowId)}
                    className="bg-red-600/90 hover:bg-red-700 text-white p-2 rounded-full shadow-md backdrop-blur-sm transition-colors"
                    title="Quitar de pendientes"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg truncate">{m.title}</h2>
                  <p className="text-gray-500 text-sm mb-1">{m.year > 0 ? m.year : 'N/A'}</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">{m.genres?.slice(0, 2).join(' • ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}