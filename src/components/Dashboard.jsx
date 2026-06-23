import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Trailers from './Trailers'; 
import Upcoming from './Upcoming';
import Rankings from './Rankings';
import UserLeaderboard from './UserLeaderboard';
import News from './News'; 
import SuggestionsPage from './SuggestionsPage';

export default function Dashboard({ onViewMovie, userIdFilter = null, onBack, isAdmin, activeTab }) {
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [filterType, setFilterType] = useState('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchMediaWithData();
  }, [userIdFilter]);

  const fetchMediaWithData = async () => {
    const { data: itemsFromDb, error } = await supabase
      .from('media_items')
      .select(`*, reviews (id, comment, rating, created_at, user_id)`);
    
    if (error) console.error("Error al cargar datos:", error);
    
    if (itemsFromDb) {
      const itemsWithData = await Promise.all(itemsFromDb.map(async (m) => {
        let year = 0;
        let title = m.title;
        let genres = [];
        let poster_url = m.poster_url;
        
        try {
          const type = m.media_type === 'tv' ? 'tv' : 'movie';
          const res = await fetch(`https://api.themoviedb.org/3/${type}/${m.api_id}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
          const data = await res.json();
          if (!poster_url && data.poster_path) poster_url = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
          const date = data.release_date || data.first_air_date;
          year = date ? parseInt(date.substring(0, 4)) : 0;
          title = data.title || data.name;
          genres = data.genres ? data.genres.map(g => g.name) : [];
        } catch (e) { console.error("Error TMDB"); }

        const sortedReviews = (m.reviews || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const userReview = userIdFilter ? (m.reviews || []).find(r => r.user_id === userIdFilter) : null;
        const avg = sortedReviews.length > 0 ? (sortedReviews.reduce((acc, r) => acc + r.rating, 0) / sortedReviews.length) : 0;
        
        return { 
          ...m, 
          poster_url,
          avg, 
          firstReview: userReview || sortedReviews[0], 
          year, 
          title, 
          genres, 
          hasUserReview: userIdFilter ? !!userReview : true
        };
      }));
      setItems(itemsWithData);
    }
  };

  const handleDeleteMediaItem = async (itemId, title, e) => {
    e.stopPropagation(); 
    if (!window.confirm(`¿ELIMINAR DEFINITIVAMENTE "${title}"?`)) return;
    await supabase.from('reviews').delete().eq('media_id', itemId);
    await supabase.from('watchlist').delete().eq('media_item_id', itemId);
    const { error } = await supabase.from('media_items').delete().eq('id', itemId);
    if (error) alert("Error al borrar: " + error.message);
    else await fetchMediaWithData();
  };

  const allGenres = [...new Set(items.flatMap(item => item.genres))].sort();

  const filteredAndSortedItems = items
    .filter(item => {
      const matchType = filterType === 'all' || item.media_type === filterType;
      const matchGenre = filterGenre === 'all' || item.genres.includes(filterGenre);
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchGenre && item.hasUserReview && matchSearch;
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

  const paginatedItems = filteredAndSortedItems.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-0">
      {userIdFilter && onBack && (
        <div className="mb-4">
          <button onClick={onBack} className="group inline-flex items-center gap-2 bg-white text-gray-600 hover:text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 shadow-sm hover:shadow transition-all">
            <span className="inline-block transform group-hover:-translate-x-1 transition-transform">←</span> Volver atrás
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
          {userIdFilter ? 'Tu Biblioteca' : activeTab === 'feed' ? 'Feed de Reseñas' : activeTab === 'rankings' ? 'Mejores Valoradas' : activeTab === 'leaderboard' ? 'Ranking de Críticos' : activeTab === 'upcoming' ? 'Próximos Estrenos' : activeTab === 'news' ? 'Noticias de Cine' : activeTab === 'suggestions' ? 'Sugerencias para ti' : 'Próximos Tráilers'}
        </h1>

        {activeTab === 'feed' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-xl shadow-sm outline-none" value={filterType} onChange={(e) => {setFilterType(e.target.value); setPage(0);}}>
                <option value="all">Todo el contenido</option>
                <option value="movie">Películas</option>
                <option value="tv">Series</option>
              </select>
              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-xl shadow-sm outline-none" value={filterGenre} onChange={(e) => {setFilterGenre(e.target.value); setPage(0);}}>
                <option value="all">Todos los géneros</option>
                {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-xl shadow-sm outline-none" value={sortBy} onChange={(e) => {setSortBy(e.target.value); setPage(0);}}>
                <option value="recent">Última reseña</option>
                <option value="year_new">Año (Más reciente)</option>
                <option value="year_old">Año (Más antiguo)</option>
                <option value="rating">Mejor puntuación</option>
                <option value="title">Alfabético</option>
              </select>
            </div>
            <input type="text" placeholder="Buscar título..." className="w-full md:w-64 p-2 border border-gray-200 rounded-xl shadow-sm outline-none" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}} />
          </div>
        )}
      </div>

      {activeTab === 'feed' ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedItems.map(m => (
                <div key={m.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col relative" onClick={() => onViewMovie(m.id)}>
                  <div className="relative h-64 overflow-hidden rounded-t-2xl">
                    <img src={m.poster_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">{m.media_type === 'tv' ? 'Serie' : 'Película'}</span>
                    </div>
                    {isAdmin && (
                      <button onClick={(e) => handleDeleteMediaItem(m.id, m.title, e)} className="absolute top-3 right-3 bg-black/40 hover:bg-red-600/90 w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="p-5 flex-grow">
                    <h2 className="font-bold text-gray-900 text-lg truncate">{m.title}</h2>
                    <p className="text-gray-500 text-sm mb-1">{m.year > 0 ? m.year : 'N/A'}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wide mb-3">{m.genres?.slice(0, 2).join(' • ')}</p>
                    {m.firstReview && <p className="text-xs text-gray-400 italic mb-4 line-clamp-2 border-t pt-3">"{m.firstReview.comment}"</p>}
                    <div className="flex items-center gap-1 font-bold text-yellow-500 mt-auto">★ <span className="text-gray-900">{m.avg > 0 ? m.avg.toFixed(1) : '0.0'}</span></div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-6 py-2 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">Anterior</button>
            <span className="font-bold text-gray-500">Página {page + 1}</span>
            <button disabled={(page + 1) * PAGE_SIZE >= filteredAndSortedItems.length} onClick={() => setPage(page + 1)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Siguiente</button>
          </div>
        </div>
      ) : activeTab === 'rankings' ? (
        <Rankings onViewMovie={onViewMovie} />
      ) : activeTab === 'leaderboard' ? (
        <UserLeaderboard onViewMovie={onViewMovie} />
      ) : activeTab === 'upcoming' ? (
        <Upcoming onViewMovie={onViewMovie} />
      ) : activeTab === 'news' ? (
        <News />
      ) : activeTab === 'suggestions' ? (
        <SuggestionsPage onViewMovie={onViewMovie} />
      ) : (
        <Trailers />
      )}
    </div>
  );
}