import { useEffect, useState } from 'react';

export default function Upcoming({ onViewMovie }) {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const endOfYear = `${today.getFullYear()}-12-31`;
        let allResults = [];
        
        for (let i = 1; i <= 10; i++) {
          const url = `https://api.themoviedb.org/3/discover/movie?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&region=ES&sort_by=release_date.asc&release_date.gte=${todayStr}&release_date.lte=${endOfYear}&page=${i}&with_release_type=3|2`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.results) {
            const validResults = data.results.filter(m => m.release_date && new Date(m.release_date) >= today);
            allResults = [...allResults, ...validResults];
          }
        }
        
        const uniqueUpcoming = Array.from(new Map(allResults.map(m => [m.id, m])).values());
        const sorted = uniqueUpcoming.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        setUpcoming(sorted);
      } catch (e) { 
        console.error("Error al cargar estrenos:", e); 
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  if (loading) {
    return <div className="text-center py-10 font-bold text-gray-500">Cargando próximos estrenos...</div>;
  }

  return (
    <div className="space-y-12">
      {Object.entries(
        upcoming.reduce((acc, m) => {
          const date = new Date(m.release_date);
          const monthYear = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
          const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
          if (!acc[capitalized]) acc[capitalized] = [];
          acc[capitalized].push(m);
          return acc;
        }, {})
      ).map(([month, movies]) => (
        <div key={month}>
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-wider">{month}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(m => (
              <div 
                key={m.id} 
                onClick={() => onViewMovie && onViewMovie(m.id)}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {m.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-gray-400 font-bold text-xs italic">Sin imagen disponible</p>
                      <p className="text-gray-600 font-bold mt-2 text-sm">{m.title}</p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    {new Date(m.release_date).getDate()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{m.title}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                    {new Date(m.release_date).toLocaleDateString('es-ES', { weekday: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}