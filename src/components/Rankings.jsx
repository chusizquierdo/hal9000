import { useEffect, useState } from 'react';
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

// Mapa unificado de IDs para mostrar los nombres de los géneros en los chips de la lista
const GENRE_MAP = {
  28: "Acción", 12: "Aventura", 16: "Animación", 35: "Comedia", 80: "Crimen",
  99: "Documental", 18: "Drama", 10751: "Familiar", 14: "Fantasía", 36: "Historia",
  27: "Terror", 10402: "Música", 9648: "Misterio", 10749: "Romance", 878: "Ciencia Ficción",
  10770: "Película de TV", 53: "Suspense", 10752: "Bélica", 37: "Western",
  10759: "Acción y Aventura", 10762: "Infantil", 10763: "Noticias", 10764: "Reality",
  10765: "Sci-Fi y Fantasía", 10766: "Telenovela", 10767: "Charla", 10768: "Política"
};

const MOVIE_GENRES = [
  { id: 28, name: "Acción" }, { id: 12, name: "Aventura" }, { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" }, { id: 80, name: "Crimen" }, { id: 99, name: "Documental" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Familiar" }, { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" }, { id: 27, name: "Terror" }, { id: 10402, name: "Música" },
  { id: 9648, name: "Misterio" }, { id: 10749, name: "Romance" }, { id: 878, name: "Ciencia Ficción" },
  { id: 53, name: "Suspense" }, { id: 10752, name: "Bélica" }, { id: 37, name: "Western" }
];

const TV_GENRES = [
  { id: 10759, name: "Acción y Aventura" }, { id: 16, name: "Animación" }, { id: 35, name: "Comedia" },
  { id: 80, name: "Crimen" }, { id: 99, name: "Documental" }, { id: 18, name: "Drama" },
  { id: 10751, name: "Familiar" }, { id: 10762, name: "Infantil" }, { id: 9648, name: "Misterio" },
  { id: 10763, name: "Noticias" }, { id: 10764, name: "Reality" }, { id: 10765, name: "Sci-Fi y Fantasía" },
  { id: 10766, name: "Telenovela" }, { id: 10767, name: "Charla" }, { id: 10768, name: "Política" },
  { id: 37, name: "Western" }
];

export default function Rankings({ onViewMovie }) {
  const [mediaType, setMediaType] = useState('movie');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isBoxOffice, setIsBoxOffice] = useState(false);
  const [rankedItems, setRankedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isBoxOffice) {
      fetchBoxOfficeRankings();
    } else {
      fetchGlobalRankings();
    }
  }, [mediaType, selectedGenre, isBoxOffice]);

  const fetchGlobalRankings = async () => {
    setLoading(true);
    try {
      let url = '';
      if (selectedGenre === 'all') {
        url = `https://api.themoviedb.org/3/${mediaType}/top_rated?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&page=1`;
      } else {
        const minVotes = mediaType === 'movie' ? 500 : 150;
        url = `https://api.themoviedb.org/3/discover/${mediaType}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&sort_by=vote_average.desc&vote_count.gte=${minVotes}&with_genres=${selectedGenre}&page=1`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error en la respuesta al consultar Rankings Globales.");
      
      const data = await res.json();
      if (data.results) {
        const formatted = data.results.map(item => ({
          id: item.id,
          title: item.title || item.name,
          year: (item.release_date || item.first_air_date)?.substring(0, 4) || 'N/A',
          genres: item.genre_ids ? item.genre_ids.map(id => GENRE_MAP[id] || '').filter(Boolean) : [],
          poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=Sin+Poster',
          vote_average: item.vote_average || 0,
          vote_count: item.vote_count || 0
        }));
        setRankedItems(formatted);
      }
    } catch (error) { 
      console.error(error); 
      Sentry.captureException(error); // Capturamos fallos de red al consultar rankings de valoración
    } finally { 
      setLoading(false); 
    }
  };

  const fetchBoxOfficeRankings = async () => {
    setLoading(true);
    try {
      const API_KEY = "8005d659cd2756fbe0a09eaba113b878";
      const pages = [1, 2, 3, 4, 5];
      const pagePromises = pages.map(p => fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=revenue.desc&page=${p}`).then(res => {
        if (!res.ok) throw new Error(`Fallo al descargar página de taquilla ${p}`);
        return res.json();
      }));
      const pagesData = await Promise.all(pagePromises);
      let rawMovies = pagesData.flatMap(d => d.results || []);
      
      const detailsData = await Promise.all(rawMovies.slice(0, 100).map(m => fetch(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${API_KEY}&language=es-ES`).then(res => {
        if (!res.ok) throw new Error(`Fallo al descargar detalles financieros de película ${m.id}`);
        return res.json();
      })));

      const formatted = detailsData.map(item => ({
        id: item.id,
        title: item.title,
        year: item.release_date?.substring(0, 4) || 'N/A',
        genres: item.genres?.map(g => g.name) || [],
        poster_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=Sin+Poster',
        vote_average: item.vote_average || 0,
        vote_count: item.vote_count || 0,
        revenue: item.revenue || 0
      }));
      setRankedItems(formatted.sort((a, b) => b.revenue - a.revenue));
    } catch (error) { 
      console.error(error); 
      Sentry.captureException(error); // Capturamos excepciones concurrentes en las llamadas paralelas de recaudación
    } finally { 
      setLoading(false); 
    }
  };

  const getPodiumBadge = (index) => index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
  const currentGenresList = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isBoxOffice ? "💰 Taquilla Histórica" : "Rankings Globales según (TMDB)"}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{isBoxOffice ? "Top 100 recaudaciones" : "Mejor valoradas por usuarios"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button onClick={() => setIsBoxOffice(!isBoxOffice)} className={`flex-grow md:flex-none px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isBoxOffice ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border-emerald-200'}`}>
            {isBoxOffice ? "🏆 Ver Rankings" : "💵 Ver Taquilla"}
          </button>
          {!isBoxOffice && (
            <>
              <select className="flex-grow md:flex-none bg-gray-50 border border-gray-200 py-2 px-4 rounded-xl text-xs font-bold" value={mediaType} onChange={(e) => { setMediaType(e.target.value); setSelectedGenre('all'); }}>
                <option value="movie">🎬 Películas</option>
                <option value="tv">📺 Series</option>
              </select>
              <select className="flex-grow md:flex-none bg-gray-50 border border-gray-200 py-2 px-4 rounded-xl text-xs font-bold" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                <option value="all">🏆 Todos</option>
                {currentGenresList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24 font-bold text-gray-500">Cargando datos...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
          {rankedItems.map((m, index) => (
            <div key={m.id} onClick={() => onViewMovie && onViewMovie(m.id)} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="w-8 sm:w-12 text-center font-black flex justify-center items-center flex-shrink-0">
                <span className={index < 3 ? 'text-xl sm:text-2xl' : 'text-xs sm:text-sm text-gray-400'}>{getPodiumBadge(index)}</span>
              </div>
              <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                <img src={m.poster_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-grow min-w-0 pr-2">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight group-hover:text-blue-600 line-clamp-2">
                  {m.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] sm:text-xs text-gray-400 font-bold">{m.year}</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 truncate hidden sm:block">{m.genres.join(' • ')}</span>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center flex-shrink-0">
                <div className="flex items-center gap-1 font-black text-yellow-500 text-sm sm:text-base">
                  ★ <span className="text-gray-900">{m.vote_average.toFixed(1)}</span>
                </div>
                <span className="text-[9px] text-gray-400 font-bold hidden sm:block">{m.vote_count.toLocaleString('es-ES')} votos</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}