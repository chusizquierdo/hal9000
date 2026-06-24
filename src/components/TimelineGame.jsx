import React, { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";

// CONFIGURACIÓN DE LA API DE TMDB
const TMDB_API_KEY = '8005d659cd2756fbe0a09eaba113b878';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'; 

// Pool de películas icónicas ampliado con sagas de Marvel, DC, Depredador y más blockbusters mundiales
// Pool de películas icónicas ampliado con sagas de Marvel, DC, Depredador y más blockbusters mundiales
const POPULAR_MOVIES_POOL = [
  // --- CLÁSICOS Y EDAD DE ORO (AÑOS 1920 - 1950) ---
  "Metrópolis", "Nosferatu", "El chico", "Tiempos modernos", "Luces de la ciudad",
  "El gran dictador", "Sucedió una noche", "Lo que el viento se llevó", "El mago de Oz", "Casablanca",
  "Ciudadano Kane", "El halcón maltés", "Qué bello es vivir", "El tercer hombre", "Luz de gas",
  "Los mejores años de nuestra vida", "La soga", "El crepúsculo de los dioses", "Eva al desnudo", "Candelero",
  "Cantando bajo la lluvia", "Raíces profundas", "La ventana indestructible", "Los siete samuráis", "La ley del silencio",
  "Rebelde sin causa", "Centauros del desierto", "Con faldas y a lo loco", "Ben-Hur", "Los diez mandamientos",
  "Doce hombres sin piedad", "Senderos de gloria", "Vértigo", "Con la muerte en los talones", "El salario de la miedo",

  // --- REVOLUCIÓN COGNITIVA Y NUEVO CINE (AÑOS 1960) ---
  "Psicosis", "Espartaco", "El apartamento", "La dolce vita", "West Side Story",
  "Lawrence de Arabia", "Matar a un ruiseñor", "El mensajero del miedo", "Los pájaros", "Cleopatra",
  "¿Teléfono rojo? Volamos hacia Moscú", "Por un puñado de dólares", "Mary Poppins", "Sonrisas y lágrimas", "Doctor Zhivago",
  "El bueno, el feo y el malo", "Fahrenheit 451", "Al calor de la noche", "El graduado", "El libro de la selva",
  "2001: Una odisea del espacio", "La semilla del diablo", "El planeta de los simios", "Hasta que llegó su hora", "La noche de los muertos vivientes",
  "Grupo salvaje", "Dos hombres y un destino", "Easy Rider", "Z", "Oliver",

  // --- LA DÉCADA DE LOS PROTAGONISTAS Y BLOCKBUSTERS (AÑOS 1970) ---
  "La naranja mecánica", "The French Connection", "Harry el sucio", "El padrino", "Cabaret",
  "El padrino: Parte II", "Golpe en la pequeña China", "El golpe", "El exorcista", "Amarcord",
  "Chinatown", "La conversación", "Alguien voló sobre el nido del cuco", "Tiburón", "Tarde de perros",
  "Taxi Driver", "Rocky", "Todos los hombres del presidente", "Network", "La profecía",
  "Star Wars", "Encuentros en la tercera fase", "Annie Hall", "Fiebre del sábado noche", "Suspiria",
  "El cazador", "Superman", "Grease", "Halloween", "El amanecer de los muertos",
  "Apocalypse Now", "Alien, el octavo pasajero", "La vida de Brian", "Kramer contra Kramer", "Mad Max", "Superman: La película",

  // --- LA ERA DE LA NOSTALGIA, EFECTOS VISUALES Y ACCIÓN (AÑOS 1980) ---
  "El resplandor", "Star Wars: El imperio contraataca", "Toro salvaje", "Aterriza como puedas", "Viernes 13",
  "En busca del arca perdida", "Blade Runner", "E.T. el extraterrestre", "La cosa", "Conan el bárbaro",
  "El precio del poder", "Star Wars: El retorno del Jedi", "Videodrome", "Terminator", "Amadeus",
  "Los cazafantasmas", "Gremlins", "Pesadilla en Elm Street", "Regreso al futuro", "El club de los cinco",
  "Los Goonies", "Mad Max 2", "Platoon", "Aliens: El regreso", "Dentro del laberinto",
  "La chaqueta metálica", "Depredador", "Predator 2", "La princesa prometida", "Wall Street", "RoboCop",
  "Jungla de cristal", "Mi vecino Totoro", "Akira", "Cinema Paradiso", "Beetlejuice",
  "Batman", "Indiana Jones y la última cruzada", "El club de los poetas muertos", "Desafío total", "Uno de los nuestros",
  "2010: Odisea dos", "Dirty Dancing", "Scarface", "Karate Kid",

  // --- LA DÉCADA DE ORO INDIE Y DIGITAL (AÑOS 1990) ---
  "Eduardo Manostijeras", "El silencio de los corderos", "Terminator 2: El juicio final", "Thelma & Louise", "La bella y la bestia",
  "Sin perdón", "Reservoir Dogs", "Instinto básico", "Drácula de Bram Stoker", "Aladdín",
  "Parque Jurásico", "La lista de Schindler", "Atrapado en el tiempo", "Pesadilla antes de Navidad", "El fugitivo",
  "Pulp Fiction", "Cadena perpetua", "Forrest Gump", "El rey león", "Seven", "Batman Vuelve", "Batman Forever",
  "Toy Story", "Braveheart", "Sospechosos habituales", "Heat", "12 monos", "Blade",
  "Fargo", "Trainspotting", "Scream", "Independence Day", "La roca",
  "Titanic", "El indomable Will Hunting", "L.A. Confidential", "Men in Black", "Starship Troopers",
  "El gran Lebowski", "Salvar al soldado Ryan", "The Truman Show", "American History X", "La delgada línea roja",
  "Matrix", "El club de la lucha", "American Beauty", "El sexto sentido", "Magnolia",
  "Misión: Imposible", "Misión: Imposible 2", "El padrino: Parte III", "Jumanji", "Abierto hasta el amanecer", "Men in Black II", "Seven",

  // --- EL NUEVO MILENIO, SAGAS Y DC/MARVEL INICIALES (AÑOS 2000) ---
  "Gladiator", "Memento", "Amores perros", "Snatch: Cerdos y diamonds", "Requiem por un sueño", "X-Men",
  "El viaje de Chihiro", "El Señor de los Anillos: La Comunidad del Anillo", "Una mente maravillosa", "Shrek", "Monstruos, S.A.",
  "El Señor de los Anillos: Las dos torres", "Ciudad de Dios", "Spider-Man", "El pianista", "Minority Report", "Spider-Man 2",
  "El Señor de los Anillos: El retorno del rey", "Kill Bill: Volumen 1", "Piratas del Caribe: La maldición de la Perla Negra", "Buscando a Nemo", "Big Fish",
  "Million Dollar Baby", "Olvídate de mí", "Los Increíbles", "El fuego de la venganza", "Saw", "Hellboy",
  "Batman Begins", "Brokeback Mountain", "Sin City", "V de Vendetta", "Constantine", "Los Cuatro Fantásticos",
  "Infiltrados", "El laberinto del fauno", "Hijos de los hombres", "El truco final", "Casino Royale", "Superman Returns",
  "No es país para viejos", "Pozos de ambición", "Zodiac", "Spider-Man 3", "Transformers",
  "El caballero oscuro", "WALL-E", "Iron Man", "Slumdog Millionaire", "Gran Torino", "El increíble Hulk", "Watchmen",
  "Avatar", "Malditos bastardos", "District 9", "Up", "En tierra hostil", "X-Men orígenes: Lobezno",
  "Harry Potter y la piedra filosofal", "Harry Potter y la cámara secreta", "Harry Potter y el prisionero de Azkaban", 
  "Harry Potter y el cáliz de fuego", "Harry Potter y la Orden del Fénix", "Harry Potter y el misterio del príncipe",
  "A todo gas", "A todo gas 2", "A todo gas: Tokyo Race", "Fast & Furious: Aún más rápido",
  "Misión: Imposible 3", "Kill Bill: Volumen 2", "Troya", "Inception", "Soy Leyenda", "Superbad",

  // --- REVOLUCIÓN DE MARVEL, DC Y EL STREAMING (AÑOS 2010) ---
  "Origen", "La red social", "Cisne negro", "Toy Story 3", "Shutter Island", "Iron Man 2", "Thor", "Capitán América: El primer vengador",
  "Drive", "Intocable", "Harry Potter y las reliquias de la muerte: Parte 1", "Harry Potter y las reliquias de la muerte: Parte 2", "Los vengadores", "The Dark Knight Rises", "The Amazing Spider-Man",
  "Django desencadenado", "Skyfall", "Iron Man 3", "Thor: El mundo oscuro", "El hombre de acero", "The Wolverine",
  "Gravity", "El lobo de Wall Street", "Prisioneros", "Her", "Frozen", "Capitán América: El Soldado de Invierno", "Guardianes de la Galaxia",
  "Interstellar", "Whiplash", "Birdman", "Perdida", "Vengadores: Era de Ultrón", "Ant-Man", "Batman v Superman: El amanecer de la justicia", "Escuadrón Suicida",
  "Mad Max: Furia en la carretera", "Del revés", "El renacido", "Sicario", "The Martian", "Capitán América: Civil War", "Doctor Strange", "X-Men: Apocalipsis",
  "La ciudad de las estrellas: La La Land", "Arrival", "Zootrópolis", "Guardianes de la Galaxia Vol. 2", "Spider-Man: Homecoming", "Thor: Ragnarok", "Liga de la Justicia", "Wonder Woman",
  "Blade Runner 2049", "Déjame salir", "Coco", "Logan", "Dunkerque", "Black Panther", "Vengadores: Infinity War", "Ant-Man y la Avispa", "Aquaman",
  "Spider-Man: Un nuevo universo", "Bohemian Rhapsody", "Un lugar tranquilo", "Hereditary", "Capitana Marvel", "Vengadores: Endgame", "Spider-Man: Lejos de casa", "Joker",
  "Parásitos", "1917", "Érase una vez en Hollywood", "Shazam!", "Aves de presa",
  "Fast & Furious 5", "Fast & Furious 6", "Fast & Furious 7", "Fast & Furious 8", "Fast & Furious: Hobbs & Shaw",
  "Misión: Imposible - Protocolo Fantasma", "Misión: Imposible - Nación Secreta", "Misión: Imposible - Fallout",
  "Los odiosos ocho", "Deadpool", "Logan", "Kingsman: Servicio secreto",

  // --- DÉCADA ACTUAL (AÑOS 2020 - 2026) ---
  "Tenet", "Druk: Otra ronda", "Mank", "Soul", "Viuda Negra", "Shang-Chi y la leyenda de los Diez Anillos", "Eternals", "El Escuadrón Suicida",
  "Dune", "Spider-Man: No Way Home", "El poder del perro", "Drive My Car", "No mires arriba", "The Batman", "Doctor Strange en el multiverso de la locura", "Thor: Love and Thunder", "Black Panther: Wakanda Forever", "Black Adam",
  "Todo a la vez en todas partes", "Top Gun: Maverick", "Sin novedad en el frente", "Avatar: El sentido del agua", "Ant-Man y la Avispa: Quantumania", "Guardianes de la Galaxia Vol. 3", "The Marvels", "Flash", "Aquaman y el reino perdido",
  "Oppenheimer", "Barbie", "Los asesinos de la luna", "Pobres criaturas", "La sociedad de la nieve", "Deadpool y Lobezno", "Alien: Romulus", "Joker: Folie à Deux",
  "Dune: Parte dos", "Del revés 2", "Furiosa: de la saga Mad Max", "Gladiator II", "Mickey 17", "Superman: Legacy", "The Batman: Parte II", "Nosferatu de Eggers", "The Fantastic Four: First Steps",
  "Fast & Furious 9", "Fast & Furious X", "Misión: Imposible - Sentencia Mortal Parte 1", "Misión: Imposible 8"
];

const x = POPULAR_MOVIES_POOL.map(function (a) {
    console.log(a.IMAGE_BASE_URL);
});
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

  if (!currentUser) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-950 border border-red-900 p-8 rounded-3xl text-center text-white font-mono shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 shadow-[0_0_15px_#dc2626]"></div>
        <span className="text-6xl block mt-4 animate-bounce">⚠️</span>
        <h2 className="text-2xl font-black text-red-500 mt-5 tracking-widest uppercase">Acceso Denegado</h2>
        <div className="bg-red-950/20 border border-red-900/60 p-6 rounded-2xl my-6 text-left">
          <p className="text-xs text-red-400 uppercase tracking-widest font-black mb-2">Protocolo de seguridad HAL-9000:</p>
          <p className="text-sm text-gray-300 font-sans leading-relaxed">
            Este simulador de trivia almacena registros globales de rendimiento. Para poder sincronizar tu puntuación con los leaderboards de la plataforma, es estrictamente obligatorio disponer de una cuenta de usuario activa.
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
            // El año solo se muestra al ganar, o si se ha fallado definitivamente de forma irreversible
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
                {/* Imagen del póster */}
                <div className="w-16 sm:w-20 lg:w-full aspect-[2/3] bg-black rounded-xl overflow-hidden shrink-0 shadow-md">
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover pointer-events-none" />
                </div>

                {/* Texto e Información */}
                <div className="flex-1 flex flex-col justify-center lg:text-center w-full min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-100 font-sans truncate lg:whitespace-normal lg:line-clamp-2">
                    {movie.title}
                  </h4>
                  
                  {/* Revelado condicionado */}
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

                {/* BOTONES AUXILIARES (Móviles) */}
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

        {/* --- CONTROLES Y FEEDBACK --- */}
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