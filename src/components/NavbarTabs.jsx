import React, { useState } from 'react';

export default function NavbarTabs({ activeTab, onTabChange }) {
  const [isOpen, setIsOpen] = useState(false); // Control del menú móvil general
  const [isMobileGamesOpen, setIsMobileGamesOpen] = useState(false); // Acordeón de juegos en móvil
  const [isDesktopGamesOpen, setIsDesktopGamesOpen] = useState(false); // Desplegable en escritorio

  const mainTabs = [
    { id: 'feed', label: 'Biblioteca' },
    { id: 'rankings', label: 'Tops' },
    { id: 'leaderboard', label: 'Ranking de Críticos' },
    { id: 'upcoming', label: 'Próximos Estrenos' },
    { id: 'trailers', label: 'Próximos Trailers' },
    { id: 'suggestions', label: 'Sugerencias' },
    { id: 'news', label: 'Noticias' },
  ];

  const gameTabs = [
    { id: 'quiz', label: 'Quiz' },
    { id: 'pixel', label: 'Pixelado' },
    { id: 'timeline', label: 'Cronología' }
  ];

  // Identificar qué texto mostrar en la cabecera del botón móvil
  let currentLabel = 'Biblioteca';
  const foundMain = mainTabs.find(t => t.id === activeTab);
  const foundGame = gameTabs.find(t => t.id === activeTab);
  if (foundMain) currentLabel = foundMain.label;
  if (foundGame) currentLabel = `Juegos: ${foundGame.label}`;
  if (activeTab === 'contact') currentLabel = 'Contactar Admin';

  // Saber si el usuario está dentro de alguna sección de juego
  const isGameActive = activeTab === 'quiz' || activeTab === 'pixel' || activeTab === 'timeline';

  return (
    <div className="max-w-7xl mx-auto px-4 mt-4 relative">
      
      {/* VISTA MÓVIL: Adaptada para control táctil */}
      <div className="sm:hidden relative w-full z-30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border-2 border-gray-900 rounded-xl px-4 py-3 font-black text-gray-900 hover:bg-gray-50 transition-all shadow-md active:scale-[0.99]"
        >
          <span>Sección: {currentLabel}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={3} 
            stroke="currentColor" 
            className={`w-4 h-4 text-gray-900 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)}></div>
            <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-gray-900 rounded-xl shadow-xl z-40 py-1.5 overflow-y-auto max-h-96">
              
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors flex items-center justify-between ${
                    activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <span className="text-blue-600 text-xs">●</span>}
                </button>
              ))}

              {/* Acordeón Desplegable de Juegos en Móvil */}
              <div className="border-t border-b border-gray-100 my-1">
                <button
                  onClick={() => setIsMobileGamesOpen(!isMobileGamesOpen)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors flex items-center justify-between ${
                    isGameActive ? 'text-blue-600 bg-blue-50/40' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">🎮 Juegos</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${isMobileGamesOpen || isGameActive ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                {(isMobileGamesOpen || isGameActive) && (
                  <div className="bg-gray-50/90 pl-4">
                    {gameTabs.map((subTab) => (
                      <button
                        key={subTab.id}
                        onClick={() => { onTabChange(subTab.id); setIsOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors flex items-center justify-between ${
                          activeTab === subTab.id ? 'text-blue-600 font-black' : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        <span>• {subTab.label}</span>
                        {activeTab === subTab.id && <span className="text-blue-600 mr-4">●</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => { onTabChange('contact'); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors flex items-center justify-between ${
                  activeTab === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Contactar Admin</span>
                {activeTab === 'contact' && <span className="text-blue-600 text-xs">●</span>}
              </button>

            </div>
          </>
        )}
      </div>

      {/* VISTA ESCRITORIO: Efecto Hover y Click Integrado */}
      <div className="hidden sm:flex gap-6 border-b border-gray-200 overflow-x-visible pb-0.5 items-center">
        {mainTabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)} 
            className={`pb-2 font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* CONTENEDOR DESPLEGABLE DINÁMICO DE JUEGOS */}
        <div 
          className="relative pb-2"
          onMouseEnter={() => setIsDesktopGamesOpen(true)}
          onMouseLeave={() => setIsDesktopGamesOpen(false)}
        >
          <button
            onClick={() => setIsDesktopGamesOpen(!isDesktopGamesOpen)}
            className={`font-bold whitespace-nowrap transition-colors flex items-center gap-1 border-b-2 pb-0.5 outline-none ${
              isGameActive ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <span>🎮 Juegos</span>
            <svg className={`w-3 h-3 transition-transform duration-200 ${isDesktopGamesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {isDesktopGamesOpen && (
            <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50 animate-fade-in">
              {gameTabs.map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => { onTabChange(subTab.id); setIsDesktopGamesOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${
                    activeTab === subTab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {subTab.id === 'quiz' ? '🏆 Trivial Quiz' : subTab.id === 'pixel' ? '🎬 Pixelado' : '⏱️ Cronología'}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => onTabChange('contact')} 
          className={`pb-2 font-bold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'contact' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          Contactar Admin
        </button>
      </div>

    </div>
  );
}