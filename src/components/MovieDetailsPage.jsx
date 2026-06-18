import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ActorDetailsPage from './ActorDetailsPage';

export default function MovieDetailsPage({ mediaId, onBack, isAdmin }) {
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

  useEffect(() => {
    const resolveInitialId = async () => {
      const { data: item } = await supabase
        .from('media_items')
        .select('api_id, media_type')
        .eq('id', String(mediaId))
        .maybeSingle();
      
      if (item) {
        setCurrentTmdbId(item.api_id);
        setCurrentMediaType(item.media_type === 'tv' ? 'tv' : 'movie');
        setSupabaseItemId(mediaId);
      } else {
        setCurrentTmdbId(mediaId);
        setCurrentMediaType('movie');
        setSupabaseItemId(null);
      }
    };
    resolveInitialId();
  }, [mediaId]);

  useEffect(() => {
    if (currentTmdbId) {
      fetchData();
    }
  }, [currentTmdbId, currentMediaType]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const type = currentMediaType;
    const tmdbId = currentTmdbId;

    const { data: existingItem } = await supabase
      .from('media_items')
      .select('id')
      .eq('api_id', String(tmdbId))
      .maybeSingle();

    const dbItemId = existingItem ? existingItem.id : null;
    setSupabaseItemId(dbItemId);

    const res = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
    const tmdbData = await res.json();
    setMovieData(tmdbData);

    try {
      const creditsRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/credits?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
      const creditsData = await creditsRes.json();
      setCast(creditsData.cast?.slice(0, 12) || []);

      if (type === 'movie') {
        const movieDirector = creditsData.crew?.find(member => member.job === 'Director');
        setDirector(movieDirector ? movieDirector.name : 'No disponible');
      } else {
        const tvCreators = tmdbData.created_by?.map(c => c.name).join(', ');
        setDirector(tvCreators || 'No disponible');
      }
    } catch (e) { console.error("Error en créditos", e); }

    try {
      const providersRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/watch/providers?api_key=8005d659cd2756fbe0a09eaba113b878`);
      const providersData = await providersRes.json();
      setWatchProviders(providersData.results?.ES?.flatrate || []);
    } catch (e) { console.error("Error en proveedores", e); }

    try {
      let videoRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
      let videoData = await videoRes.json();
      let trailer = videoData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

      if (!trailer) {
        videoRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=8005d659cd2756fbe0a09eaba113b878`);
        videoData = await videoRes.json();
        trailer = videoData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      }
      setTrailerKey(trailer ? trailer.key : '');
    } catch (e) { setTrailerKey(''); }

    try {
      const recRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/recommendations?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
      const recData = await recRes.json();
      setRecommendations(recData.results?.slice(0, 8) || []);
    } catch (e) { setRecommendations([]); }

    if (dbItemId) {
      const { data: allReviews } = await supabase.from('reviews').select('*, profiles(username)').eq('media_id', dbItemId);
      setReviews(allReviews || []);
      
      const myReview = allReviews?.find(r => r.user_id === user?.id);
      if (myReview) { 
        setUserReview(myReview); 
        setComment(myReview.comment); 
        setRating(myReview.rating); 
      } else {
        setUserReview(null); setComment(''); setRating(5.0);
      }

      if (user) {
        const { data: watchlistEntry } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('media_item_id', dbItemId)
          .maybeSingle();

        if (watchlistEntry) {
          setIsInWatchlist(true); setWatchlistId(watchlistEntry.id);
        } else {
          setIsInWatchlist(false); setWatchlistId(null);
        }
      }
    } else {
      setReviews([]);
      setUserReview(null);
      setComment('');
      setRating(5.0);
      setIsInWatchlist(false);
      setWatchlistId(null);
    }
  };

  const handleDeleteUserReview = async (reviewId) => {
    const confirmed = window.confirm("⚠️ ACCIÓN DE ADMINISTRADOR:\n\n¿Seguro que quieres eliminar esta reseña de forma permanente?");
    if (!confirmed) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      alert("Error al borrar la reseña");
    } else {
      fetchData(); 
    }
  };

  const ensureMediaItemExistsInDb = async () => {
    if (supabaseItemId) return supabaseItemId;

    const title = movieData.title || movieData.name;
    const poster_url = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;

    const { data, error } = await supabase
      .from('media_items')
      .insert({ title, media_type: currentMediaType, api_id: String(currentTmdbId), poster_url })
      .select('id')
      .single();

    if (!error && data) {
      setSupabaseItemId(data.id);
      return data.id;
    }
    return null;
  };

  const handleToggleWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dbItemId = await ensureMediaItemExistsInDb();
    if (!dbItemId) return;

    if (isInWatchlist) {
      const { error } = await supabase.from('watchlist').delete().eq('id', watchlistId);
      if (!error) { setIsInWatchlist(false); setWatchlistId(null); }
    } else {
      const { data, error } = await supabase.from('watchlist').insert({ user_id: user.id, media_item_id: dbItemId }).select('id').single();
      if (!error && data) { setIsInWatchlist(true); setWatchlistId(data.id); }
    }
  };

  const handleSaveReview = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dbItemId = await ensureMediaItemExistsInDb();
    if (!dbItemId) return;

    if (userReview) {
      await supabase.from('reviews').update({ comment, rating: parseFloat(rating) }).eq('id', userReview.id);
    } else {
      await supabase.from('reviews').insert({ user_id: user.id, media_id: dbItemId, comment, rating: parseFloat(rating) });
    }
    setIsEditing(false); fetchData();
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

  // MODIFICACIÓN: Pasamos la nueva prop 'onMediaClick' para gestionar el salto dinámico de películas
  if (selectedActorId) {
    return (
      <ActorDetailsPage 
        actorId={selectedActorId} 
        onBack={() => setSelectedActorId(null)} 
        onMediaClick={(tmdbId, mediaType) => {
          setCurrentTmdbId(tmdbId);
          setCurrentMediaType(mediaType);
          setSelectedActorId(null); // Oculta la página de actor y carga la película nueva
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll limpio hacia arriba
        }}
      />
    );
  }

  if (!movieData) return <div className="p-8 text-center text-gray-500 font-medium">Sincronizando ficha técnica premium...</div>;

  const releaseYear = movieData.release_date 
    ? movieData.release_date.substring(0, 4) 
    : movieData.first_air_date 
      ? movieData.first_air_date.substring(0, 4) 
      : 'N/A';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <button onClick={onBack} className="text-blue-600 mb-6 font-bold hover:underline inline-flex items-center gap-1">← Volver al listado</button>
      
      <div className="flex gap-8 flex-col md:flex-row">
        <img src={`https://image.tmdb.org/t/p/w300${movieData.poster_path}`} alt={movieData.title || movieData.name} className="w-64 rounded-2xl shadow-lg shrink-0 object-cover bg-gray-100" />
        
        <div className="flex flex-col justify-start flex-grow">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{movieData.title || movieData.name}</h1>
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

          <p className="mt-4 text-gray-700 leading-relaxed">{movieData.overview || "No hay sinopsis disponible en español para este título."}</p>

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
          </div>

          <div className="mt-6">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-2.5">Disponible en (España)</p>
            {watchProviders.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {watchProviders.map((provider) => (
                  <div key={provider.provider_id} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl p-2 shadow-sm" title={provider.provider_name}>
                    <img src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} alt={provider.provider_name} className="w-6 h-6 rounded-md object-cover shadow-inner" />
                    <span className="text-xs font-bold text-gray-700 pr-1">{provider.provider_name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xs italic font-medium bg-gray-50 border border-gray-100 rounded-xl p-3 inline-block">No disponible en suscripciones de streaming en este momento.</p>
            )}
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
      <div className="p-6 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
        <h3 className="font-bold text-lg mb-4">{userReview && !isEditing ? 'Tu reseña' : 'Escribe tu reseña'}</h3>
        {userReview && !isEditing ? (
          <div>
            <p className="text-yellow-500 font-black text-xl">{userReview.rating} ★</p>
            <p className="italic mt-2 text-gray-700">"{userReview.comment}"</p>
            <button onClick={() => setIsEditing(true)} className="text-blue-600 mt-3 font-bold text-sm underline hover:text-blue-700">Editar mi reseña</button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <textarea className="w-full p-4 border border-gray-200 rounded-xl resize-none outline-none focus:border-blue-500 bg-white" placeholder="¿Qué te ha parecido? Cuéntale a la comunidad tus impresiones..." value={comment} onChange={e => setComment(e.target.value)} />
            <div>
              <label className="font-bold text-sm block mb-2 text-gray-600">Tu puntuación: <span className="text-blue-600 font-black">{rating.toFixed(1)} / 10</span></label>
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <div key={star} className="relative flex text-2xl">
                    <button type="button" onClick={() => setRating(star - 0.5)} className="absolute left-0 top-0 z-10 h-full w-1/2 opacity-0"/>
                    <button type="button" onClick={() => setRating(star)} className="absolute right-0 top-0 z-10 h-full w-1/2 opacity-0"/>
                    <span className={rating >= star ? 'text-yellow-400' : rating === star - 0.5 ? 'text-yellow-400/50' : 'text-gray-200'}>★</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleSaveReview} className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm">
              {supabaseItemId ? 'Guardar reseña' : 'Publicar y registrar título'}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {reviews.filter(r => r.id !== userReview?.id).length > 0 ? (
          reviews.filter(r => r.id !== userReview?.id).map(r => (
            <div key={r.id} className="border-b border-gray-100 pb-4 flex justify-between items-start gap-4">
              <div className="flex-grow">
                <p className="font-bold text-gray-900 text-sm">{r.profiles?.username || 'Usuario anónimo'}</p>
                <p className="text-yellow-500 font-bold text-sm mt-0.5">{r.rating} ★</p>
                <p className="text-gray-600 text-sm mt-1">{"comment" in r ? r.comment : ''}</p>
              </div>
              
              {isAdmin && (
                <button 
                  onClick={() => handleDeleteUserReview(r.id)}
                  className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all tracking-tight shrink-0 shadow-sm"
                  title="Borrar comentario inapropiado"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-xs italic font-medium">Aún no hay más reseñas escritas para este título.</p>
        )}
      </div>
    </div>
  );
}