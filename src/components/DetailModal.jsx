import { useState, useEffect } from 'react';

const API_KEY = "8005d659cd2756fbe0a09eaba113b878";

export default function DetailModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.api_id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits`);
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("Error cargando detalles");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [movie]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="text-cyan-400 font-bold">Cargando detalles...</div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-slate-950 p-6 rounded-xl border border-red-500 text-red-400">
          <p>No se pudieron cargar los detalles.</p>
          <button onClick={onClose} className="mt-4 bg-red-900 px-4 py-2 rounded">Cerrar</button>
        </div>
      </div>
    );
  }

  const director = details.credits?.crew?.find(person => person.job === "Director")?.name || "Desconocido";
  const cast = details.credits?.cast?.slice(0, 5).map(c => c.name).join(", ") || "No disponible";
  const year = details.release_date ? new Date(details.release_date).getFullYear() : "N/A";
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : "N/A";

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 bg-blue-900/50 hover:bg-red-900/50 text-cyan-400 p-2 rounded-full transition-all z-10">✕</button>
        
        <div className="p-8">
          {details.poster_path && (
            <img 
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} 
              alt={details.title}
              className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
            />
          )}

          {/* Título y Año */}
          <h2 className="text-3xl font-black text-white mb-2">
            {details.title} <span className="text-cyan-700 text-xl font-medium">({year})</span>
          </h2>
          <p className="text-cyan-500 font-mono text-xs mb-6 uppercase tracking-widest">{details.tagline}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-900/50">
                <p className="text-[10px] uppercase font-bold text-blue-500">Director</p>
                <p className="text-white font-bold">{director}</p>
              </div>
              <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-900/50">
                <p className="text-[10px] uppercase font-bold text-blue-500">Géneros</p>
                <p className="text-white font-bold text-sm">{details.genres?.map(g => g.name).join(", ") || "N/A"}</p>
              </div>
              <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-900/50">
                <p className="text-[10px] uppercase font-bold text-blue-500">Duración</p>
                <p className="text-white font-bold text-sm">{runtime}</p>
              </div>
            </div>
            <div className="bg-blue-950/30 p-4 rounded-xl border border-blue-900/50">
              <p className="text-[10px] uppercase font-bold text-blue-500">Reparto principal</p>
              <p className="text-white text-sm leading-relaxed">{cast}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[10px] uppercase font-bold text-blue-500 mb-2">Sinopsis</p>
            <p className="text-blue-200 text-sm leading-relaxed">{details.overview || "Sin descripción disponible."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}