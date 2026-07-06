import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

export default function AdminPanel() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      
      if (error) throw error;
      
      setProfiles(data || []);
    } catch (err) {
      console.error("Error al obtener perfiles en el Panel de Administración:", err);
      Sentry.captureException(err); // Capturamos fallos de lectura de perfiles en Supabase
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
      
      if (error) throw error;
      
      await fetchProfiles(); // Recargar lista de forma controlada
    } catch (err) {
      console.error(`Error al alternar el rol del usuario con ID ${id}:`, err);
      Sentry.captureException(err); // Capturamos fallos de escritura de privilegios en Supabase
    }
  };

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-bold text-red-800 mb-4">Panel de Administración</h2>
      <table className="w-full bg-white">
        <thead>
          <tr>
            <th className="p-2 border">Usuario</th>
            <th className="p-2 border">Rol</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.username}</td>
              <td className="p-2 border">{p.role}</td>
              <td className="p-2 border">
                <button 
                  onClick={() => toggleRole(p.id, p.role)}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  Cambiar a {p.role === 'admin' ? 'User' : 'Admin'}
                </button>
              </td>
            </tr> 
          ))}
        </tbody>
      </table>
    </div>
  );
}