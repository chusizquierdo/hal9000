import { useState } from 'react';
import { supabase } from '../supabaseClient';
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

export default function ReviewForm({ media, onReviewCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("No se pudo obtener la sesión del usuario actual.");

      // 1. Guardar o obtener el media_id
      const { data: mediaItem, error: mediaError } = await supabase
        .from('media_items')
        .upsert({ api_id: media.id.toString(), title: media.title, category: 'pelicula' })
        .select('id')
        .single();

      if (mediaError) throw mediaError;

      // 2. Guardar la reseña
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          media_id: mediaItem.id,
          rating,
          comment
        });

      if (reviewError) throw reviewError;

      alert('¡Reseña publicada!');
      onReviewCreated(); // Refresca el dashboard
      setComment(''); // Limpiamos el campo tras publicar con éxito
    } catch (error) {
      console.error("Error al publicar la reseña:", error);
      Sentry.captureException(error); // Capturamos fallos en cascada de autenticación, upsert o claves foráneas
      alert(error.message || 'Error inesperado al intentar publicar la reseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
      <h3 className="font-bold mb-2">Reseñar: {media.title}</h3>
      <select 
        className="border p-1 mb-2" 
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} estrellas</option>)}
      </select>
      <textarea 
        className="w-full border p-2" 
        placeholder="Tu opinión..." 
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button disabled={loading} className="bg-green-600 text-white p-2 mt-2 w-full">
        {loading ? 'Publicando...' : 'Publicar Reseña'}
      </button>
    </form>
  );
}