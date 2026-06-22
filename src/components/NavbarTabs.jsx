import React from 'react';

export default function NavbarTabs({ activeTab, onTabChange }) {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-4">
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto scrollbar-none">
        <button 
          onClick={() => onTabChange('feed')} 
          className={`pb-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'feed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Biblioteca
        </button>
        <button 
          onClick={() => onTabChange('rankings')} 
          className={`pb-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'rankings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tops
        </button>
        <button 
          onClick={() => onTabChange('leaderboard')} 
          className={`pb-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'leaderboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Ranking de Críticos
        </button>
        <button 
          onClick={() => onTabChange('upcoming')} 
          className={`pb-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Próximos Estrenos
        </button>
        <button 
          onClick={() => onTabChange('trailers')} 
          className={`pb-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'trailers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Próximos Trailers
        </button>
        <button 
          onClick={() => onTabChange('suggestions')} 
          className={`pb-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'suggestions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Sugerencias
        </button>
        <button 
          onClick={() => onTabChange('news')} 
          className={`pb-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'news' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Noticias
        </button> 
      </div>
    </div>
  );
}