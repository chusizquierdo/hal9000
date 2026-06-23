import React, { useState, useEffect } from 'react';
import { ALL_QUIZ_QUESTIONS } from './quizData';
import { supabase } from "../supabaseClient";

// Tu API Key de TMDb activa para las fotos reales de Hollywood tanto en local como en producción
const TMDB_API_KEY = '8005d659cd2756fbe0a09eaba113b878';

// MODIFICACIÓN: Límite de tiempo optimizado a 10 segundos por pregunta
const TIME_LIMIT_PER_QUESTION = 15;

const generateRandomQuizSet = () => {
  return [...ALL_QUIZ_QUESTIONS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);
};

export default function QuizGame({ onBack }) {
  const [questions, setQuestions] = useState(() => generateRandomQuizSet());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  
  // INTEGRACIÓN DE TIEMPO: Estado para controlar los segundos restantes
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_PER_QUESTION);

  // Estados para la gestión de seguridad de usuarios
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Estados para la gestión dinámica de la imagen real de la película
  const currentQuestion = questions[currentQuestionIndex];
  const defaultFallback = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';
  const [movieImage, setMovieImage] = useState(defaultFallback);

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

  // INTEGRACIÓN DE TIEMPO: Efecto de cuenta regresiva por segundo
  useEffect(() => {
    if (isAnswered || gameFinished || !currentUser || checkingAuth) return;

    if (timeLeft === 0) {
      setIsAnswered(true);
      setSelectedOption(null); // Registrar que no hubo respuesta a tiempo
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isAnswered, gameFinished, currentUser, checkingAuth]);

  // Búsqueda inteligente por título en la API de cine
  useEffect(() => {
    if (checkingAuth || !currentUser || !currentQuestion) return;

    setMovieImage(defaultFallback);

    if (!TMDB_API_KEY) return;

    const query = encodeURIComponent(currentQuestion.tituloPelicula);
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=es-ES`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const movie = data.results[0];
          if (movie.backdrop_path) {
            setMovieImage(`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`);
          } 
          else if (movie.poster_path) {
            setMovieImage(`https://image.tmdb.org/t/p/w780${movie.poster_path}`);
          }
        }
      })
      .catch(err => console.error("Error al consultar TMDb API:", err));
  }, [currentQuestionIndex, currentQuestion, currentUser, checkingAuth]);

  // Efecto para guardar automáticamente la puntuación en Supabase al terminar el juego
  useEffect(() => {
    if (gameFinished && currentUser) {
      saveQuizScore();
    }
  }, [gameFinished]);

  const saveQuizScore = async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('quiz_score')
        .eq('id', currentUser.id)
        .single();

      if (profileError) throw profileError;

      const currentHighScore = profile?.quiz_score || 0;

      if (score > currentHighScore) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ quiz_score: score })
          .eq('id', currentUser.id);

        if (updateError) throw updateError;
        console.log("¡Récord cinematográfico actualizado con éxito en Supabase!");
      }
    } catch (err) {
      console.error("Error al guardar la puntuación en la tabla profiles:", err);
    }
  };

  const handleOptionClick = (optionId) => {
    if (isAnswered || !currentQuestion) return;
    
    setSelectedOption(optionId);
    setIsAnswered(true);

    if (optionId === currentQuestion.respuestaCorrecta) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(TIME_LIMIT_PER_QUESTION);
    
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameFinished(true);
    }
  };

  const restartGame = () => {
    const newQuestions = generateRandomQuizSet();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
    setTimeLeft(TIME_LIMIT_PER_QUESTION);
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
            Este simulador de trivia almacena registros globales de rendimiento. Para poder calibrar tus respuestas y sincronizar tu puntuación con los leaderboards de la plataforma, es estrictamente obligatorio disponer de una cuenta de usuario activa.
          </p>
        </div>
        <button onClick={onBack} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          ⬅ Volver al Panel Central
        </button>
      </div>
    );
  }

  if (gameFinished || !currentQuestion) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gray-950 border border-gray-800 p-8 rounded-3xl text-center text-white font-mono shadow-2xl">
        <span className="text-6xl">🏆</span>
        <h2 className="text-3xl font-black text-red-500 mt-5 tracking-widest uppercase">Análisis Terminado</h2>
        <p className="text-gray-400 mt-3 text-sm">HAL-9000 ha evaluado tus conocimientos cinéfilos.</p>
        
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl my-8">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Puntuación Final</p>
          <p className="text-5xl font-black text-white mt-2">{score} / {questions.length}</p>
          <p className="text-sm text-red-400 mt-4 italic font-sans px-4">
            {score === questions.length ? "Perfecto. Tu cerebro es tan eficiente como mis circuitos. No detecto errores en tu base de datos." : "Análisis completado. Tu rendimiento es acceptable, pero tus archivos sobre historia del cine requieren una actualización urgente."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={restartGame} className="w-full bg-red-950 border border-red-800 hover:bg-red-900 text-white p-4 rounded-xl font-bold transition-colors uppercase tracking-wider text-xs">
            Reiniciar Test (Nuevas Preguntas)
          </button>
          <button onClick={onBack} className="w-full bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 text-gray-400 p-4 rounded-xl font-bold transition-colors uppercase tracking-wider text-xs">
            Salir al Panel Central
          </button>
        </div>
      </div>
    );
  }

  const timePercentage = (timeLeft / TIME_LIMIT_PER_QUESTION) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-950 border border-gray-800 rounded-3xl text-white font-mono shadow-2xl overflow-hidden">
      
      {/* Cabecera - Barra de Estado */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/40 relative">
        <div className="flex items-center gap-2.5">
          <div className={`w-3 h-3 rounded-full border-2 shadow-lg ${
            timeLeft <= 3 
              ? 'bg-red-600 animate-ping border-red-900 shadow-red-600' 
              : 'bg-red-600 animate-pulse border-2 border-red-900 shadow-[0_0_10px_#dc2626]'
          }`}></div>
          <span className="text-xs font-black tracking-widest text-gray-300 uppercase">HAL-9000 TRIVIA SYSTEM V.2</span>
        </div>
        
        {/* Marcador numérico de tiempo */}
        <div className="flex items-center gap-4">
          <span className={`text-xs font-black px-2.5 py-1 rounded-md border ${
            timeLeft <= 3 
              ? 'bg-red-950/80 text-red-400 border-red-800 animate-pulse' 
              : 'bg-gray-900 text-gray-400 border-gray-800'
          }`}>
            ⏰ {timeLeft}s
          </span>
          <span className="text-xs bg-gray-800 px-3 py-1 rounded-full font-bold border border-gray-700">Pregunta: {currentQuestionIndex + 1}/{questions.length}</span>
        </div>

        {/* Barra de progreso dinámica superior */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-gray-800 w-full">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft <= 3 ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' : 'bg-blue-500'
            }`}
            style={{ width: `${timePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Visor Multimedia */}
      <div className="relative min-h-[300px] max-h-[60vh] h-auto bg-black flex items-center justify-center overflow-hidden border-b border-gray-800">
        <img 
          src={movieImage} 
          alt={currentQuestion.tituloPelicula} 
          className={`w-full h-full object-contain transition-all duration-1000 select-none ${
            isAnswered ? 'blur-none' : 'blur-3xl opacity-40'
          }`} 
        />
        
        {/* Superposición de HAL-9000 cuando está bloqueada */}
        {!isAnswered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/70 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              {/* Ojo de HAL */}
              <div className="w-20 h-20 rounded-full bg-black border-4 border-gray-700 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-gray-800 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-red-600 shadow-[0_0_15px_#dc2626] animate-pulse"></div>
                </div>
              </div>
            </div>
            <span className="text-xs text-red-500 font-black uppercase tracking-widest mt-4">
              Pista Visual Codificada
            </span>
            <span className="text-[10px] text-gray-600 font-sans mt-1">Esperando respuesta del usuario...</span>
          </div>
        )}
        
        {/* Indicador de audio activado */}
        {currentQuestion.youtubeId && isAnswered && (
          <div className="absolute top-3 right-3 bg-red-950/90 border border-red-700 px-3 py-1 rounded-full text-[10px] text-red-200 font-bold uppercase tracking-tight shadow-lg animate-fade-in">
            🔊 Transmisión de Audio Activa
          </div>
        )}
      </div>

      {/* Cuerpo del Cuestionario */}
      <div className="p-6 sm:p-8">
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
          <h3 className="text-sm sm:text-base font-bold leading-relaxed tracking-tight text-gray-100 font-sans min-h-[50px]">
            {currentQuestion.pregunta}
          </h3>
        </div>

        {/* Listado de Opciones de Respuesta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {currentQuestion.opciones.map((opcion) => {
            const isCorrect = opcion.id === currentQuestion.respuestaCorrecta;
            const isSelected = opcion.id === selectedOption;
            
            let buttonStyle = "bg-gray-900 border-gray-800 hover:border-red-600 hover:bg-gray-800 text-gray-300";
            if (isAnswered) {
              if (isCorrect) buttonStyle = "bg-emerald-950 border-emerald-500 text-emerald-100 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]";
              else if (isSelected) buttonStyle = "bg-red-950/60 border-red-600 text-red-200 line-through opacity-70";
              else buttonStyle = "bg-gray-900/30 border-gray-900 text-gray-700 opacity-40";
            }

            return (
              <button
                key={opcion.id}
                disabled={isAnswered}
                onClick={() => handleOptionClick(opcion.id)}
                className={`w-full text-left p-5 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-center gap-4 group ${buttonStyle}`}
              >
                {/* Letra de la opción */}
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black border text-xs uppercase shadow-inner transition-colors ${
                  isAnswered && isCorrect ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-500 group-hover:border-red-500 group-hover:text-red-400'
                }`}>
                  {opcion.id}
                </span>
                {/* Texto de la opción */}
                <span className="flex-1 font-medium">{opcion.texto}</span>
                {/* Icono de estado al responder */}
                {isAnswered && isCorrect && <span className="text-lg">✅</span>}
                {isAnswered && isSelected && !isCorrect && <span className="text-lg">❌</span>}
              </button>
            );
          })}
        </div>

        {/* Panel de Feedback y Curiosidades Cinéfilas */}
        {isAnswered && (
          <div className="mt-8 p-6 bg-gray-900 border-2 border-gray-800 rounded-3xl animate-fade-in shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                selectedOption === null 
                  ? 'bg-amber-500' 
                  : selectedOption === currentQuestion.respuestaCorrecta 
                  ? 'bg-emerald-500' 
                  : 'bg-red-600'
              }`}></div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-300">
                {selectedOption === null 
                  ? "⚠️ Tiempo Agotado - Desconexión de Emergencia"
                  : selectedOption === currentQuestion.respuestaCorrecta 
                  ? "🟢 Acceso Concedido - Base de Datos Actualizada" 
                  : "🔴 Error de Sistema - Desviación Detectada"}
              </p>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-200 mt-4 leading-relaxed font-sans bg-gray-950 p-4 rounded-xl border border-gray-800">
              {currentQuestion.curiosidad}
            </p>
            
            <button 
              onClick={handleNext}
              className="mt-6 w-full bg-white text-gray-950 p-3.5 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-colors uppercase tracking-widest shadow-md"
            >
              {currentQuestionIndex + 1 === questions.length ? "Finalizar Análisis y Ver Resultados" : "Siguiente Archivo de Transmisión ➔"}
            </button>
          </div>
        )}
      </div>
      
      {/* Estilos para animaciones */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}} />
    </div>
  );
}