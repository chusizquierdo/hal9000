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
  { id: 63, name: "Filmin", img: filminLogo },
  { id: 350, name: "Apple TV+", img: appleLogo },
];

const GENRES = [
  { id: 28, name: "Acción" }, { id: 12, name: "Aventura" }, { id: 16, name: "Animación" },
  { id: 35, name: "Comedia" }, { id: 80, name: "Crimen" }, { id: 99, name: "Documental" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Familia" }, { id: 14, name: "Fantasía" },
  { id: 36, name: "Historia" }, { id: 27, name: "Terror" }, { id: 10402, name: "Música" },
  { id: 9648, name: "Misterio" }, { id: 10749, name: "Romance" }, { id: 878, name: "Ciencia ficción" },
  { id: 10770, name: "Película de TV" }, { id: 53, name: "Suspense" }, { id: 10752, name: "Bélica" },
  { id: 37, name: "Western" }
];

export default function SuggestionsPage({ onViewMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  // Estados de control de volumen de páginas
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Filtros de la aplicación
  const [filters, setFilters] = useState({ 
    genre: '', year: '', personId: '', personQuery: '', providers: [], minRating: '6' 
  });

  const updateFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1); 
  };

  const fetchMovies = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=8005d659cd2756fbe0a09eaba113b878&language=es-ES&sort_by=popularity.desc&vote_count.gte=50&primary_release_date.lte=${today}&watch_region=ES&with_watch_monetization_types=flatrate|rent|buy|free|ads&page=${page}`;
    
    url += `&vote_average.gte=${filters.minRating || 6}`;

    if (filters.genre) url += `&with_genres=${filters.genre}`;
    if (filters.year) url += `&primary_release_year=${filters.year}`;
    if (filters.personId) url += `&with_people=${filters.personId}`;
    if (filters.providers.length > 0) url += `&with_watch_providers=${filters.providers.join('|')}`;

    try {
      console.log("Petición activa a TMDB:", url);
      const res = await fetch(url);
      const data = await res.json();
      
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || 0);

      const filteredResults = (data.results || []).filter(m => (m.release_date || '9999-12-31') <= today);
      setMovies(filteredResults.sort(() => Math.random() - 0.5));
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

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
      
      {/* PANEL DE FILTROS TRADICIONAL */}
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select 
            value={filters.genre} 
            onChange={(e) => updateFilter({...filters, genre: e.target.value})} 
            className="p-2 border rounded-xl bg-gray-50 outline-none w-full text-sm"
          >
            <option value="">Todos los géneros</option>
            {GENRES.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          
          <input 
            type="number" 
            placeholder="Año (ej: 2020)" 
            value={filters.year} 
            onChange={(e) => updateFilter({...filters, year: e.target.value})} 
            className="p-2 border rounded-xl bg-gray-50 outline-none w-full text-sm" 
          />

          <input 
            type="number" 
            step="0.1" 
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
        <button 
          disabled={page === 1} 
          onClick={() => setPage(prev => Math.max(1, prev - 1))} 
          className="px-6 py-2 bg-gray-100 rounded-xl font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors"
        >
          Anterior
        </button>
        
        <span className="font-bold self-center text-gray-600 text-sm">
          Página {page} de {totalPages} ({totalResults} películas encontradas)
        </span>
        
        <button 
          disabled={page >= totalPages} 
          onClick={() => setPage(prev => prev + 1)} 
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}