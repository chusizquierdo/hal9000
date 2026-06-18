import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";

export default function UserLeaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Consultamos la tabla profiles y pedimos el conteo de registros asociados en reviews
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          reviews (count)
        `);

      if (dbError) throw dbError;

      // Mapeamos los datos respetando la estructura real de las tablas
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.username || 'Usuario Anónimo',
        reviewsCount: user.reviews?.[0]?.count || 0
      }));

      // Ordenación descendente de mayor a menor número de críticas
      const sorted = formattedUsers.sort((a, b) => b.reviewsCount - a.reviewsCount);
      setUsers(sorted);
    } catch (err) {
      console.error("Error al cargar el leaderboard:", err);
      setError("No se pudo sincronizar el ranking de críticos.");
    } finally {
      setLoading(false);
    }
  };

  const renderRankBadge = (index) => {
    switch (index) {
      case 0: return <span className="text-xl sm:text-2xl drop-shadow-sm" title="Primer Puesto">🥇</span>;
      case 1: return <span className="text-xl sm:text-2xl drop-shadow-sm" title="Segundo Puesto">🥈</span>;
      case 2: return <span className="text-xl sm:text-2xl drop-shadow-sm" title="Tercer Puesto">🥉</span>;
      default:
        return (
          <span className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs border border-gray-200 shadow-inner">
            {index + 1}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-500 font-medium my-6">
        ⏳ Sincronizando el ranking de críticos de HAL9000...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 text-red-700 rounded-2xl text-center border border-red-100 my-6 font-medium text-sm">
        ❌ {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-gray-100 my-6 mx-4 sm:mx-auto">
      <div className="mb-5 pb-4 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          🔥 Críticos de la Comunidad
        </h2>
        <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">Usuarios ordenados por volumen de reseñas reales de la base de datos.</p>
      </div>

      <div className="flex flex-col gap-2">
        {users.length === 0 ? (
          <p className="text-gray-400 text-sm italic py-4 text-center">No hay usuarios registrados todavía.</p>
        ) : (
          users.map((user, index) => {
            const isTop3 = index < 3;
            const bgStyles = index === 0 
              ? "from-amber-50/50 to-transparent border-amber-100/70" 
              : index === 1 
              ? "from-slate-50/60 to-transparent border-slate-200/60" 
              : index === 2 
              ? "from-orange-50/40 to-transparent border-orange-100/50" 
              : "bg-white border-gray-100";

            return (
              <div 
                key={user.id} 
                className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border bg-gradient-to-r ${bgStyles} transition-transform duration-200 hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-8 sm:w-9 flex justify-center items-center shrink-0">
                    {renderRankBadge(index)}
                  </div>
                  <span className={`text-xs sm:text-sm tracking-tight truncate max-w-[140px] xs:max-w-[220px] sm:max-w-none ${
                    isTop3 ? 'font-black text-gray-900' : 'font-semibold text-gray-700'
                  }`}>
                    {user.name}
                  </span>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl inline-block ${
                    index === 0 
                      ? 'bg-amber-100 text-amber-800' 
                      : isTop3 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-gray-50 text-gray-500'
                  }`}>
                    {user.reviewsCount} {user.reviewsCount === 1 ? 'reseña' : 'reseñas'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}