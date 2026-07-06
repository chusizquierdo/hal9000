import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Verificamos que haya una sesión activa al cargar el componente
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session) {
          setIsReady(true);
        } else {
          setMessage('Enlace no válido o expirado.');
        }
      } catch (err) {
        console.error("Error al comprobar la sesión:", err);
        Sentry.captureException(err); // Capturamos fallos al verificar la sesión de recuperación
        setMessage('Error al validar el acceso de recuperación.');
      }
    };
    checkSession();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      } else {
        setMessage('Contraseña actualizada correctamente. Ya puedes iniciar sesión.');
      }
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      Sentry.captureException(error); // Capturamos fallos en la llamada de actualización a Supabase Auth
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 font-mono text-white">
      <div className="w-full max-w-md p-8 bg-gray-950/80 border border-gray-800 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-black mb-6 text-center text-red-500 uppercase">Nueva Contraseña</h1>
        
        {!isReady && !message ? (
          <p className="text-center text-gray-400">Validando acceso...</p>
        ) : message ? (
          <div className="text-center text-red-300">
            <p>{message}</p>
            <a href="/" className="block mt-4 underline text-white">Volver al inicio</a>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Nueva contraseña" 
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button 
              disabled={loading} 
              className="w-full bg-red-900 text-red-100 p-4 rounded-lg font-bold hover:bg-red-800 transition-all uppercase tracking-widest"
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}