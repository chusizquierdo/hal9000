import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function CreatePoll({ onClose, onPollSaved, initialPoll = null, initialOptions = [] }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ id: null, text: '' }, { id: null, text: '' }]);

  useEffect(() => {
    // Si recibimos datos, estamos en modo edición
    if (initialPoll) {
      setQuestion(initialPoll.question);
      if (initialOptions.length > 0) {
        setOptions(initialOptions.map(o => ({ id: o.id, text: o.option_text })));
      }
    }
  }, [initialPoll, initialOptions]);

  const addOption = () => setOptions([...options, { id: null, text: '' }]);
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.text.trim() !== '');
    if (!question || validOptions.length < 2) {
      return alert('Debes poner una pregunta y al menos 2 opciones');
    }

    if (initialPoll) {
      // --- MODO EDICIÓN ---
      const { error: pollError } = await supabase
        .from('polls')
        .update({ question })
        .eq('id', initialPoll.id);
        
      if (pollError) return alert('Error al actualizar la encuesta: ' + pollError.message);

      for (let opt of validOptions) {
        if (opt.id) {
          // Actualizar opción existente
          await supabase.from('poll_options').update({ option_text: opt.text }).eq('id', opt.id);
        } else {
          // Insertar nueva opción si se añadió alguna extra
          await supabase.from('poll_options').insert({ poll_id: initialPoll.id, option_text: opt.text });
        }
      }
      alert('Encuesta actualizada con éxito');
    } else {
      // --- MODO CREACIÓN ---
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({ question, is_active: true })
        .select()
        .single();

      if (pollError) return alert('Error al crear encuesta: ' + pollError.message);

      const optionsToInsert = validOptions.map(o => ({
        poll_id: poll.id,
        option_text: o.text
      }));

      await supabase.from('poll_options').insert(optionsToInsert);
      alert('Encuesta creada con éxito');
    }

    onPollSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl">
        <h3 className="text-xl font-black mb-4 text-blue-600">
          {initialPoll ? 'Editar encuesta' : 'Crear nueva encuesta'}
        </h3>
        <input 
          className="w-full p-3 border border-gray-200 rounded-xl mb-4"
          placeholder="¿Qué quieres preguntar?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((opt, i) => (
          <input 
            key={i}
            className="w-full p-2 border border-gray-200 rounded-lg mb-2 text-sm"
            placeholder={`Opción ${i + 1}`}
            value={opt.text}
            onChange={(e) => handleOptionChange(i, e.target.value)}
          />
        ))}
        <button type="button" onClick={addOption} className="text-xs font-bold text-gray-500 mb-4 block hover:text-blue-600">
          + Añadir opción
        </button>
        
        <div className="flex gap-3 mt-4">
          <button type="button" onClick={onClose} className="flex-1 p-3 rounded-xl font-bold bg-gray-100 hover:bg-gray-200">
            Cancelar
          </button>
          <button type="submit" className="flex-1 p-3 rounded-xl font-black bg-blue-600 text-white hover:bg-blue-700">
            {initialPoll ? 'Guardar Cambios' : 'Guardar Encuesta'}
          </button>
        </div>
      </form>
    </div>
  );
}