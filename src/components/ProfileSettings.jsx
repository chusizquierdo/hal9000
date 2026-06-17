import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ProfileSettings({ session, onBack, onProfileUpdated }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      alert('Error cargando datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) return alert('El nombre de usuario no puede estar vacío');

    try {
      setLoading(true);
      const { user } = session;

      const updates = {
        id: user.id,
        username: username.trim(),
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      
      alert('¡Perfil actualizado con éxito!');
      onProfileUpdated(); // Avisa a App.jsx para refrescar la barra superior
    } catch (error) {
      alert('Error al actualizar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = async (e) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Creamos un nombre único basado en la ID del usuario para no llenar el almacenamiento de basura
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Subir la imagen al bucket 'avatars' de Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Obtener la URL pública del archivo que acabamos de subir
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (error) {
      alert('Error subiendo la imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <button onClick={onBack} className="group inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-bold text-sm transition-colors">
        <span className="inline-block transform group-hover:-translate-x-1 transition-transform">←</span> Volver al inicio
      </button>

      <h2 className="text-3xl font-black text-gray-900 mb-6">Configurar Perfil</h2>

      {loading ? (
        <p className="text-gray-500 font-medium">Cargando datos...</p>
      ) : (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Zona de la Foto de Perfil */}
          <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center text-gray-400">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold uppercase">{username ? username[0] : '?'}</span>
              )}
            </div>
            
            <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              uploading ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}>
              {uploading ? 'Subiendo...' : '📸 Cambiar foto de perfil'}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleUploadAvatar} 
                disabled={uploading} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Input de Nombre de Usuario */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-800"
              placeholder="Tu apodo en la plataforma"
              required
            />
          </div>

          {/* Botón de Guardar */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      )}
    </div>
  );
}