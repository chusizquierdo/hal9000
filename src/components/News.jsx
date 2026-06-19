import { useEffect, useState } from 'react';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const PAGE_SIZE = 10;
  // TODO: Asegúrate de mantener tu clave aquí
  const API_KEY = 'bfa3d03d060942e0a16e72aae468c370'; 

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const url = `https://newsapi.org/v2/everything?q=cine&language=es&sortBy=publishedAt&pageSize=30&page=${page}&apiKey=${API_KEY}`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'ok' && data.articles) {
          const filteredArticles = data.articles.filter(art => {
            if (!art.title || !art.description) return false;
            
            const text = `${art.title} ${art.description}`.toLowerCase();
            return (
              text.includes('película') || 
              text.includes('cine') || 
              text.includes('serie') || 
              text.includes('estreno') ||
              text.includes('netflix') ||
              text.includes('hbo') ||
              text.includes('amazon prime') ||
              text.includes('disney') ||
              text.includes('actor') ||
              text.includes('actriz') ||
              text.includes('director') ||
              text.includes('taquilla')
            );
          });

          setArticles(filteredArticles.slice(0, PAGE_SIZE));
          setTotalResults(filteredArticles.length > 0 ? data.totalResults : 0);
        } else {
          console.error("Error o respuesta vacía de NewsAPI:", data.message || data);
          setArticles([]);
        }
      } catch (e) {
        console.error("Error al cargar noticias:", e);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedArticle) {
      fetchNews();
    }
  }, [page, selectedArticle]);

  // Vista detallada de la noticia seleccionada
  if (selectedArticle) {
    // Limpiamos el texto truncado que añade la API "[+1234 chars]" para que no quede feo
    const cleanContent = selectedArticle.content 
      ? selectedArticle.content.replace(/\[\+\d+\schars\]/g, '').trim()
      : '';

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="group inline-flex items-center gap-2 bg-gray-50 text-gray-600 hover:text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 shadow-sm mb-6 transition-all"
        >
          ← Volver al Listado de Noticias
        </button>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400 uppercase">
            <span>{selectedArticle.source?.name || 'Medio'}</span>
            <span>•</span>
            <span>{new Date(selectedArticle.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            {selectedArticle.title}
          </h1>

          {selectedArticle.author && (
            <p className="text-sm text-gray-500 font-medium">Por: <span className="font-bold text-gray-700">{selectedArticle.author}</span></p>
          )}

          {selectedArticle.urlToImage && (
            <div className="h-96 rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={selectedArticle.urlToImage} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}

          {/* Sección de introducción / Resumen */}
          <div className="text-lg text-gray-700 font-medium leading-relaxed bg-gray-50 p-5 rounded-2xl border-l-4 border-blue-500">
            <span className="block text-xs font-bold text-blue-600 uppercase mb-1">Resumen del artículo</span>
            {selectedArticle.description}
          </div>

          {/* Cuerpo disponible de la noticia estilizado */}
          <div className="text-gray-800 text-base leading-relaxed space-y-4 pt-4">
            <p className="first-letter:text-5xl first-letter:font-black first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left">
              {cleanContent || 'Para proteger los derechos de autor de la distribuidora y los medios de comunicación, los detalles extendidos de esta cobertura se deben consultar directamente en la fuente oficial de edición.'}
            </p>
          </div>

          {/* Enlace estético para expandir */}
          <div className="pt-8 mt-6 border-t border-gray-100 text-center space-y-4">
            <p className="text-xs text-gray-400 font-medium">
              Debido a las restricciones de sindicación de contenidos, el texto completo final se encuentra alojado en el medio original.
            </p>
            <a 
              href={selectedArticle.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Continuar leyendo la noticia completa →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado del listado de noticias con tarjetas
  return (
    <div className="space-y-8">
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-500 animate-pulse">
          Buscando últimas noticias de cine y series...
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
          No se han encontrado noticias en este momento. Verifica tu API Key o los límites del plan gratuito.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedArticle(art)}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {art.urlToImage && (
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={art.urlToImage} 
                    alt={art.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    <span>{art.source?.name}</span>
                    <span>•</span>
                    <span className="text-gray-400">
                      {new Date(art.publishedAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {art.description}
                  </p>
                </div>
                <div className="text-xs font-bold text-blue-600 pt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver detalles de la noticia <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginador estricto */}
      {!loading && articles.length > 0 && (
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button 
            disabled={page === 1} 
            onClick={() => { setPage(prev => prev - 1); window.scrollTo({ top: 0 }); }} 
            className="px-6 py-2 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            Anterior
          </button>
          <span className="font-bold text-gray-500 text-sm">
            Página {page} de {Math.ceil(totalResults / PAGE_SIZE) || 1}
          </span>
          <button 
            disabled={page * PAGE_SIZE >= totalResults} 
            onClick={() => { setPage(prev => prev + 1); window.scrollTo({ top: 0 }); }} 
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}