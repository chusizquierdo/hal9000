import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";

export default function UserLeaderboard({ onViewMovie }) {
  // Pestaña activa: 'critics' o 'quiz'
  const [activeTab, setActiveTab] = useState('critics');
  
  const [usersCritics, setUsersCritics] = useState([]);
  const [usersQuiz, setUsersQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para controlar el desplegable y las reseñas del usuario seleccionado (Sección Críticos)
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userReviews, setUserReviews] = useState({}); // Guarda { userId: [reseñas] }
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Consultamos los perfiles incluyendo el conteo de reviews y la nueva columna 'quiz_score'
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          quiz_score,
          reviews (count)
        `);

      if (dbError) throw dbError;

      // Mapeamos los datos base comunes
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.username || 'Usuario Anónimo',
        reviewsCount: user.reviews?.[0]?.count || 0,
        quizScore: user.quiz_score || 0 // Puntuación del quiz (aciertos)
      }));

      // 1. Ordenación para el Ranking de Críticos (por número de críticas)
      const sortedCritics = [...formattedUsers].sort((a, b) => b.reviewsCount - a.reviewsCount);
      setUsersCritics(sortedCritics);

      // 2. Ordenación para el Ranking del Quiz (por mayor cantidad de aciertos)
      const sortedQuiz = [...formattedUsers].sort((a, b) => b.quizScore - a.quizScore);
      setUsersQuiz(sortedQuiz);

    } catch (err) {
      console.error("Error al cargar los leaderboards:", err);
      setError("No se pudo sincronizar los rankings de la plataforma.");
    } finally {
      setLoading(false);
    }
  };

  // Función para expandir/colapsar y cargar las reseñas específicas de un usuario (Solo críticos)
  const handleUserClick = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);

    if (userReviews[userId]) return;

    try {
      setLoadingReviews(true);
      
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
        ⏳ Sincronizando los sistemas de clasificación de HAL9000...
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

  // Selección del set de datos según la pestaña activa
  const currentDataset = activeTab === 'critics' ? usersCritics : usersQuiz;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 my-6 mx-4 sm:mx-auto">
      
      {/* Cabecera del Componente */}
      <div className="mb-6 pb-2 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            📊 Panel Global de Rankings
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
            {activeTab === 'critics' 
              ? "Haz clic sobre un crítico para desplegar y leer detalladamente su historial de reseñas."
              : "Historial de transmisiones del sistema. Los usuarios con las mentes cinéfilas más eficientes."
            }
          </p>
        </div>

        {/* Selector de Pestañas Estilizado */}
        <div className="flex bg-gray-100 p-1 rounded-2xl self-start md:self-center border border-gray-200/50">
          <button
            onClick={() => setActiveTab('critics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'critics' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🔥 Críticos
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'quiz' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🏆 Ranking Quiz
          </button>
        </div>
      </div>

      {/* Renderizado Dinámico del Listado */}
      <div className="flex flex-col gap-4">
        {currentDataset.length === 0 ? (
          <p className="text-gray-400 text-sm italic py-6 text-center">No hay registros cargados todavía.</p>
        ) : (
          currentDataset.map((user, index) => {
            const isTop3 = index < 3;
            const isExpanded = activeTab === 'critics' && expandedUserId === user.id;
            
            // Asignación de color de fondo premium para el podio
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
                {/* Fila Principal de la Tarjeta */}
                <div 
                  onClick={() => activeTab === 'critics' && handleUserClick(user.id)}
                  className={`flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r ${bgStyles} ${
                    activeTab === 'critics' ? 'cursor-pointer hover:bg-gray-50/60' : ''
                  }`}
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
                      {activeTab === 'critics' && (
                        <span className={`text-xs transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-blue-500 font-bold' : 'text-gray-400'
                        }`}>
                          ▼
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bloque Derecho Dinámico según la Pestaña */}
                  <div className="text-right shrink-0 ml-2">
                    {activeTab === 'critics' ? (
                      <span className={`text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm ${
                        index === 0 
                          ? 'bg-amber-100 text-amber-900' 
                          : isTop3 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-gray-50 text-gray-500'
                      }`}>
                        {user.reviewsCount} {user.reviewsCount === 1 ? 'reseña' : 'reseñas'}
                      </span>
                    ) : (
                      <span className={`text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm ${
                        index === 0 
                          ? 'bg-amber-500 text-white' 
                          : index === 1 
                          ? 'bg-slate-400 text-white' 
                          : index === 2 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {user.quizScore} {user.quizScore === 1 ? 'acierto' : 'aciertos'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sección Desplegable Exclusiva para Críticos */}
                {activeTab === 'critics' && isExpanded && (
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