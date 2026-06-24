import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "../supabaseClient";

// CONFIGURACIÓN DE LA API DE TMDB
const TMDB_API_KEY = '8005d659cd2756fbe0a09eaba113b878'; 
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// POOL OFICIAL DE LOS 200 ACTORES DE HOLLYWOOD SELECCIONADOS
const HOLLYWOOD_ACTORS = [
  // Era Dorada
  "Humphrey Bogart", "Marlon Brando", "Katharine Hepburn", "Bette Davis",
  "Cary Grant", "James Stewart", "Marilyn Monroe", "Audrey Hepburn",
  "Clark Gable", "John Wayne", "Ingrid Bergman", "Elizabeth Taylor",
  "Gregory Peck", "Henry Fonda", "Grace Kelly", "Joan Crawford",
  "Kirk Douglas", "Charlton Heston", "Judy Garland", "Lauren Bacall",
  "Paul Newman", "Robert Redford", "Vivien Leigh", "Greta Garbo",
  "James Dean", "Spencer Tracy", "Marlene Dietrich", "Rita Hayworth",
  "Gary Cooper", "Burt Lancaster", "Ava Gardner", "Lana Turner",
  "William Holden", "James Cagney", "Hedy Lamarr", "Barbara Stanwyck",
  "Orson Welles", "Laurence Olivier", "Olivia de Havilland", "Joan Fontaine",
  "Charlie Chaplin", "Buster Keaton", "Natalie Wood", "Debbie Reynolds",
  "Groucho Marx", "Gene Kelly", "Shirley Temple", "Maureen O'Hara",
  "Fred Astaire", "Alec Guinness", "Ginger Rogers",
  
  // Años 60 - 1980
  "Robert De Niro", "Al Pacino", "Meryl Streep", "Jane Fonda",
  "Jack Nicholson", "Dustin Hoffman", "Diane Keaton", "Sigourney Weaver",
  "Clint Eastwood", "Harrison Ford", "Glenn Close", "Susan Sarandon",
  "Sylvester Stallone", "Arnold Schwarzenegger", "Goldie Hawn", "Sally Field",
  "Bruce Willis", "Tom Cruise", "Michelle Pfeiffer", "Sharon Stone",
  "Tom Hanks", "Mel Gibson", "Jamie Lee Curtis", "Jodie Foster",
  "Richard Gere", "Michael Douglas", "Geena Davis", "Carrie Fisher",
  "John Travolta", "Patrick Swayze", "Barbra Streisand", "Cher",
  "Kevin Costner", "Kurt Russell", "Whoopi Goldberg", "Jessica Lange",
  "Jeff Bridges", "Willem Dafoe", "Frances McDormand", "Kathleen Turner",
  "Christopher Walken", "Harvey Keitel", "Diane Lane", "Demi Moore",
  "Gene Hackman", "Robert Duvall", "Winona Ryder", "Laura Dern",
  "Steve McQueen", "Sean Connery", "Anjelica Huston", "Mia Farrow",

  // Años 90 - 2000
  "Brad Pitt", "Leonardo DiCaprio", "Julia Roberts", "Sandra Bullock",
  "Johnny Depp", "George Clooney", "Angelina Jolie", "Scarlett Johansson",
  "Matt Damon", "Ben Affleck", "Natalie Portman", "Charlize Theron",
  "Keanu Reeves", "Nicolas Cage", "Nicole Kidman", "Cate Blanchett",
  "Will Smith", "Jim Carrey", "Reese Witherspoon", "Kate Winslet",
  "Denzel Washington", "Morgan Freeman", "Jennifer Aniston", "Gwyneth Paltrow",
  "Robin Williams", "Christian Bale", "Halle Berry", "Penélope Cruz",
  "Hugh Jackman", "Russell Crowe", "Salma Hayek", "Julianne Moore",
  "Joaquin Phoenix", "Edward Norton", "Renée Zellweger", "Hilary Swank",
  "Heath Ledger", "Matthew McConaughey", "Amy Adams", "Jessica Chastain",
  "Robert Downey Jr.", "Samuel L. Jackson", "Emily Blunt", "Anne Hathaway",
  "Gary Oldman", "Philip Seymour Hoffman", "Helena Bonham Carter", "Rachel Weisz",
  "Woody Harrelson", "Viggo Mortensen", "Uma Thurman", "Cameron Diaz",

  // 2010 - Presente
  "Ryan Gosling", "Timothée Chalamet", "Emma Stone", "Jennifer Lawrence",
  "Cillian Murphy", "Robert Pattinson", "Margot Robbie", "Zendaya",
  "Tom Holland", "Bradley Cooper", "Florence Pugh", "Saoirse Ronan",
  "Jake Gyllenhaal", "Chris Pratt", "Anya Taylor-Joy", "Kristen Stewart",
  "Chris Evans", "Chris Hemsworth", "Viola Davis", "Lupita Nyong'o",
  "Mark Ruffalo", "Michael B. Jordan", "Octavia Spencer", "Taraji P. Henson",
  "Pedro Pascal", "Oscar Isaac", "Ana de Armas", "Lady Gaga",
  "Adam Driver", "Michael Fassbender", "Brie Larson", "Elizabeth Olsen",
  "James McAvoy", "Dwayne Johnson", "Zoe Saldaña", "Rooney Mara",
  "Vin Diesel", "Jason Statham", "Emma Watson", "Carey Mulligan",
  "Benedict Cumberbatch", "Tom Hardy", "Alicia Vikander", "Amanda Seyfried",
  "Austin Butler", "Glen Powell", "Shailene Woodley", "Sydney Sweeney",
  "Jacob Elordi", "Paul Mescal", "Jenna Ortega", "Rebecca Ferguson"
];

export default function PixelGame({ onBack }) {
  // Estados de control de la partida
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [gameState, setGameState] = useState('loading'); // 'loading', 'playing', 'won', 'lost', 'summary'
  
  // Estados de la pregunta actual
  const [options, setOptions] = useState([]);
  const [targetActor, setTargetActor] = useState(null);
  const [blurAmount, setBlurAmount] = useState(45); 
  const [scoreEarned, setScoreEarned] = useState(120); // Arranca en 120 puntos obligatorios
  const [selectedOption, setSelectedOption] = useState(null);
  const [movieHint, setMovieHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  
  const [savingPoints, setSavingPoints] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Estados esenciales de protección y sesión de usuario
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const timerRef = useRef(null);
  const TOTAL_QUESTIONS = 20;

  // Comprobamos el estado de autenticación al montar el componente
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

  // Lógica de cronómetro calibrada a 20 segundos totales
  useEffect(() => {
    if (checkingAuth || !currentUser) return;

    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        
        setScoreEarned(prevScore => {
          const nextScore = prevScore - 3; // Caída controlada de 3 puntos por tick
          
          if (nextScore <= 0) {
            clearInterval(timerRef.current);
            setGameState('lost');
            setBlurAmount(0); // Al llegar a 0 se limpia la imagen al 100% automáticamente
            return 0;
          }
          return nextScore;
        });

        setBlurAmount(prevBlur => {
          if (prevBlur <= 0) return 0;
          return prevBlur - 1.125; // Sincronizado matemáticamente para llegar a 0 junto al marcador
        });

      }, 500); // Ticks cómodos de medio segundo
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

      // 1. Tomar 4 nombres únicos al azar del listado de los 200
      const shuffledPool = [...HOLLYWOOD_ACTORS].sort(() => 0.5 - Math.random());
      const selectedNames = shuffledPool.slice(0, 4);
      const chosenTargetName = selectedNames[Math.floor(Math.random() * selectedNames.length)];

      // 2. Fetch a TMDB
      const searchUrl = `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(chosenTargetName)}`;
      const res = await fetch(searchUrl);
      if (!res.ok) throw new Error("Error de comunicación con los servidores de TMDB.");
      
      const data = await res.json();
      const apiResult = data.results && data.results[0];

      if (!apiResult || !apiResult.profile_path) {
        loadQuestionRound(); // Reintento transparente si falta la imagen
        return;
      }

      // Extraer película famosa del actor
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
    setBlurAmount(0); // Revelado instantáneo al responder

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

  // PANTALLAS DE CONTROL DE ACCESO GLOBAL (ESTILO HAL-9000 EXACTO)
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
      <div className="w-full max-w-2xl mx-auto bg-gray-950 border border-red-900 p-8 rounded-3xl text-center text-white font-mono shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 shadow-[0_0_15px_#dc2626]"></div>
        <span className="text-6xl block mt-4 animate-bounce">⚠️</span>
        <h2 className="text-2xl font-black text-red-500 mt-5 tracking-widest uppercase">Acceso Denegado</h2>
        <div className="bg-red-950/20 border border-red-900/60 p-6 rounded-2xl my-6 text-left">
          <p className="text-xs text-red-400 uppercase tracking-widest font-black mb-2">Protocolo de seguridad HAL-9000:</p>
          <p className="text-sm text-gray-300 font-sans leading-relaxed">
            Este simulador de trivia almacena registros globales de rendimiento. Para poder calibrar tus respuestas y sincronizar tu puntuación con los leaderboards de la plataforma, es estrictamente obligatorio disponer de una cuenta de usuario activa.
          </p>
        </div>
        <button onClick={onBack} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          ⬅ Volver al Panel Central
        </button>
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
          <p className="text-5xl font-black text-white mt-2">{accumulatedScore} <span className="text-sm font-bold text-gray-400">pts</span></p>
          <p className="text-sm text-red-400 mt-4 italic font-sans px-4">
            {accumulatedScore >= 1500 ? "Excelente agudeza visual. Tus registros coinciden con mis bancos de memoria principal sin desviaciones." : "Análisis de escaneo completado. Tus respuestas son aceptables, pero tus archivos ópticos requieren una calibración inmediata."}
          </p>
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

  // CÁLCULO DE PROGRESO DE PUNTOS PARA LA BARRA (120 PTS MÁXIMO)
  const scorePercentage = (scoreEarned / 120) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-950 border border-gray-800 rounded-3xl text-white font-mono shadow-2xl overflow-hidden">
      
      {/* Cabecera - Barra de Estado */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/40 relative">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onBack} 
            className="bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800 p-2 rounded-xl transition-all mr-1"
            title="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className={`w-3 h-3 rounded-full border-2 shadow-lg ${
            scoreEarned <= 40 
              ? 'bg-red-600 animate-ping border-red-900 shadow-red-600' 
              : 'bg-red-600 animate-pulse border-2 border-red-900 shadow-[0_0_10px_#dc2626]'
          }`}></div>
          <span className="text-xs font-black tracking-widest text-gray-300 uppercase hidden sm:inline">HAL-9000 PIXEL SYSTEM V.1</span>
          <span className="text-xs font-black tracking-widest text-gray-300 uppercase sm:hidden">HAL-9000</span>
        </div>
        
        {/* Marcador numérico de puntos y progreso de rondas */}
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 px-3 py-1 rounded-md border border-gray-800 text-right">
            <span className="text-[9px] text-gray-500 block uppercase font-bold leading-tight">Acumulado</span>
            <span className="text-xs font-bold text-gray-300">{accumulatedScore} pts</span>
          </div>
          <span className={`text-xs font-black px-2.5 py-1.5 rounded-md border ${
            scoreEarned <= 40 
              ? 'bg-red-950/80 text-red-400 border-red-800 animate-pulse' 
              : 'bg-gray-900 text-amber-400 border-gray-800'
          }`}>
            ⭐ {scoreEarned} pts
          </span>
          <span className="text-xs bg-gray-800 px-2.5 py-1.5 rounded-md font-bold border border-gray-700">Rostro: {currentQuestion}/{TOTAL_QUESTIONS}</span>
        </div>

        {/* Barra de progreso dinámica superior basada en los puntos restantes */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gray-800 w-full">
          <div 
            className={`h-full transition-all duration-500 ease-linear ${
              scoreEarned <= 40 ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' : 'bg-blue-500'
            }`}
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Visor de Rostro de Hollywood */}
      <div className="relative min-h-[320px] max-h-[60vh] h-auto bg-black flex items-center justify-center overflow-hidden border-b border-gray-800">
        {targetActor && (
          <img
            src={`${IMAGE_BASE_URL}${targetActor.profile_path}`}
            alt="Escaneo de Rostro"
            className="w-full h-full object-contain transition-all duration-300 select-none pointer-events-none"
            style={{ filter: `blur(${blurAmount}px)` }}
          />
        )}
        
        {/* Superposiciones de estado en el ojo central */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex items-center justify-center p-4">
            <span className="bg-emerald-600 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xl uppercase tracking-wider border border-emerald-500">
              🟢 Acceso Concedido (+{scoreEarned} pts)
            </span>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-rose-950/40 backdrop-blur-xs flex items-center justify-center p-4">
            <span className="bg-rose-600 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xl uppercase tracking-wider border border-rose-500">
              {scoreEarned === 0 ? "⚠️ Tiempo Agotado - Desconexión" : "🔴 Error de Sistema - Desviación"}
            </span>
          </div>
        )}
      </div>

      {/* Cuerpo del Cuestionario */}
      <div className="p-6 sm:p-8">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl text-center">
          <h3 className="text-xs sm:text-sm font-bold tracking-widest text-red-500 uppercase">
            SISTEMA DE RECONOCIMIENTO BIOMÉTRICO
          </h3>
          <p className="text-xs text-gray-400 font-sans mt-1">
            Analiza el patrón pixelado e identifica a la celebridad de Hollywood antes de que se agoten los puntos.
          </p>
        </div>

        {/* SECCIÓN DE PISTA ESTILO HAL-9000 */}
        {movieHint && (
          <div className="mt-4 text-center">
            {!showHint ? (
              <button
                disabled={gameState !== 'playing' || scoreEarned > 60}
                onClick={() => setShowHint(true)}
                className="w-full bg-gray-900 border border-gray-800 hover:border-amber-600 hover:bg-gray-800 text-gray-400 p-3 rounded-xl text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-800"
              >
                {scoreEarned > 60 
                  ? `💡 Pista de producción bloqueada (Disponible a los 60 pts)` 
                  : '💡 Solicitar análisis de archivos cinematográficos asociados'
                }
              </button>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left animate-fade-in">
                <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Base de datos de producciones:</p>
                <p className="text-xs sm:text-sm text-gray-200 font-sans mt-1 leading-relaxed">
                  El sujeto posee registros de actividad principal en la obra: <span className="text-white font-bold italic underline">"{movieHint}"</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Listado de Opciones de Respuesta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {options.map((name, index) => {
            const isCorrect = name === targetActor?.name;
            const isSelected = name === selectedOption;
            const optionLetter = String.fromCharCode(65 + index); // Genera A, B, C, D
            
            let buttonStyle = "bg-gray-900 border-gray-800 hover:border-red-600 hover:bg-gray-800 text-gray-300";
            if (gameState !== 'playing') {
              if (isCorrect) buttonStyle = "bg-emerald-950 border-emerald-500 text-emerald-100 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]";
              else if (isSelected) buttonStyle = "bg-red-950/60 border-red-600 text-red-200 line-through opacity-70";
              else buttonStyle = "bg-gray-900/30 border-gray-900 text-gray-700 opacity-40";
            }

            return (
              <button
                key={name}
                disabled={gameState !== 'playing' || scoreEarned === 0}
                onClick={() => {
                  setSelectedOption(name);
                  handleOptionClick(name);
                }}
                className={`w-full text-left p-5 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-center gap-4 group truncate ${buttonStyle}`}
              >
                {/* Letra de la opción */}
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black border text-xs uppercase shadow-inner transition-colors shrink-0 ${
                  gameState !== 'playing' && isCorrect ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-500 group-hover:border-red-500 group-hover:text-red-400'
                }`}>
                  {optionLetter}
                </span>
                {/* Nombre del actor */}
                <span className="flex-1 font-medium truncate">{name}</span>
                {/* Icono de estado al responder */}
                {gameState !== 'playing' && isCorrect && <span className="text-lg shrink-0">✅</span>}
                {gameState !== 'playing' && isSelected && !isCorrect && <span className="text-lg shrink-0">❌</span>}
              </button>
            );
          })}
        </div>

        {/* Panel de Feedback Inferior */}
        {gameState !== 'playing' && (
          <div className="mt-8 p-6 bg-gray-900 border-2 border-gray-800 rounded-3xl animate-fade-in shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                gameState === 'won' ? 'bg-emerald-500' : 'bg-red-600'
              }`}></div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-300">
                {gameState === 'won' 
                  ? "🟢 Identificación Exitosa - Perfil Sincronizado" 
                  : scoreEarned === 0 
                  ? "⚠️ Tiempo de Escaneo Agotado"
                  : "🔴 Error de Correspondencia Biométrica"}
              </p>
            </div>
            
            {targetActor && (
              <p className="text-xs sm:text-sm text-gray-200 mt-4 leading-relaxed font-sans bg-gray-950 p-4 rounded-xl border border-gray-800">
                Identidad confirmada en el núcleo central de datos: <span className="font-mono text-red-400 font-bold uppercase tracking-wider">{targetActor.name}</span>.
              </p>
            )}
            
            <button 
              onClick={handleNextBackbone}
              className="mt-6 w-full bg-white text-gray-950 p-3.5 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-colors uppercase tracking-widest shadow-md"
            >
              {currentQuestion === TOTAL_QUESTIONS ? "Finalizar Análisis y Ver Resultados" : "Siguiente Archivo de Transmisión ➔"}
            </button>
          </div>
        )}
      </div>
      
      {/* Estilos nativos para animaciones */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}} />
    </div>
  );
}