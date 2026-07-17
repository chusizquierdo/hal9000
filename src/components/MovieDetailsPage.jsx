import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ActorDetailsPage from './ActorDetailsPage';

// ✅ Añadimos los nuevos props newReviews y markReviewAsSeen
export default function MovieDetailsPage({ mediaId, onBack, isAdmin, newReviews = [], markReviewAsSeen = () => {} }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5.0);
  
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState(null);

  const [director, setDirector] = useState('');
  const [cast, setCast] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);

  const [currentTmdbId, setCurrentTmdbId] = useState(null);
  const [currentMediaType, setCurrentMediaType] = useState('movie');
  const [supabaseItemId, setSupabaseItemId] = useState(null);
  const [trailerKey, setTrailerKey] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const [selectedActorId, setSelectedActorId] = useState(null);

  // --- Lógica de Formato Markdown ---
  const applyFormat = (format) => {
    const textarea = document.getElementById('review-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = comment;
    const selected = text.substring(start, end);
    let replacement = '';
    if (format === 'bold') replacement = `**${selected}**`;
    if (format === 'italic') replacement = `*${selected}*`;
    if (format === 'spoiler') replacement = `[spoiler]${selected}[/spoiler]`;
    setComment(text.substring(0, start) + replacement + text.substring(end));
  };

  const renderFormattedComment = (text) => {
    if (!text) return text;
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '<span class="spoiler-blur" onclick="this.classList.add(\'revealed\')">$1</span>');
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  // --- Resolución del ID Inicial ---
  useEffect(() => {
    let active = true;
    const resolveInitialId = async () => {
      try {
        const { data: item } = await supabase
          .from('media_items')
          .select('api_id, media_type')
          .eq('id', String(mediaId))
          .maybeSingle();
        
        if (!active) return;

        if (item) {
          setCurrentTmdbId(item.api_id);
          setCurrentMediaType(item.media_type === 'tv' ? 'tv' : 'movie');
          setSupabaseItemId(mediaId);
        } else {
          setCurrentTmdbId(mediaId);
          setCurrentMediaType('movie');
          setSupabaseItemId(null);
        }
      } catch (err) {
        console.error("Error resolviendo ID inicial", err);
        if (!active) return;
        setCurrentTmdbId(mediaId);
        setCurrentMediaType('movie');
        setSupabaseItemId(null);
      }
    };
    resolveInitialId();
    return () => {
      active = false;
    };
  }, [mediaId]);

  // --- Carga de datos optimizada en paralelo ---
  useEffect(() => {
    const controller = new AbortController();
    if (currentTmdbId) {
      fetchData(controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, [currentTmdbId, currentMediaType]);

  const fetchData = async (signal) => {
    const type = currentMediaType;
    const tmdbId = currentTmdbId;
    const apiKey = '8005d659cd2756fbe0a09eaba113b878';

    // Wrappers asíncronos para evitar usar .catch() directo sobre los Builders de Supabase
    const getAuthUserSafe = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        return data?.user || null;
      } catch {
        return null;
      }
    };

    const getExistingItemSafe = async () => {
      try {
        const { data } = await supabase
          .from('media_items')
          .select('id')
          .eq('api_id', String(tmdbId))
          .maybeSingle();
        return data || null;
      } catch {
        return null;
      }
    };

    // 1. Cargamos el usuario y la comprobación de existencia en Supabase en paralelo
    const [user, existingItem] = await Promise.all([
      getAuthUserSafe(),
      getExistingItemSafe()
    ]);

    if (signal?.aborted) return;

    setCurrentUser(user);
    const dbItemId = existingItem ? existingItem.id : null;
    setSupabaseItemId(dbItemId);

    // 2. Consulta de detalles de Supabase (Reseñas y Watchlist)
    const fetchSupabaseDetails = async () => {
      if (!dbItemId) {
        if (signal?.aborted) return;
        setReviews([]);
        setUserReview(null);
        setComment('');
        setRating(5.0);
        setIsInWatchlist(false);
        setWatchlistId(null);
        return;
      }

      const getReviewsSafe = async () => {
        try {
          const { data } = await supabase
            .from('reviews')
            .select('*, profiles(username), review_likes(user_id)')
            .eq('media_id', dbItemId);
          return data || [];
        } catch {
          return [];
        }
      };

      const getWatchlistSafe = async () => {
        if (!user) return null;
        try {
          const { data } = await supabase
            .from('watchlist')
            .select('id')
            .eq('user_id', user.id)
            .eq('media_item_id', dbItemId)
            .maybeSingle();
          return data || null;
        } catch {
          return null;
        }
      };

      const [reviewsData, watchlistData] = await Promise.all([
        getReviewsSafe(),
        getWatchlistSafe()
      ]);

      if (signal?.aborted) return;

      const sortedReviews = [...reviewsData].sort((a, b) => {
        const likesA = a.review_likes?.length || 0;
        const likesB = b.review_likes?.length || 0;
        return likesB - likesA;
      });
      setReviews(sortedReviews);

      const myReview = sortedReviews.find(r => r.user_id === user?.id);
      if (myReview) {
        setUserReview(myReview);
        setComment(myReview.comment);
        setRating(myReview.rating);
      } else {
        setUserReview(null);
        setComment('');
        setRating(5.0);
      }

      if (watchlistData) {
        setIsInWatchlist(true);
        setWatchlistId(watchlistData.id);
      } else {
        setIsInWatchlist(false);
        setWatchlistId(null);
      }
    };

    // Lanzamos la consulta secundaria de Supabase
    const supabasePromise = fetchSupabaseDetails();

    // 3. Auxiliar para fetch con timeout (Evita colgar la interfaz por TMDB)
    const fetchWithTimeout = async (url, timeout = 3000, parentSignal = null) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      
      if (parentSignal) {
        if (parentSignal.aborted) {
          controller.abort();
        } else {
          parentSignal.addEventListener('abort', () => controller.abort());
        }
      }

      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    };

    // 4. Funciones individuales para TMDB
    const fetchMainData = async () => {
      try {
        const tmdbData = await fetchWithTimeout(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${apiKey}&language=es-ES`, 3500, signal);
        if (signal?.aborted) return null;
        setMovieData(tmdbData);
        return tmdbData;
      } catch (e) {
        if (e.name === 'AbortError') return null;
        console.error("❌ [TMDB] Error o Timeout al cargar info principal", e);
        if (signal?.aborted) return null;
        setMovieData({
          title: "Título no disponible temporalmente",
          overview: "No se pudieron obtener los detalles técnicos de los servidores de TMDB en este momento, pero puedes interactuar con las reseñas.",
          poster_path: null,
          release_date: "",
          first_air_date: ""
        });
        return null;
      }
    };

    const fetchCredits = async (mainTvPromise) => {
      try {
        const creditsData = await fetchWithTimeout(`https://api.themoviedb.org/3/${type}/${tmdbId}/credits?api_key=${apiKey}&language=es-ES`, 3000, signal);
        if (signal?.aborted) return;
        setCast(creditsData.cast?.slice(0, 12) || []);

        if (type === 'movie') {
          const movieDirector = creditsData.crew?.find(member => member.job === 'Director');
          if (signal?.aborted) return;
          setDirector(movieDirector ? movieDirector.name : 'No disponible');
        } else {
          const mainData = await mainTvPromise;
          if (signal?.aborted) return;
          const tvCreators = mainData?.created_by?.map(c => c.name).join(', ');
          setDirector(tvCreators || 'No disponible');
        }
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.error("❌ [TMDB] Error o Timeout en créditos", e);
        if (signal?.aborted) return;
        setCast([]);
        setDirector('No disponible');
      }
    };

    const fetchProviders = async () => {
      try {
        const providersData = await fetchWithTimeout(`https://api.themoviedb.org/3/${type}/${tmdbId}/watch/providers?api_key=${apiKey}`, 3000, signal);
        if (signal?.aborted) return;
        setWatchProviders(providersData.results?.ES?.flatrate || []);
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.error("❌ [TMDB] Error o Timeout en proveedores", e);
        if (signal?.aborted) return;
        setWatchProviders([]);
      }
    };

    const fetchTrailers = async () => {
      try {
        let videoData = await fetchWithTimeout(`https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=${apiKey}&language=es-ES`, 2500, signal);
        if (signal?.aborted) return;
        let trailer = videoData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        if (!trailer) {
          if (signal?.aborted) return;
          videoData = await fetchWithTimeout(`https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=${apiKey}`, 2500, signal);
          if (signal?.aborted) return;
          trailer = videoData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        }
        if (signal?.aborted) return;
        setTrailerKey(trailer ? trailer.key : '');
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.error("❌ [TMDB] Error o Timeout en trailers", e);
        if (signal?.aborted) return;
        setTrailerKey('');
      }
    };

    const fetchRecommendations = async () => {
      try {
        const recData = await fetchWithTimeout(`https://api.themoviedb.org/3/${type}/${tmdbId}/recommendations?api_key=${apiKey}&language=es-ES`, 3000, signal);
        if (signal?.aborted) return;
        setRecommendations(recData.results?.slice(0, 8) || []);
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.error("❌ [TMDB] Error o Timeout en recomendaciones", e);
        if (signal?.aborted) return;
        setRecommendations([]);
      }
    };

    // Ejecutamos absolutamente todo en paralelo
    const mainPromise = fetchMainData();
    await Promise.all([
      supabasePromise,
      mainPromise,
      fetchCredits(mainPromise),
      fetchProviders(),
      fetchTrailers(),
      fetchRecommendations()
    ]);
  };

  // ✅ NUEVO: Lógica para marcar reseñas como vistas al entrar orgánicamente a la película
  useEffect(() => {
    // Si tenemos reseñas mostrándose, y hay reseñas sin leer pendientes en App.jsx
    if (reviews.length > 0 && newReviews?.length > 0) {
      // Cruzamos los IDs de las reseñas cargadas con las notificaciones no leídas
      const unreadInView = reviews.filter(r => newReviews.some(nr => nr.id === r.id));
      
      // Si hay coincidencia, avisamos a App.jsx para que las marque como leídas
      unreadInView.forEach(unread => {
        markReviewAsSeen(unread.id);
      });
    }
  }, [reviews, newReviews, markReviewAsSeen]);

  const handleToggleLike = async (reviewId, reviewAuthorId, currentLikes) => {
    if (!currentUser) return alert("Debes iniciar sesión para dar me gusta");
    if (currentUser.id === reviewAuthorId) return;

    const hasLiked = currentLikes.some(like => like.user_id === currentUser.id);

    setReviews(prevReviews => prevReviews.map(r => {
      if (r.id === reviewId) {
        const updatedLikes = hasLiked
          ? r.review_likes.filter(l => l.user_id !== currentUser.id)
          : [...(r.review_likes || []), { user_id: currentUser.id }];
        return { ...r, review_likes: updatedLikes };
      }
      return r;
    }));

    if (hasLiked) {
      await supabase.from('review_likes').delete().match({ review_id: reviewId, user_id: currentUser.id });
    } else {
      await supabase.from('review_likes').insert({ review_id: reviewId, user_id: currentUser.id });
    }
  };

  const handleDeleteUserReview = async (reviewId, isAdminAction = false) => {
    const message = isAdminAction 
      ? "⚠️ ACCIÓN DE ADMINISTRADOR:\n\n¿Seguro que quieres eliminar esta reseña de forma permanente?"
      : "¿Seguro que quieres eliminar tu reseña de forma permanente?";

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      alert("Error al borrar la reseña: " + error.message);
    } else {
      if (!isAdminAction) {
        setIsEditing(false);
      }
      fetchData(); 
    }
  };

  const ensureMediaItemExistsInDb = async () => {
    if (supabaseItemId) return supabaseItemId;

    const title = movieData.title || movieData.name;
    const poster_url = movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : '';

    const { data, error } = await supabase
      .from('media_items')
      .insert({ title, media_type: currentMediaType, api_id: String(currentTmdbId), poster_url })
      .select('id')
      .single();

    if (error) {
      console.error("❌ Error al registrar película en media_items:", error);
      alert("No se pudo vincular la película en la Base de Datos: " + error.message);
      return null;
    }

    if (data) {
      setSupabaseItemId(data.id);
      return data.id;
    }
    return null;
  };

  const handleToggleWatchlist = async () => {
    if (!currentUser) {
      alert("⚠️ Debes iniciar sesión para añadir títulos a tu lista de pendientes.");
      return;
    }

    const dbItemId = await ensureMediaItemExistsInDb();
    if (!dbItemId) return;

    if (isInWatchlist) {
      const { error } = await supabase.from('watchlist').delete().eq('id', watchlistId);
      if (!error) { setIsInWatchlist(false); setWatchlistId(null); }
    } else {
      const { data, error } = await supabase.from('watchlist').insert({ user_id: currentUser.id, media_item_id: dbItemId }).select('id').single();
      if (!error && data) { setIsInWatchlist(true); setWatchlistId(data.id); }
    }
  };

  const handleSaveReview = async () => {
    if (!currentUser) {
      alert("⚠️ Debes iniciar sesión para poder guardar o publicar una reseña.");
      return;
    }

    const dbItemId = await ensureMediaItemExistsInDb();
    if (!dbItemId) {
      // El error ya lo arroja ensureMediaItemExistsInDb()
      return;
    }

    try {
      if (userReview) {
        const { error } = await supabase
          .from('reviews')
          .update({ 
            comment, 
            rating: parseFloat(rating),
            created_at: new Date().toISOString()
          })
          .eq('id', userReview.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert({ 
            user_id: currentUser.id, 
            media_id: dbItemId, 
            comment, 
            rating: parseFloat(rating),
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      setIsEditing(false); 
      fetchData(); // Recargamos para ver los cambios actualizados
    } catch (err) {
      console.error("❌ Error al procesar tu reseña:", err);
      alert("Hubo un fallo al intentar guardar la reseña en Supabase: " + (err.message || err));
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'No disponible';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'No disponible';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const translateTvStatus = (status) => {
    const statuses = {
      'Returning Series': 'En emisión',
      'Ended': 'Finalizada',
      'In Production': 'En producción',
      'Canceled': 'Cancelada',
      'Planned': 'Planificada'
    };
    return statuses[status] || status || 'Desconocido';
  };

  if (selectedActorId) {
    return (
      <ActorDetailsPage 
        actorId={selectedActorId} 
        onBack={() => setSelectedActorId(null)} 
        onMediaClick={(tmdbId, mediaType) => {
          setCurrentTmdbId(tmdbId);
          setCurrentMediaType(mediaType);
          setSelectedActorId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (!movieData) return <div className="p-8 text-center text-gray-500 font-medium">Cargando ficha técnica premium...</div>;

  const releaseYear = movieData.release_date 
    ? movieData.release_date.substring(0, 4) 
    : movieData.first_air_date 
      ? movieData.first_air_date.substring(0, 4) 
      : 'N/A';

  const rawReleaseDate = movieData.release_date || movieData.first_air_date;
  const isNotReleasedYet = rawReleaseDate ? new Date(rawReleaseDate) > new Date() : false;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <button onClick={onBack} className="text-blue-600 mb-6 font-bold hover:underline inline-flex items-center gap-1">← Volver</button>
      
      <div className="flex gap-6 md:gap-8 flex-col md:flex-row">
        {movieData.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w300${movieData.poster_path}`} 
            alt={movieData.title || movieData.name} 
            className="w-full max-w-[260px] md:w-64 rounded-2xl shadow-lg shrink-0 object-cover bg-gray-100 mx-auto md:mx-0" 
          />
        ) : (
          <div className="w-full max-w-[260px] md:w-64 h-96 rounded-2xl shadow-lg shrink-0 flex items-center justify-center p-4 bg-gray-100 text-center text-xs font-bold text-gray-400 uppercase mx-auto md:mx-0">
            Sin Póster
          </div>
        )}
        
        <div className="flex flex-col justify-start flex-grow">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{movieData.title || movieData.name}</h1>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {currentMediaType === 'tv' ? 'Serie' : 'Película'}
            </span>
          </div>
          
          <div className="mt-3">
            <button 
              onClick={handleToggleWatchlist}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 ${
                isInWatchlist 
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              {isInWatchlist ? '✓ En películas pendientes' : '⏳ Añadir a pendientes'}
            </button>
          </div>

          <p className="mt-4 text-gray-700 leading-relaxed text-sm sm:text-base">{movieData.overview || "No hay sinopsis disponible en español para este título."}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
            <div>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Año de Lanzamiento</p>
              <p className="text-gray-800 font-semibold mt-0.5">{releaseYear}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                {currentMediaType === 'tv' ? 'Creado por' : 'Director'}
              </p>
              <p className="text-gray-800 font-semibold mt-0.5">{director}</p>
            </div>

            {currentMediaType === 'movie' ? (
              <>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Duración</p>
                  <p className="text-gray-800 font-semibold mt-0.5">{formatRuntime(movieData.runtime)}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Presupuesto</p>
                  <p className="text-gray-800 font-semibold mt-0.5">{formatCurrency(movieData.budget)}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Recaudación Global</p>
                  <p className="text-green-600 font-bold mt-0.5">{formatCurrency(movieData.revenue)}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Temporadas</p>
                  <p className="text-gray-800 font-semibold mt-0.5">{movieData.number_of_seasons || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Episodios Totales</p>
                  <p className="text-gray-800 font-semibold mt-0.5">{movieData.number_of_episodes || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Estado de emisión</p>
                  <p className="text-gray-800 font-semibold mt-0.5">{translateTvStatus(movieData.status)}</p>
                </div>
              </>
            )}

            <div className="col-span-2 sm:col-span-3 border-t border-gray-200/60 pt-3 mt-1">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-3">Reparto Principal</p>
              {cast.length > 0 ? (
                <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-200 snap-x">
                  {cast.map(actor => (
                    <div 
                      key={actor.id} 
                      onClick={() => setSelectedActorId(actor.id)} 
                      className="w-24 shrink-0 cursor-pointer group snap-start"
                    >
                      <div className="h-32 w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100">
                        {actor.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                            alt={actor.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-2 text-center text-[10px] text-gray-400 font-bold uppercase">Sin Foto</div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-gray-800 mt-1.5 truncate group-hover:text-blue-600 transition-colors">
                        {actor.name}
                      </p>
                      <p className="text-[9px] text-gray-400 truncate font-medium">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs italic font-medium">Información sobre el elenco no disponible.</p>
              )}
            </div>
            
            <div className="col-span-2 sm:col-span-3 border-t border-gray-200/60 pt-3 mt-1">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-3">Disponible en</p>
              {watchProviders.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {watchProviders.map((provider) => (
                    <div key={provider.provider_id} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} 
                        alt={provider.provider_name} 
                        className="w-6 h-6 rounded-md" 
                      />
                      <span className="text-xs font-bold text-gray-700">{provider.provider_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs italic font-medium">No disponible en plataformas de streaming actualmente.</p>
              )}
            </div>
            
          </div>
        </div>
      </div>

      {trailerKey && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center gap-2">🎬 Tráiler Oficial</h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-black">
            <iframe src={`https://www.youtube.com/embed/${trailerKey}?rel=0`} title="Tráiler del título" className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">✨ Títulos similares recomendados</h2>
          <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-gray-200 snap-x">
            {recommendations.map((rec) => (
              <div key={rec.id} onClick={() => { setCurrentTmdbId(rec.id); setCurrentMediaType(rec.media_type || 'movie'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-32 shrink-0 cursor-pointer group snap-start">
                <div className="relative h-44 w-full rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all border border-gray-100 bg-gray-50">
                  {rec.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`} alt={rec.title || rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 text-center text-[10px] text-gray-400 font-bold uppercase">Sin Póster</div>
                  )}
                </div>
                <p className="text-[11px] font-bold text-gray-800 mt-2 truncate group-hover:text-blue-600 transition-colors">{rec.title || rec.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="my-8" />
      
      <h2 className="text-2xl font-bold mb-4">Reseñas de la comunidad</h2>
      <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
        {isNotReleasedYet ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 mb-3 border border-amber-100 text-xl">
              ⏳
            </div>
            <h3 className="font-bold text-gray-800 text-base">Evaluaciones Bloqueadas</h3>
            <p className="text-gray-500 text-xs mt-1 max-w-md mx-auto leading-relaxed">
              Este título tiene fijada su fecha de lanzamiento para el <strong>{new Date(rawReleaseDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>. El formulario para puntuar y redactar tu reseña se activará automáticamente ese día.
            </p>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg mb-4">{userReview && !isEditing ? 'Tu reseña' : 'Escribe tu reseña'}</h3>
            
            {!currentUser ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm font-semibold">🔑 Debes iniciar sesión para poder puntuar y escribir una reseña.</p>
              </div>
            ) : userReview && !isEditing ? (
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-yellow-500 font-black text-xl">{userReview.rating} ★</p>
                  <span className="text-xs text-gray-400 font-medium">{formatDate(userReview.created_at)}</span>
                </div>
                <div className="italic mt-2 text-gray-700 text-sm sm:text-base">{renderFormattedComment(userReview.comment)}</div>
                <div className="flex items-center gap-4 mt-4">
                  <button onClick={() => setIsEditing(true)} className="text-blue-600 font-bold text-sm underline hover:text-blue-700">Editar mi reseña</button>
                  <button onClick={() => handleDeleteUserReview(userReview.id, false)} className="text-red-600 font-bold text-sm underline hover:text-red-700">Eliminar mi reseña</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 p-2 bg-white border border-gray-200 rounded-lg w-fit flex-wrap">
                    <button type="button" onClick={() => applyFormat('bold')} className="px-3 py-1 bg-gray-100 rounded text-xs font-bold hover:bg-gray-200">Negrita</button>
                    <button type="button" onClick={() => applyFormat('italic')} className="px-3 py-1 bg-gray-100 rounded text-xs italic hover:bg-gray-200">Cursiva</button>
                    <button type="button" onClick={() => applyFormat('spoiler')} className="px-3 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">Spoiler</button>
                </div>
                
                <textarea 
                  id="review-textarea" 
                  className="w-full min-h-[160px] sm:min-h-[180px] p-4 border border-gray-200 rounded-xl resize-none outline-none focus:border-blue-500 bg-white text-base sm:text-sm leading-relaxed" 
                  placeholder="¿Qué te ha parecido? Cuéntale a la comunidad tus impresiones..." 
                  value={comment} 
                  onChange={e => setComment(e.target.value)} 
                  rows={5}
                ></textarea>
                
                <div>
                  <label className="font-bold text-sm block mb-2 text-gray-600">Tu puntuación: <span className="text-blue-600 font-black">{rating.toFixed(1)} / 10</span></label>
                  <div className="flex flex-wrap gap-0.5 sm:gap-1 text-xl sm:text-2xl select-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <div key={star} className="relative flex">
                        <button type="button" onClick={() => setRating(star - 0.5)} className="absolute left-0 top-0 z-10 h-full w-1/2 opacity-0 cursor-pointer"></button>
                        <button type="button" onClick={() => setRating(star)} className="absolute right-0 top-0 z-10 h-full w-1/2 opacity-0 cursor-pointer"></button>
                        <span className={rating >= star ? 'text-yellow-400' : rating === star - 0.5 ? 'text-yellow-400/50' : 'text-gray-200'}>★</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleSaveReview} className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base">
                  {supabaseItemId ? 'Guardar reseña' : 'Publicar y registrar título'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-4">
        {reviews.filter(r => r.id !== userReview?.id).length > 0 ? (
          reviews.filter(r => r.id !== userReview?.id).map(r => {
            const reviewLikes = r.review_likes || [];
            const hasLiked = currentUser && reviewLikes.some(like => like.user_id === currentUser.id);
            const isOwnReview = currentUser && currentUser.id === r.user_id;

            return (
              <div key={r.id} className="border-b border-gray-100 pb-4 flex justify-between items-start gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-sm">{r.profiles?.username || 'Usuario anónimo'}</p>
                    <span className="text-[11px] text-gray-400 font-medium">• {formatDate(r.created_at)}</span>
                  </div>
                  <p className="text-yellow-500 font-bold text-sm mt-0.5">{r.rating} ★</p>
                  <div className="text-gray-600 text-sm mt-1">{renderFormattedComment(r.comment)}</div>
                  
                  <div className="mt-3">
                    <button 
                      onClick={() => handleToggleLike(r.id, r.user_id, reviewLikes)}
                      disabled={isOwnReview || !currentUser}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                        isOwnReview 
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100' 
                          : hasLiked
                            ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                      title={isOwnReview ? "No puedes darle me gusta a tu propia reseña" : !currentUser ? "Inicia sesión para dar me gusta" : ""}
                    >
                      <span>{hasLiked ? '❤️' : '🤍'}</span>
                      <span>{reviewLikes.length}</span>
                    </button>
                  </div>
                </div>
                
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteUserReview(r.id, true)}
                    className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all tracking-tight shrink-0 shadow-sm"
                    title="Borrar comentario inapropiado"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-xs italic font-medium">Aún no hay más reseñas escritas para este título.</p>
        )}
      </div>
    </div>
  );
}