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

export default function PixelGame() {
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

  const timerRef = useRef(null);
  const TOTAL_QUESTIONS = 20;

  useEffect(() => {
    initNewSession();
    return () => clearInterval(timerRef.current);
  }, []);

  // Lógica de cronómetro calibrada a 20 segundos totales (40 ticks de 500ms reduciendo de 3 en 3)
  useEffect(() => {
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
  }, [gameState]);

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
      const { data: { session }, error: sErr } = await supabase.auth.getSession();
      if (sErr || !session || session.isGuest) return;

      const uid = session.user.id;
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

  if (gameState === 'loading') {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center text-gray-500 font-bold my-6 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse">
        🎬 Cargando pregunta {currentQuestion} de {TOTAL_QUESTIONS}...
      </div>
    );
  }

  if (gameState === 'summary') {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-3xl shadow-xl border border-gray-100 my-8">
        <span className="text-5xl">🏆</span>
        <h2 className="text-2xl font-black text-gray-900 mt-4 tracking-tight">¡Ronda de 20 Preguntas Completada!</h2>
        <p className="text-gray-500 font-medium mt-1.5">Has demostrado tus conocimientos sobre los rostros más célebres de Hollywood.</p>
        
        <div className="my-6 p-6 bg-blue-50/60 rounded-2xl border border-blue-100 max-w-sm mx-auto">
          <p className="text-xs text-blue-600 font-extrabold uppercase tracking-widest">Puntuación Total de la Partida</p>
          <p className="text-4xl font-black text-blue-700 mt-1">{accumulatedScore} <span className="text-sm font-bold text-blue-500">pts</span></p>
        </div>

        <button
          onClick={initNewSession}
          className="w-full bg-gray-900 text-white font-black py-4 rounded-xl shadow-md hover:bg-gray-800 transition-all active:scale-[0.98]"
        >
          Jugar Otra Ronda ➔
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-sm border border-gray-100 my-6">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-900 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
              Pregunta {currentQuestion} / {TOTAL_QUESTIONS}
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-1.5">
            🎬 Pixelado de Hollywood
          </h2>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/60 text-right">
            <span className="block text-[10px] text-gray-400 font-extrabold uppercase">Total acumulado</span>
            <span className="text-sm font-black text-gray-800">{accumulatedScore} pts</span>
          </div>

          <div className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
            scoreEarned > 60 ? 'bg-blue-50 border border-blue-100 text-blue-700' : 'bg-red-50 border border-red-100 text-red-600 animate-pulse'
          }`}>
            ⭐ {scoreEarned} pts
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-2xl text-xs font-bold mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* RECUADRO DE ROSTRO AGRANDADO Y TOTALMENTE RESPONSIVE */}
      <div className="relative w-full max-w-sm h-80 sm:h-[420px] mx-auto bg-gray-950 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-900 mb-6 flex items-center justify-center">
        {targetActor && (
          <img
            src={`${IMAGE_BASE_URL}${targetActor.profile_path}`}
            alt="Rostro en análisis"
            className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300"
            style={{ filter: `blur(${blurAmount}px)` }}
          />
        )}
        
        {/* Capas superpuestas de estados visuales */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-green-600/15 flex items-center justify-center p-4">
            <span className="bg-white text-green-700 font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg border border-green-200 uppercase tracking-wider animate-bounce">
              ¡Respuesta Correcta! (+{scoreEarned} pts)
            </span>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-red-600/15 flex items-center justify-center p-4">
            <span className="bg-white text-red-700 font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg border border-red-200 uppercase tracking-wider">
              {scoreEarned === 0 ? "¡Tiempo Agotado! ⏱️" : "Respuesta Incorrecta"}
            </span>
          </div>
        )}
      </div>

      {/* SECCIÓN DE PISTA RESTRINGIDA A 60 PUNTOS O MENOS */}
      {movieHint && (
        <div className="mb-5 text-center">
          {!showHint ? (
            <button
              disabled={gameState !== 'playing' || scoreEarned > 60}
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-sm border border-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 bg-amber-50 hover:bg-amber-100/80 text-amber-800"
            >
              {scoreEarned > 60 
                ? `💡 Pista bloqueada (Disponible a los 60 pts o menos)` 
                : '💡 ¡Pista Disponible! Solicitar producción famosa'
              }
            </button>
          ) : (
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 max-w-md mx-auto text-center animate-fade-in">
              <p className="text-[11px] text-amber-700 font-extrabold uppercase tracking-wide">Pista de Actuación</p>
              <p className="text-xs sm:text-sm text-amber-900 font-bold mt-0.5">
                Es muy conocido/a por su participación en: <span className="font-black underline italic">"{movieHint}"</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* REJILLA DE OPCIONES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((name) => {
          let btnStyle = "border-gray-200 text-gray-800 hover:border-gray-900 hover:bg-gray-50 active:scale-[0.99]";
          const isButtonDisabled = gameState !== 'playing' || scoreEarned === 0;

          if (gameState !== 'playing') {
            if (name === targetActor?.name) {
              btnStyle = "border-green-500 bg-green-50 text-green-700 font-black ring-4 ring-green-100";
            } else if (selectedOption === name) {
              btnStyle = "border-red-500 bg-red-50 text-red-700 font-black";
            } else {
              btnStyle = "border-gray-100 text-gray-300 opacity-40 cursor-not-allowed";
            }
          }

          return (
            <button
              key={name}
              disabled={isButtonDisabled}
              onClick={() => handleOptionClick(name)}
              className={`border-2 rounded-2xl px-4 py-3.5 font-bold text-sm text-left transition-all flex items-center justify-between truncate ${btnStyle}`}
            >
              <span className="truncate">{name}</span>
              {gameState === 'won' && name === targetActor?.name && <span className="text-green-600 font-black">✓</span>}
              {gameState === 'lost' && selectedOption === name && <span className="text-red-600 font-black">✗</span>}
            </button>
          );
        })}
      </div>

      {/* BOTÓN CONTINUAR */}
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="mt-6 pt-5 border-t border-gray-100 text-center animate-fade-in">
          {targetActor && (
            <p className="text-xs sm:text-sm font-bold text-gray-500 mb-3.5">
              Identidad de la estrella: <span className="font-black text-gray-900">{targetActor.name}</span>
            </p>
          )}
          
          <button
            onClick={handleNextBackbone}
            className="bg-gray-900 text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-md hover:bg-gray-800 active:scale-95 transition-all w-full sm:w-auto"
          >
            {currentQuestion === TOTAL_QUESTIONS ? "Ver Resultados Finales 🏆" : "Siguiente Rostro ➔"}
          </button>
        </div>
      )}

    </div>
  );
}