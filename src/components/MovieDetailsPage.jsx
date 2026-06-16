import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function MovieDetailsPage({ mediaId, onBack }) {
  const [movieData, setMovieData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchData();
  }, [mediaId]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Info de TMDB (Detalles, Director, Actores)
    const res = await fetch(`https://api.themoviedb.org/3/movie/${mediaId}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&append_to_response=credits`);
    const tmdbData = await res.json();
    setMovieData(tmdbData);

    // 2. Reseñas de Supabase
    const { data: allReviews } = await supabase.from('reviews').select('*, profiles(username)').eq('media_id', mediaId);
    setReviews(allReviews || []);

    const myReview = allReviews?.find(r => r.user_id === user?.id);
    if (myReview) {
      setUserReview(myReview);
      setComment(myReview.comment);
      setRating(myReview.rating);
    }
  };

  const handleSaveReview = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (userReview) {
      await supabase.from('reviews').update({ comment, rating }).eq('id', userReview.id);
    } else {
      await supabase.from('reviews').insert({ user_id: user.id, media_id: mediaId, comment, rating });
    }
    setIsEditing(false);
    fetchData();
  };

  if (!movieData) return <div>Cargando información...</div>;

  const director = movieData.credits?.crew.find(c => c.job === 'Director')?.name;
  const actors = movieData.credits?.cast.slice(0, 5).map(a => a.name).join(', ');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <button onClick={onBack} className="text-blue-600 mb-6 font-bold">← Volver al inicio</button>
      
      {/* SECCIÓN INFORMACIÓN DE LA PELÍCULA */}
      <div className="flex gap-8">
        <img src={`https://image.tmdb.org/t/p/w300${movieData.poster_path}`} alt={movieData.title} className="w-64 rounded-lg shadow-lg" />
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{movieData.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{movieData.release_date.slice(0,4)} | {movieData.genres?.map(g => g.name).join(', ')}</p>
          <p className="mt-4 text-gray-700 leading-relaxed">{movieData.overview}</p>
          <p className="mt-4"><strong>Director:</strong> {director}</p>
          <p className="mt-1"><strong>Reparto:</strong> {actors}</p>
          <p className="mt-1"><strong>Año:</strong> {movieData.release_date.slice(0,4)}</p>
        </div>
      </div>

      <hr className="my-8" />

      {/* SECCIÓN RESEÑAS */}
      <h2 className="text-2xl font-bold mb-4">Reseñas de la comunidad</h2>
      
      {/* 1. Formulario de Interacción (Tu reseña) */}
      <div className="p-6 bg-blue-50 rounded-lg mb-8 border border-blue-100">
        <h3 className="font-bold text-lg mb-2">
          {userReview && !isEditing ? 'Tu reseña actual' : (userReview ? 'Editar tu reseña' : 'Escribe tu propia reseña')}
        </h3>
        
        {userReview && !isEditing ? (
          <div>
            <p className="text-yellow-600 font-bold">{userReview.rating} ★</p>
            <p className="italic">"{userReview.comment}"</p>
            <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 mt-3 underline">Editar reseña</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <textarea className="w-full p-3 border rounded" value={comment} onChange={e => setComment(e.target.value)} placeholder="¿Qué te ha parecido?" />
            <input type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} className="w-20 p-2 border rounded" />
            <button onClick={handleSaveReview} className="bg-blue-600 text-white py-2 px-6 rounded font-bold hover:bg-blue-700">Guardar reseña</button>
          </div>
        )}
      </div>

      {/* 2. Listado de otras reseñas */}
      <div className="space-y-6">
        {reviews.filter(r => r.id !== userReview?.id).map(r => (
          <div key={r.id} className="border-b pb-4">
            <p className="font-bold text-gray-800">{r.profiles?.username || 'Usuario'}</p>
            <p className="text-yellow-500">{r.rating} ★</p>
            <p className="text-gray-600 mt-1">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}