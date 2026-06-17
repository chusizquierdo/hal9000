import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function MovieDetailsPage({ mediaId, onBack }) {
  const [movieData, setMovieData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5.0);
  
  // Nuevos estados para controlar la lista de pendientes
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState(null);

  useEffect(() => { fetchData(); }, [mediaId]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Obtener datos de la película desde TMDB
    const res = await fetch(`https://api.themoviedb.org/3/movie/${mediaId}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`);
    const tmdbData = await res.json();
    setMovieData(tmdbData);

    // 2. Obtener reseñas del título
    const { data: allReviews } = await supabase.from('reviews').select('*, profiles(username)').eq('media_id', mediaId);
    setReviews(allReviews || []);
    
    const myReview = allReviews?.find(r => r.user_id === user?.id);
    if (myReview) { 
      setUserReview(myReview); 
      setComment(myReview.comment); 
      setRating(myReview.rating); 
    }

    // 3. Comprobar si este título ya está en la lista de películas pendientes del usuario
    if (user) {
      const { data: watchlistEntry } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('media_item_id', mediaId)
        .maybeSingle();

      if (watchlistEntry) {
        setIsInWatchlist(true);
        setWatchlistId(watchlistEntry.id);
      } else {
        setIsInWatchlist(false);
        setWatchlistId(null);
      }
    }
  };

  // Función para añadir o quitar de la lista de pendientes de forma dinámica
  const handleToggleWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isInWatchlist) {
      // Si ya está guardada, la eliminamos de la tabla
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', watchlistId);
      
      if (!error) {
        setIsInWatchlist(false);
        setWatchlistId(null);
      }
    } else {
      // Si no está guardada, creamos el nuevo registro
      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          media_item_id: mediaId
        })
        .select('id')
        .single();

      if (!error && data) {
        setIsInWatchlist(true);
        setWatchlistId(data.id);
      }
    }
  };

  const handleSaveReview = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (userReview) {
      await supabase.from('reviews').update({ comment, rating: parseFloat(rating) }).eq('id', userReview.id);
    } else {
      await supabase.from('reviews').insert({ user_id: user.id, media_id: mediaId, comment, rating: parseFloat(rating) });
    }
    setIsEditing(false); fetchData();
  };

  if (!movieData) return <div className="p-8">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <button onClick={onBack} className="text-blue-600 mb-6 font-bold hover:underline">← Volver</button>
      <div className="flex gap-8 flex-col md:flex-row">
        <img src={`https://image.tmdb.org/t/p/w300${movieData.poster_path}`} alt={movieData.title} className="w-64 rounded-2xl shadow-lg shrink-0 object-cover" />
        <div className="flex flex-col justify-start">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{movieData.title}</h1>
          
          {/* Botón interactivo de añadir/quitar de pendientes */}
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

          <p className="mt-4 text-gray-700 leading-relaxed">{movieData.overview}</p>
        </div>
      </div>
      <hr className="my-8" />
      <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
      <div className="p-6 bg-gray-50 rounded-2xl mb-8">
        <h3 className="font-bold text-lg mb-4">{userReview && !isEditing ? 'Tu reseña' : 'Escribe tu reseña'}</h3>
        {userReview && !isEditing ? (
          <div>
            <p className="text-yellow-500 font-black text-xl">{userReview.rating} ★</p>
            <p className="italic mt-2">"{userReview.comment}"</p>
            <button onClick={() => setIsEditing(true)} className="text-blue-600 mt-3 font-bold text-sm underline">Editar</button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <textarea className="w-full p-4 border rounded-xl" value={comment} onChange={e => setComment(e.target.value)} />
            <div>
              <label className="font-bold text-sm block mb-2">Puntuación: {rating} / 10</label>
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
            <button onClick={handleSaveReview} className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Guardar reseña</button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {reviews.filter(r => r.id !== userReview?.id).map(r => (
          <div key={r.id} className="border-b pb-4">
            <p className="font-bold">{r.profiles?.username || 'Usuario'}</p>
            <p className="text-yellow-500 font-bold">{r.rating} ★</p>
            <p className="text-gray-600">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}