import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ContactAdminPage({ session, onBack }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // BLOQUEO DE SEGURIDAD PARA INVITADOS
  if (session?.isGuest) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-amber-50 rounded-3xl border border-amber-100 text-center my-6 mx-4 sm:mx-auto">
        <span className="text-3xl sm:text-4xl">🔒</span>
        <h2 className="text-lg sm:text-xl font-black text-amber-950 mt-3">Función No Disponible</h2>
        <p className="text-amber-700 text-xs sm:text-sm mt-1 font-medium">
          Debes iniciar sesión con una cuenta registrada en el sistema para poder enviar sugerencias o reportes al administrador.
        </p>
        <button 
          onClick={onBack} 
          className="mt-5 px-5 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 transition-colors shadow-sm"
        >
          Volver a la Biblioteca
        </button>
      </div>
    );
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      // 1. BUSQUEDA INTELIGENTE DEL ID REAL EN LA TABLA PROFILES
      // Primero intentamos buscar si existe por el ID de la sesión actual
      let finalUserId = session.user.id;

      const { data: profileById } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      // Si no se encuentra (como le pasa a prueba2 por la desincronización)
      // lo buscamos de forma segura por su nombre de usuario
      if (!profileById) {
        const currentUsername = session.user.user_metadata?.username || session.user.email?.split('@')[0];
        
        const { data: profileByUsername } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', currentUsername)
          .maybeSingle();

        if (profileByUsername) {
          // Si lo encuentra por nombre, usamos el ID que tenga en la tabla (sea el que sea)
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