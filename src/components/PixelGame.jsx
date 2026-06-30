import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "../supabaseClient";
import { POPULAR_MOVIES_POOL } from '../listados';
import { HOLLYWOOD_ACTORS } from '../listados';

// CONFIGURACIÓN DE LA API DE TMDB
const TMDB_API_KEY = '8005d659cd2756fbe0a09eaba113b878'; 
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


export default function PixelGame({ onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [gameState, setGameState] = useState('loading'); 
  
  const [options, setOptions] = useState([]);
  const [targetActor, setTargetActor] = useState(null);
  const [blurAmount, setBlurAmount] = useState(45); 
  const [scoreEarned, setScoreEarned] = useState(120); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [movieHint, setMovieHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  
  const [savingPoints, setSavingPoints] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const timerRef = useRef(null);
  const TOTAL_QUESTIONS = 20;

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        if (user) {
          initNewSession();
        }
      } catch (err) {
        console.error("Error al verificar la identidad del usuario:", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUserAuthentication();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (checkingAuth || !currentUser) return;

    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setScoreEarned(prevScore => {
          const nextScore = prevScore - 3; 
          if (nextScore <= 0) {
            clearInterval(timerRef.current);
            setGameState('lost');
            setBlurAmount(0); 
            return 0;
          }
          return nextScore;
        });

        setBlurAmount(prevBlur => {
          if (prevBlur <= 0) return 0;
          return prevBlur - 1.125; 
        });

      }, 500); 
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [gameState, currentUser, checkingAuth]);

  const initNewSession = () => {
    setCurrentQuestion(1);
    setAccumulatedScore(0);
    loadQuestionRound();
  };

  const loadQuestionRound = async () => {
    try {
      setGameState('loading');
      setBlurAmount(45);
      setScoreEarned(120); 
      setSelectedOption(null);
      setMovieHint("");
      setShowHint(false);
      setErrorMessage(null);

      const shuffledPool = [...HOLLYWOOD_ACTORS].sort(() => 0.5 - Math.random());
      const selectedNames = shuffledPool.slice(0, 4);
      const chosenTargetName = selectedNames[Math.floor(Math.random() * selectedNames.length)];

      const searchUrl = `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(chosenTargetName)}`;
      const res = await fetch(searchUrl);
      if (!res.ok) throw new Error("Error de comunicación con los servidores de TMDB.");
      
      const data = await res.json();
      const apiResult = data.results && data.results[0];

      if (!apiResult || !apiResult.profile_path) {
        loadQuestionRound(); 
        return;
      }

      const famousProduction = apiResult.known_for && apiResult.known_for[0];
      const productionTitle = famousProduction ? (famousProduction.title || famousProduction.name) : "Cine de Hollywood";

      setTargetActor({
        id: apiResult.id,
        name: chosenTargetName,
        profile_path: apiResult.profile_path
      });

      setMovieHint(productionTitle);
      setOptions(selectedNames);
      setGameState('playing');

    } catch (err) {
      console.error(err);
      setErrorMessage("Error de sincronización con TMDB. Comprueba tu API Key.");
      setGameState('lost');
    }
  };

  const handleOptionClick = (name) => {
    if (gameState !== 'playing' || scoreEarned === 0) return;
    setSelectedOption(name);
    clearInterval(timerRef.current);
    setBlurAmount(0); 

    if (name === targetActor.name) {
      setAccumulatedScore(prev => prev + scoreEarned);
      setGameState('won');
    } else {
      setGameState('lost');
    }
  };

  const handleNextBackbone = async () => {
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion(prev => prev + 1);
      loadQuestionRound();
    } else {
      setGameState('summary');
      await saveFinalScoreToSupabase(accumulatedScore);
    }
  };

  const saveFinalScoreToSupabase = async (finalPoints) => {
    try {
      setSavingPoints(true);
      if (!currentUser) return;

      const uid = currentUser.id;
      const { data: prof, error: pErr } = await supabase
        .from('profiles')
        .select('pixel_score')
        .eq('id', uid)
        .single();

      if (pErr) throw pErr;

      const updatedScore = (prof.pixel_score || 0) + finalPoints;
      const { error: uErr } = await supabase
        .from('profiles')
        .update({ pixel_score: updatedScore })
        .eq('id', uid);

      if (uErr) throw uErr;
    } catch (err) {
      console.error("Error al guardar en Supabase:", err);
    } finally {
      setSavingPoints(false);
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

  // DISEÑO UNIFICADO: Pantalla de Acceso Denegado (HAL-9000 Avanzada)
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-8 mt-10 bg-black border border-red-900/50 rounded-3xl shadow-2xl relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-red-900/10 pointer-events-none animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* El ojo de buey iluminado de HAL-9000 */}
          <div className="w-24 h-24 bg-red-600 rounded-full mb-8 shadow-[0_0_50px_rgba(220,38,38,0.8)] border-4 border-red-800 flex items-center justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <h2 className="text-3xl font-black text-red-500 mb-4 tracking-widest font-mono">
            ACCESO DENEGADO
          </h2>
          <p className="text-red-400 text-lg mb-6 font-mono max-w-lg leading-relaxed">
            "Lo siento, Dave. Me temo que no puedo hacer eso. Tus credenciales no se encuentran en la base de datos principal."
          </p>
          <div className="px-6 py-3 bg-red-950/50 border border-red-800 rounded-xl text-red-300 font-mono text-sm mb-6">
            CÓDIGO DE ERROR: 401_UNAUTHORIZED
          </div>
          <button 
            onClick={onBack} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(220,38,38,0.4)] font-mono"
          >
            ⬅ Volver al Panel Central
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-950 border border-gray-800 p-12 rounded-3xl text-center text-white font-mono shadow-2xl">
        <p className="text-sm text-gray-400 tracking-widest animate-pulse">
          🎬 CARGANDO ROSTRO {currentQuestion} DE {TOTAL_QUESTIONS}...
        </p>
      </div>
    );
  }

  if (gameState === 'summary') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-950 border border-gray-800 p-8 rounded-3xl text-center text-white font-mono shadow-2xl">
        <span className="text-6xl">🏆</span>
        <h2 className="text-3xl font-black text-red-500 mt-5 tracking-widest uppercase">Análisis Terminado</h2>
        <p className="text-gray-400 mt-3 text-sm">HAL-9000 ha evaluado tus conocimientos sobre fisonomía de estrellas.</p>
        
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl my-8">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Puntuación Total Conseguida</p>
          <p className="text-5xl font-black text-white mt-2">{accumulatedScore}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={initNewSession} className="w-full bg-red-950 border border-red-800 hover:bg-red-900 text-white p-4 rounded-xl font-bold transition-colors uppercase tracking-wider text-xs">
            Jugar Otra Ronda ➔
          </button>
          <button onClick={onBack} className="w-full bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 text-gray-400 p-4 rounded-xl font-bold transition-colors uppercase tracking-wider text-xs">
            Salir al Panel Central
          </button>
        </div>
      </div>
    );
  }

  const scorePercentage = (scoreEarned / 120) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-950 border border-gray-800 rounded-3xl text-white font-mono shadow-2xl overflow-hidden flex flex-col">
      
      {/* Cabecera - Barra de Estado */}
      <div className="p-3 sm:p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/40 relative shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack} 
            className="bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800 p-2 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse border border-red-900 shadow-[0_0_8px_#dc2626]"></div>
          <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase hidden sm:inline">HAL-9000 PIXEL</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 px-2 py-1 rounded-md border border-gray-800 text-center min-w-[70px]">
            <span className="text-[8px] text-gray-500 block uppercase font-bold leading-none">Total</span>
            <span className="text-xs font-bold text-gray-300">{accumulatedScore}</span>
          </div>
          <span className={`text-xs font-black px-2 py-1 rounded-md border ${
            scoreEarned <= 40 ? 'bg-red-950/80 text-red-400 border-red-800 animate-pulse' : 'bg-gray-900 text-amber-400 border-gray-800'
          }`}>
            ⭐ {scoreEarned}
          </span>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded-md font-bold border border-gray-700">Rostro: {currentQuestion}/{TOTAL_QUESTIONS}</span>
        </div>

        <div className="absolute bottom-0 left-0 h-[2px] bg-gray-800 w-full">
          <div 
            className={`h-full transition-all duration-500 ease-linear ${scoreEarned <= 40 ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' : 'bg-blue-500'}`}
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Visor de Rostro de Hollywood */}
      <div className="relative h-[220px] sm:h-[340px] w-full bg-black flex items-center justify-center overflow-hidden border-b border-gray-800 shrink-0">
        {targetActor && (
          <img
            src={`${IMAGE_BASE_URL}${targetActor.profile_path}`}
            alt="Rostro"
            className="w-full h-full object-contain transition-all duration-300 select-none pointer-events-none"
            style={{ filter: `blur(${blurAmount}px)` }}
          />
        )}
        
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-10">
            <span className="bg-emerald-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl border border-emerald-500 uppercase tracking-wider animate-bounce">
              🟢 Concedido (+{scoreEarned} pts)
            </span>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-10">
            <span className="bg-rose-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl border border-rose-500 uppercase tracking-wider">
              {scoreEarned === 0 ? "⚠️ Tiempo Agotado" : "🔴 Error Biométrico"}
            </span>
          </div>
        )}
      </div>

      {/* Cuerpo del Cuestionario */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between bg-gray-950">
        <div className="bg-gray-900/50 border border-gray-800/80 p-2.5 sm:p-4 rounded-xl text-center hidden xs:block">
          <h3 className="text-[10px] sm:text-xs font-bold tracking-widest text-red-500 uppercase">
            RECONOCIMIENTO BIOMÉTRICO
          </h3>
        </div>

        {movieHint && (
          <div className="mt-2 text-center">
            {!showHint ? (
              <button
                disabled={gameState !== 'playing' || scoreEarned > 60}
                onClick={() => setShowHint(true)}
                className="w-full bg-gray-900 border border-gray-800 hover:border-amber-600 hover:bg-gray-800 text-gray-400 py-2 px-3 rounded-xl text-[11px] font-bold transition-all disabled:opacity-30"
              >
                {scoreEarned > 60 ? `💡 Pista bloqueada (Disponible a los 60 pts)` : '💡 Solicitar película asociada'}
              </button>
            ) : (
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-3 text-center animate-fade-in">
                <p className="text-[11px] text-gray-300 font-sans leading-tight">
                  Obra principal: <span className="text-amber-400 font-bold italic">"{movieHint}"</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Listado de Opciones */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
          {options.map((name, index) => {
            const isCorrect = name === targetActor?.name;
            const isSelected = name === selectedOption;
            const optionLetter = String.fromCharCode(65 + index); 
            
            let buttonStyle = "bg-gray-900 border-gray-800 hover:border-red-600 text-gray-300";
            if (gameState !== 'playing') {
              if (isCorrect) buttonStyle = "bg-emerald-950 border-emerald-500 text-emerald-100 font-bold shadow-md";
              else if (isSelected) buttonStyle = "bg-red-950/60 border-red-600 text-red-200 line-through opacity-60";
              else buttonStyle = "bg-gray-900/20 border-gray-900 text-gray-700 opacity-30";
            }

            return (
              <button
                key={name}
                disabled={gameState !== 'playing' || scoreEarned === 0}
                onClick={() => {
                  setSelectedOption(name);
                  handleOptionClick(name);
                }}
                className={`w-full text-left p-3 sm:p-5 rounded-xl border text-[11px] sm:text-sm transition-all duration-150 flex items-center gap-2 sm:gap-4 truncate ${buttonStyle}`}
              >
                <span className={`w-5 h-5 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-black border text-[10px] sm:text-xs uppercase shrink-0 ${
                  gameState !== 'playing' && isCorrect ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'
                }`}>
                  {optionLetter}
                </span>
                <span className="flex-1 font-medium truncate leading-tight whitespace-normal sm:whitespace-nowrap">{name}</span>
              </button>
            );
          })}
        </div>

        {/* Panel de Feedback Inferior */}
        {gameState !== 'playing' && (
          <div className="mt-4 p-3 sm:p-4 bg-gray-900 border border-gray-800 rounded-2xl animate-fade-in text-center">
            {targetActor && (
              <p className="text-[11px] sm:text-xs text-gray-300 font-sans">
                Identidad: <span className="font-mono text-red-400 font-bold uppercase tracking-wider">{targetActor.name}</span>
              </p>
            )}
            <button 
              onClick={handleNextBackbone}
              className="mt-3 w-full bg-white text-gray-950 py-2.5 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-colors uppercase tracking-wider"
            >
              {currentQuestion === TOTAL_QUESTIONS ? "Ver Resultados" : "Siguiente Rostro ➔"}
            </button>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}