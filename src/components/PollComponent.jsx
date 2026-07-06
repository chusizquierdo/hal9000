import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import CreatePoll from './CreatePoll';

export default function PollComponent({ pollId, isAdmin, onPollDeleted }) {
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);

  useEffect(() => {
    fetchPollData();
  }, [pollId]);

  async function fetchPollData() {
    setLoading(true);
    const { data: pollData } = await supabase.from('polls').select('*').eq('id', pollId).single();
    
    const { data: optionsData } = await supabase
      .from('poll_options')
      .select(`*, user_votes(count)`)
      .eq('poll_id', pollId);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: votes } = await supabase.from('user_votes').select('option_id').eq('poll_id', pollId).eq('user_id', user.id);
        if (votes?.length > 0) setUserVote(votes[0].option_id);
    }

    setPoll(pollData);
    setOptions(optionsData || []);
    
    const total = optionsData?.reduce((acc, opt) => acc + (opt.user_votes[0]?.count || 0), 0) || 0;
    setTotalVotes(total);
    setLoading(false);
  }

  async function handleVote(optionId) {
    if (!poll.is_active) return alert("Encuesta cerrada.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Inicia sesión para votar");
    await supabase.from('user_votes').upsert({ poll_id: pollId, user_id: user.id, option_id: optionId }, { onConflict: 'poll_id, user_id' });
    fetchPollData();
  }

  async function togglePollStatus() {
    const newState = !poll.is_active;
    const { error } = await supabase.from('polls').update({ is_active: newState }).eq('id', pollId);
    if (!error) fetchPollData();
  }

  async function handleDelete() {
    if (!window.confirm("¿Eliminar encuesta?")) return;
    await supabase.from('user_votes').delete().eq('poll_id', pollId);
    await supabase.from('poll_options').delete().eq('poll_id', pollId);
    await supabase.from('polls').delete().eq('id', pollId);
    onPollDeleted();
  }

  if (loading) return <div className="p-4 text-center">Cargando...</div>;
  if (!poll) return null;

  return (
    <>
      <div 
        className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative"
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        {isAdmin && isHovered && (
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button 
              onClick={() => setIsEditingModalOpen(true)}
              className="text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all text-blue-500 bg-blue-50 hover:bg-blue-600 hover:text-white"
            >
              Editar
            </button>
            <button onClick={togglePollStatus} className="text-[10px] font-black uppercase text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg hover:bg-yellow-500 hover:text-white">
              {poll.is_active ? 'Cerrar' : 'Abrir'}
            </button>
            <button onClick={handleDelete} className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white">
              Eliminar
            </button>
          </div>
        )}
        
        <h3 className="text-lg font-bold text-gray-900 mb-6 pr-12">{poll.question}</h3>
        
        <div className="space-y-3">
          {options.map((opt) => {
            const count = opt.user_votes[0]?.count || 0;
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isSelected = userVote === opt.id;
            return (
              <button key={opt.id} onClick={() => handleVote(opt.id)} className={`w-full p-4 rounded-2xl border relative overflow-hidden transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isSelected ? 'bg-blue-200' : 'bg-green-100'}`} style={{ width: `${percentage}%` }}></div>
                <div className="flex justify-between relative z-10">
                  <span className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>{opt.option_text}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>{percentage}% ({count})</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-5 text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
          {totalVotes} Votos totales {!poll.is_active ? '- Encuesta cerrada' : ''}
        </div>
      </div>

      {isEditingModalOpen && (
        <CreatePoll 
          onClose={() => setIsEditingModalOpen(false)} 
          onPollSaved={fetchPollData} 
          initialPoll={poll} 
          initialOptions={options} 
        />
      )}
    </>
  );
}