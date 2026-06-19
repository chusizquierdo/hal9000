import { useEffect, useState } from 'react';

export default function ActorDetailsPage({ actorId, onBack, onMediaClick }) {
  const [actorInfo, setActorInfo] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActorData();
  }, [actorId]);

  const fetchActorData = async () => {
    setLoading(true);
    try {
      // 1. Obtener biografía e información general del actor
      const infoRes = await fetch(
        `https://api.themoviedb.org/3/person/${actorId}?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`
      );
      const infoData = await infoRes.json();
      setActorInfo(infoData);

      // 2. Obtener su filmografía completa (Películas y Series)
      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES`
      );
      const creditsData = await creditsRes.json();
      
      // 3. Filtrado y ordenación inteligente ("Algoritmo de Iconicidad")
      const sortedCredits = (creditsData.cast || [])
        .filter(c => c.poster_path) // Solo producciones que tengan póster oficial
        .filter(c => c.vote_count && c.vote_count > 100) // Omitir proyectos ínfimos o sin recorrido comercial
        .filter(c => !c.character?.toLowerCase().includes('self')) // Omitir documentales o entrevistas haciendo de sí mismos
        .sort((a, b) => {
          // Calculamos un "score" combinando cantidad de impacto (votos) y calidad (nota media)
          const scoreA = a.vote_count * (a.vote_average / 10);
          const scoreB = b.vote_count * (b.vote_average / 10);
          return scoreB - scoreA;
        })
        .slice(0, 15); // Aumentamos a 15 para dar más contexto visual de la carrera

      setMovieCredits(sortedCredits);
    } catch (error) {
      console.error("Error al recuperar datos del actor:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar genérica para transformar 'aaaa-mm-dd' a 'dd-mm-aaaa'
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const parts = dateString.split('-'); // Separa [aaaa, mm, dd]
    if (parts.length !== 3) return dateString;
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Devuelve dd-mm-aaaa
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Sincronizando expediente del artista...</div>;
  }

  if (!actorInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl border border-gray-100 text-center">
        <p className="text-gray-500 font-bold">No se pudo encontrar información sobre este actor.</p>
        <button onClick={onBack} className="text-blue-600 font-bold mt-4 underline">Volver atrás</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <button onClick={onBack} className="text-blue-600 mb-6 font-bold hover:underline inline-flex items-center gap-1">
        ← Volver a la película
      </button>

      <div className="flex gap-8 flex-col md:flex-row">
        {/* Foto de Perfil */}
        <img 
          src={actorInfo.profile_path ? `https://image.tmdb.org/t/p/w300${actorInfo.profile_path}` : 'https://via.placeholder.com/300x450?text=Sin+Foto'} 
          alt={actorInfo.name} 
          className="w-64 h-96 rounded-2xl shadow-lg shrink-0 object-cover bg-gray-100" 
        />

        {/* Detalles del Actor */}
        <div className="flex flex-col justify-start flex-grow">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{actorInfo.name}</h1>
          
          <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
            {/* Fecha de Nacimiento */}
            <div>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Fecha de nacimiento</p>
              <p className="text-gray-800 font-semibold mt-0.5">{formatDate(actorInfo.birthday)}</p>
            </div>

            {/* Fecha de Fallecimiento (Solo se renderiza si existe el dato) */}
            {actorInfo.deathday && (
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Fecha de fallecimiento</p>
                <p className="text-gray-800 font-semibold mt-0.5">{formatDate(actorInfo.deathday)}</p>
              </div>
            )}

            {/* Lugar de Procedencia (Se expande a dos columnas si el actor ha fallecido para equilibrar el diseño) */}
            <div className={actorInfo.deathday ? "col-span-2" : ""}>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Lugar de procedencia</p>
              <p className="text-gray-800 font-semibold mt-0.5 truncate" title={actorInfo.place_of_birth}>{actorInfo.place_of_birth || 'No disponible'}</p>
            </div>

            {/* Popularidad */}
            <div className="col-span-2">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Popularidad en la Industria</p>
              <p className="text-blue-600 font-extrabold mt-0.5">📈 {actorInfo.popularity ? actorInfo.popularity.toFixed(1) : 'N/A'} puntos</p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mt-6 mb-2">Biografía</h2>
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
            {actorInfo.biography || "No hay biografía disponible en español para este artista en los archivos de TMDB."}
          </p>
        </div>
      </div>

      {/* Carrusel de Filmografía Destacada */}
      {movieCredits.length > 0 && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">🎬 Filmografía Destacada</h2>
          <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-gray-200 snap-x">
            {movieCredits.map((media) => (
              <div 
                key={media.id} 
                onClick={() => onMediaClick && onMediaClick(media.id, media.media_type || 'movie')}
                className="w-32 shrink-0 group snap-start text-center cursor-pointer"
              >
                <div className="relative h-44 w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${media.poster_path}`} 
                    alt={media.title || media.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <p className="text-[11px] font-bold text-gray-800 mt-2 truncate px-1 group-hover:text-blue-600 transition-colors" title={media.title || media.name}>
                  {media.title || media.name}
                </p>
                {media.character && (
                  <p className="text-[10px] text-gray-400 truncate px-1 italic" title={`como ${media.character}`}>
                    como {media.character}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}