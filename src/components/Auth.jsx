import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CINEMA_QUOTES = [
  "Francamente, querida, eso me importa un bledo. (Lo que el viento se llevó)",
  "Le haré una oferta que no podrá rechazar. (El Padrino)",
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
  "La codicia, a falta de una palabra mejor, es buena. (Wall Street)",
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
  "La belleza mató a la bestia. (King Kong)",
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

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
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
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) alert(error.message);
      else alert('¡Registro exitoso! Por favor, verifica tu correo.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-mono text-white p-6">
      <div className="absolute top-20 w-32 h-32 rounded-full border-4 border-red-900 bg-red-950/20 shadow-[0_0_50px_rgba(220,38,38,0.5)] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-600 shadow-[0_0_20px_white]" />
      </div>

      {/* Contenedor más ancho: max-w-3xl */}
      <div className="z-10 w-full max-w-3xl p-12 bg-gray-950/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-black mb-10 text-center tracking-widest text-red-500 uppercase">HAL-9000</h1>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-6">
          {isSignUp && (
            <input type="text" placeholder="Usuario" className="w-full p-5 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500 text-lg" value={username} onChange={(e) => setUsername(e.target.value)} required />
          )}
          <input type="email" placeholder="Correo electrónico" className="w-full p-5 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500 text-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" className="w-full p-5 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-red-500 text-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <button disabled={loading} className="w-full bg-red-900 text-red-100 p-5 rounded-lg font-bold hover:bg-red-800 transition-all uppercase tracking-widest text-lg">
            {loading ? 'Procesando...' : isSignUp ? 'Iniciar Inicialización' : 'Acceder al Sistema'}
          </button>
          
          <button type="button" className="text-sm text-gray-500 hover:text-red-400 mt-4 text-center" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? '¿Ya estás registrado? Inicia sesión' : '¿Nueva conexión? Regístrate'}
          </button>
        </form>
      </div>

      <div className="absolute bottom-10 w-full text-center px-6">
        <p key={quote} className="text-gray-500 italic animate-fade-in transition-opacity duration-1000">"{quote}"</p>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 1s ease-in-out; }
      `}</style> 
    </div>
  );
}