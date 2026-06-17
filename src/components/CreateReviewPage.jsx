import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import MediaSearch from './MediaSearch';

export default function CreateReviewPage({ onReviewCreated }) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0); 
  const [loading, setLoading] = useState(false);
  
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState(null);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    if (selectedMedia) {
      checkWatchlist();
    }
  }, [selectedMedia]);

  const checkWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: watchlistEntry } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_item_id', String(selectedMedia.id))
      .maybeSingle();

    if (watchlistEntry) {
      setIsInWatchlist(true);
      setWatchlistId(watchlistEntry.id);
    } else {
      setIsInWatchlist(false);
      setWatchlistId(null);
    }
  };

  const handleToggleWatchlist = async () => {
    setWatchlistLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setWatchlistLoading(false);
      return;
    }

    const mediaIdStr = String(selectedMedia.id);

    if (isInWatchlist) {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', watchlistId);
      
      if (!error) {
        setIsInWatchlist(false);
        setWatchlistId(null);
      } else {
        alert("Error al quitar de pendientes: " + error.message);
      }
    } else {
      const mediaType = selectedMedia.media_type === 'tv' ? 'tv' : 'movie';
      const mediaTitle = selectedMedia.title || selectedMedia.name;

      const { data: mediaData, error: mediaError } = await supabase
        .from('media_items')
        .upsert([{ 
          api_id: mediaIdStr, 
          title: mediaTitle,
          media_type: mediaType,
          poster_url: selectedMedia.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMedia.poster_path}` : null
        }], { onConflict: 'api_id' })
        .select('id')
        .single();

      if (mediaError) {
        setWatchlistLoading(false);
        return alert("Error al registrar el título: " + mediaError.message);
      }

      const { data, error: watchlistError } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          media_item_id: mediaData.id
        })
        .select('id')
        .single();

      if (!watchlistError && data) {
        setIsInWatchlist(true);
        setWatchlistId(data.id);
      } else if (watchlistError) {
        alert("Error al añadir a pendientes: " + watchlistError.message);
      }
    }
    setWatchlistLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedia) return alert("Selecciona un contenido primero");
    if (rating === 0) return alert("Por favor, selecciona una puntuación antes de publicar.");

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const mediaIdStr = String(selectedMedia.id);
    const mediaType = selectedMedia.media_type === 'tv' ? 'tv' : 'movie';
    const mediaTitle = selectedMedia.title || selectedMedia.name;

    // 1. Obtener o crear la película usando api_id
    let { data: existingMedia, error: searchError } = await supabase
      .from('media_items')
      .select('id')
      .eq('api_id', mediaIdStr)
      .maybeSingle();

    let mediaIdToUse = existingMedia?.id;

    if (!mediaIdToUse) {
      const { data: newMedia, error: insertError } = await supabase
        .from('media_items')
        .insert([{ 
          api_id: mediaIdStr,
          title: mediaTitle,
          media_type: mediaType,
          poster_url: selectedMedia.poster_path ? `https://image.tmdb.org/t/p/w500${selectedMedia.poster_path}` : null
        }])
        .select('id')
        .single();

      if (insertError) {
        setLoading(false);
        return alert("Error al preparar el título: " + insertError.message);
      }
      mediaIdToUse = newMedia.id;
    }

    // 2. Gestionar la reseña con confirmación de actualización
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_id', mediaIdToUse)
      .maybeSingle();

    let reviewError;
    if (existingReview) {
      const confirmUpdate = window.confirm("Ya habías publicado una reseña para esta película. ¿Deseas sustituirla por la actual?");
      
      if (confirmUpdate) {
        const { error } = await supabase
          .from('reviews')
          .update({ comment: comment, rating: parseFloat(rating) })
          .eq('id', existingReview.id);
        reviewError = error;
      } else {
        setLoading(false);
        return; 
      }
    } else {
      const { error } = await supabase
        .from('reviews')
        .insert([{ 
          user_id: user.id, 
          media_id: mediaIdToUse, 
          comment: comment, 
          rating: parseFloat(rating) 
        }]);
      reviewError = error;
    }

    setLoading(false);
    if (reviewError) {
      alert("Error al guardar reseña: " + reviewError.message);
    } else {
      onReviewCreated(); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-8">Nueva Reseña</h2>
        
        {!selectedMedia ? (
          <div className="space-y-4">
            <p className="text-gray-500">Busca la película o serie que quieres valorar:</p>
            <MediaSearch onSelect={setSelectedMedia} />
            <button onClick={onReviewCreated} className="w-full py-3 mt-4 text-gray-500 font-bold hover:text-gray-800 transition-colors">
              Cancelar y volver
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {selectedMedia.poster_path && (
                  <img src={`https://image.tmdb.org/t/p/w92${selectedMedia.poster_path}`} alt="poster" className="w-16 h-24 object-cover rounded-lg shadow-sm" />
                )}
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Estás reseñando</p>
                  <p className="text-xl font-bold text-gray-900">{selectedMedia.title || selectedMedia.name}</p>
                </div>
              </div>
              
              <button 
                type="button"
                disabled={watchlistLoading}
                onClick={handleToggleWatchlist}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                  isInWatchlist 
                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {watchlistLoading ? '...' : isInWatchlist ? '✓ En pendientes' : '⏳ Añadir a pendientes'}
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Comentario</label>
              <textarea 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                placeholder="¿Qué te ha parecido?" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Puntuación: {rating} / 10</label>
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <div key={star} className="relative flex text-2xl">
                    <button type="button" onClick={() => setRating(star - 0.5)} className="absolute left-0 top-0 z-10 h-full w-1/2 cursor-pointer opacity-0" />
                    <button type="button" onClick={() => setRating(star)} className="absolute right-0 top-0 z-10 h-full w-1/2 cursor-pointer opacity-0" />
                    <span className={`${rating >= star ? 'text-yellow-400' : rating === star - 0.5 ? 'text-yellow-400/50' : 'text-gray-200'}`}>
                      ★
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                {loading ? 'Publicando...' : 'Publicar Reseña'}
              </button>
              <button type="button" onClick={() => setSelectedMedia(null)} className="flex-1 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
                Cambiar
              </button>
            </div>
            <button type="button" onClick={onReviewCreated} className="text-gray-400 hover:text-red-500 font-medium text-sm transition-colors">
              Cancelar y salir
            </button>
          </form>
        )}
      </div>
    </div>
  );
}