import React, { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import { POPULAR_MOVIES_POOL } from '../listados';

// CONFIGURACIÓN DE LA API DE TMDB
const TMDB_API_KEY = '8005d659cd2756fbe0a09eaba113b878';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'; 


export default function TimelineGame({ onBack }) {
  const [movies, setMovies] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [scoreEarned, setScoreEarned] = useState(100); 
  const [gameState, setGameState] = useState('loading'); 
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [attemptsInRound, setAttemptsInRound] = useState(0);

  // Seguridad y sesión
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const TOTAL_ROUNDS = 10; 

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        if (user) {
          initNewGame();
        }
      } catch (err) {
        console.error("Error al verificar la identidad del usuario:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUserAuthentication();
  }, []);

  const initNewGame = () => {
    setCurrentRound(1);
    setAccumulatedScore(0);
    loadTimelineRound();
  };

  const loadTimelineRound = async () => {
    try {
      setGameState('loading');
      setScoreEarned(100);
      setAttemptsInRound(0);

      const fetchedMovies = [];
      const trackingYears = new Set();
      const usedTitlesPool = [...POPULAR_MOVIES_POOL].sort(() => 0.5 - Math.random());

      // Algoritmo de extracción para evitar colisiones de años en la misma ronda
      for (const title of usedTitlesPool) {
        if (fetchedMovies.length === 5) break;

        const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=es-ES`);
        const data = await res.json();
        const movieData = data.results && data.results[0];

        if (movieData && movieData.release_date) {
          const year = parseInt(movieData.release_date.split('-')[0]);
          
          // CONTROL RIGUROSO: Si el año ya está en juego en esta ronda, saltamos la película
          if (!trackingYears.has(year) && !isNaN(year)) {
            trackingYears.add(year);
            fetchedMovies.push({
              id: movieData.id,
              title: movieData.title || title,
              poster: movieData.poster_path ? `${IMAGE_BASE_URL}${movieData.poster_path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
              releaseDate: movieData.release_date,
              year: year
            });
          }
        }
      }

      // Si por problemas de red o API no se llenan, metemos IDs aleatorios asegurando años diferentes como fallback alternativo
      while (fetchedMovies.length < 5) {
        const randomYear = 1940 + Math.floor(Math.random() * 80);
        if (!trackingYears.has(randomYear)) {
          trackingYears.add(randomYear);
          fetchedMovies.push({
            id: Math.random(),
            title: `Película de Prueba Alternativa (${randomYear})`,
            poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
            releaseDate: `${randomYear}-01-01`,
            year: randomYear
          });
        }
      }

      const scrambledMovies = [...fetchedMovies].sort(() => 0.5 - Math.random());
      setMovies(scrambledMovies);
      setGameState('playing');
    } catch (err) {
      console.error("Error cargando la ronda cronológica:", err);
      setGameState('playing');
    }
  };

  // --- LÓGICA DRAG & DROP RESPONSIVE (HTML5) ---
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedMovies = [...movies];
    const draggedItem = updatedMovies[draggedIndex];
    updatedMovies.splice(draggedIndex, 1);
    updatedMovies.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setMovies(updatedMovies);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // --- ALTERNATIVA ACCESIBLE EN MÓVILES (BOTONES ▲ Y ▼) ---
  const moveCard = (index, direction) => {
    if (gameState !== 'playing') return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= movies.length) return;

    const updatedMovies = [...movies];
    const temp = updatedMovies[index];
    updatedMovies[index] = updatedMovies[targetIndex];
    updatedMovies[targetIndex] = temp;
    setMovies(updatedMovies);
  };

  // --- VERIFICACIÓN DE CRONOLOGÍA ---
  const verifyChronology = () => {
    let isCorrect = true;
    for (let i = 0; i < movies.length - 1; i++) {
      if (movies[i].year > movies[i + 1].year) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      setAccumulatedScore(prev => prev + scoreEarned);
      setGameState('verified_win');
    } else {
      const nextAttempts = attemptsInRound + 1;
      setAttemptsInRound(nextAttempts);
      setScoreEarned(prev => Math.max(20, prev - 40)); // Mayor penalización al fallar el primer intento

      if (nextAttempts >= 2) {
        // Al superar el único reintento permitido (2 fallos en total), se bloquea la ronda
        setScoreEarned(0);
        setGameState('verified_fail_final');
      } else {
        setGameState('verified_fail');
      }
    }
  };

  const handleNextRound = async () => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      loadTimelineRound();
    } else {
      setGameState('summary');
      await saveScoreToSupabase(accumulatedScore);
    }
  };

  const saveScoreToSupabase = async (finalPoints) => {
    try {
      if (!currentUser) return;
      const uid = currentUser.id;

      const { data: prof, error: pErr } = await supabase
        .from('profiles')
        .select('timeline_score')
        .eq('id', uid)
        .single();

      if (pErr) throw pErr;

      const currentHighScore = prof?.timeline_score || 0;

      if (finalPoints > currentHighScore) {
        const { error: uErr } = await supabase
          .from('profiles')
          .update({ timeline_score: finalPoints })
          .eq('id', uid);

        if (uErr) throw uErr;
      }
    } catch (err) {
      console.error("Error al guardar puntuación en el timeline:", err);
    }
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

  // --- REEMPLAZADO: MENSAJE CLONADO EXACTAMENTE DEL ARCHIVO WORDLE ---
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

  if (gameState === 'loading') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-950 border border-gray-800 p-12 rounded-3xl text-center text-white font-mono shadow-2xl">
        <p className="text-sm text-gray-400 tracking-widest animate-pulse">
          🎬 RECOPILANDO ARCHIVOS CRONOLÓGICOS DE HOLLYWOOD...
        </p>
      </div>
    );
  }

  if (gameState === 'summary') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-950 border border-gray-800 p-8 rounded-3xl text-center text-white font-mono shadow-2xl">
        <span className="text-6xl">🏆</span>
        <h2 className="text-3xl font-black text-red-500 mt-5 tracking-widest uppercase">Análisis Temporal Terminado</h2>
        <p className="text-gray-400 mt-3 text-sm">HAL-9000 ha evaluado tu control sobre el espacio-tiempo del cine.</p>
        
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl my-8">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Rendimiento Histórico Total</p>
          <p className="text-5xl font-black text-white mt-2">{accumulatedScore} <span className="text-sm font-bold text-gray-400">pts</span></p>
          <p className="text-sm text-red-400 mt-4 italic font-sans px-4">
            {accumulatedScore >= 700 ? "Secuencia temporal perfecta. Tu mapa cognitivo del cine es impecable." : "Línea temporal ajustada con fluctuaciones. Recomiendo analizar mejor las fichas técnicas."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={initNewGame} className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold transition-all uppercase tracking-wider text-xs shadow-md">
            Nueva Línea Temporal ➔
          </button>
          <button onClick={onBack} className="w-full bg-gray-900 border border-gray-800 hover:bg-gray-800 text-gray-400 p-4 rounded-xl font-bold transition-colors uppercase tracking-wider text-xs">
            Salir al Panel Central
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-950 border border-gray-800 rounded-3xl text-white font-mono shadow-2xl overflow-hidden">
      
      {/* Cabecera / Navbar */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/40 relative">
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800 p-2 rounded-xl transition-all mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse border-2 border-red-900 shadow-[0_0_10px_#dc2626]"></div>
          <span className="text-xs font-black tracking-widest text-gray-300 uppercase hidden sm:inline">HAL-9000 TIMELINE SYSTEM V.1</span>
          <span className="text-xs font-black tracking-widest text-gray-300 uppercase sm:hidden">TIMELINE</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 px-3 py-1 rounded-md border border-gray-800 text-right">
            <span className="text-[9px] text-gray-500 block uppercase font-bold">Acumulado</span>
            <span className="text-xs font-bold text-gray-300">{accumulatedScore} pts</span>
          </div>
          <span className="text-xs font-black px-2.5 py-1.5 rounded-md border bg-gray-900 text-amber-400 border-gray-800">
            ⭐ {scoreEarned} pts
          </span>
          <span className="text-xs bg-gray-800 px-2.5 py-1.5 rounded-md font-bold border border-gray-700">Ronda: {currentRound}/{TOTAL_ROUNDS}</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl text-center mb-8">
          <h3 className="text-xs sm:text-sm font-black tracking-widest text-red-500 uppercase">
            REORDENACIÓN DE VECTORES CRONOLÓGICOS
          </h3>
          <p className="text-xs text-gray-400 font-sans mt-1">
            Ordena las producciones de <span className="text-white font-bold font-mono">MÁS ANTIGUA (arriba/izquierda)</span> a <span className="text-white font-bold font-mono">MÁS RECIENTE (abajo/derecha)</span>.
          </p>
        </div>

        {/* --- CONTENEDOR DE TARJETAS --- */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch justify-center select-none mb-8">
          {movies.map((movie, index) => {
            const isRevealed = gameState === 'verified_win' || gameState === 'verified_fail_final';
            
            return (
              <div
                key={movie.id}
                draggable={gameState === 'playing'}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex-1 bg-gray-900 border rounded-2xl p-3 flex flex-row lg:flex-col gap-4 items-center transition-all duration-300 relative ${
                  draggedIndex === index ? 'opacity-30 scale-95 border-blue-500' : 'border-gray-800 hover:border-gray-700'
                } ${gameState === 'playing' ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                <div className="w-16 sm:w-20 lg:w-full aspect-[2/3] bg-black rounded-xl overflow-hidden shrink-0 shadow-md">
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover pointer-events-none" />
                </div>

                <div className="flex-1 flex flex-col justify-center lg:text-center w-full min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-100 font-sans truncate lg:whitespace-normal lg:line-clamp-2">
                    {movie.title}
                  </h4>
                  
                  {isRevealed ? (
                    <span className={`text-xs font-mono font-black mt-1 bg-gray-950 px-2 py-0.5 rounded border border-gray-800 w-fit lg:mx-auto ${gameState === 'verified_win' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {movie.year}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-600 font-mono mt-1 uppercase tracking-widest">
                      Año: ????
                    </span>
                  )}
                </div>

                {gameState === 'playing' && (
                  <div className="flex flex-col gap-1 shrink-0 lg:absolute lg:top-2 lg:right-2 bg-gray-950/80 p-1 rounded-lg border border-gray-800">
                    <button 
                      onClick={() => moveCard(index, 'up')} 
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-20 text-[11px]"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveCard(index, 'down')} 
                      disabled={index === movies.length - 1}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-20 text-[11px]"
                    >
                      ▼
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {gameState === 'playing' && (
          <button
            onClick={verifyChronology}
            className="w-full bg-white text-gray-950 py-4 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest shadow-md"
          >
            Verificar Secuencia Temporal ⚙️
          </button>
        )}

        {gameState === 'verified_fail' && (
          <div className="p-6 bg-gray-900 border-2 border-amber-600/60 rounded-3xl animate-fade-in text-center">
            <p className="text-xs font-black uppercase tracking-widest text-amber-500">
              ⚡ Desviación Temporal Detectada (¡Último intento!)
            </p>
            <p className="text-xs text-gray-400 font-sans mt-2">
              El orden no es correcto. Tienes una única oportunidad extra para reordenar los vectores. Los años siguen ocultos.
            </p>
            <button
              onClick={() => setGameState('playing')}
              className="mt-5 w-full bg-amber-600 text-gray-950 p-3.5 rounded-xl text-xs font-black hover:bg-amber-700 hover:text-white transition-colors uppercase tracking-wider"
            >
              Reajustar Línea de Tiempo ↩
            </button>
          </div>
        )}

        {gameState === 'verified_fail_final' && (
          <div className="p-6 bg-gray-900 border-2 border-red-900/60 rounded-3xl animate-fade-in text-center">
            <p className="text-xs font-black uppercase tracking-widest text-red-500">
              🔴 Ronda Fallada de Forma Irreversible
            </p>
            <p className="text-xs text-gray-400 font-sans mt-2">
              Has agotado tus intentos en esta ronda. Los años reales se han revelado arriba para que puedas analizarlos.
            </p>
            <button
              onClick={handleNextRound}
              className="mt-5 w-full bg-gray-800 border border-gray-700 text-white p-3.5 rounded-xl text-xs font-bold hover:bg-gray-700 transition-colors uppercase tracking-widest"
            >
              {currentRound === TOTAL_ROUNDS ? "Ver Resultados Finales 🏆" : "Siguiente Línea Temporal ➔"}
            </button>
          </div>
        )}

        {gameState === 'verified_win' && (
          <div className="p-6 bg-gray-900 border-2 border-emerald-900/60 rounded-3xl animate-fade-in text-center">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400">
              🟢 Continuidad Espacio-Temporal Sincronizada (+{scoreEarned} pts)
            </p>
            <p className="text-xs text-gray-400 font-sans mt-2">
              Ficheros alineados a la perfección. Transmisión limpia.
            </p>
            <button
              onClick={handleNextRound}
              className="mt-5 w-full bg-white text-gray-950 p-3.5 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-colors uppercase tracking-widest shadow-md"
            >
              {currentRound === TOTAL_ROUNDS ? "Ver Resultados Finales 🏆" : "Siguiente Línea Temporal ➔"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}