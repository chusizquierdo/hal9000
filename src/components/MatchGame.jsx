import { useState, useEffect } from 'react';
// IMPORTAMOS EL CLIENTE DE SUPABASE (Ajusta la ruta si tu archivo está en otra carpeta)
import { supabase } from '../supabaseClient';
// Importamos el listado desde la raíz de src
import { HOLLYWOOD_ACTORS } from '../listados';

const TMDB_API_KEY = "8005d659cd2756fbe0a09eaba113b878";

// Modifica este número para cambiar cuántas parejas aparecen por ronda
const ITEMS_PER_ROUND = 8;

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function MatchGame({ onBack }) {
  const [difficulty, setDifficulty] = useState(null); // 'facil', 'medio', 'dificil'
  const [actors, setActors] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estados del juego
  const [selectedActor, setSelectedActor] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [errorPair, setErrorPair] = useState(null);

  // Mecánicas arcade: Puntos y Vidas
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  // Estado para controlar que la puntuación solo se guarde una vez por partida finalizada
  const [scoreSaved, setScoreSaved] = useState(false);

  // Estados para la gestión de seguridad de usuarios
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Comprobamos el estado de autenticación al montar el componente
  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error al verificar la identidad del usuario:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUserAuthentication();
  }, []);

  // Función para iniciar una partida según la dificultad
  const startGame = async (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setLoading(true);
    setMatchedPairs([]);
    setSelectedActor(null);
    setSelectedMovie(null);
    setScore(0);
    setLives(3); // Reiniciamos a 3 vidas por partida
    setScoreSaved(false); // Reseteamos el control de guardado para la nueva partida

    // Encontramos los índices de corte basados en los bloques de tu listados.js
    const idx60s = HOLLYWOOD_ACTORS.indexOf("Robert De Niro");
    const idx90s = HOLLYWOOD_ACTORS.indexOf("Brad Pitt");

    let filteredPool = [];

    if (selectedDifficulty === 'facil') {
      filteredPool = idx90s !== -1 ? HOLLYWOOD_ACTORS.slice(idx90s) : HOLLYWOOD_ACTORS;
    } else if (selectedDifficulty === 'medio') {
      filteredPool = idx60s !== -1 ? HOLLYWOOD_ACTORS.slice(idx60s) : HOLLYWOOD_ACTORS;
    } else {
      filteredPool = HOLLYWOOD_ACTORS;
    }

    // Seleccionamos los actores aleatorios para la ronda
    const randomActors = shuffleArray(filteredPool).slice(0, ITEMS_PER_ROUND);

    try {
      const completedData = await Promise.all(
        randomActors.map(async (actorName, index) => {
          // PASO 1: Buscar los datos del actor para conseguir su ID y su foto de perfil
          const personResponse = await fetch(
            `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(actorName)}&language=es-ES`
          );
          const personData = await personResponse.json();
          const person = personData.results?.[0];

          let movieTitle = "Película Desconocida";
          let fullPosterUrl = 'https://via.placeholder.com/150x225?text=Sin+P&oacute;ster';
          let actorImageUrl = 'https://via.placeholder.com/150x150?text=Sin+Foto';

          if (person) {
            if (person.profile_path) {
              actorImageUrl = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
            }

            // PASO 2: Solicitar todos los créditos de películas de ese actor
            const creditsResponse = await fetch(
              `https://api.themoviedb.org/3/person/${person.id}/movie_credits?api_key=${TMDB_API_KEY}&language=es-ES`
            );
            const creditsData = await creditsResponse.json();
            
            const validMovies = (creditsData.cast || [])
              .filter(m => m.poster_path && m.title)
              .sort((a, b) => b.popularity - a.popularity);

            if (validMovies.length > 0) {
              // Seleccionamos una película al azar de entre las 15 más populares
              const maxRange = Math.min(validMovies.length, 15);
              const chosenMovie = validMovies[Math.floor(Math.random() * maxRange)];
              
              movieTitle = chosenMovie.title;
              fullPosterUrl = `https://image.tmdb.org/t/p/w500${chosenMovie.poster_path}`;
            }
          }

          return {
            id: index + 1,
            actor: actorName,
            actorImage: actorImageUrl,
            title: movieTitle,
            poster: fullPosterUrl
          };
        })
      );

      setActors(shuffleArray(completedData));
      setMovies(shuffleArray(completedData));
    } catch (error) {
      console.error("Error obteniendo datos dinámicos de TMDB:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de comprobación de parejas, puntos y vidas
  useEffect(() => {
    if (selectedActor && selectedMovie) {
      if (selectedActor === selectedMovie) {
        // ¡Acierto!
        setMatchedPairs(prev => [...prev, selectedActor]);
        setScore(prev => prev + 100);
        setSelectedActor(null);
        setSelectedMovie(null);
      } else {
        // ¡Fallo!
        setErrorPair({ actor: selectedActor, movie: selectedMovie });
        setScore(prev => Math.max(0, prev - 25)); // Resta 25 pts (mínimo cero)
        setLives(prev => prev - 1); // Pierde una vida

        setTimeout(() => {
          setErrorPair(null);
          setSelectedActor(null);
          setSelectedMovie(null);
        }, 1000);
      }
    }
  }, [selectedActor, selectedMovie]);

  const isGameFinished = difficulty && matchedPairs.length === ITEMS_PER_ROUND && lives > 0;
  const isGameOver = lives === 0;

  // EFECTO PARA GUARDAR AUTOMÁTICAMENTE EL RÉCORD EN SUPABASE
  useEffect(() => {
    const saveGameScore = async () => {
      // Si el juego ha terminado (ganado o perdido), no se ha guardado aún y hay puntos
      if ((isGameFinished || isGameOver) && !scoreSaved && score > 0 && currentUser) {
        setScoreSaved(true); // Bloqueamos para evitar bucles o múltiples peticiones

        try {
          // Mapeamos la dificultad actual con su respectiva columna en Supabase
          const columnMapping = {
            facil: 'match_easy_score',
            medio: 'match_normal_score',
            dificil: 'match_hard_score'
          };
          const targetColumn = columnMapping[difficulty];

          // 2. Traemos el récord actual de ese usuario en esa dificultad
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select(targetColumn)
            .eq('id', currentUser.id)
            .single();

          if (fetchError) throw fetchError;

          const currentHighScore = profile?.[targetColumn] || 0;

          // 3. Si la puntuación actual supera al récord anterior, actualizamos
          if (score > currentHighScore) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ [targetColumn]: score })
              .eq('id', currentUser.id);

            if (updateError) throw updateError;
            console.log(`¡Nuevo récord guardado en ${targetColumn}! Puntos: ${score}`);
          }
        } catch (err) {
          console.error("Error intentando guardar la puntuación en Supabase:", err);
        }
      }
    };

    saveGameScore();
  }, [isGameFinished, isGameOver, score, difficulty, scoreSaved, currentUser]);

  const handleActorClick = (id) => {
    if (matchedPairs.includes(id) || errorPair || loading || lives === 0) return;
    setSelectedActor(id === selectedActor ? null : id);
  };

  const handleMovieClick = (id) => {
    if (matchedPairs.includes(id) || errorPair || loading || lives === 0) return;
    setSelectedMovie(id === selectedMovie ? null : id);
  };

  if (checkingAuth) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-950 border border-gray-800 p-12 rounded-3xl text-center text-white font-mono shadow-2xl">
        <p className="text-sm text-gray-400 tracking-widest animate-pulse">
          ⏳ VERIFICANDO PERMISO DE ACCESO EN LA BASE DE DATOS...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-3 sm:mx-auto p-6 sm:p-8 mt-6 sm:mt-10 bg-black border border-red-900/50 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-600 rounded-full mb-6 sm:mb-8 shadow-[0_0_50px_rgba(220,38,38,0.8)] border-4 border-red-800 flex items-center justify-center">
            <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-red-500 mb-4 tracking-widest text-center uppercase font-mono">
            ACCESO DENEGADO
          </h2>
          <p className="text-red-400 text-sm sm:text-lg mb-6 font-mono max-w-lg leading-relaxed text-center">
            "Lo siento, Dave. Me temo que no puedo hacer eso. Tus credenciales no se encuentran en la base de datos principal."
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="px-4 py-2.5 bg-red-950/50 border border-red-800 rounded-xl text-red-300 font-mono text-xs sm:text-sm">
              CÓDIGO DE ERROR: 401_UNAUTHORIZED
            </div>
            <button 
              onClick={onBack} 
              className="mt-2 bg-transparent border border-red-900/60 hover:border-red-500 text-red-400 hover:text-red-200 px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest font-mono"
            >
              Volver al Panel Central
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA 1: MENÚ DE SELECCIÓN DE DIFICULTAD
  if (!difficulty) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white border border-gray-100 rounded-3xl shadow-xl text-center space-y-8 my-10 font-sans">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">CineMatch 🎬</h2>
          <p className="text-gray-500 font-medium">Pon a prueba tu cultura cinematográfica emparejando a los actores con sus obras.</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => startGame('facil')}
            className="p-5 rounded-2xl border-2 border-green-200 bg-green-50/50 hover:bg-green-50 text-left transition-all hover:scale-[1.02] group"
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-black text-green-700">🟢 Modo Fácil</span>
              <span className="text-xs font-bold bg-green-200 text-green-800 px-2.5 py-1 rounded-md uppercase">Años 90 - Pres.</span>
            </div>
            <p className="text-sm text-green-600/90 font-medium mt-1">Estrellas contemporáneas y blockbusters modernos con sus mejores películas.</p>
          </button>

          <button 
            onClick={() => startGame('medio')}
            className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-left transition-all hover:scale-[1.02] group"
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-black text-blue-700">🔵 Modo Medio</span>
              <span className="text-xs font-bold bg-blue-200 text-blue-800 px-2.5 py-1 rounded-md uppercase">Años 60 - Pres.</span>
            </div>
            <p className="text-sm text-blue-600/90 font-medium mt-1">Incluye a los grandes referentes del nuevo Hollywood clásico y los 70/80.</p>
          </button>

          <button 
            onClick={() => startGame('dificil')}
            className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-left transition-all hover:scale-[1.02] group"
          >
            <div className="flex justify-between items-center">
              <span className="text-xl font-black text-purple-700">🔮 Modo Cinefilo</span>
              <span className="text-xs font-bold bg-purple-200 text-purple-800 px-2.5 py-1 rounded-md uppercase">Toda la Historia</span>
            </div>
            <p className="text-sm text-purple-600/90 font-medium mt-1">Desbloquea la Era Dorada. Solo para auténticos expertos del séptimo arte.</p>
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA 2: PANTALLA DE CARGA
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">Sincronizando perfiles y carteleras con TMDB...</p>
      </div>
    );
  }

  // PANTALLA 3: ENTORNO DE JUEGO ACTIVO
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 font-sans">
      
      {/* MARCADOR SUPERIOR DE VIDAS Y PUNTOS */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 border border-gray-200 p-4 rounded-2xl shadow-sm">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-black text-gray-900">CineMatch</h2>
          <p className="text-gray-500 text-xs font-medium">Dificultad: <span className="font-bold text-gray-700 uppercase">{difficulty}</span></p>
        </div>

        <div className="flex items-center gap-6">
          {/* Marcador de Vidas */}
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Vidas:</span>
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-xl transition-all duration-300">
                {i < lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>

          {/* Marcador de Puntos */}
          <div className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-black text-sm tracking-wide shadow-sm shadow-blue-500/20">
            ⭐ {score} PTS
          </div>
        </div>

        <button 
          onClick={() => setDifficulty(null)} 
          className="px-3 py-1.5 text-xs font-extrabold text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors uppercase tracking-wider"
        >
          ⚙️ Salir
        </button>
      </div>

      {/* PANTALLA DE VICTORIA */}
      {isGameFinished && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-600 text-white p-6 rounded-2xl text-center shadow-xl shadow-green-500/20 animate-bounce">
          <h3 className="text-2xl font-black">¡Victoria Absoluta! 🎉</h3>
          <p className="mt-1 font-medium text-green-100">Has completado el panel con una puntuación final de <span className="font-black text-white">{score} puntos</span>.</p>
          <div className="flex justify-center gap-4 mt-4">
            <button 
              onClick={() => startGame(difficulty)} 
              className="px-5 py-2 bg-white text-green-700 font-black rounded-xl hover:bg-green-50 transition-colors text-sm shadow"
            >
              Volver a jugar
            </button>
            <button 
              onClick={() => setDifficulty(null)} 
              className="px-5 py-2 bg-green-700 text-white font-black rounded-xl hover:bg-green-800 transition-colors text-sm border border-green-600"
            >
              Menú Principal
            </button>
          </div>
        </div>
      )}

      {/* PANTALLA DE GAME OVER */}
      {isGameOver && (
        <div className="bg-gradient-to-r from-red-500 to-rose-600 border-2 border-red-600 text-white p-6 rounded-2xl text-center shadow-xl shadow-red-500/20">
          <h3 className="text-2xl font-black">GAME OVER 💀</h3>
          <p className="mt-1 font-medium text-red-100">Te has quedado sin vidas. ¡Sigue entrenando esa cultura cinéfila!</p>
          <div className="flex justify-center gap-4 mt-4">
            <button 
              onClick={() => startGame(difficulty)} 
              className="px-5 py-2 bg-white text-red-700 font-black rounded-xl hover:bg-red-50 transition-colors text-sm shadow"
            >
              Intentar de nuevo
            </button>
            <button 
              onClick={() => setDifficulty(null)} 
              className="px-5 py-2 bg-red-700 text-white font-black rounded-xl hover:bg-red-800 transition-colors text-sm border border-red-600"
            >
              Menú Principal
            </button>
          </div>
        </div>
      )}

      {/* TABLERO PRINCIPAL DE JUEGO */}
      <div className={`grid grid-cols-2 gap-4 md:gap-12 relative ${isGameOver ? 'opacity-40 pointer-events-none' : ''}`}>
        {/* COLUMNA ACTORES */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-2">Actores</h3>
          {actors.map((item) => {
            const isMatched = matchedPairs.includes(item.id);
            const isSelected = selectedActor === item.id;
            const isError = errorPair?.actor === item.id;

            return (
              <div 
                key={`actor-${item.id}`}
                onClick={() => handleActorClick(item.id)}
                className={`
                  rounded-2xl cursor-pointer transition-all duration-300 border-2 shadow-sm overflow-hidden flex h-20 select-none
                  ${isMatched ? 'border-green-400 opacity-50 scale-95 bg-green-50/30 cursor-not-allowed' : ''}
                  ${isSelected ? 'bg-blue-600 border-blue-700 text-white shadow-md scale-105' : ''}
                  ${isError ? 'border-red-500 bg-red-100 text-red-700 animate-bounce' : ''}
                  ${!isMatched && !isSelected && !isError ? 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-md' : ''}
                `}
              >
                <img 
                  src={item.actorImage} 
                  alt={item.actor} 
                  className="w-14 sm:w-16 h-full object-cover border-r border-gray-100 shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=Actor'; }}
                />
                <div className="flex-1 flex items-center justify-center p-2 text-center overflow-hidden">
                  <span className={`font-black text-xs sm:text-sm line-clamp-2 ${isSelected ? 'text-white' : isMatched ? 'text-green-700' : isError ? 'text-red-700' : 'text-gray-700'}`}>
                    {item.actor}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* COLUMNA PELÍCULAS */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest text-center mb-2">Películas</h3>
          {movies.map((item) => {
            const isMatched = matchedPairs.includes(item.id);
            const isSelected = selectedMovie === item.id;
            const isError = errorPair?.movie === item.id;

            return (
              <div 
                key={`movie-${item.id}`}
                onClick={() => handleMovieClick(item.id)}
                className={`
                  rounded-2xl cursor-pointer transition-all duration-300 border-2 shadow-sm overflow-hidden flex h-20 select-none
                  ${isMatched ? 'border-green-400 opacity-50 scale-95 bg-green-50/30 cursor-not-allowed' : ''}
                  ${isSelected ? 'border-blue-600 shadow-md ring-4 ring-blue-100 scale-105' : ''}
                  ${isError ? 'border-red-500 bg-red-100 animate-bounce' : ''}
                  ${!isMatched && !isSelected && !isError ? 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md' : ''}
                `}
              >
                <img 
                  src={item.poster} 
                  alt={item.title} 
                  className="w-14 sm:w-16 h-full object-cover border-r border-gray-100 shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150x225?text=Cine'; }}
                />
                <div className="flex-1 flex items-center justify-center p-2 text-center overflow-hidden">
                  <span className={`font-black text-xs sm:text-sm line-clamp-2 ${isMatched ? 'text-green-700' : isSelected ? 'text-blue-700' : isError ? 'text-red-700' : 'text-gray-700'}`}>
                    {item.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}