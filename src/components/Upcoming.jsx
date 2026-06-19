import { useEffect, useState } from 'react';

export default function Upcoming({ onViewMovie }) {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodOffset, setPeriodOffset] = useState(0); // 0 = Próximos 2 meses, 1 = Siguientes 2 meses, etc.

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Limpiamos horas para comparar solo días
        
        // Calcular el inicio teórico de este bloque de 2 meses (Día 1 del mes que toque)
        const startDate = new Date(today.getFullYear(), today.getMonth() + (periodOffset * 2), 1);

        // Calcular el fin de este bloque (Último día del segundo mes)
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0);

        // Formateador seguro YYYY-MM-DD para la API
        const formatYYYYMMDD = (dateObj) => {
          const y = dateObj.getFullYear();
          const m = String(dateObj.getMonth() + 1).padStart(2, '0');
          const d = String(dateObj.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
        };

        // Si es el primer bloque, la API empieza desde HOY. Si son bloques futuros, desde el día 1 de ese mes.
        const startStr = periodOffset === 0 ? formatYYYYMMDD(today) : formatYYYYMMDD(startDate);
        const endStr = formatYYYYMMDD(endDate);

        let allResults = [];
        
        // Consultamos hasta 4 páginas de TMDB para garantizar que pescamos toda la cartelera española
        for (let i = 1; i <= 4; i++) {
          const url = `https://api.themoviedb.org/3/discover/movie?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&region=ES&sort_by=release_date.asc&release_date.gte=${startStr}&release_date.lte=${endStr}&page=${i}&with_release_type=3|2`;
          const res = await fetch(url);
          const data = await res.json();
          
          if (data.results && data.results.length > 0) {
            allResults = [...allResults, ...data.results];
          } else {
            break; 
          }
          if (data.page >= data.total_pages) break;
        }
        
        // FILTRADO ESTRICTO CONTRA "FECHAS FANTASMA" DE TMDB
        const validResults = allResults.filter(m => {
          if (!m.release_date) return false;
          
          // Desglosamos la fecha de texto de TMDB de forma segura contra zonas horarias
          const [year, month, day] = m.release_date.split('-').map(Number);
          const movieDate = new Date(year, month - 1, day);
          
          // Determinamos cuál es la fecha mínima permitida para este bloque de la pantalla
          // Si estamos en la pag 1, lo mínimo es HOY. Si es la pag 2+, lo mínimo es el inicio del bloque.
          const minAllowedDate = periodOffset === 0 ? today : startDate;
          
          return movieDate >= minAllowedDate;
        });
        
        // Eliminar duplicados por ID de película
        const uniqueUpcoming = Array.from(new Map(validResults.map(m => [m.id, m])).values());
        
        // Ordenar cronológicamente
        const sorted = uniqueUpcoming.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        setUpcoming(sorted);
      } catch (e) { 
        console.error("Error al cargar estrenos:", e); 
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, [periodOffset]);

  return (
    <div className="space-y-8">
      {/* Selector de periodo superior */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <button 
          onClick={() => setPeriodOffset(prev => Math.max(0, prev - 1))}
          disabled={periodOffset === 0 || loading}
          className="px-4 py-2 bg-gray-50 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          ← Meses Anteriores
        </button>
        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
          Bloque del Periodo {periodOffset + 1}
        </span>
        <button 
          onClick={() => setPeriodOffset(prev => prev + 1)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
        >
          Siguientes Meses →
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 font-bold text-gray-500 animate-pulse">
          Cargando estrenos del periodo seleccionado...
        </div>
      ) : upcoming.length === 0 ? (
        <div className="text-center py-16 font-medium text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
          No se han encontrado estrenos programados para este rango de meses.
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(
            upcoming.reduce((acc, m) => {
              if (!m.release_date) return acc;
              const [year, month, day] = m.release_date.split('-').map(Number);
              const date = new Date(year, month - 1, day);
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
                        {m.release_date.split('-')[2]}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{m.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                        {(() => {
                          const [y, mo, d] = m.release_date.split('-').map(Number);
                          return new Date(y, mo - 1, d).toLocaleDateString('es-ES', { weekday: 'short' });
                        })()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selector de periodo inferior */}
      {!loading && upcoming.length > 0 && (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={() => {
              setPeriodOffset(prev => Math.max(0, prev - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={periodOffset === 0}
            className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all"
          >
            Anterior
          </button>
          <button 
            onClick={() => {
              setPeriodOffset(prev => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}