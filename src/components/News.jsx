import { useEffect, useState } from 'react';
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Fuentes añadidas y rutas de RSS corregidas
  const RSS_FEEDS = [
    { url: 'https://www.espinof.com/rss2.xml', sourceName: 'Espinof' },
    { url: 'https://www.ecartelera.com/rss/noticias/', sourceName: 'eCartelera' },
    { url: 'https://www.fotogramas.es/rss/all.xml/', sourceName: 'Fotogramas' },
    { url: 'https://www.sensacine.com/rss/noticias.xml', sourceName: 'Sensacine' },
    { url: 'https://www.cinemania.es/feed/', sourceName: 'Cinemanía' }
  ];

  const fallbackImage = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop';

  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      try {
        const feedPromises = RSS_FEEDS.map(async (feed) => {
          const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
          try {
            const res = await fetch(API_URL);
            const data = await res.json();
            
            if (data.status === 'ok' && data.items) {
              return data.items.map(item => {
                // EXTRACCIÓN DE IMAGEN MEJORADA
                const imageUrl = item.enclosure?.link || 
                                 item.media?.content?.url || 
                                 item.thumbnail || 
                                 (item.content?.match(/src=["'](https?:\/\/[^"'\s]+\.(jpg|jpeg|png|webp))["']/i) || [])[1];

                return {
                  title: item.title,
                  description: item.description?.replace(/<[^>]+>/g, '').substring(0, 150) + '...',
                  content: item.content?.replace(/<[^>]+>/g, '') || item.description?.replace(/<[^>]+>/g, ''),
                  url: item.link,
                  image: imageUrl || fallbackImage,
                  publishedAt: item.pubDate,
                  author: item.author || 'Redacción',
                  source: { name: feed.sourceName }
                };
              });
            }
          } catch (err) { 
            console.error(`Error en ${feed.sourceName}:`, err); 
            Sentry.captureException(err); // Captura si un RSS específico da error o cambia de estructura
          }
          return [];
        });

        const results = await Promise.all(feedPromises);
        const allArticles = results.flat().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        setArticles(allArticles);
      } catch (e) { 
        console.error("Error global:", e); 
        Sentry.captureException(e); // Captura si falla el Promise.all o el ordenamiento de artículos
      } finally { 
        setLoading(false); 
      }
    };

    if (!selectedArticle) fetchAllNews();
  }, [selectedArticle]);

  const totalPages = Math.ceil(articles.length / PAGE_SIZE) || 1;
  const displayedArticles = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100">
        <button onClick={() => setSelectedArticle(null)} className="mb-6 px-4 py-2 bg-gray-100 rounded-xl font-bold text-xs hover:bg-gray-200">← Volver al listado</button>
        <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">{selectedArticle.title}</h1>
        <div className="text-xs font-bold text-blue-600 mb-6">{selectedArticle.source.name} • {new Date(selectedArticle.publishedAt).toLocaleDateString()}</div>
        <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-96 object-cover rounded-2xl mb-6 shadow-md" onError={(e) => e.target.src = fallbackImage} />
        <p className="text-lg text-gray-700 leading-relaxed">{selectedArticle.content}</p>
        <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="block mt-8 bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700">Leer en la web original →</a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {loading ? <div className="text-center py-20 animate-pulse font-bold text-gray-500">Recopilando noticias de cine...</div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedArticles.map((art, i) => (
              <div key={i} onClick={() => setSelectedArticle(art)} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                <div className="h-48 overflow-hidden">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => e.target.src = fallbackImage} />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold text-blue-600 uppercase mb-2">{art.source.name}</div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{art.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3">{art.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-2 bg-gray-100 rounded-xl font-bold disabled:opacity-30">Anterior</button>
            <span className="font-bold text-sm text-gray-500">Página {page} de {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-30">Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}