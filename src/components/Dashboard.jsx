import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard({ onViewMovie }) {
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [filterType, setFilterType] = useState('all');
  const [filterGenre, setFilterGenre] = useState('all'); // Nuevo estado para género

  useEffect(() => {
    fetchMediaWithData();
  }, []);

  const fetchMediaWithData = async () => {
    const { data: itemsFromDb } = await supabase
      .from('media_items')
      .select(`*, reviews (id, comment, rating, created_at)`);
    
    if (itemsFromDb) {
      const itemsWithData = await Promise.all(itemsFromDb.map(async (m) => {
        let year = 0;
        let title = m.title;
        let genres = []; // Guardaremos los géneros aquí
        
        try {
          const type = m.media_type === 'tv' ? 'tv' : 'movie';
          const res = await fetch(`https://api.themoviedb.org/3/${type}/${m.api_id}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
          const data = await res.json();
          const date = data.release_date || data.first_air_date;
          year = date ? parseInt(date.substring(0, 4)) : 0;
          title = data.title || data.name;
          genres = data.genres ? data.genres.map(g => g.name) : [];
        } catch (e) { console.error("Error obteniendo datos de TMDB"); }

        const sortedReviews = (m.reviews || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const avg = sortedReviews.length > 0 
          ? (sortedReviews.reduce((acc, r) => acc + r.rating, 0) / sortedReviews.length) 
          : 0;
        
        return { ...m, avg, firstReview: sortedReviews[0], year, title, genres };
      }));
      setItems(itemsWithData);
    }
  };

  // Obtener lista de géneros únicos para el select
  const allGenres = [...new Set(items.flatMap(item => item.genres))].sort();

  const filteredAndSortedItems = items
    .filter(item => {
      const matchType = filterType === 'all' || item.media_type === filterType;
      const matchGenre = filterGenre === 'all' || item.genres.includes(filterGenre);
      return matchType && matchGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.avg - a.avg;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'year_new') return b.year - a.year;
      if (sortBy === 'year_old') return a.year - b.year;
      if (sortBy === 'recent') {
        const dateA = a.firstReview ? new Date(a.firstReview.created_at) : new Date(0);
        const dateB = b.firstReview ? new Date(b.firstReview.created_at) : new Date(0);
        return dateB - dateA;
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Feed de Reseñas</h1>
        <div className="flex flex-wrap gap-3">
          {/* Filtro por Tipo */}
          <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-xl shadow-sm outline-none" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todo el contenido</option>
            <option value="movie">Películas</option>
            <option value="tv">Series</option>
          </select>

          {/* Nuevo Filtro por Género */}
          <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-xl shadow-sm outline-none" value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
            <option value="all">Todos los géneros</option>
            {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          {/* Filtro por Orden */}
          <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-xl shadow-sm outline-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Última reseña</option>
            <option value="year_new">Año (Más reciente)</option>
            <option value="year_old">Año (Más antiguo)</option>
            <option value="rating">Mejor puntuación</option>
            <option value="title">Alfabético</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedItems.map(m => (
          <div key={m.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col" onClick={() => onViewMovie(m.id)}>
            <div className="relative h-64">
              <img src={m.poster_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl" />
              <div className="absolute top-3 left-3">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">{m.media_type === 'tv' ? 'Serie' : 'Película'}</span>
              </div>
            </div>
            <div className="p-5 flex-grow">
              <h2 className="font-bold text-gray-900 text-lg truncate">{m.title}</h2>
              <p className="text-gray-500 text-sm mb-1">{m.year > 0 ? m.year : 'N/A'}</p>
              {/* Mostramos los géneros debajo del año */}
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide mb-3">{m.genres?.slice(0, 2).join(' • ')}</p>
              
              {m.firstReview && (
                <p className="text-xs text-gray-400 italic mb-4 line-clamp-2 border-t pt-3">
                  "{m.firstReview.comment}"
                </p>
              )}

              <div className="flex items-center gap-1 font-bold text-yellow-500 mt-auto">
                ★ <span className="text-gray-900">{m.avg > 0 ? m.avg.toFixed(1) : '0.0'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}