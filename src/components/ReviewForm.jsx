import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ReviewForm({ media, onReviewCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Guardar o obtener el media_id
    const { data: mediaItem } = await supabase
      .from('media_items')
      .upsert({ api_id: media.id.toString(), title: media.title, category: 'pelicula' })
      .select('id')
      .single();

    // 2. Guardar la reseña
    const { error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        media_id: mediaItem.id,
        rating,
        comment
      });

    if (error) alert(error.message);
    else {
      alert('¡Reseña publicada!');
      onReviewCreated(); // Refresca el dashboard
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
      <h3 className="font-bold mb-2">Reseñar: {media.title}</h3>
      <select className="border p-1 mb-2" onChange={(e) => setRating(Number(e.target.value))}>
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