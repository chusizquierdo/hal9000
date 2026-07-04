import React, { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import { SOPA_MOVIES_POOL } from '../listados';

export default function SopaLetras({ user }) {
  // 1. Control de acceso
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-6 p-6 bg-white border border-gray-200 rounded-3xl shadow-sm text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-black text-gray-900">Acceso Restringido</h2>
        <p className="text-gray-500 mt-2 text-sm">Debes estar registrado para poder acceder a los juegos de la plataforma.</p>
      </div>
    );
  }

  // --- ESTADOS DE CONFIGURACIÓN Y JUEGO ---
  const [difficulty, setDifficulty] = useState(null); // null, 'easy', 'normal', 'hard'
  const [gridSize, setGridSize] = useState(15);
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selection, setSelection] = useState([]); // Objetos {r, c}
  const [failedSelection, setFailedSelection] = useState([]); // Para el flash rojo
  const [correctCells, setCorrectCells] = useState([]); // Strings "r-c"
  const [isSelecting, setIsSelecting] = useState(false);
  const [wordsToFind, setWordsToFind] = useState([]);
  const [startCell, setStartCell] = useState(null); // Guarda la celda de origen {r, c}

  // Historial para evitar repetir exactamente las mismas palabras consecutivamente
  const [previousWords, setPreviousWords] = useState([]);

  // --- ESTADOS DEL TIEMPO Y COMPLETADO ---
  const [startTime, setStartTime] = useState(null);
  const [finalTimeStr, setFinalTimeStr] = useState('');
  const [isGameFinished, setIsGameFinished] = useState(false);

  // --- INICIALIZAR O REINICIAR SEGÚN DIFICULTAD ---
  useEffect(() => {
    if (difficulty) {
      generateGame();
    }
  }, [difficulty]);

  // Mezclador Fisher-Yates uniforme
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateGame = () => {
    let size = 15;
    if (difficulty === 'easy') size = 12;
    if (difficulty === 'hard') size = 18;
    setGridSize(size);

    let newGrid = Array.from({ length: size }, () => Array(size).fill(''));
    
    const uniquePool = [...new Set(SOPA_MOVIES_POOL)];
    const filteredPool = uniquePool.filter(word => word.length <= size);
    let shuffledPool = shuffleArray(filteredPool);
    
    let candidateWords = shuffledPool.filter(word => !previousWords.includes(word));
    if (candidateWords.length < 10) {
      candidateWords = shuffledPool;
    }
    
    let selectedMovies = candidateWords.slice(0, 10);
    setPreviousWords(selectedMovies);

    selectedMovies.sort((a, b) => b.length - a.length);

    let placedWords = [];
    let diagonalPlaced = false;

    selectedMovies.forEach((word) => {
      const cleanWord = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 200) {
        let dir;
        
        if (!diagonalPlaced) {
          const diagDirs = difficulty === 'hard' ? [2, 5] : [2];
          dir = diagDirs[Math.floor(Math.random() * diagDirs.length)];
        } else {
          const maxDirs = difficulty === 'hard' ? 6 : 3;
          dir = Math.floor(Math.random() * maxDirs);
        }
        
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);

        if (canPlace(newGrid, cleanWord, r, c, dir, size)) {
          placeWord(newGrid, cleanWord, r, c, dir);
          placedWords.push(cleanWord);
          placed = true;
          
          if (dir === 2 || dir === 5) {
            diagonalPlaced = true;
          }
        }
        attempts++;
      }
    });

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setWordsToFind(shuffleArray(placedWords));
    setFoundWords([]);
    setCorrectCells([]);
    setSelection([]);
    setFailedSelection([]);
    setStartCell(null);
    setIsGameFinished(false);
    setStartTime(Date.now());
    setGrid(newGrid);
  };

  const getDirectionDeltas = (dir) => {
    switch (dir) {
      case 0: return { dr: 0, dc: 1 };
      case 1: return { dr: 1, dc: 0 };
      case 2: return { dr: 1, dc: 1 };
      case 3: return { dr: 0, dc: -1 };
      case 4: return { dr: -1, dc: 0 };
      case 5: return { dr: -1, dc: -1 };
      default: return { dr: 0, dc: 1 };
    }
  };

  const canPlace = (grid, word, r, c, dir, size) => {
    const { dr, dc } = getDirectionDeltas(dir);
    if (r + dr * (word.length - 1) < 0 || r + dr * (word.length - 1) >= size) return false;
    if (c + dc * (word.length - 1) < 0 || c + dc * (word.length - 1) >= size) return false;

    for (let i = 0; i < word.length; i++) {
      const targetR = r + dr * i;
      const targetC = c + dc * i;
      if (grid[targetR][targetC] !== '' && grid[targetR][targetC] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, r, c, dir) => {
    const { dr, dc } = getDirectionDeltas(dir);
    for (let i = 0; i < word.length; i++) {
      grid[r + dr * i][c + dc * i] = word[i];
    }
  };

  // --- GUARDAR RÉCORD ---
  const saveSopaRecord = async (totalSeconds) => {
    try {
      const columnMap = {
        easy: 'sopa_easy_time',
        normal: 'sopa_normal_time',
        hard: 'sopa_hard_time'
      };
      const recordColumn = columnMap[difficulty];

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select(recordColumn)
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentRecord = profile[recordColumn];

      if (currentRecord === null || totalSeconds < currentRecord) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ [recordColumn]: totalSeconds })
          .eq('id', user.id);

        if (updateError) throw updateError;
      }
    } catch (err) {
      console.error("Error al sincronizar el récord:", err);
    }
  };

  // --- INTERACCIÓN ---
  const handleStart = (r, c) => {
    if (isGameFinished) return;
    setIsSelecting(true);
    setFailedSelection([]);
    setStartCell({ r, c });
    setSelection([{ r, c }]);
  };

  const handleMove = (r, c) => {
    if (!isSelecting || isGameFinished || !startCell) return;

    const diffR = r - startCell.r;
    const diffC = c - startCell.c;
    const absR = Math.abs(diffR);
    const absC = Math.abs(diffC);

    if (diffR === 0 || diffC === 0 || absR === absC) {
      const stepR = diffR === 0 ? 0 : diffR / absR;
      const stepC = diffC === 0 ? 0 : diffC / absC;
      const steps = Math.max(absR, absC);
      const newSelection = [];

      for (let i = 0; i <= steps; i++) {
        newSelection.push({
          r: startCell.r + stepR * i,
          c: startCell.c + stepC * i
        });
      }
      setSelection(newSelection);
    }
  };

  const handleEnd = () => {
    if (!isSelecting || isGameFinished) return;
    setIsSelecting(false);
    setStartCell(null);

    if (selection.length === 0) return;

    const forwardWord = selection.map(s => grid[s.r][s.c]).join('');
    const backwardWord = [...selection].reverse().map(s => grid[s.r][s.c]).join('');
    
    let targetWord = null;
    if (wordsToFind.includes(forwardWord) && !foundWords.includes(forwardWord)) {
      targetWord = forwardWord;
    } else if (wordsToFind.includes(backwardWord) && !foundWords.includes(backwardWord)) {
      targetWord = backwardWord;
    }

    if (targetWord) {
      const updatedFound = [...foundWords, targetWord];
      setFoundWords(updatedFound);
      const cellsToMark = selection.map(s => `${s.r}-${s.c}`);
      setCorrectCells(prev => [...prev, ...cellsToMark]);
      setSelection([]);

      if (updatedFound.length === wordsToFind.length) {
        const totalTimeMs = Date.now() - startTime;
        const totalSeconds = Math.floor(totalTimeMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        const timeString = minutes > 0 
          ? `${minutes} ${minutes === 1 ? 'min' : 'mins'} y ${seconds} ${seconds === 1 ? 'seg' : 'segs'}`
          : `${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
          
        setFinalTimeStr(timeString);
        setIsGameFinished(true);
        saveSopaRecord(totalSeconds);
      }
    } else {
      setFailedSelection(selection);
      setSelection([]);
      setTimeout(() => setFailedSelection([]), 500);
    }
  };

  const handleTouchMove = (e) => {
    if (!isSelecting || isGameFinished) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset && element.dataset.r !== undefined && element.dataset.c !== undefined) {
      const r = parseInt(element.dataset.r, 10);
      const c = parseInt(element.dataset.c, 10);
      handleMove(r, c);
    }
  };

  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isSelecting) handleEnd();
    };
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isSelecting, selection, grid, wordsToFind, foundWords, isGameFinished]);

  // --- SELECCIÓN DE DIFICULTAD ---
  if (!difficulty) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-gray-200 rounded-3xl shadow-sm text-center">
        <div className="text-4xl mb-3">🔤</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Sopa de Letras</h2>
        <p className="text-gray-500 text-sm mb-6">Selecciona el nivel de dificultad para empezar a buscar tus películas favoritas.</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setDifficulty('easy')}
            className="w-full py-3.5 px-4 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 font-bold rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all active:scale-[0.99] shadow-sm"
          >
            🟢 Fácil (Matriz 12X12)
          </button>
          <button 
            onClick={() => setDifficulty('normal')}
            className="w-full py-3.5 px-4 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 font-bold rounded-2xl border border-gray-200 hover:border-blue-300 transition-all active:scale-[0.99] shadow-sm"
          >
            🔵 Normal (Matriz 15X15)
          </button>
          <button 
            onClick={() => setDifficulty('hard')}
            className="w-full py-3.5 px-4 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 text-gray-700 font-bold rounded-2xl border border-gray-200 hover:border-purple-300 transition-all active:scale-[0.99] shadow-sm"
          >
            🟣 Difícil (Matriz 18X18 + Inversas)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-md border border-gray-100 my-6 overflow-y-auto flex flex-col justify-between">
      
      {/* PANTALLA SUPERPUESTA DE ÉXITO AL COMPLETAR */}
      {isGameFinished && (
        <div className="mb-4 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl text-center shadow-inner animate-fade-in shrink-0">
          <h3 className="text-lg font-black text-emerald-900">¡Sopa de letras completada! 🎉</h3>
          <p className="text-xs text-emerald-700 mt-1 font-medium">
            Has encontrado las 10 películas en un tiempo de <span className="font-bold underline">{finalTimeStr}</span>.
          </p>
          <div className="mt-3 flex gap-3 justify-center">
            <button
              onClick={generateGame}
              className="px-4 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              🔄 Jugar otra vez
            </button>
            <button
              onClick={() => setDifficulty(null)}
              className="px-4 py-2 bg-white text-gray-700 font-black text-xs rounded-xl border border-gray-200 shadow-sm transition-all active:scale-95"
            >
              ⚙️ Menú Principal
            </button>
          </div>
        </div>
      )}

      {/* CABECERA CON NOMBRE DEL JUEGO Y CONTADOR DE PROGRESO */}
      <div className="flex items-center justify-between gap-4 mb-2 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">Sopa de Letras</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-bold tracking-wide uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Modo: {difficulty === 'easy' ? 'Fácil' : difficulty === 'normal' ? 'Normal' : 'Difícil'}
            </span>
            <span className="text-[10px] font-bold tracking-wide uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Progreso: {foundWords.length} / 10
            </span>
          </div>
        </div>
        {!isGameFinished && (
          <button
            onClick={() => setDifficulty(null)}
            className="text-[11px] font-extrabold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl transition-colors shadow-sm"
          >
            ⚙️ Salir
          </button>
        )}
      </div>

      {/* NOTA VISIBLE DE ADVERTENCIA SOBRE LAS DIAGONALES */}
      <div className="mb-3 p-2 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold rounded-xl flex items-center gap-2 shadow-sm shrink-0">
        <span>💡</span>
        <p className="leading-tight">
          <strong>¡Ojo!</strong> Las palabras también pueden esconderse en <strong>diagonal</strong>
          {difficulty === 'hard' ? ' y leerse de derecha a izquierda o al revés.' : ' (hacia adelante).'}
        </p>
      </div>

      {/* LISTA DE PALABRAS A ENCONTRAR - CORREGIDA SIN SCROLL HORIZONTAL */}
      <div className="mb-4 shrink-0 bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Películas a buscar:</p>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-2 whitespace-normal">
          {wordsToFind.map(w => (
            <div 
              key={w} 
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wide border flex items-center gap-1.5 transition-all truncate ${
                foundWords.includes(w) 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 line-through opacity-50' 
                  : 'bg-white border-gray-200 text-gray-700 shadow-sm'
              }`}
              title={w}
            >
              <span className={foundWords.includes(w) ? 'text-emerald-500' : 'text-gray-300'}>•</span>
              <span className="truncate">{w}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CUADRÍCULA RESPONSIVA MEJORADA (MÁS GRANDE EN MÓVILES) */}
      <div className="w-full flex justify-center items-center my-auto overflow-hidden grow">
        <div 
          className={`grid gap-0.5 sm:gap-1 select-none touch-none bg-gray-100 p-1.5 sm:p-2 rounded-2xl shadow-inner border border-gray-200/40 w-full aspect-square max-w-[100vw] sm:max-h-[58vh] sm:max-w-[58vh] ${isGameFinished ? 'opacity-60 pointer-events-none' : ''}`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          onTouchMove={handleTouchMove}
        >
          {grid.map((row, r) => row.map((char, c) => {
            const isSelected = selection.some(s => s.r === r && s.c === c);
            const isFailed = failedSelection.some(s => s.r === r && s.c === c);
            const isMarkedAsCorrect = correctCells.includes(`${r}-${c}`);

            return (
              <div
                key={`${r}-${c}`}
                className={`aspect-square flex items-center justify-center font-extrabold rounded-md sm:rounded-xl cursor-pointer text-[11px] xs:text-xs sm:text-sm md:text-base tracking-wide transition-all duration-150 select-none
                  ${isSelected 
                    ? 'bg-indigo-500 text-white shadow-md transform scale-105 z-10' 
                    : isFailed 
                    ? 'bg-rose-500 text-white animate-shake' 
                    : isMarkedAsCorrect 
                    ? 'bg-emerald-100 text-emerald-800 font-black shadow-sm border-transparent' 
                    : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200/40 hover:shadow-sm'
                  }
                `}
                onMouseDown={() => handleStart(r, c)}
                onMouseEnter={() => handleMove(r, c)}
                onTouchStart={() => handleStart(r, c)}
                data-r={r}
                data-c={c}
              >
                {char}
              </div>
            );
          }))}
        </div>
      </div>

    </div>
  );
}