import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PollComponent from './PollComponent';
import CreatePoll from './CreatePoll';

export default function PollsView({ isAdmin }) {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const POLLS_PER_PAGE = 6;

  const fetchPolls = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    setPolls(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const totalPages = Math.ceil(polls.length / POLLS_PER_PAGE);
  const paginatedPolls = polls.slice(currentPage * POLLS_PER_PAGE, (currentPage + 1) * POLLS_PER_PAGE);

  if (loading) return <div className="p-10 text-center">Cargando encuestas...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {isAdmin && (
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black hover:bg-blue-700 transition-all"
          >
            + Crear Encuesta
          </button>
        </div>
      )}
      
      {isModalOpen && (
        <CreatePoll 
          onClose={() => setIsModalOpen(false)} 
          onPollSaved={fetchPolls} 
        />
      )}
      
      <h2 className="text-3xl font-black text-gray-800 text-center mb-10">Encuestas de la Comunidad</h2>
      
      {polls.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPolls.map((poll) => (
              <PollComponent 
                key={poll.id} 
                pollId={poll.id} 
                isAdmin={isAdmin} 
                onPollDeleted={fetchPolls} 
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-4 py-2 rounded-xl font-bold ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">No hay encuestas activas.</p>
      )}
    </div>
  );
}