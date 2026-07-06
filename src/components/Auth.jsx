import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as Sentry from "@sentry/react"; // IMPORTAMOS SENTRY

const CINEMA_QUOTES = [
  "Francamente, querida, eso me importa un bledo. (Lo que el viento se llevó)",
  "Le haré una oferta que no podrá rezar. (El Padrino)",
  "No tienes ni idea de lo que me pasa. (La ley del silencio)",
  "Toto, tengo el presentimiento de que ya no estamos en Kansas. (El mago de Oz)",
  "Aquí me tienes mirándote, chica. (Casablanca)",
  "Anda, alégrame el día. (Harry el Sucio)",
  "Muy bien, Sr. DeMille, estoy lista para mi primer plano. (El crepúsculo de los dioses)",
  "Que la Fuerza te acompañe. (Star Wars)",
  "A todo el mundo le gusta un buen puro. (Con faldas y a lo loco)",
  "¡Aquí está Johnny! (El resplandor)",
  "Pueda que no sea muy listo, pero sé lo que es el amor. (Forrest Gump)",
  "El mejor amigo de un chico es su madre. (Psicosis)",
  "¡Estoy hasta los mismos pelos y no voy a seguir soportándolo! (Network, un mundo implacable)",
  "Olvídalo, Jake, esto es Chinatown. (Chinatown)",
  "Tengo miedo, Dave. (2001: Una odisea del espacio)",
  "¡Qué mundo tan maravilloso! (El mago de Oz)",
  "Te lo digo ahora, lo he pensado mucho. (El graduado)",
  "Si no puedes soportar el calor, sal de la cocina. (Truman)",
  "Soy el rey del mundo. (Titanic)",
  "Me encanta el olor del napalm por la mañana. (Apocalypse Now)",
  "La vida es una caja de bombones. (Forrest Gump)",
  "¡Hola, guapo! (Casablanca)",
  "A Dios pongo por testigo que jamás volveré a pasar hambre. (Lo que el viento se llevó)",
  "Eres tú, ¿quién más podría ser? (Casablanca)",
  "¡Y tú, que te creías que eras listo! (El puente sobre el río Kwai)",
  "La verdad es que no me importa. (El tercer hombre)",
  "¡Sacad las manos de ahí, malditos simios! (El planeta de los simios)",
  "He venido aquí a mascar chicle y dar patadas en el culo, y se me ha acabado el chicle. (Están vivos)",
  "Elemental, mi querido Watson. (Sherlock Holmes)",
  "Acompáñame a ver si esto funciona. (Casablanca)",
  "Lo importante no es ganar, sino participar. (Carros de fuego)",
  "¡Atrápame si puedes! (Atrápame si puedes)",
  "No hay lugar como el hogar. (El mago de Oz)",
  "Mantén a tus amigos cerca, pero a tus enemigos más cerca. (El Padrino II)",
  "La vida se abre camino. (Parque Jurásico)",
  "Si no hubiera sido por ti... (Casablanca)",
  "Bond. James Bond. (007 contra el Doctor No)",
  "Hay dos tipos de personas en el mundo: las que tienen el revólver cargado y las que cavan. (El bueno, el feo y el malo)",
  "Tú me completas. (Jerry Maguire)",
  "Se acabó la fiesta. (La jungla de cristal)",
  "¡Es una trampa! (Star Wars: El retorno del Jedi)",
  "Houston, tenemos un problema. (Apollo 13)",
  "Mañana será otro día. (Lo que el viento se llevó)",
  "Hasta la vista, baby. (Terminator 2)",
  "Podría haber sido alguien. (La ley del silencio)",
  "La codicia, a falta de una palabra mejor, is buena. (Wall Street)",
  "No hay llanto en el béisbol. (Ellas dan el golpe)",
  "Si tú lo construyes, él vendrá. (Campo de sueños)",
  "¡Dadme la libertad o dadme la muerte! (Braveheart)",
  "Una vez, un hombre del censo intentó hacerme una encuesta. Me comí su hígado acompañado de habas y un buen Chianti. (El silencio de los corderos)",
  "¡Necesitamos un barco más grande! (Tiburón)",
  "Tú no eres el jefe de nadie. (El club de la lucha)",
  "Lo que tenemos aquí es un fallo en la comunicación. (La leyenda del indomable)",
  "Creo que este es el comienzo de una gran amistad. (Casablanca)",
  "Solo tienes que silbar. (Tener y no tener)",
  "¡Abrid la puerta! (El resplandor)",
  "La beauty mató a la bestia. (King Kong)",
  "El amor significa nunca tener que pedir perdón. (Love Story)",
  "Lo siento, Dave. (2001: Una odisea del espacio)",
  "¡Eso es, eso es todo, amigos! (Looney Tunes)",
  "El futuro no está escrito. (Terminator)",
  "La libertad no tiene precio. (Braveheart)",
  "¡Esto es la guerra! (Los hermanos Marx)",
  "La esperanza es lo último que se pierde. (Cadena perpetua)",
  "Estoy cansado, jefe. (La milla verde)",
  "¡Aléjate de ella, puerca! (Aliens: El regreso)",
  "En el espacio nadie puede oírte gritar. (Alien, el octavo pasajero)",
  "Aún no habéis comprendido a qué os enfrentáis. Un perfecto organismo. Su perfección estructural solo está igualada por su hostilidad. (Alien, el octavo pasajero)",
  "Yo admiro su pureza, es un superviviente al que no afecta la conciencia, los remordimientos ni las fantasías de moralidad. (Alien, el octavo pasajero)",
  "No tenéis ninguna posibilidad, pero... contáis con mi simpatía. (Alien, el octavo pasajero)"
];

export default function Auth({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [view, setView] = useState('login'); 
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState(CINEMA_QUOTES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * CINEMA_QUOTES.length);
      setQuote(CINEMA_QUOTES[randomIndex]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (view === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) {
          setMessage(error.message);
          Sentry.captureException(error); // Monitorizar fallos en el registro de cuentas
        } else {
          setMessage('¡Registro exitoso! Por favor, verifica tu correo electrónico para activar tu cuenta.');
        }
      } else if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message === 'Email not confirmed') {
            setMessage('⚠️ Tu correo electrónico aún no ha sido verificado. Por favor, haz clic en el enlace que enviamos a tu bandeja de entrada antes de acceder.');
          } else if (error.message === 'Invalid login credentials') {
            setMessage('❌ Acceso denegado. El correo electrónico o la contraseña son incorrectos.');
          } else {
            setMessage(error.message);
          }
          Sentry.captureException(error); // Monitorizar credenciales incorrectas o problemas de login
        }
      } else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`,
        });
        if (error) {
          setMessage(error.message);
          Sentry.captureException(error); // Monitorizar problemas con la recuperación de contraseñas
        } else {
          setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        }
      }
    } catch (err) {
      console.error("Error inesperado en el flujo de autenticación:", err);
      Sentry.captureException(err);
      setMessage("Ocurrió un error inesperado al procesar la autenticación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black/90 backdrop-blur-md flex flex-col md:grid md:grid-rows-[auto_1fr_auto] items-center justify-center md:justify-items-center p-4 font-mono text-white overflow-hidden z-[100]">
      
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 border border-gray-800 bg-gray-950/50 text-gray-500 hover:text-red-500 hover:border-red-900 px-3 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest cursor-pointer"
        >
          ✕ Cancelar
        </button>
      )}

      {/* HAL EYE WITH WORDLE-STYLE ANIMATION */}
      <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full mb-6 md:mb-0 shadow-[0_0_50px_rgba(220,38,38,0.8)] border-4 border-red-800 flex items-center justify-center shrink-0">
        <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
      </div>

      <div className="w-full max-w-md md:w-[600px] md:h-[480px] p-6 md:p-12 bg-gray-950/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl flex flex-col justify-center shrink-0">
        <h1 className="text-2xl md:text-4xl font-black mb-6 md:mb-10 text-center tracking-widest text-red-500 uppercase">HAL-9000</h1>
        
        {message ? (
          <div className="text-center text-red-300 p-4 bg-red-950/30 border border-red-900 rounded-lg max-w-sm mx-auto">
            <p className="text-sm leading-relaxed font-bold">{message}</p>
            <button onClick={() => { setMessage(''); setView('login'); }} className="block w-full mt-5 bg-red-900/40 hover:bg-red-900 text-white text-xs py-2 rounded-xl border border-red-700/50 transition-colors uppercase tracking-wider font-bold">Volver al inicio</button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="flex flex-col gap-4 md:gap-4">
            {view === 'signup' && (
              <input type="text" placeholder="Usuario" className="w-full p-3 md:p-4 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500" value={username} onChange={(e) => setUsername(e.target.value)} required />
            )}
            
            {(view === 'login' || view === 'signup' || view === 'forgot') && (
              <input type="email" placeholder="Correo electrónico" className="w-full p-3 md:p-4 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
            )}
            
            {(view === 'login' || view === 'signup') && (
              <input type="password" placeholder="Contraseña" className="w-full p-3 md:p-4 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
            )}
            
            <button disabled={loading} className="w-full bg-red-900 text-red-100 p-3 md:p-4 rounded-lg font-bold hover:bg-red-800 transition-all uppercase tracking-widest">
              {loading ? 'Procesando...' : view === 'signup' ? 'Crear cuenta' : view === 'forgot' ? 'Enviar enlace' : 'Acceder al Sistema'}
            </button>
            
            <div className="flex flex-col gap-2">
              <button type="button" className="text-xs md:text-sm text-gray-500 hover:text-red-400 text-center" onClick={() => setView(view === 'login' ? 'signup' : 'login')}>
                {view === 'login' ? '¿Nueva conexión? Regístrate' : '¿Ya estás registrado? Inicia sesión'}
              </button>
              {view === 'login' && (
                <button type="button" className="text-xs text-gray-600 hover:text-red-400 text-center" onClick={() => setView('forgot')}>
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
          </form>
        )}
      </div> 

      <div className="h-20 flex items-center justify-center px-4 shrink-0 mt-4 md:mt-0">
        <p key={quote} className="text-gray-400 italic text-sm md:text-lg text-center animate-fade-in transition-opacity duration-1000 line-clamp-2 px-2">
          "{quote}"
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 1s ease-in-out; }
      `}} /> 
    </div>
  );
}