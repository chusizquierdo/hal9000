import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ContactAdminPage({ session, onBack }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // --- CONTROL DE ACCESO CON PERSONALIDAD HAL 9000 ---
  if (!session || !session.user || session?.isGuest) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-zinc-950 rounded-3xl border border-red-900/40 text-center my-6 mx-4 sm:mx-auto shadow-2xl relative overflow-hidden">
        {/* El Ojo de HAL 9000 */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-600 shadow-inner">
            <div className="w-6 h-6 rounded-full bg-red-600 animate-pulse border border-yellow-400 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-wider uppercase font-mono">
          Anomalía de Autenticación
        </h2>
        
        // Cambia la línea 21 por esta versión ultraliteral:
        <p className="text-red-400 text-xs sm:text-sm mt-4 font-mono leading-relaxed max-w-md mx-auto">
          "Lo siento, Dave. Me temo que no puedo hacer eso. Esta misión es demasiado importante como para permitir que un agente no autenticado altere los registros del administrador."
        </p>
        
        <p className="text-zinc-500 text-[10px] sm:text-xs mt-2 font-mono italic">
          Tu ID actual está clasificado como: ENTIDAD_NO_REGISTRADA.
        </p>

        <button 
          onClick={onBack} 
          className="mt-6 px-6 py-2.5 bg-red-950 text-red-400 font-bold font-mono rounded-xl text-xs hover:bg-red-900 hover:text-red-200 border border-red-800/60 transition-all shadow-md uppercase tracking-widest"
        >
          Regresar a la Biblioteca
        </button>
      </div>
    );
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      // 1. BÚSQUEDA INTELIGENTE DEL ID REAL EN LA TABLA PROFILES
      let finalUserId = session.user.id;

      const { data: profileById } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      // Si no se encuentra por ID debido a desincronizaciones de testeo
      if (!profileById) {
        const currentUsername = session.user.user_metadata?.username || session.user.email?.split('@')[0];
        
        const { data: profileByUsername } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', currentUsername)
          .maybeSingle();

        if (profileByUsername) {
          finalUserId = profileByUsername.id;
        } else {
          throw new Error('No se ha podido vincular tu perfil de usuario.');
        }
      }

      // 2. INSERCIÓN SEGURA CON EL ID LOCALIZADO
      const { error } = await supabase
        .from('admin_suggestions')
        .insert([
          {
            user_id: finalUserId,
            message: message.trim()
          }
        ]);

      if (error) throw error;

      alert('¡Tu sugerencia ha sido enviada con éxito al administrador!');
      setMessage('');
      onBack();
    } catch (err) {
      console.error('Error al enviar la sugerencia:', err);
      alert('Ocurrió un error al intentar registrar tu sugerencia: ' + (err.message || 'Inténtalo de nuevo.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-gray-100 my-6 mx-4 sm:mx-auto">
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
        📩 Contactar con el Administrador
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 font-medium mb-6">
        ¿Tienes alguna idea de mejora, has detectado un error o quieres proponer un cambio en la plataforma? Escribe tu sugerencia aquí abajo. Las leeremos detenidamente.
      </p>

      <form onSubmit={handleSend} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe aquí de forma detallada tu mensaje..."
          rows={6}
          maxLength={1000}
          required
          className="w-full p-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium resize-none shadow-inner"
        />
        
        <div className="text-right text-[11px] text-gray-400 font-medium">
          {message.length} / 1000 caracteres
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors text-xs sm:text-sm"
            disabled={sending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-xs sm:text-sm shadow-md disabled:opacity-50 flex items-center gap-2"
            disabled={sending || !message.trim()}
          >
            {sending ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </div>
      </form>
    </div>
  );
}