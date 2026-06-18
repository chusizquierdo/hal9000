import { useEffect, useState } from 'react';

export default function Trailers() {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const today = new Date();
        let allMovies = [];

        for (let i = 1; i <= 5; i++) {
          const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&page=${i}`);
          const data = await res.json();
          if (data.results) allMovies = [...allMovies, ...data.results];
        }
        
        const futureMovies = allMovies.filter(m => m.release_date && new Date(m.release_date) > today);
        
        const trailersWithData = await Promise.all(futureMovies.slice(0, 20).map(async (m) => {
          const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
          const videoData = await videoRes.json();
          const trailer = videoData.results.find(v => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube');
          return trailer ? { ...m, trailerKey: trailer.key } : null;
        }));
        
        setTrailers(trailersWithData.filter(t => t !== null));
        setLoading(false);
      } catch (e) { 
        console.error("Error al cargar trailers:", e);
        setLoading(false);
      }
    };
    fetchTrailers();
  }, []);

  if (loading) return <div className="text-center py-10 font-bold text-gray-500">Cargando tráileres...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {trailers.map(t => (
        <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-48 bg-black group">
            <img src={`https://img.youtube.com/vi/${t.trailerKey}/mqdefault.jpg`} alt={t.title} className="w-full h-full object-cover opacity-80" />
            <a href={`https://www.youtube.com/watch?v=${t.trailerKey}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </a>
          </div>
          <div className="p-4"><h3 className="font-bold text-gray-900 truncate">{t.title}</h3></div>
        </div>
      ))}
    </div>
  );
}