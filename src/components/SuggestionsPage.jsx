import { useEffect, useState } from 'react';
import * as Sentry from "@sentry/react";

import netflixLogo from '../assets/netflix.jpg';
import disneyLogo from '../assets/disney.svg';
import primeLogo from '../assets/prime.jpg';
import hboLogo from '../assets/hbo.png';
import skyLogo from '../assets/sky.png';
import filminLogo from '../assets/filmin.jpg';
import appleLogo from '../assets/apple.jpg';

const PROVIDERS = [
  { id: 8, name: "Netflix", img: netflixLogo },
  { id: 337, name: "Disney+", img: disneyLogo },
  { id: 119, name: "Prime Video", img: primeLogo },
  { id: 1899, name: "HBO Max", img: hboLogo },
  { id: 1773, name: "SkyShowtime", img: skyLogo },
  { id: 11, name: "Filmin", img: filminLogo },
  { id: 350, name: "Apple TV+", img: appleLogo },
];

export default function SuggestionsPage({ onViewMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  // He añadido 'minRating' al estado inicial de los filtros (por defecto 6)
  const [filters, setFilters] = useState({ 
    genre: '', year: '', personId: '', personQuery: '', providers: [], minRating: '6' 
  });

  // Función unificada para actualizar filtros y resetear a página 1
  const updateFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Imprescindible: Al cambiar cualquier filtro, volvemos a la página 1
  };

  const toggleProvider = (id) => {
    const newProviders = filters.providers.includes(id)
      ? filters.providers.filter(p => p !== id)
      : [...prev.providers, id];
    updateFilter({ ...filters, providers: newProviders });
  };

  const fetchMovies = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    // Construcción de la URL con el parámetro de nota mínima (minRating)
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&sort_by=popularity.desc&vote_count.gte=250&primary_release_date.lte=${today}&watch_region=ES&with_watch_monetization_types=flatrate&page=${page}`;
    
    // Añadimos el filtro de nota mínima (por defecto 6, o lo que el usuario elija)
    url += `&vote_average.gte=${filters.minRating || 6}`;

    if (filters.genre) url += `&with_genres=${filters.genre}`;
    if (filters.year) url += `&primary_release_year=${filters.year}`;
    if (filters.personId) url += `&with_people=${filters.personId}`;
    if (filters.providers.length > 0) url += `&with_watch_providers=${filters.providers.join('|')}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const filteredResults = (data.results || []).filter(m => (m.release_date || '9999-12-31') <= today);
      
      // Mantenemos el shuffle para la aleatoriedad visual
      setMovies(filteredResults.sort(() => Math.random() - 0.5));
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  // El useEffect se dispara cuando cambia la página o CUALQUIER filtro
  useEffect(() => { 
    fetchMovies(); 
  }, [page, filters.genre, filters.year, filters.personId, filters.providers, filters.minRating]);

  const handlePersonSearch = async () => {
    if (!filters.personQuery) {
      updateFilter({ ...filters, personId: '' });
      return;
    }
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=8005d659cd2756fbe0a09eaba113b878&query=${encodeURIComponent(filters.personQuery)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        updateFilter({ ...filters, personId: data.results[0].id });
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  return (
    <div className="space-y-6 pb-12 px-4">
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-black text-gray-400 uppercase w-full mb-1">Mis plataformas:</span>
          {PROVIDERS.map(p => (
            <button
              key={p.id}
              onClick={() => {
                const newProviders = filters.providers.includes(p.id) 
                  ? filters.providers.filter(id => id !== p.id) 
                  : [...filters.providers, p.id];
                updateFilter({...filters, providers: newProviders});
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                filters.providers.includes(p.id) ? 'bg-blue-600 border-blue-700 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <img src={p.img} alt={p.name} className="w-4 h-4 object-contain" />
              {p.name}
            </button>
          ))}
        </div>

        {/* Fila de filtros modificada para incluir la Nota Media */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select 
            value={filters.genre} 
            onChange={(e) => updateFilter({...filters, genre: e.target.value})} 
            className="p-2 border rounded-xl bg-gray-50 outline-none w-full text-sm"
          >
            <option value="">Todos los géneros</option>
            <option value="28">Acción</option><option value="35">Comedia</option><option value="18">Drama</option>
            {/* Puedes añadir más opciones aquí */}
          </select>
          
          <input 
            type="number" 
            placeholder="Año (ej: 2020)" 
            value={filters.year} 
            onChange={(e) => updateFilter({...filters, year: e.target.value})} 
            className="p-2 border rounded-xl bg-gray-50 outline-none w-full text-sm" 
          />

          {/* NUEVO FILTRO DE NOTA MÍNIMA */}
          <input 
            type="number" 
            step="0.1" // Permite decimales (ej: 6.5)
            min="0" 
            max="10" 
            placeholder="Nota mín (ej: 7.5)" 
            value={filters.minRating} 
            onChange={(e) => updateFilter({...filters, minRating: e.target.value})} 
            className="p-2 border rounded-xl bg-gray-50 outline-none w-full text-sm" 
          />
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Actor/Director" 
              value={filters.personQuery} 
              onChange={(e) => setFilters(p => ({...p, personQuery: e.target.value}))} 
              onKeyDown={(e) => e.key === 'Enter' && handlePersonSearch()} 
              className="p-2 border rounded-xl bg-gray-50 outline-none w-full text-sm" 
            />
            <button 
              onClick={() => updateFilter({ genre: '', year: '', personId: '', personQuery: '', providers: [], minRating: '6' })} 
              className="px-4 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              X
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400 animate-pulse">Buscando recomendaciones...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map(m => (
            <div key={m.id} onClick={() => onViewMovie(m.id)} className="cursor-pointer bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 relative group">
              {m.vote_average && (
                <div className="absolute top-2 right-2 z-10 bg-black/75 text-white px-2 py-0.5 rounded-lg text-xs font-black flex items-center gap-1 backdrop-blur-sm shadow-sm border border-white/10">
                  <span>⭐</span>
                  <span>{m.vote_average.toFixed(1)}</span>
                </div>
              )}
              <img src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/500x750?text=Sin+Imagen'} alt={m.title} className="w-full aspect-[2/3] object-cover" />
              <div className="p-3 bg-white">
                <h3 className="font-bold text-sm truncate text-gray-900 group-hover:text-blue-600 transition-colors">{m.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        <button disabled={page === 1} onClick={() => setPage(prev => Math.max(1, prev - 1))} className="px-6 py-2 bg-gray-100 rounded-xl font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors">Anterior</button>
        <span className="font-bold self-center text-gray-600">Página {page}</span>
        <button onClick={() => setPage(prev => prev + 1)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Siguiente</button>
      </div>
    </div>
  );
}