import { useEffect, useState } from 'react';
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

export default function Trailers() {
  const [validTrailersPool, setValidTrailersPool] = useState([]); // Almacena TODOS los tráilers válidos confirmados con vídeo
  const [displayedTrailers, setDisplayedTrailers] = useState([]); // Tráileres que se muestran en la página actual
  const [loading, setLoading] = useState(true);
  
  // --- ESTADOS DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // Cantidad exacta de tráileres por página

  // EFECTO 1: Descarga el catálogo, filtra los vídeos y genera el almacén global de tráilers válidos
  useEffect(() => {
    const fetchAllValidTrailers = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        let megaHypeMovies = [];
        let upcomingMovies = [];

        // 1. Obtener películas con alta popularidad futura
        const resDiscover = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&sort_by=popularity.desc&primary_release_date.gte=${today}&page=1`
        );
        if (!resDiscover.ok) throw new Error("Error en la respuesta al consultar películas en discover de tráilers.");
        
        const dataDiscover = await resDiscover.json();
        if (dataDiscover.results) megaHypeMovies = dataDiscover.results;

        // 2. Obtener próximos estrenos (Páginas 1 y 2 para tener buen volumen)
        for (let i = 1; i <= 2; i++) {
          const resUpcoming = await fetch(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&page=${i}&region=ES`
          );
          if (!resUpcoming.ok) throw new Error(`Error en la respuesta de películas próximas (upcoming), página ${i}.`);
          
          const dataUpcoming = await resUpcoming.json();
          if (dataUpcoming.results) upcomingMovies = [...upcomingMovies, ...dataUpcoming.results];
        }

        // Combinar, limpiar duplicados por ID y ordenar por popularidad
        const combinedMovies = [...megaHypeMovies, ...upcomingMovies];
        const sortedMovies = combinedMovies
          .filter(m => m.release_date && m.release_date >= today)
          .sort((a, b) => b.popularity - a.popularity);

        const uniqueMovies = Array.from(new Set(sortedMovies.map(m => m.id)))
          .map(id => sortedMovies.find(m => m.id === id));

        // Filtramos y buscamos los vídeos de todo el bloque (limitado a los 40 primeros para equilibrar rendimiento)
        const allTrailersEvaluated = await Promise.all(
          uniqueMovies.slice(0, 40).map(async (m) => {
            try {
              const videoRes = await fetch(
                `https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`
              );
              if (!videoRes.ok) throw new Error(`Fallo en videos en español para ID: ${m.id}`);
              
              const videoData = await videoRes.json();
              
              let trailer = videoData.results?.find(
                v => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
              );
              
              // Fallback internacional si no está en español
              if (!trailer) {
                const fallbackRes = await fetch(
                  `https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=8005d659cd2756fbe0a09eaba113b878`
                );
                if (!fallbackRes.ok) throw new Error(`Fallo en videos fallback para ID: ${m.id}`);
                
                const fallbackData = await fallbackRes.json();
                trailer = fallbackData.results?.find(
                  v => (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip') && v.site === 'YouTube'
                );
              }

              return trailer ? { ...m, trailerKey: trailer.key } : null;
            } catch (err) {
              console.error(`Error procesando videos para película ${m.id}:`, err);
              Sentry.captureException(err); // Capturamos fallos individuales de red o mapeo en la resolución de promesas por película
              return null;
            }
          })
        );

        // Guardamos únicamente los que SÍ tienen vídeo en una piscina limpia de resultados
        const cleanTrailers = allTrailersEvaluated.filter(t => t !== null);
        setValidTrailersPool(cleanTrailers);
        setLoading(false);
      } catch (e) {
        console.error("Error al compilar almacén de tráileres:", e);
        Sentry.captureException(e); // Capturamos fallos genéricos o interrupciones severas en la secuencia global de peticiones de cartelera
        setLoading(false);
      }
    };

    fetchAllValidTrailers();
  }, []);

  // EFECTO 2: Segmentar la piscina de tráileres limpios según la página actual (Instantáneo en memoria)
  useEffect(() => {
    if (validTrailersPool.length === 0) return;

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    
    // Al segmentar aquí, garantizamos que siempre tome exactamente 8 elementos válidos
    setDisplayedTrailers(validTrailersPool.slice(indexOfFirstItem, indexOfLastItem));
  }, [validTrailersPool, currentPage]);

  // Cálculo de páginas totales basado exclusivamente en contenido real
  const totalPages = Math.ceil(validTrailersPool.length / ITEMS_PER_PAGE) || 1;

  if (loading) return <div className="text-center py-10 font-bold text-gray-500">Cargando cartelera y verificando tráileres oficiales...</div>;

  return (
    <div className="p-4 space-y-8">
      
      {/* Cuadrícula de Tráileres estable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedTrailers.map(t => (
          <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-black group">
              <img 
                src={`https://img.youtube.com/vi/${t.trailerKey}/hqdefault.jpg`} 
                alt={t.title} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300" 
              />
              <a 
                href={`https://www.youtube.com/watch?v=${t.trailerKey}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 truncate" title={t.title}>
                {t.title}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Estreno: {t.release_date ? t.release_date.split('-').reverse().join('/') : 'Por confirmar'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- DISEÑO CLONADO DEL COMPONENTE DE NOTICIAS --- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2 bg-gray-100 rounded-xl font-bold disabled:opacity-30"
          >
            Anterior
          </button>
          
          <span className="font-bold text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}