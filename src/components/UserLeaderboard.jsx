import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";

export default function UserLeaderboard({ onViewMovie }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para controlar el desplegable y las reseñas del usuario seleccionado
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userReviews, setUserReviews] = useState({}); // Guarda { userId: [reseñas] }
  const [loadingReviews, setLoadingReviews] = useState(false);

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

  // Función para expandir/colapsar y cargar las reseñas específicas de un usuario
  const handleUserClick = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);

    // Si ya tenemos las reseñas guardadas localmente, evitamos otra petición a Supabase
    if (userReviews[userId]) return;

    try {
      setLoadingReviews(true);
      
      // MODIFICACIÓN: Solicitamos también el 'id' de media_items para poder navegar a él
      const { data, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          media_items (
            id,
            title
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      setUserReviews(prev => ({
        ...prev,
        [userId]: data || []
      }));

    } catch (err) {
      console.error("Error al cargar las reseñas del crítico:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const renderRankBadge = (index) => {
    switch (index) {
      case 0: return <span className="text-2xl sm:text-3xl drop-shadow-sm" title="Primer Puesto">🥇</span>;
      case 1: return <span className="text-2xl sm:text-3xl drop-shadow-sm" title="Segundo Puesto">🥈</span>;
      case 2: return <span className="text-2xl sm:text-3xl drop-shadow-sm" title="Tercer Puesto">🥉</span>;
      default:
        return (
          <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border border-gray-200 shadow-inner">
            {index + 1}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-gray-500 font-medium my-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
        ⏳ Sincronizando el ranking de críticos de HAL9000...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-red-50 text-red-700 rounded-3xl text-center border border-red-100 my-6 font-medium text-sm">
        ❌ {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 my-6 mx-4 sm:mx-auto">
      <div className="mb-6 pb-5 border-b border-gray-100">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          🔥 Críticos de la Comunidad
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
          Haz clic sobre el recuadro de cualquier crítico para desplegar y leer detalladamente su historial de reseñas.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {users.length === 0 ? (
          <p className="text-gray-400 text-sm italic py-6 text-center">No hay usuarios registrados todavía.</p>
        ) : (
          users.map((user, index) => {
            const isTop3 = index < 3;
            const isExpanded = expandedUserId === user.id;
            
            const bgStyles = index === 0 
              ? "from-amber-50/50 to-transparent border-amber-100/80 shadow-amber-50/30" 
              : index === 1 
              ? "from-slate-50/70 to-transparent border-slate-200/70" 
              : index === 2 
              ? "from-orange-50/40 to-transparent border-orange-100/60" 
              : "bg-white border-gray-100";

            return (
              <div 
                key={user.id} 
                className={`flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isExpanded ? 'border-blue-200 ring-4 ring-blue-50/40' : 'hover:border-gray-300'
                }`}
              >
                {/* Fila del Crítico */}
                <div 
                  onClick={() => handleUserClick(user.id)}
                  className={`flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r ${bgStyles} cursor-pointer transition-colors hover:bg-gray-50/60`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 flex justify-center items-center shrink-0">
                      {renderRankBadge(index)}
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-sm sm:text-base tracking-tight truncate ${
                        isTop3 ? 'font-black text-gray-900' : 'font-bold text-gray-800'
                      }`}>
                        {user.name}
                      </span>
                      <span className={`text-xs transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-blue-500 font-bold' : 'text-gray-400'
                      }`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <span className={`text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm ${
                      index === 0 
                        ? 'bg-amber-100 text-amber-900' 
                        : isTop3 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-gray-50 text-gray-500'
                    }`}>
                      {user.reviewsCount} {user.reviewsCount === 1 ? 'reseña' : 'reseñas'}
                    </span>
                  </div>
                </div>

                {/* Sección Desplegable */}
                {isExpanded && (
                  <div className="bg-slate-50/60 border-t border-gray-100 p-4 sm:p-6 transition-all">
                    {loadingReviews && !userReviews[user.id] ? (
                      <p className="text-sm text-gray-400 italic text-center py-4 font-medium">⏳ Recuperando críticas de la base de datos relacional...</p>
                    ) : !userReviews[user.id] || userReviews[user.id].length === 0 ? (
                      <p className="text-sm text-gray-400 italic text-center py-4 font-medium">Este usuario aún no ha guardado ningún comentario.</p>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <table className="w-full text-left border-collapse table-auto text-sm sm:text-base">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                              <th className="p-4 sm:p-5 w-1/4">Título</th>
                              <th className="p-4 sm:p-5 w-2/3">Comentario de la Reseña</th>
                              <th className="p-4 sm:p-5 text-center w-24">Nota</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                            {userReviews[user.id].map((review) => (
                              <tr key={review.id} className="hover:bg-slate-50/40 transition-colors align-top">
                                {/* MODIFICACIÓN: Añadida acción onClick y estilos hover interactivos */}
                                <td 
                                  className="p-4 sm:p-5 font-bold text-gray-900 min-w-[160px] leading-snug cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                                  onClick={() => review.media_items?.id && onViewMovie(review.media_items.id)}
                                  title="Click para ver detalles de este contenido"
                                >
                                  {review.media_items?.title || "Contenido Eliminado"}
                                </td>
                                <td className="p-4 sm:p-5 text-gray-600 font-normal whitespace-pre-line leading-relaxed italic">
                                  "{review.comment || 'Sin comentario escrito.'}"
                                </td>
                                <td className="p-4 sm:p-5 text-center font-black text-gray-900 whitespace-nowrap">
                                  <span className="text-yellow-500 mr-1 text-base">★</span>
                                  {review.rating ? Number(review.rating).toFixed(1) : '0.0'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}