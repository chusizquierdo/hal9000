import { useEffect, useState } from 'react';

// Mapa unificado de IDs para mostrar los nombres de los géneros en los chips de la lista
const GENRE_MAP = {
  28: "Acción", 12: "Aventura", 16: "Animación", 35: "Comedia", 80: "Crimen",
  99: "Documental", 18: "Drama", 10751: "Familiar", 14: "Fantasía", 36: "Historia",
  27: "Terror", 10402: "Música", 9648: "Misterio", 10749: "Romance", 878: "Ciencia Ficción",
  10770: "Película de TV", 53: "Suspense", 10752: "Bélica", 37: "Western",
  10759: "Acción y Aventura", 10762: "Infantil", 10763: "Noticias", 10764: "Reality",
  10765: "Sci-Fi y Fantasía", 10766: "Telenovela", 10767: "Charla", 10768: "Política"
};

// Listados específicos para los selectores de la interfaz
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
  const [mediaType, setMediaType] = useState('movie'); // 'movie' o 'tv'
  const [selectedGenre, setSelectedGenre] = useState('all'); // ID del género o 'all'
  const [isBoxOffice, setIsBoxOffice] = useState(false); // Switch para controlar el modo taquillazo histórico
  const [rankedItems, setRankedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isBoxOffice) {
      fetchBoxOfficeRankings();
    } else {
      fetchGlobalRankings();
    }
  }, [mediaType, selectedGenre, isBoxOffice]);

  // Tu consulta original por Géneros e Históricos Globales intacta
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
      const data = await res.json();
      
      if (data.results) {
        const formatted = data.results.map(item => {
          const date = item.release_date || item.first_air_date;
          const year = date ? date.substring(0, 4) : 'N/A';
          const genres = item.genre_ids ? item.genre_ids.map(id => GENRE_MAP[id] || '').filter(Boolean) : [];
          
          return {
            id: item.id,
            title: item.title || item.name,
            year,
            genres,
            poster_url: item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://via.placeholder.com/500x750?text=Sin+Poster',
            vote_average: item.vote_average || 0,
            vote_count: item.vote_count || 0
          };
        });
        
        setRankedItems(formatted);
      }
    } catch (error) {
      console.error("Error al consultar el ranking en TMDB:", error);
    } finally {
      setLoading(false);
    }
  };

  // Nueva consulta optimizada para traer exactamente las 100 películas más taquilleras con su recaudación
  const fetchBoxOfficeRankings = async () => {
    setLoading(true);
    try {
      const API_KEY = "8005d659cd2756fbe0a09eaba113b878";
      // TMDB devuelve 20 resultados por página. Necesitamos 5 páginas para conseguir 100 elementos
      const pages = [1, 2, 3, 4, 5];
      const pagePromises = pages.map(p =>
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=revenue.desc&page=${p}`).then(res => res.json())
      );
      
      const pagesData = await Promise.all(pagePromises);
      let rawMovies = [];
      pagesData.forEach(data => {
        if (data.results) rawMovies = [...rawMovies, ...data.results];
      });

      // Recortamos por seguridad a 100 elementos exactos
      const top100Raw = rawMovies.slice(0, 100);

      // Traemos el detalle completo de cada una en paralelo para obtener el campo exacto de "revenue" (recaudación)
      const detailPromises = top100Raw.map(movie =>
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=es-ES`).then(res => res.json())
      );
      
      const detailsData = await Promise.all(detailPromises);

      const formatted = detailsData.map(item => {
        const year = item.release_date ? item.release_date.substring(0, 4) : 'N/A';
        const genres = item.genres ? item.genres.map(g => g.name) : [];
        
        return {
          id: item.id,
          title: item.title,
          year,
          genres,
          poster_url: item.poster_path 
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : 'https://via.placeholder.com/500x750?text=Sin+Poster',
          vote_average: item.vote_average || 0,
          vote_count: item.vote_count || 0,
          revenue: item.revenue || 0
        };
      });

      // Aseguramos ordenación por volumen total de dinero recaudado descendente
      formatted.sort((a, b) => b.revenue - a.revenue);
      setRankedItems(formatted);
    } catch (error) {
      console.error("Error al consultar el ranking de taquilla:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPodiumBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const currentGenresList = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES;

  return (
    <div className="space-y-6">
      {/* Controles de Filtrado Superior */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isBoxOffice ? "💰 Películas Más Taquilleras de la Historia (Top 100)" : "Rankings Históricos Globales (TMDB)"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isBoxOffice ? "Las producciones cinematográficas con las mayores recaudaciones comerciales de todos los tiempos" : "Explora las obras maestras mejor valoradas del planeta por millones de cinéfilos"}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* BOTÓN EXTRA: Alternar Vista Taquilleras sin romper lo existente */}
          <button
            onClick={() => setIsBoxOffice(!isBoxOffice)}
            className={`flex-grow md:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm ${
              isBoxOffice
                ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            {isBoxOffice ? "🏆 Volver a Filtros por Género" : "💵 Ver 100 Más Taquilleras"}
          </button>

          {/* Tus selectores originales: Solo se muestran si NO estamos viendo las taquilleras */}
          {!isBoxOffice && (
            <>
              {/* Selector de Tipo */}
              <select 
                className="flex-grow md:flex-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-xl shadow-sm outline-none font-medium transition-all focus:border-blue-500 focus:bg-white text-sm" 
                value={mediaType} 
                onChange={(e) => {
                  setMediaType(e.target.value);
                  setSelectedGenre('all');
                }}
              >
                <option value="movie">🎬 Películas</option>
                <option value="tv">📺 Series de TV</option>
              </select>

              {/* Selector Dinámico de Géneros */}
              <select 
                className="flex-grow md:flex-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-xl shadow-sm outline-none font-medium transition-all focus:border-blue-500 focus:bg-white text-sm" 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="all">🏆 Todos los géneros (Top General)</option>
                {currentGenresList.map(genre => (
                  <option key={genre.id} value={genre.id}>🎭 {genre.name}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Listado Visualizado */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-sm text-gray-500 font-bold">Procesando y cargando clasificaciones de TMDB...</span>
        </div>
      ) : rankedItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 font-bold text-sm italic">No se encontraron producciones históricas en este género.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
          {rankedItems.map((m, index) => (
            <div 
              key={m.id} 
              onClick={() => onViewMovie && onViewMovie(m.id)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
            >
              {/* Posición en el ranking */}
              <div className="w-12 text-center font-black text-lg text-gray-700 flex justify-center items-center">
                <span className={index < 3 ? 'text-2xl' : 'text-sm text-gray-400'}>
                  {getPodiumBadge(index)}
                </span>
              </div>

              {/* Poster de la producción */}
              <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                <img src={m.poster_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>

              {/* Título e Info Principal */}
              <div className="flex-grow min-w-0">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-gray-900 truncate text-base group-hover:text-blue-600 transition-colors">{m.title}</h3>
                  <span className="text-xs text-gray-400 flex-shrink-0">({m.year})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 items-center mt-1">
                  <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                    {isBoxOffice ? 'Película' : (mediaType === 'tv' ? 'Serie' : 'Película')}
                  </span>
                  <p className="text-[10px] text-gray-400 font-medium truncate">
                    {m.genres.length > 0 ? m.genres.join(' • ') : 'Sin géneros'}
                  </p>
                </div>
              </div>

              {/* Columna Derecha Dinámica: Muestra recaudación en dólares si es modo taquilla */}
              <div className="flex flex-col items-end justify-center pl-2 flex-shrink-0">
                {isBoxOffice ? (
                  <>
                    <div className="text-emerald-700 font-black text-sm sm:text-base bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 shadow-sm">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(m.revenue)}
                    </div>
                    <div className="flex items-center gap-1 font-bold text-gray-400 text-xs mt-1">
                      ★ <span className="text-gray-700 font-black">{m.vote_average.toFixed(1)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 font-black text-yellow-500 text-base">
                      ★ <span className="text-gray-900">{m.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-0.5 whitespace-nowrap">
                      {m.vote_count.toLocaleString('es-ES')} votos
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}