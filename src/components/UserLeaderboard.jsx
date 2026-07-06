import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

export default function UserLeaderboard({ onViewMovie }) {
  // Pestaña activa: 'critics', 'quiz', 'pixel', 'timeline', 'wordle', 'sopa' o 'match'
  const [activeTab, setActiveTab] = useState('critics');
  
  // Sub-dificultades inicializadas por defecto en modo FÁCIL ('easy')
  const [sopaDifficulty, setSopaDifficulty] = useState('easy');
  const [matchDifficulty, setMatchDifficulty] = useState('easy');
  
  const [usersCritics, setUsersCritics] = useState([]);
  const [usersQuiz, setUsersQuiz] = useState([]);
  const [usersPixel, setUsersPixel] = useState([]); 
  const [usersTimeline, setUsersTimeline] = useState([]); 
  const [usersWordle, setUsersWordle] = useState([]); 
  const [usersSopa, setUsersSopa] = useState([]); 
  const [usersMatch, setUsersMatch] = useState([]); // Almacena los datos crudos para CineMatch
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para controlar el desplegable y las reseñas del usuario seleccionado (Sección Críticos)
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userReviews, setUserReviews] = useState({}); // Guarda { userId: [reseñas] }
  const [loadingReviews, setLoadingReviews] = useState(false);

  // --- ESTADO DEL BUSCADOR ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- ESTADOS DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // Reiniciar la página y búsqueda al cambiar de pestaña activa o dificultades
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
    setExpandedUserId(null); 
  }, [activeTab, sopaDifficulty, matchDifficulty]);

  // Reiniciar a la página 1 cuando el usuario escribe en el buscador
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          quiz_score,
          pixel_score,
          timeline_score,
          wordle_score,
          sopa_easy_time,
          sopa_normal_time,
          sopa_hard_time,
          match_easy_score,
          match_normal_score,
          match_hard_score,
          reviews (count)
        `);

      if (dbError) throw dbError;

      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.username || 'Usuario Anónimo',
        reviewsCount: user.reviews?.[0]?.count || 0,
        quizScore: user.quiz_score || 0, 
        pixelScore: user.pixel_score || 0,
        timelineScore: user.timeline_score || 0,
        wordleScore: user.wordle_score || 0,
        sopaEasy: user.sopa_easy_time,   
        sopaNormal: user.sopa_normal_time,
        sopaHard: user.sopa_hard_time,
        // CORRECCIÓN: Si no han jugado o da null, se asigna 0 por defecto para evitar fallos de ordenamiento
        matchEasy: user.match_easy_score !== null && user.match_easy_score !== undefined ? user.match_easy_score : 0, 
        matchNormal: user.match_normal_score !== null && user.match_normal_score !== undefined ? user.match_normal_score : 0,
        matchHard: user.match_hard_score !== null && user.match_hard_score !== undefined ? user.match_hard_score : 0
      }));

      // 1. Ordenación para el Ranking de Críticos (por número de críticas)
      const sortedCritics = [...formattedUsers].sort((a, b) => b.reviewsCount - a.reviewsCount);
      setUsersCritics(sortedCritics);

      // 2. Ordenación para el Ranking del Quiz (por mayor cantidad de aciertos)
      const sortedQuiz = [...formattedUsers].sort((a, b) => b.quizScore - a.quizScore);
      setUsersQuiz(sortedQuiz);

      // 3. Ordenación para el Ranking de Pixelado (por puntuación)
      const sortedPixel = [...formattedUsers].sort((a, b) => b.pixelScore - a.pixelScore);
      setUsersPixel(sortedPixel);

      // 4. Ordenación para el Ranking de Cronología (por puntuación temporal)
      const sortedTimeline = [...formattedUsers].sort((a, b) => b.timelineScore - a.timelineScore);
      setUsersTimeline(sortedTimeline);

      // 5. Ordenación para el Ranking de Wordle (por puntuación de fotogramas)
      const sortedWordle = [...formattedUsers].sort((a, b) => b.wordleScore - a.wordleScore);
      setUsersWordle(sortedWordle);

      // 6. Guardamos el dataset base para la Sopa de letras
      setUsersSopa(formattedUsers);

      // 7. Guardamos el dataset base para CineMatch
      setUsersMatch(formattedUsers);

    } catch (err) {
      console.error("Error al cargar los leaderboards:", err);
      Sentry.captureException(err); // Capturamos el error global de sincronización de perfiles
      setError("No se pudo sincronizar los rankings de la plataforma.");
    } finally {
      setLoading(false);
    }
  };

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
      Sentry.captureException(err); // Capturamos el fallo específico de lectura de reseñas de este crítico
    } finally {
      setLoadingReviews(false);
    }
  };

  // Formateador auxiliar de segundos a formato legible (MM:SS)
  const formatSopaTime = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds === undefined) return '---';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs} min`;
  };

  const renderRankBadge = (globalIndex) => {
    switch (globalIndex) {
      case 0: return <span className="text-2xl sm:text-3xl drop-shadow-sm" title="Primer Puesto">🥇</span>;
      case 1: return <span className="text-2xl sm:text-3xl drop-shadow-sm" title="Segundo Puesto">🥈</span>;
      case 2: return <span className="text-2xl sm:text-3xl drop-shadow-sm" title="Tercer Puesto">🥉</span>;
      default:
        return (
          <span className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border border-gray-200 shadow-inner">
            {globalIndex + 1}
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

  // --- SELECCIÓN Y ORDENACIÓN DINÁMICA DEL DATASET ACTIVO ---
  let currentDataset = [];
  let propKey = '';

  if (activeTab === 'critics') currentDataset = usersCritics;
  else if (activeTab === 'quiz') currentDataset = usersQuiz;
  else if (activeTab === 'pixel') currentDataset = usersPixel;
  else if (activeTab === 'timeline') currentDataset = usersTimeline;
  else if (activeTab === 'wordle') currentDataset = usersWordle;
  else if (activeTab === 'sopa') {
    propKey = sopaDifficulty === 'easy' ? 'sopaEasy' : sopaDifficulty === 'normal' ? 'sopaNormal' : 'sopaHard';
    const conTiempo = usersSopa.filter(u => u[propKey] !== null && u[propKey] !== undefined);
    const sinTiempo = usersSopa.filter(u => u[propKey] === null || u[propKey] === undefined);
    // Ordenamos de MENOR a MAYOR tiempo
    conTiempo.sort((a, b) => a[propKey] - b[propKey]);
    currentDataset = [...conTiempo, ...sinTiempo];
  }
  else if (activeTab === 'match') {
    propKey = matchDifficulty === 'easy' ? 'matchEasy' : matchDifficulty === 'normal' ? 'matchNormal' : 'matchHard';
    // Consideramos sin récord si los puntos son exactamente 0
    const conPuntos = usersMatch.filter(u => u[propKey] !== 0);
    const sinPuntos = usersMatch.filter(u => u[propKey] === 0);
    // Ordenamos de MAYOR a MENOR puntuación
    conPuntos.sort((a, b) => b[propKey] - a[propKey]);
    currentDataset = [...conPuntos, ...sinPuntos];
  }

  // Aplicamos el filtro del buscador guardando la referencia a su posición original
  const filteredDatasetWithIndex = currentDataset
    .map((user, originalIndex) => ({ ...user, originalIndex }))
    .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Cálculos finales de segmentación/paginación
  const totalPages = Math.ceil(filteredDatasetWithIndex.length / ITEMS_PER_PAGE) || 1;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const displayedUsers = filteredDatasetWithIndex.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 my-6 mx-4 sm:mx-auto">
      
      {/* Cabecera del Componente */}
      <div className="mb-6 pb-2 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            📊 Panel Global de Rankings
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
            {activeTab === 'critics' 
              ? "Haz clic sobre un crítico para desplegar y leer detalladamente su historial de reseñas."
              : activeTab === 'quiz'
              ? "Historial de transmisiones del sistema. Los usuarios con las mentes cinéfilas más eficientes en el Trivial."
              : activeTab === 'pixel'
              ? "Clasificación de agudeza visual. ¿Quién es el mejor reconociendo rostros en Pixelado?"
              : activeTab === 'timeline'
              ? "Líneas de tiempo maestras. Historial de ordenación cronológica perfecta en el cine global."
              : activeTab === 'wordle'
              ? "Detectives del fotograma. Clasificación oficial de los que necesitan menos pistas en el Wordle de Cine."
              : activeTab === 'sopa'
              ? "Récords de velocidad. Clasificación oficial de los usuarios más rápidos resolviendo las matrices de películas."
              : "Estrellas y carteleras. Historial de emparejamientos perfectos vinculando actores con su respectiva filmografía."
            }
          </p>
        </div>

        {/* Selector de Pestañas Estilizado */}
        <div className="flex flex-wrap bg-gray-100 p-1 rounded-2xl self-start lg:self-center border border-gray-200/50 gap-y-1">
          <button
            onClick={() => setActiveTab('critics')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'critics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🔥 Críticos
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'quiz' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🏆 Trivial
          </button>
          <button
            onClick={() => setActiveTab('pixel')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pixel' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🎬 Pixelado
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'timeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            ⏱️ Cronología
          </button>
          <button
            onClick={() => setActiveTab('wordle')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'wordle' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🧩 Wordle
          </button>
          <button
            onClick={() => setActiveTab('sopa')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'sopa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🔤 Sopa Letras
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'match' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🎯 CineMatch
          </button>
        </div>
      </div>

      {/* SUB-MENU DE DIFICULTADES EXCLUSIVO PARA SOPA DE LETRAS */}
      {activeTab === 'sopa' && (
        <div className="mb-5 p-2 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-extrabold text-indigo-950 ml-2 uppercase tracking-wide">⚙️ Dificultad del ranking:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setSopaDifficulty('easy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sopaDifficulty === 'easy' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 hover:bg-indigo-100/50'
              }`}
            >
              🟢 Fácil
            </button>
            <button
              onClick={() => setSopaDifficulty('normal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sopaDifficulty === 'normal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 hover:bg-indigo-100/50'
              }`}
            >
              🔵 Normal
            </button>
            <button
              onClick={() => setSopaDifficulty('hard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                sopaDifficulty === 'hard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 hover:bg-indigo-100/50'
              }`}
            >
              🟣 Difícil
            </button>
          </div>
        </div>
      )}

      {/* SUB-MENU DE DIFICULTADES EXCLUSIVO PARA CINEMATCH */}
      {activeTab === 'match' && (
        <div className="mb-5 p-2 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-extrabold text-blue-950 ml-2 uppercase tracking-wide">⚙️ Dificultad del ranking:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setMatchDifficulty('easy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                matchDifficulty === 'easy' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-100/50'
              }`}
            >
              🟢 Fácil
            </button>
            <button
              onClick={() => setMatchDifficulty('normal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                matchDifficulty === 'normal' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-100/50'
              }`}
            >
              🔵 Normal
            </button>
            <button
              onClick={() => setMatchDifficulty('hard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                matchDifficulty === 'hard' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-100/50'
              }`}
            >
              🟣 Difícil
            </button>
          </div>
        </div>
      )}

      {/* --- INPUT DEL BUSCADOR --- */}
      <div className="mb-6 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar usuario por nombre..."
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Renderizado Dinámico del Listado */}
      <div className="flex flex-col gap-4">
        {displayedUsers.length === 0 ? (
          <p className="text-gray-400 text-sm italic py-6 text-center">No se encontraron usuarios coincidentes.</p>
        ) : (
          displayedUsers.map((user) => {
            const globalIndex = user.originalIndex;
            const isTop3 = globalIndex < 3;
            const isExpanded = activeTab === 'critics' && expandedUserId === user.id;

            // Condición para ocultar/mostrar medallas si no hay récord registrado
            const hasNoRecord = activeTab === 'sopa' 
              ? (user[propKey] === null || user[propKey] === undefined)
              : (activeTab === 'match' && user[propKey] === 0);
            
            const bgStyles = !hasNoRecord && globalIndex === 0 
              ? "from-amber-50/50 to-transparent border-amber-100/80 shadow-amber-50/30" 
              : !hasNoRecord && globalIndex === 1 
              ? "from-slate-50/70 to-transparent border-slate-200/70" 
              : !hasNoRecord && globalIndex === 2 
              ? "from-orange-50/40 to-transparent border-orange-100/60" 
              : "bg-white border-gray-100";

            return (
              <div 
                key={user.id} 
                className={`flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isExpanded ? 'border-blue-200 ring-4 ring-blue-50/40' : 'hover:border-gray-300'
                }`}
              >
                <div 
                  onClick={() => activeTab === 'critics' && handleUserClick(user.id)}
                  className={`flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r ${bgStyles} ${
                    activeTab === 'critics' ? 'cursor-pointer hover:bg-gray-50/60' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 flex justify-center items-center shrink-0">
                      {hasNoRecord ? (
                        <span className="w-7 h-7 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center text-xs font-bold border border-gray-100">-</span>
                      ) : (
                        renderRankBadge(globalIndex)
                      )}
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-sm sm:text-base tracking-tight truncate ${
                        isTop3 && !hasNoRecord ? 'font-black text-gray-900' : 'font-bold text-gray-800'
                      }`}>
                        {user.name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    {activeTab === 'critics' && (
                      <span className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm bg-gray-50 text-gray-500">
                        {user.reviewsCount} {user.reviewsCount === 1 ? 'reseña' : 'reseñas'}
                      </span>
                    )}
                    
                    {activeTab === 'quiz' && (
                      <span className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm bg-red-50 text-red-600 border border-red-100">
                        {user.quizScore} pts
                      </span>
                    )}

                    {activeTab === 'pixel' && (
                      <span className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {user.pixelScore} pts
                      </span>
                    )}

                    {activeTab === 'timeline' && (
                      <span className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {user.timelineScore} pts
                      </span>
                    )}

                    {activeTab === 'wordle' && (
                      <span className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm bg-yellow-50 text-yellow-700 border border-yellow-100">
                        {user.wordleScore} pts
                      </span>
                    )}

                    {activeTab === 'sopa' && (
                      <span className={`text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm border ${
                        hasNoRecord 
                          ? 'bg-gray-50 border-gray-200 text-gray-400 italic' 
                          : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                      }`}>
                        ⏱️ {hasNoRecord ? 'Sin récord' : formatSopaTime(user[propKey])}
                      </span>
                    )}

                    {activeTab === 'match' && (
                      <span className={`text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl inline-block shadow-sm border ${
                        hasNoRecord 
                          ? 'bg-gray-50 border-gray-200 text-gray-400 italic' 
                          : 'bg-blue-50 border-blue-100 text-blue-600'
                      }`}>
                        ⭐ {hasNoRecord ? 'Sin récord' : `${user[propKey]} pts`}
                      </span>
                    )}
                  </div>
                </div>

                {/* DESPLEGABLE DE RESEÑAS (Sección Críticos) */}
                {isExpanded && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-4 sm:p-6 space-y-4">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Historial de críticas de {user.name}</h4>
                    {loadingReviews ? (
                      <p className="text-xs font-medium text-gray-400 animate-pulse">Cargando publicaciones del analista...</p>
                    ) : !userReviews[user.id] || userReviews[user.id].length === 0 ? (
                      <p className="text-xs font-medium text-gray-400 italic">Este usuario no ha guardado comentarios escritos en cartelera.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {userReviews[user.id].map((review) => (
                          <div key={review.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="space-y-1">
                              <button
                                onClick={() => onViewMovie && review.media_items?.id && onViewMovie(review.media_items.id)}
                                className="text-sm font-bold text-gray-900 hover:text-blue-600 text-left transition-colors block"
                              >
                                {review.media_items?.title || 'Contenido Desconocido'}
                              </button>
                              <p className="text-xs text-gray-600 font-medium whitespace-pre-line">{review.comment}</p>
                              <p className="text-[10px] text-gray-400 font-medium">
                                Publicado el {new Date(review.created_at).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            <div className="shrink-0 self-start bg-amber-50 text-amber-600 font-black text-xs px-2 py-1 rounded-lg border border-amber-100">
                              ⭐ {review.rating} / 10
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- BOTONES DE PAGINACIÓN --- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2 bg-gray-100 rounded-xl font-bold text-sm text-gray-700 disabled:opacity-30 transition-all"
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
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-30 transition-all"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}