import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as Sentry from "@sentry/react"; // 1. IMPORTAMOS SENTRY
import MediaSearch from './MediaSearch';
import ActorDetailsPage from './ActorDetailsPage';

export default function CreateReviewPage({ onReviewCreated }) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5.0); // Iniciamos en 5.0 para el selector de medias estrellas
  const [loading, setLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState(null);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // --- Estados de información extendida del diseño premium ---
  const [movieData, setMovieData] = useState(null);
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [trailerKey, setTrailerKey] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
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
    setTimeout(() => textarea.focus(), 0);
  };

  // --- Carga de datos al seleccionar un elemento ---
  useEffect(() => { 
    if (selectedMedia) {
      checkWatchlist(); 
      fetchMediaDetails();
    } else {
      setMovieData(null);
      setCast([]);
      setDirector('');
      setWatchProviders([]);
      setTrailerKey('');
      setRecommendations([]);
    }
  }, [selectedMedia]);

  // --- Funciones auxiliares de formato ---
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

  // --- Consulta de datos en TMDb ---
  const fetchMediaDetails = async () => {
    setDetailsLoading(true);
    const type = selectedMedia.media_type || 'movie';
    const tmdbId = selectedMedia.id;
    const apiKey = '8005d659cd2756fbe0a09eaba113b878';

    try {
      const res = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${apiKey}&language=es-ES`);
      const tmdbData = await res.json();
      setMovieData(tmdbData);

      const creditsRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/credits?api_key=${apiKey}&language=es-ES`);
      const creditsData = await creditsRes.json();
      setCast(creditsData.cast?.slice(0, 12) || []);

      if (type === 'movie') {
        const movieDirector = creditsData.crew?.find(member => member.job === 'Director');
        setDirector(movieDirector ? movieDirector.name : 'No disponible');
      } else {
        const tvCreators = tmdbData.created_by?.map(c => c.name).join(', ');
        setDirector(tvCreators || 'No disponible');
      }
    } catch (e) { 
      console.error("❌ Error al obtener créditos o detalles principales:", e); 
      Sentry.captureException(e); // Enviar error de detalles a Sentry
    }

    try {
      const providersRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/watch/providers?api_key=${apiKey}`);
      const providersData = await providersRes.json();
      setWatchProviders(providersData.results?.ES?.flatrate || []);
    } catch (e) { 
      console.error("❌ Error al obtener proveedores de streaming:", e); 
      Sentry.captureException(e); // Enviar error de proveedores a Sentry
    }

    try {
      let videoRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=${apiKey}&language=es-ES`);
      let videoData = await videoRes.json();
      let trailer = videoData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

      if (!trailer) {
        videoRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/videos?api_key=${apiKey}`);
        videoData = await videoRes.json();
        trailer = videoData.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      }
      setTrailerKey(trailer ? trailer.key : '');
    } catch (e) { 
      console.error("❌ Error al obtener el trailer oficial:", e);
      setTrailerKey(''); 
      Sentry.captureException(e); // Enviar error de trailer a Sentry
    }

    try {
      const recRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/recommendations?api_key=${apiKey}&language=es-ES`);
      const recData = await recRes.json();
      setRecommendations(recData.results?.slice(0, 8) || []);
    } catch (e) { 
      console.error("❌ Error al obtener recomendaciones:", e);
      setRecommendations([]); 
      Sentry.captureException(e); // Enviar error de recomendaciones a Sentry
    }

    setDetailsLoading(false);
  };

  const checkWatchlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingItem } = await supabase
        .from('media_items')
        .select('id')
        .eq('api_id', String(selectedMedia.id))
        .maybeSingle();

      if (existingItem) {
        const { data } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('media_item_id', existingItem.id)
          .maybeSingle();
        
        if (data) { 
          setIsInWatchlist(true); 
          setWatchlistId(data.id); 
          return;
        }
      }
      setIsInWatchlist(false);
      setWatchlistId(null);
    } catch (err) {
      console.error("⚠️ Error silencioso al verificar la watchlist:", err);
      Sentry.captureException(err); // Capturar fallo al verificar lista
    }
  };

  const handleToggleWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setWatchlistLoading(false); return; }

      if (isInWatchlist) {
        await supabase.from('watchlist').delete().eq('id', watchlistId);
        setIsInWatchlist(false);
        setWatchlistId(null);
      } else {
        const payloadMedia = { 
          api_id: String(selectedMedia.id), 
          title: selectedMedia.title || selectedMedia.name, 
          media_type: selectedMedia.media_type || 'movie',
          poster_url: selectedMedia.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMedia.poster_path}` : null
        };
        
        const { data: m, error: upsertErr } = await supabase.from('media_items').upsert(payloadMedia, { onConflict: 'api_id' }).select('id').single();
        
        if (upsertErr) throw upsertErr;

        const { data, error: insertErr } = await supabase.from('watchlist').insert({ user_id: user.id, media_item_id: m.id }).select('id').single();
        if (insertErr) throw insertErr;

        setIsInWatchlist(true); 
        setWatchlistId(data.id);
      }
    } catch (error) {
      console.error("❌ Fallo crítico en handleToggleWatchlist:", error);
      Sentry.captureException(error); // Notificar a Sentry el error de pendientes
      alert("Error al actualizar la lista de pendientes. Revisa la consola.");
    } finally {
      setWatchlistLoading(false);
    }
  };

  // --- FLUJO DE ENVÍO CON MÁXIMO DIAGNÓSTICO ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedMedia) return;
    setLoading(true);
    
    try {
      // 1. Verificar sesión del usuario
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("❌ Error de Supabase Auth al obtener el usuario:", userError);
        throw userError;
      }
      if (!user) { 
        setLoading(false); 
        return alert("Debes iniciar sesión."); 
      }

      // 2. Mapear y sanear el objeto de la película
      const apiIdString = selectedMedia.id ? String(selectedMedia.id) : null;
      const finalTitle = selectedMedia.title || selectedMedia.name || movieData?.title || movieData?.name || "Título Desconocido";
      const finalMediaType = selectedMedia.media_type || movieData?.media_type || 'movie';
      const posterPath = selectedMedia.poster_path || movieData?.poster_path;
      const finalPosterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;

      const mediaPayload = { 
          api_id: apiIdString, 
          title: finalTitle, 
          media_type: finalMediaType,
          poster_url: finalPosterUrl
      };
      
      if (!mediaPayload.api_id) {
        const idError = new Error("ERROR CRÍTICO FRONTEND: 'api_id' es null o undefined antes de enviar.");
        console.error("❌", idError.message);
        Sentry.captureException(idError); // Forzar reporte inmediato a Sentry
        alert("El ID de la película no es válido. Comprueba la consola.");
        setLoading(false);
        return;
      }

      // 3. Ejecutar inserción/actualización de la película
      const { data: media, error: mediaError } = await supabase
        .from('media_items')
        .upsert(mediaPayload, { onConflict: 'api_id' })
        .select('id')
        .maybeSingle();

      if (mediaError) {
        console.error("❌ ERROR RETORNADO POR SUPABASE EN 'media_items':");
        console.dir(mediaError);
        console.error(`Detalles: ${mediaError.details} | Pista: ${mediaError.hint} | Mensaje: ${mediaError.message}`);
        throw mediaError;
      }

      if (!media) {
        const noMediaError = new Error("Supabase no devolvió ningún registro de película tras el upsert.");
        console.error("❌", noMediaError.message);
        throw noMediaError;
      }

      // 4. Verificar existencia de reseña previa
      const { data: existing, error: searchError } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('media_id', media.id)
        .maybeSingle();

      if (searchError) {
        console.error("❌ Error al consultar reseñas preexistentes:", searchError);
        throw searchError;
      }

      const parsedRating = parseFloat(rating);

      // 5. Insertar o actualizar reseña final
      if (existing) {
          if (window.confirm("¿Sustituir tu reseña anterior existente para este título?")) {
            const { error: updateError } = await supabase
              .from('reviews')
              .update({ comment, rating: parsedRating })
              .eq('id', existing.id);
            
            if (updateError) {
              console.error("❌ Error al actualizar la reseña existente:", updateError);
              throw updateError;
            }
          } else { 
            setLoading(false); 
            return; 
          }
      } else {
          const { error: insertError } = await supabase
            .from('reviews')
            .insert({ user_id: user.id, media_id: media.id, comment, rating: parsedRating });
          
          if (insertError) {
            console.error("❌ Error al insertar la nueva reseña:", insertError);
            throw insertError;
          }
      }
      
      onReviewCreated();
      
    } catch (catchError) {
      console.error("💥 EXCEPCIÓN DETECTADA EN EL FLUJO:", catchError);
      Sentry.captureException(catchError); // 2. CAPTURAMOS CUALQUIER EXCEPCIÓN DEL FLUJO DE RESEÑAS
      alert(`Error al registrar el contenido en la base de datos.\n\nMensaje técnico: ${catchError.message || catchError}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Vista de Ficha de Actor ---
  if (selectedActorId) {
    return (
      <ActorDetailsPage 
        actorId={selectedActorId} 
        onBack={() => setSelectedActorId(null)} 
        onMediaClick={(tmdbId, mediaType) => {
          setSelectedActorId(null);
          setSelectedMedia({ id: tmdbId, media_type: mediaType });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // --- Estado 1: Buscador inicial si no hay contenido seleccionado ---
  if (!selectedMedia) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Nueva Reseña</h2>
          <div className="space-y-4">
            <MediaSearch onSelect={setSelectedMedia} />
            <button onClick={onReviewCreated} className="w-full py-3 text-gray-500 font-bold hover:underline">Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Estado 2: Cargando detalles técnicos ---
  if (detailsLoading || !movieData) {
    return <div className="p-8 text-center text-gray-500 font-medium">Sincronizando ficha técnica premium...</div>;
  }

  const releaseYear = movieData.release_date 
    ? movieData.release_date.substring(0, 4) 
    : movieData.first_air_date 
      ? movieData.first_air_date.substring(0, 4) 
      : 'N/A';

  const rawReleaseDate = movieData.release_date || movieData.first_air_date;
  const isNotReleasedYet = rawReleaseDate ? new Date(rawReleaseDate) > new Date() : false;

  // --- Estado 3: Renderizado con el diseño premium max-w-4xl ---
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <button onClick={() => setSelectedMedia(null)} className="text-blue-600 mb-6 font-bold hover:underline inline-flex items-center gap-1">← Cambiar título</button>
      
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
              {(selectedMedia.media_type || 'movie') === 'tv' ? 'Serie' : 'Película'}
            </span>
          </div>
          
          <div className="mt-3">
            <button 
              type="button"
              onClick={handleToggleWatchlist}
              disabled={watchlistLoading}
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
                {(selectedMedia.media_type || 'movie') === 'tv' ? 'Creado por' : 'Director'}
              </p>
              <p className="text-gray-800 font-semibold mt-0.5">{director}</p>
            </div>

            {(selectedMedia.media_type || 'movie') === 'movie' ? (
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

            {/* Reparto Principal */}
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

            {/* Dónde ver */}
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

      {/* Tráiler */}
      {trailerKey && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center gap-2">🎬 Tráiler Oficial</h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-black">
            <iframe src={`https://www.youtube.com/embed/${trailerKey}?rel=0`} title="Tráiler del título" className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">✨ Títulos similares recomendados</h2>
          <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-gray-200 snap-x">
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                onClick={() => { 
                  setSelectedMedia({ 
                    id: rec.id, 
                    media_type: rec.media_type || 'movie', 
                    title: rec.title || rec.name, 
                    poster_path: rec.poster_path 
                  }); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }} 
                className="w-32 shrink-0 cursor-pointer group snap-start"
              >
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
      
      {/* Formulario de envío integrado con el diseño premium */}
      <h2 className="text-2xl font-bold mb-4">Tu valoración</h2>
      <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
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
          <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
            <h3 className="font-bold text-lg">Escribe tu reseña</h3>
            
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
              required
            />
            
            <div>
              <label className="font-bold text-sm block mb-2 text-gray-600">Tu puntuación: <span className="text-blue-600 font-black">{rating.toFixed(1)} / 10</span></label>
              <div className="flex flex-wrap gap-0.5 sm:gap-1 text-xl sm:text-2xl select-none">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <div key={star} className="relative flex">
                    <button type="button" onClick={() => setRating(star - 0.5)} className="absolute left-0 top-0 z-10 h-full w-1/2 opacity-0 cursor-pointer"/>
                    <button type="button" onClick={() => setRating(star)} className="absolute right-0 top-0 z-10 h-full w-1/2 opacity-0 cursor-pointer"/>
                    <span className={rating >= star ? 'text-yellow-400' : rating === star - 0.5 ? 'text-yellow-400/50' : 'text-gray-200'}>★</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-300 text-sm sm:text-base"
            >
              {loading ? 'Publicando...' : 'Publicar y registrar título'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}