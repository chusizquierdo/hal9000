import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { POPULAR_MOVIES_POOL } from '../listados';
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

const TMDB_API_KEY = '8005d659cd2756fbe0a09eaba113b878'; 
const MAX_ATTEMPTS = 4; 
const TOTAL_MOVIES_PER_ROUND = 10; 
const STARTING_SCORE = 1000;
const PENALTY_PER_ATTEMPT = 400; 

// FUNCIÓN DE NORMALIZACIÓN ULTRA-INTELIGENTE
// Unifica acentos, signos y traduce números romanos a números normales para evitar fallos en el buscador
const normalizeForSearch = (str) => {
  if (!str) return '';
  let clean = str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos (á -> a, ó -> o)
    .replace(/[^a-z0-9 ]/g, "")      // Elimina signos como dos puntos, guiones, etc.
    .replace(/\s+/g, ' ')            // Elimina espacios dobles internos
    .trim();
  
  // Conversión de números romanos comunes a números estándar
  clean = clean.replace(/\bii\b/g, "2");
  clean = clean.replace(/\biii\b/g, "3");
  clean = clean.replace(/\biv\b/g, "4");
  clean = clean.replace(/\bv\b/g, "5");
  
  return clean;
};

export default function Wordle({ user }) {
  const [gameState, setGameState] = useState('loading'); 
  const [currentMovie, setCurrentMovie] = useState(null);
  const [targetPoolTitle, setTargetPoolTitle] = useState(''); 
  const [images, setImages] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill(null));
  
  // Estados del Buscador Predictivo
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [movieRound, setMovieRound] = useState(1);
  const [sessionScore, setSessionScore] = useState(0);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [usedMovies, setUsedMovies] = useState([]);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      resetFullSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-10 bg-black border border-red-900/50 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-red-600 rounded-full mb-8 shadow-[0_0_50px_rgba(220,38,38,0.8)] border-4 border-red-800 flex items-center justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <h2 className="text-3xl font-black text-red-500 mb-4 tracking-widest font-mono">
            ACCESO DENEGADO
          </h2>
          <p className="text-red-400 text-lg mb-6 font-mono max-w-lg leading-relaxed">
            "Lo siento, Dave. Me temo que no puedo hacer eso. Tus credenciales no se encuentran en la base de datos principal."
          </p>
          <div className="px-6 py-3 bg-red-950/50 border border-red-800 rounded-xl text-red-300 font-mono text-sm">
            CÓDIGO DE ERROR: 401_UNAUTHORIZED
          </div>
        </div>
      </div>
    );
  }

  const resetFullSession = () => {
    setMovieRound(1);
    setSessionScore(0);
    loadNextMovie([]);
  };

  const loadNextMovie = async (updatedUsedMovies) => {
    setGameState('loading');
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setScoreEarned(0);

    const availableMovies = POPULAR_MOVIES_POOL.filter(movie => !updatedUsedMovies.includes(movie));
    const poolToUse = availableMovies.length > 0 ? availableMovies : POPULAR_MOVIES_POOL;
    
    let selectedTitle = "";
    let fetchedMovie = null;
    let finalBackdrops = [];
    let searchAttempts = 0;

    while (searchAttempts < 5) {
      selectedTitle = poolToUse[Math.floor(Math.random() * poolToUse.length)];
      try {
        const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(selectedTitle)}&language=es-ES`);
        if (!searchRes.ok) throw new Error(`HTTP error fetching search for movie: ${selectedTitle}`);
        
        const searchData = await searchRes.json();
        
        if (searchData.results && searchData.results.length > 0) {
          fetchedMovie = searchData.results[0];
          
          const imagesRes = await fetch(`https://api.themoviedb.org/3/movie/${fetchedMovie.id}/images?api_key=${TMDB_API_KEY}`);
          if (!imagesRes.ok) throw new Error(`HTTP error fetching images for movie ID: ${fetchedMovie.id}`);
          
          const imagesData = await imagesRes.json();
          
          let backdrops = imagesData.backdrops || [];
          let cleanBackdrops = backdrops.filter(b => b.iso_639_1 === null);
          if (cleanBackdrops.length < MAX_ATTEMPTS) {
            cleanBackdrops = [...cleanBackdrops, ...backdrops.filter(b => b.iso_639_1 !== null)];
          }
          
          if (cleanBackdrops.length > 0) {
            finalBackdrops = cleanBackdrops.sort(() => 0.5 - Math.random()).slice(0, MAX_ATTEMPTS);
            while (finalBackdrops.length < MAX_ATTEMPTS) {
              finalBackdrops.push(finalBackdrops[Math.floor(Math.random() * finalBackdrops.length)]);
            }
            break; 
          }
        }
      } catch (e) {
        console.error("Error en búsqueda intermedia de API:", e);
        Sentry.captureException(e); // Capturamos el error en Sentry para monitorizar problemas con la API de TMDb
      }
      searchAttempts++;
    }

    if (!fetchedMovie || finalBackdrops.length === 0) {
      selectedTitle = "Origen";
      fetchedMovie = { title: "Origen", id: 27205 };
      finalBackdrops = [{ file_path: "/s3TBrRGB19xpSRuRLGPMf0K0I2R.jpg" }, { file_path: "/s3TBrRGB19xpSRuRLGPMf0K0I2R.jpg" }, { file_path: "/s3TBrRGB19xpSRuRLGPMf0K0I2R.jpg" }, { file_path: "/s3TBrRGB19xpSRuRLGPMf0K0I2R.jpg" }];
    }

    setTargetPoolTitle(selectedTitle);
    setUsedMovies([...updatedUsedMovies, selectedTitle]);
    setCurrentMovie(fetchedMovie);
    setImages(finalBackdrops.map(b => `https://image.tmdb.org/t/p/w780${b.file_path}`));
    setCurrentAttempt(0);
    setGuesses(Array(MAX_ATTEMPTS).fill(null));
    setGameState('playing');
  };

  const handleAdvanceRound = async () => {
    if (movieRound < TOTAL_MOVIES_PER_ROUND) {
      setMovieRound(prev => prev + 1);
      loadNextMovie(usedMovies);
    } else {
      setGameState('completed');
      await updateUserScore(sessionScore);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const normalizedInput = normalizeForSearch(value);

    if (value.trim().length > 1) {
      const filtered = POPULAR_MOVIES_POOL.filter(movie =>
        normalizeForSearch(movie).includes(normalizedInput)
      );
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (title) => {
    setInputValue(''); 
    setSuggestions([]);
    setShowSuggestions(false);
    executeGuessSubmission(title); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    if (gameState !== 'playing' || !inputValue.trim()) return;

    const submissionText = inputValue;
    setInputValue(''); 
    setSuggestions([]);
    setShowSuggestions(false);

    executeGuessSubmission(submissionText);
  };

  const executeGuessSubmission = (guessString) => {
    const isCorrect = normalizeForSearch(guessString) === normalizeForSearch(targetPoolTitle);

    if (isCorrect) {
      setGuesses(prev => {
        const updated = [...prev];
        updated[currentAttempt] = { text: guessString, isCorrect: true };
        return updated;
      });
      
      const points = STARTING_SCORE - (currentAttempt * PENALTY_PER_ATTEMPT);
      setScoreEarned(points);
      setSessionScore(prev => prev + points);
      setGameState('won');
      return; 
    }

    setGuesses(prev => {
      const updated = [...prev];
      updated[currentAttempt] = { text: guessString, isCorrect: false };
      return updated;
    });

    if (currentAttempt + 1 >= MAX_ATTEMPTS) {
      setGameState('lost');
    } else {
      setCurrentAttempt(prev => prev + 1);
    }
  };

  const skipAttempt = () => {
    if (gameState !== 'playing') return;
    executeGuessSubmission("— Pista solicitada —");
  };

  const updateUserScore = async (finalSessionScore) => {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('wordle_score')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentHighScore = profile.wordle_score || 0;

      if (finalSessionScore > currentHighScore) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ wordle_score: finalSessionScore })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error("Error gestión puntuación:", error);
      Sentry.captureException(error); // Capturamos fallos en la consulta o guardado de datos en Supabase
    }
  };

  if (gameState === 'loading') {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center text-gray-500 font-medium bg-white rounded-3xl shadow-sm border border-gray-100 my-6">
        <span className="text-4xl animate-spin inline-block mb-4">🎬</span>
        <p>Cargando fotogramas y sincronizando catálogo...</p>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="max-w-3xl mx-auto p-8 sm:p-12 bg-gray-900 text-white rounded-3xl shadow-xl text-center my-6 border border-gray-800">
        <span className="text-6xl block mb-6">🏆🎬</span>
        <h2 className="text-3xl font-black mb-2 tracking-tight">¡Ronda Completada!</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8 text-base">
          Has completado el juego de las <strong>{TOTAL_MOVIES_PER_ROUND} películas</strong>.
        </p>
        
        <div className="inline-block bg-gray-800 border border-gray-700 px-8 py-6 rounded-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">Puntuación Final</span>
          <span className="text-4xl font-black text-amber-400 font-mono">{sessionScore} pts</span>
        </div>

        <div>
          <button 
            onClick={resetFullSession} 
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-gray-950 px-8 py-4 rounded-xl font-extrabold shadow-lg transition-colors text-lg"
          >
            Jugar Otra Vez
          </button>
        </div>
      </div>
    );
  }

  const currentPotentialPoints = STARTING_SCORE - (currentAttempt * PENALTY_PER_ATTEMPT);

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 my-6">
      
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
          🧩 Wordle de Cine
        </h2>
        <div className="flex justify-center flex-wrap gap-3 mt-4">
          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">
            Película {movieRound} de {TOTAL_MOVIES_PER_ROUND}
          </span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
            Intento {currentAttempt + 1} / {MAX_ATTEMPTS}
          </span>
          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
            Puntos: {currentPotentialPoints}
          </span>
          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold border border-gray-800">
            Total: {sessionScore} pts
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-inner mb-6 border border-gray-200">
        {images[currentAttempt] ? (
          <img 
            src={images[gameState === 'playing' ? currentAttempt : MAX_ATTEMPTS - 1]} 
            alt="Fotograma" 
            className="w-full h-full object-cover select-none pointer-events-none transition-opacity duration-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-600">Cargando fotograma...</div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        {guesses.map((guess, idx) => (
          <div 
            key={idx} 
            className={`h-10 flex items-center justify-center px-2 rounded-xl border text-xs font-bold transition-all ${
              guess 
                ? guess.isCorrect 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-red-50 border-red-100 text-red-600'
                : idx === currentAttempt 
                  ? 'bg-blue-50/50 border-blue-200 ring-2 ring-blue-100' 
                  : 'bg-gray-50 border-gray-100 text-transparent'
            }`}
          >
            {guess ? (
              <span className="truncate max-w-full">
                {guess.isCorrect ? `🎉 ¡Acertada!` : `❌ ${guess.text}`}
              </span>
            ) : (
              <span className="opacity-0">...</span>
            )}
          </div>
        ))}
      </div>

      {gameState === 'playing' && (
        <form onSubmit={handleFormSubmit} className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => inputValue.trim().length > 1 && setShowSuggestions(true)}
                placeholder="Empieza a escribir el título de la película..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                autoComplete="off"
              />
              
              {/* MEJORA DEFINITIVA: Desplegable en formato GRID panorámico y sin cortes de altura */}
              {showSuggestions && suggestions.length > 0 && (
                <ul 
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5"
                >
                  {suggestions.map((movie, index) => (
                    <li 
                      key={index}
                      onClick={() => handleSelectSuggestion(movie)}
                      className="px-3 py-2.5 hover:bg-gray-50 text-gray-900 font-bold text-xs sm:text-sm cursor-pointer transition-colors rounded-xl flex items-center justify-between border border-transparent hover:border-gray-100"
                    >
                      <span className="truncate mr-2">{movie}</span>
                      <span className="text-[10px] text-gray-400 font-normal shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">↵</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm self-start"
            >
              Probar
            </button>
          </div>

          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={skipAttempt}
              className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors underline decoration-gray-300 underline-offset-4"
            >
              Pasar fotograma voluntariamente (-{PENALTY_PER_ATTEMPT} pts)
            </button>
          </div>
        </form>
      )}

      {gameState === 'won' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-fade-in shadow-sm mt-4">
          <h3 className="text-2xl font-black text-emerald-700 mb-2">¡Correcto! 🏆</h3>
          <p className="text-emerald-600 mb-4 font-medium">
            La película era exactly <strong>{targetPoolTitle}</strong>. ¡Has ganado <strong className="text-lg">{scoreEarned} puntos</strong>!
          </p>
          <button type="button" onClick={handleAdvanceRound} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-colors">
            {movieRound < TOTAL_MOVIES_PER_ROUND ? `Siguiente Película (${movieRound + 1}/${TOTAL_MOVIES_PER_ROUND})` : 'Ver Resultado Global'}
          </button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center animate-fade-in shadow-sm mt-4">
          <h3 className="text-2xl font-black text-red-700 mb-2">¡Se agotaron los intentos! 💔</h3>
          <p className="text-red-600 mb-4 font-medium">La película correcta era <strong>{targetPoolTitle}</strong>.</p>
          <button type="button" onClick={handleAdvanceRound} className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-md transition-colors">
            {movieRound < TOTAL_MOVIES_PER_ROUND ? `Siguiente Película (${movieRound + 1}/${TOTAL_MOVIES_PER_ROUND})` : 'Ver Resultado Global'}
          </button>
        </div>
      )}

    </div>
  );
}