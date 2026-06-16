import { useState } from 'react';
import { supabase } from '../supabaseClient';
import MediaSearch from './MediaSearch';

export default function CreateReviewPage({ onReviewCreated }) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedia) return alert("Selecciona un contenido primero");

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Upsert: Aseguramos que el contenido exista en media_items
    // Capturamos el tipo: si viene 'tv' lo guardamos como tal, si no, como 'movie'
    const mediaType = selectedMedia.media_type === 'tv' ? 'tv' : 'movie';
    const mediaTitle = selectedMedia.title || selectedMedia.name;

    const { error: mediaError } = await supabase
      .from('media_items')
      .upsert([
        { 
          id: String(selectedMedia.id), 
          title: mediaTitle,
          api_id: String(selectedMedia.id), 
          media_type: mediaType, // Ahora guardamos si es 'movie' o 'tv'
          poster_url: selectedMedia.poster_path ? `https://image.tmdb.org/t/p/w200${selectedMedia.poster_path}` : null
        }
      ]);

    if (mediaError) {
      console.error("Error al registrar media:", mediaError);
      setLoading(false);
      return alert("Error al registrar en la base de datos: " + mediaError.message);
    }

    // 2. Insert: Guardamos la reseña
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert([
        { 
          user_id: user.id, 
          media_id: String(selectedMedia.id), 
          comment: comment, 
          rating: parseInt(rating) 
        }
      ]);

    setLoading(false);

    if (reviewError) {
      console.error("Error al guardar reseña:", reviewError);
      alert("Error al guardar reseña: " + reviewError.message);
    } else {
      onReviewCreated(); 
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nueva Reseña</h2>
      
      {!selectedMedia ? (
        <MediaSearch onSelect={setSelectedMedia} />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <p className="font-semibold text-blue-900">Estás reseñando:</p>
            {/* Usamos || para mostrar correctamente tanto 'title' como 'name' */}
            <p className="text-lg">{selectedMedia.title || selectedMedia.name}</p>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600">Comentario</label>
            <textarea 
              className="p-3 border rounded-md h-32" 
              placeholder="¿Qué te ha parecido?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-600">Puntuación (1-5)</label>
            <input 
              type="number" 
              min="1" max="5" 
              value={rating} 
              onChange={(e) => setRating(e.target.value)}
              className="p-2 border rounded-md w-20"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 font-bold"
            >
              {loading ? 'Publicando...' : 'Publicar Reseña'}
            </button>
            <button 
              type="button" 
              onClick={() => setSelectedMedia(null)} 
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 font-bold"
            >
              Cambiar selección
            </button>
          </div>
        </form>
      )}
    </div>
  );
}