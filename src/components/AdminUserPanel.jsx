import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";

export default function AdminUserPanel({ isAdmin }) {
  const [activeSubTab, setActiveSubTab] = useState('users'); // 'users' o 'suggestions'
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState(null);

  // ESTADOS PARA LA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const USERS_PER_PAGE = 20;

  useEffect(() => {
    if (isAdmin) {
      if (activeSubTab === 'users') {
        fetchUsers();
      } else {
        fetchSuggestions();
      }
    }
  }, [isAdmin, currentPage, activeSubTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const from = (currentPage - 1) * USERS_PER_PAGE;
      const to = from + USERS_PER_PAGE - 1;

      const { data, count, error: dbError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          role,
          created_at,
          reviews (count)
        `, { count: 'exact' })
        .order('username', { ascending: true, nullsFirst: false })
        .range(from, to);

      if (dbError) throw dbError;

      const formatted = data.map(user => ({
        id: user.id,
        name: user.username || 'Sin Nombre de Usuario',
        role: user.role || 'user',
        joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Desconocida',
        reviewsCount: user.reviews?.[0]?.count || 0
      }));

      setUsers(formatted);
      if (count !== null) setTotalUsers(count);
      
    } catch (err) {
      console.error("Error al obtener la lista de usuarios:", err);
      setError("Error crítico al intentar consultar la tabla profiles.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const { data, error: sugError } = await supabase
        .from('admin_suggestions')
        .select(`
          id,
          message,
          created_at,
          profiles ( username )
        `)
        .order('created_at', { ascending: false });

      if (sugError) throw sugError;
      setSuggestions(data || []);
    } catch (err) {
      console.error("Error al leer sugerencias:", err);
      alert("Error al cargar el buzón de sugerencias.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // --- FUNCIÓN ADAPTADA PARA TRABAJAR CON EL TRIGGER SQL ---
  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `⚠️ ¿ESTÁS SEGURO?\n\nVas a eliminar permanentemente al usuario "${userName}".\n\nGracias al Trigger SQL activo, esta acción borrará de golpe:\n1. Todas sus reseñas en la tabla de críticas.\n2. Su perfil público en la tabla profiles.\n3. Su cuenta y correo electrónico en Authentication.`
    );

    if (confirmDelete) {
      try {
        setLoading(true);

        // 1. Primero eliminamos sus reseñas manualmente para limpiar sus dependencias
        const { error: reviewsDeleteError } = await supabase
          .from('reviews')
          .delete()
          .eq('user_id', userId);

        if (reviewsDeleteError) throw reviewsDeleteError;

        // 2. Eliminamos la fila en la tabla 'profiles'
        // EN ESTE MISMO INSTANTE, el trigger de Supabase detectará la baja
        // y destruirá automáticamente el registro en auth.users (Authentication)
        const { data: deletedData, error: profileDeleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)
          .select();

        if (profileDeleteError) throw profileDeleteError;

        if (!deletedData || deletedData.length === 0) {
          alert("⚠️ Las reseñas se borraron, pero el perfil NO se ha podido eliminar.\n\nVerifica que tus políticas de seguridad RLS permitan el borrado a los usuarios administradores.");
          return;
        }

        alert(`Éxito total: El usuario "${userName}", sus reseñas y sus accesos de autenticación han sido desvinculados por completo del sistema.`);
        fetchUsers();
      } catch (err) {
        console.error("Error al procesar la baja del usuario:", err);
        alert("Ocurrió un error en Supabase al intentar borrar los registros.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCompleteSuggestion = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('admin_suggestions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSuggestions(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error al completar la sugerencia:", err);
      alert("No se pudo eliminar el registro de la base de datos.");
    }
  };

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-3xl border border-red-100 text-center my-6 mx-4 sm:mx-auto">
        <span className="text-3xl sm:text-4xl">🚫</span>
        <h2 className="text-lg sm:text-xl font-black text-red-950 mt-3">Acceso Restringido</h2>
        <p className="text-red-700 text-xs sm:text-sm mt-1 font-medium">No cuentas con el rol de administrador asignado en tu perfil.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-red-50 text-red-700 rounded-2xl text-center border border-red-100 my-6 font-medium text-sm">
        ❌ {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-gray-100 my-6 mx-4 sm:mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            ⚙️ Panel de Control Global
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">Gestión avanzada sobre los usuarios y dependencias en Supabase.</p>
        </div>
        <span className="bg-purple-50 text-purple-700 text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-center border border-purple-100">
          Rol Admin Detectado
        </span>
      </div>

      {/* SUB-NAVEGACIÓN INTERNA PARA EL PANEL DEL ADMIN */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-6 max-w-md">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeSubTab === 'users' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          👥 Usuarios Registrados
        </button>
        <button
          onClick={() => setActiveSubTab('suggestions')}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${
            activeSubTab === 'suggestions' 
              ? 'bg-white text-purple-700 shadow-sm' 
              : 'text-gray-500 hover:text-purple-600'
          }`}
        >
          📩 Sugerencias Recibidas
        </button>
      </div>

      {/* CONTENIDO DE LA TAB DE USUARIOS */}
      {activeSubTab === 'users' && (
        <>
          {loading && users.length === 0 ? (
            <div className="p-6 text-center text-gray-500 font-medium">
              ⏳ Leyendo base de datos relacional de usuarios...
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm italic py-8 text-center">La tabla profiles no contains registros activos.</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-inner">
                <table className="w-full text-left border-collapse bg-white table-auto">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      <th className="p-3 sm:p-4">Nombre (username)</th>
                      <th className="p-3 sm:p-4 text-center">Rol</th>
                      <th className="p-3 sm:p-4 text-center">Reseñas creadas</th>
                      <th className="p-3 sm:p-4 hidden md:table-cell">F. Alta</th>
                      <th className="p-3 sm:p-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 sm:p-4 font-bold text-gray-900">
                          <span className="truncate block max-w-[180px] sm:max-w-xs">{user.name}</span>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <span className={`inline-block text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                            user.role === 'admin' 
                              ? 'bg-purple-50 text-purple-700 border-purple-100' 
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 text-center font-bold text-gray-700">{user.reviewsCount}</td>
                        <td className="p-3 sm:p-4 text-gray-400 font-medium text-xs hidden md:table-cell">{user.joinDate}</td>
                        <td className="p-3 sm:p-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all font-bold text-[11px] sm:text-xs px-2.5 py-1.5 rounded-xl border border-red-100 disabled:opacity-50"
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    Mostrando página <strong className="text-gray-900">{currentPage}</strong> de <strong className="text-gray-900">{totalPages}</strong> (Total: {totalUsers})
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1 || loading}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || loading}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* CONTENIDO DE LA TAB DE SUGERENCIAS */}
      {activeSubTab === 'suggestions' && (
        <>
          {loadingSuggestions ? (
            <div className="p-6 text-center text-gray-500 font-medium">
              ⏳ Abriendo el buzón de sugerencias de usuarios...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <span className="text-2xl">🎉</span>
              <p className="text-gray-500 text-sm font-bold mt-2">¡Buzón limpio!</p>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">No hay ninguna sugerencia pendiente por revisar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-inner">
              <table className="w-full text-left border-collapse bg-white table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="p-3 sm:p-4 w-1/4">Usuario</th>
                    <th className="p-3 sm:p-4 w-1/2">Sugerencia / Mensaje</th>
                    <th className="p-3 sm:p-4 text-center w-1/4">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                  {suggestions.map((item) => (
                    <tr key={item.id} className="hover:bg-purple-50/10 transition-colors">
                      <td className="p-3 sm:p-4 font-black text-purple-950 vertical-align-top">
                        {item.profiles?.username || 'Usuario eliminado'}
                        <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-gray-700 font-medium whitespace-pre-wrap break-words leading-relaxed">
                        {item.message}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        <button
                          onClick={() => handleCompleteSuggestion(item.id)}
                          className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all font-bold text-[11px] px-3 py-2 rounded-xl border border-blue-100 shadow-sm flex items-center gap-1 mx-auto"
                        >
                          📥 Marcar como leída
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}