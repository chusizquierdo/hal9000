import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard({ onViewMovie }) {
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState('year');

  useEffect(() => {
    fetchMoviesWithData();
  }, []);

  const fetchMoviesWithData = async () => {
    const { data: moviesFromDb } = await supabase
      .from('media_items')
      .select(`*, reviews (id, comment, rating, created_at)`);
    
    if (moviesFromDb) {
      const moviesWithYears = await Promise.all(moviesFromDb.map(async (m) => {
        let year = 0;
        try {
          const res = await fetch(`https://api.themoviedb.org/3/movie/${m.api_id}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
          const data = await res.json();
          year = data.release_date ? parseInt(data.release_date.substring(0, 4)) : 0;
        } catch (e) { console.error("Error obteniendo año de TMDB"); }

        const sortedReviews = (m.reviews || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const avg = sortedReviews.length > 0 
          ? (sortedReviews.reduce((acc, r) => acc + r.rating, 0) / sortedReviews.length) 
          : 0;
        
        return { ...m, avg, firstReview: sortedReviews[0], year };
      }));

      setMovies(moviesWithYears);
    }
  };

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return b.avg - a.avg;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    // Cambiamos a 'a.year - b.year' para que sea de más antiguo a más moderno
    if (sortBy === 'year') return a.year - b.year; 
    return 0;
  });

  return (
    <div>
      <div className="mb-6 flex gap-2 items-center">
        <span className="font-bold text-gray-700">Ordenar por:</span>
        <select className="p-2 border rounded" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="year">Por año (Antiguas a Modernas)</option>
          <option value="rating">Mejor puntuación</option>
          <option value="title">Alfabético</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedMovies.map(m => (
          <div key={m.id} className="border p-4 rounded shadow bg-white cursor-pointer hover:shadow-lg transition" onClick={() => onViewMovie(m.id)}>
            <img src={m.poster_url} alt={m.title} className="w-full h-64 object-cover rounded" />
            <h2 className="font-bold text-lg mt-2">{m.title} ({m.year > 0 ? m.year : 'N/A'})</h2>
            <p className="text-sm">Puntuación: {m.avg.toFixed(1)} ★</p>
            {m.firstReview && (
              <p className="text-xs italic mt-2 text-gray-600 border-t pt-2">
                "{m.firstReview.comment.substring(0, 50)}..."
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}