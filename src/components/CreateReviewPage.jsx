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

  const applyFormat = (format) => {
    const textarea = document.getElementById('review-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = comment.substring(start, end);
    let replacement = format === 'bold' ? `**${selected}**` : format === 'italic' ? `*${selected}*` : `[spoiler]${selected}[/spoiler]`;
    setComment(comment.substring(0, start) + replacement + comment.substring(end));
    setTimeout(() => textarea.focus(), 0);
  };

  useEffect(() => { if (selectedMedia) checkWatchlist(); }, [selectedMedia]);

  const checkWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('watchlist').select('id').eq('user_id', user.id).eq('media_item_id', String(selectedMedia.id)).maybeSingle();
    if (data) { setIsInWatchlist(true); setWatchlistId(data.id); }
  };

  const handleToggleWatchlist = async () => {
    setWatchlistLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (isInWatchlist) {
      await supabase.from('watchlist').delete().eq('id', watchlistId);
      setIsInWatchlist(false);
    } else {
      const { data: m } = await supabase.from('media_items').upsert({ api_id: String(selectedMedia.id), title: selectedMedia.title || selectedMedia.name, media_type: selectedMedia.media_type || 'movie' }, { onConflict: 'api_id' }).select('id').single();
      const { data } = await supabase.from('watchlist').insert({ user_id: user.id, media_item_id: m.id }).select('id').single();
      setIsInWatchlist(true); setWatchlistId(data.id);
    }
    setWatchlistLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedia || rating === 0) return alert("Selecciona contenido y puntuación.");
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: media } = await supabase.from('media_items').select('id').eq('api_id', String(selectedMedia.id)).single();
    
    const { data: existing } = await supabase.from('reviews').select('id').eq('user_id', user.id).eq('media_id', media.id).maybeSingle();
    
    if (existing) {
        if (window.confirm("¿Sustituir reseña anterior?")) await supabase.from('reviews').update({ comment, rating }).eq('id', existing.id);
        else { setLoading(false); return; }
    } else {
        await supabase.from('reviews').insert({ user_id: user.id, media_id: media.id, comment, rating });
    }
    setLoading(false);
    onReviewCreated();
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">Nueva Reseña</h2>
        {!selectedMedia ? (
          <div className="space-y-4">
            <MediaSearch onSelect={setSelectedMedia} />
            <button onClick={onReviewCreated} className="w-full py-3 text-gray-500 font-bold">Cancelar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                {selectedMedia.poster_path && <img src={`https://image.tmdb.org/t/p/w92${selectedMedia.poster_path}`} className="w-12 h-16 object-cover rounded-lg" />}
                <p className="font-bold text-gray-900 truncate">{selectedMedia.title || selectedMedia.name}</p>
              </div>
              <button type="button" onClick={handleToggleWatchlist} className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold border">
                {isInWatchlist ? '✓ En pendientes' : '⏳ Añadir a pendientes'}
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Comentario</label>
              <div className="grid grid-cols-3 gap-2 w-full">
                <button type="button" onClick={() => applyFormat('bold')} className="p-2 bg-gray-100 rounded text-xs font-bold">Negrita</button>
                <button type="button" onClick={() => applyFormat('italic')} className="p-2 bg-gray-100 rounded text-xs italic">Cursiva</button>
                <button type="button" onClick={() => applyFormat('spoiler')} className="p-2 bg-gray-100 rounded text-xs">Spoiler</button>
              </div>
              <textarea id="review-textarea" className="w-full p-4 bg-gray-50 border rounded-2xl" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-700">Puntuación: {rating} / 10</label>
              <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                {[...Array(10)].map((_, i) => (
                    <button key={i} type="button" onClick={() => setRating(i + 1)} className={`text-2xl ${rating >= i + 1 ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
              {loading ? 'Publicando...' : 'Publicar Reseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}