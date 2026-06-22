import React, { useState } from 'react';

export default function NavbarTabs({ activeTab, onTabChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'feed', label: 'Biblioteca' },
    { id: 'rankings', label: 'Tops' },
    { id: 'leaderboard', label: 'Ranking de Críticos' },
    { id: 'upcoming', label: 'Próximos Estrenos' },
    { id: 'trailers', label: 'Próximos Trailers' },
    { id: 'suggestions', label: 'Sugerencias' },
    { id: 'news', label: 'Noticias' },
  ];

  // Buscamos la pestaña que está activa para pintar su nombre en el botón móvil
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

  const handleMobileSelect = (id) => {
    onTabChange(id);
    setIsOpen(false); // Cierra el menú al hacer clic en una opción
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-4 relative">
      
      {/* VISTA MÓVIL: Menú Desplegable (se muestra solo en pantallas pequeñas) */}
      <div className="sm:hidden relative w-full z-30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 hover:bg-gray-100 transition-all shadow-sm active:scale-[0.99]"
        >
          <span>Sección: {currentTab.label}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2.5} 
            stroke="currentColor" 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isOpen && (
          <>
            {/* Fondo transparente para detectar clics fuera del menú y cerrarlo */}
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)}></div>
            
            {/* Opciones del menú flotante */}
            <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-40 py-1.5 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleMobileSelect(tab.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors flex items-center justify-between ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="text-blue-600 text-xs">●</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* VISTA ESCRITORIO: Pestañas horizontales (se oculta en móviles con 'hidden sm:flex') */}
      <div className="hidden sm:flex gap-6 border-b border-gray-200 overflow-x-auto scrollbar-none pb-0.5">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)} 
            className={`pb-2 font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

    </div>
  );
}