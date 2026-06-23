// quizData.jsx
export const ALL_QUIZ_QUESTIONS = [
    {
    id: 1,
    pregunta: "¿Qué mítica película de ciencia ficción de 1982 presenta a los 'Replicantes' y se ambienta en un Los Ángeles futurista?",
    opciones: [
      { id: 'a', texto: 'Matrix' },
      { id: 'b', texto: 'Blade Runner' },
      { id: 'c', texto: 'Alien, el octavo pasajero' },
      { id: 'd', texto: 'Terminator' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Blade Runner',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "¡Exacto! Dirigida por Ridley Scott y basada en la novela de Philip K. Dick."
  },
  {
    id: 2,
    pregunta: "En la obra maestra 'El Padrino' (1972), ¿qué fruta aparece en pantalla justo antes de que ocurra una muerte o un atentado?",
    opciones: [
      { id: 'a', texto: 'Las manzanas' },
      { id: 'b', texto: 'Las uvas' },
      { id: 'c', texto: 'Las naranjas' },
      { id: 'd', texto: 'Los limones' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'The Godfather',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Las naranjas se usaron originalmente para dar color a los oscuros sets, pero acabaron convirtiéndose en el presagio de muerte oficial de la saga."
  },
  {
    id: 3,
    pregunta: "¿Quién compuso la icónica y terrorífica banda sonora de 'Tiburón' (1975)?",
    opciones: [
      { id: 'a', texto: 'Hans Zimmer' },
      { id: 'b', texto: 'John Williams' },
      { id: 'c', texto: 'Ennio Morricone' },
      { id: 'd', texto: 'Danny Elfman' }
    ],
    respuestaCorrecta: 'b',
    youtubeId: 'A9QTSydav4I', 
    tituloPelicula: 'Jaws',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "John Williams ganó el Óscar por esta banda sonora. Steven Spielberg admitió que la mitad del éxito de la película se debió a esa música."
  },
  {
    id: 4,
    pregunta: "¿Cuál es la primera película del universo de Star Wars estrenada en cines en el año 1977?",
    opciones: [
      { id: 'a', texto: 'El Imperio Contraataca' },
      { id: 'b', texto: 'La Amenaza Fantasma' },
      { id: 'c', texto: 'Una Nueva Esperanza' },
      { id: 'd', texto: 'El Retorno del Jedi' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'Star Wars',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Se estrenó simplemente como 'Star Wars', pero más tarde se le añadió el subtítulo 'Episodio IV: Una Nueva Esperanza'."
  },
  {
    id: 5,
    pregunta: "En 'Inception' (Origen, 2010), ¿cuál es el objeto que utiliza el personaje de DiCaprio como tótem para saber si está en un sueño?",
    opciones: [
      { id: 'a', texto: 'Un dado modificado' },
      { id: 'b', texto: 'Una peonza o tótem giratorio' },
      { id: 'c', texto: 'Una ficha de ajedrez' },
      { id: 'd', texto: 'Un anillo de bodas' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Inception',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Si la peonza gira indefinidamente, significa que continúa atrapado dentro de un sueño."
  },
  {
    id: 6,
    pregunta: "¿Qué película ganó el premio Óscar a Mejor Película en la primera gala donde una cinta de habla no inglesa se alzó con la estatuilla?",
    opciones: [
      { id: 'a', texto: 'Roma' },
      { id: 'b', texto: 'Parásitos' },
      { id: 'c', texto: 'Amélie' },
      { id: 'd', texto: 'La vida es bella' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Parasite',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La surcoreana 'Parásitos' (2019) hizo historia al ganar tanto Mejor Película Internacional como Mejor Película del año simultáneamente."
  },
  {
    id: 7,
    pregunta: "En '2001: Una odisea del espacio', ¿cuál es la primera palabra que pronuncia la supercomputadora HAL-9000?",
    opciones: [
      { id: 'a', texto: 'Hola' },
      { id: 'b', texto: 'Buenos días' },
      { id: 'c', texto: 'Dave' },
      { id: 'd', texto: 'Peligro' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: '2001: A Space Odyssey',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "HAL-9000 saluda al astronauta diciendo: 'Buenos días, doctor Chandra. Soy un computador HAL 9000'."
  },
  {
    id: 8,
    pregunta: "En 'Pulp Fiction', ¿qué misterioso objeto brilla con destellos dorados dentro del maletín de Marsellus Wallace?",
    opciones: [
      { id: 'a', texto: 'Un lingote de oro puro' },
      { id: 'b', texto: 'El alma de Marsellus' },
      { id: 'c', texto: 'Nunca se revela explícitamente' },
      { id: 'd', texto: 'Los diamantes de Reservoir Dogs' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'Pulp Fiction',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Es uno de los 'MacGuffins' más famosos de la historia del cine. Quentin Tarantino admitió que simplemente pusieron una bombilla naranja."
  },
  {
    id: 9,
    pregunta: "¿Cuál es la primera regla del infame 'Club de la Lucha' (Fight Club, 1999)?",
    opciones: [
      { id: 'a', texto: 'No hablar sobre el Club de la Lucha' },
      { id: 'b', texto: 'Solo pelear descalzos' },
      { id: 'c', texto: 'Traer tu propia ropa limpia' },
      { id: 'd', texto: 'Tener total lealtad a Tyler Durden' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Fight Club',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La primera y la segunda regla dicen exactamente lo mismo: 'No hablar sobre el Club de la Lucha'."
  },
  {
    id: 10,
    pregunta: "En 'Matrix' (1999), ¿qué color de pastilla debe tomar Neo si quiere despertar y conocer la cruda realidad del mundo exterior?",
    opciones: [
      { id: 'a', texto: 'La pastilla azul' },
      { id: 'b', texto: 'La pastilla roja' },
      { id: 'c', texto: 'La pastilla verde' },
      { id: 'd', texto: 'La pastilla amarilla' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Matrix',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La pastilla roja simboliza la verdad incómoda, mientras que la azul le devolvería a su ignorancia idílica dentro de la simulación."
  },
  {
    id: 11,
    pregunta: "¿Qué veterano actor interpretó de forma magistral al mago Gandalf en la trilogía de 'El Señor de los Anillos'?",
    opciones: [
      { id: 'a', texto: 'Christopher Lee' },
      { id: 'b', texto: 'Patrick Stewart' },
      { id: 'c', texto: 'Ian McKellen' },
      { id: 'd', texto: 'Michael Caine' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'The Lord of the Rings: The Fellowship of the Ring',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Sir Ian McKellen inicialmente iba a rechazar el papel debido a problemas de agenda con la primera entrega de X-Men."
  },
  {
    id: 12,
    pregunta: "¿Qué visionario cineasta dirigió la colosal película catastrofista y romántica 'Titanic' en 1997?",
    opciones: [
      { id: 'a', texto: 'Steven Spielberg' },
      { id: 'b', texto: 'James Cameron' },
      { id: 'c', texto: 'Ridley Scott' },
      { id: 'd', texto: 'Peter Jackson' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Titanic',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "James Cameron ha realizado a fecha de 2026 un total de 33 inmersiones al Titanic."
  },
  {
    id: 13,
    pregunta: "Por su legendaria interpretación del Joker en 'El Caballero Oscuro' (2008), Heath Ledger ganó un premio Óscar póstumo a:",
    opciones: [
      { id: 'a', texto: 'Mejor Actor Principal' },
      { id: 'b', texto: 'Mejor Guion Adaptado' },
      { id: 'c', texto: 'Mejor Actor de Reparto' },
      { id: 'd', texto: 'Mejor Efecto Visual' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'The Dark Knight',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Ledger pasó semanas encerrado en un hotel diseñando la retorcida psicología, tics y la icónica voz del personaje."
  },
  {
    id: 14,
    pregunta: "En 'Volver al futuro' (1985), ¿a qué velocidad exacta en millas por hora debe acelerar el DeLorean para activar los circuitos del tiempo?",
    opciones: [
      { id: 'a', texto: '55 mph' },
      { id: 'b', texto: '88 mph' },
      { id: 'c', texto: '100 mph' },
      { id: 'd', texto: '120 mph' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Back to the Future',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Los productores eligieron '88' simplemente porque el número lucía muy llamativo e interesante en el velocímetro digital."
  },
  {
    id: 15,
    pregunta: "¿Qué legendario director de suspenso dirigió e impactó al mundo entero con la escena de la ducha en 'Psicosis' (1960)?",
    opciones: [
      { id: 'a', texto: 'Orson Welles' },
      { id: 'b', texto: 'Alfred Hitchcock' },
      { id: 'c', texto: 'Stanley Kubrick' },
      { id: 'd', text: 'John Huston' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Psycho',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Para simular el sonido de los apuñalamientos en esa escena, el equipo de sonido apuñaló melones repetidamente."
  },
  {
    id: 16,
    pregunta: "En la aclamada película de ciencia ficción 'Interestelar' (2014), ¿cómo se llama el carismático robot exmilitar con forma de bloque modular?",
    opciones: [
      { id: 'a', texto: 'HAL' },
      { id: 'b', texto: 'K-2SO' },
      { id: 'c', texto: 'TARS' },
      { id: 'd', texto: 'WALL-E' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'Interstellar',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "TARS cuenta con un regulador de humor y un curioso parámetro ajustable para medir su nivel de honestidad y sarcasmo."
  },
  {
    id: 17,
    pregunta: "En 'Parque Jurásico' (1993), ¿de dónde extraen los científicos el ADN prehistórico para clonar e iniciar la población de dinosaurios?",
    opciones: [
      { id: 'a', texto: 'De huesos fosilizados' },
      { id: 'b', texto: 'De mosquitos atrapados en ámbar' },
      { id: 'c', texto: 'De plumas fosilizadas' },
      { id: 'd', texto: 'De huevos congelados' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Jurassic Park',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La idea se basa en una teoría científica real, aunque el ADN se degrada demasiado rápido con el tiempo como para que funcione."
  },
  {
    id: 18,
    pregunta: "¿Qué actor se metió en la piel del escalofriante y refinado asesino caníbal Hannibal Lecter en 'El silencio de los corderos'?",
    opciones: [
      { id: 'a', texto: 'Robert De Niro' },
      { id: 'b', texto: 'Jack Nicholson' },
      { id: 'c', texto: 'Anthony Hopkins' },
      { id: 'd', texto: 'Al Pacino' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'The Silence of the Lambs',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aparece menos de 16 minutos totales en toda la película, pero bastó para darle el Óscar a Mejor Actor Principal."
  },
  {
    id: 19,
    pregunta: "¿Con qué delicioso dulce compara Forrest Gump la impredecible naturaleza de la vida en su famosa frase en el banco?",
    opciones: [
      { id: 'a', texto: 'Una tarta de manzana' },
      { id: 'b', texto: 'Una caja de bombones' },
      { id: 'c', texto: 'Un helado de vainilla' },
      { id: 'd', texto: 'Un algodón de azúcar' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Forrest Gump',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La frase exacta es: 'La vida es como una caja de bombones, nunca sabes lo que te va a tocar'."
  },
  {
    id: 20,
    pregunta: "En la satírica y distópica película 'El show de Truman' (1998), ¿cómo se llama el megaproductor y creador del gigantesco show televisivo?",
    opciones: [
      { id: 'a', texto: 'Marlon' },
      { id: 'b', texto: 'Christof' },
      { id: 'c', texto: 'Kirk' },
      { id: 'd', texto: 'Moses' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Truman Show',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Interpretado por Ed Harris, el nombre 'Christof' hace una clara alusión satírica a jugar a ser Dios ('Christ-off')."
  },
  {
    id: 21,
    pregunta: "¿Qué célebre aforismo en latín enseña Robin Williams a sus alumnos en 'El club de los poetas muertos' (1989)?",
    opciones: [
      { id: 'a', texto: 'Carpe Diem' },
      { id: 'b', texto: 'Veni, vidi, vici' },
      { id: 'c', texto: 'Memento mori' },
      { id: 'd', texto: 'Alea iacta est' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Dead Poets Society',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Significa 'Aprovecha el día' e insta a los jóvenes a exprimir el momento y hacer sus vidas extraordinarias."
  },
  {
    id: 22,
    pregunta: "¿Cuál es el nombre del imponente general romano convertido en gladiador interpretado por Russell Crowe en el año 2000?",
    opciones: [
      { id: 'a', texto: 'Espartaco' },
      { id: 'b', texto: 'Máximo Décimo Meridio' },
      { id: 'c', texto: 'Cómodo' },
      { id: 'd', texto: 'Julio César' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Gladiator',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su discurso de presentación en el Coliseo es uno de los momentos más citados de la historia del cine de acción."
  },
  {
    id: 23,
    pregunta: "En la tensa y electrizante película 'Whiplash' (2014), ¿qué instrumento musical toca con obsesión el protagonista Andrew Neiman?",
    opciones: [
      { id: 'a', texto: 'El piano de cola' },
      { id: 'b', texto: 'La batería' },
      { id: 'c', texto: 'El saxofón' },
      { id: 'd', texto: 'El contrabajo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Whiplash',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El actor Miles Teller tocaba la batería desde los 15 años, pero sufrió ampollas reales debido al ritmo frenético del rodaje."
  },
  {
    id: 24,
    pregunta: "En 'Apocalypse Now', ¿qué sustancia afirma adorar el teniente coronel Kilgore por la mañana debido a su característico olor?",
    opciones: [
      { id: 'a', texto: 'La pólvora' },
      { id: 'b', texto: 'El café recién hecho' },
      { id: 'c', texto: 'El napalm' },
      { id: 'd', texto: 'La gasolina de avión' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'Apocalypse Now',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La célebre frase completa dice: 'Me gusta el olor a napalm por la mañana... huele a victoria'."
  },
  {
    id: 25,
    pregunta: "¿Cuál es el cóctel icónico y predilecto que consume constantemente 'El Nota' en 'El gran Lebowski' (1998)?",
    opciones: [
      { id: 'a', texto: 'Martini seco' },
      { id: 'b', texto: 'Margarita' },
      { id: 'c', texto: 'Ruso Blanco' },
      { id: 'd', texto: 'Bloody Mary' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'The Big Lebowski',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El Ruso Blanco se prepara combinando vodka, licor de café y nata líquida o leche."
  },
  {
    id: 26,
    pregunta: "¿Qué aclamado y sangriento director de cine firmó el espectacular drama bélico 'Malditos bastardos' en 2009?",
    opciones: [
      { id: 'a', texto: 'Martin Scorsese' },
      { id: 'b', texto: 'Quentin Tarantino' },
      { id: 'c', texto: 'Christopher Nolan' },
      { id: 'd', texto: 'David Fincher' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Inglourious Basterds',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Tarantino pasó casi una década escribiendo el guion porque no lograba dar con un final que le satisficiera."
  },
  {
    id: 27,
    pregunta: "En la desgarradora obra 'La lista de Schindler' (1993), filmada en blanco y negro, ¿qué elemento destaca por tener color?",
    opciones: [
      { id: 'a', texto: 'La bandera nazi' },
      { id: 'b', texto: 'El abrigo de una niña pequeña' },
      { id: 'c', texto: 'Los ojos de Oskar Schindler' },
      { id: 'd', texto: 'Un coche de época' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: "Schindler's List",
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El abrigo de la niña es de un color rojo apagado y simboliza la inocencia masacrada durante el Holocausto."
  },
  {
    id: 28,
    pregunta: "¿Qué premiado director mexicano creó la oscura fantasía histórica de 'El laberinto del fauno' en el año 2006?",
    opciones: [
      { id: 'a', texto: 'Alfonso Cuarón' },
      { id: 'b', texto: 'Alejandro G. Iñárritu' },
      { id: 'c', texto: 'Guillermo del Toro' },
      { id: 'd', texto: 'Robert Rodriguez' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'Pan\'s Labyrinth',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Guillermo del Toro tradujo él mismo los subtítulos al inglés tras quedar horrorizado con las traducciones de sus anteriores cintas."
  },
  {
    id: 29,
    pregunta: "En el clásico atemporal 'Casablanca' (1942), ¿cómo se llama el mítico local nocturno regentado por Humphrey Bogart?",
    opciones: [
      { id: 'a', texto: 'The Blue Parrot' },
      { id: 'b', texto: 'Rick\'s Café Américain' },
      { id: 'c', texto: 'La Belle Aurore' },
      { id: 'd', texto: 'The Casablanca Club' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Casablanca',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El local entero fue construido exclusivamente en los estudios de Warner Bros, ninguna escena se rodó en Marruecos."
  },
  {
    id: 30,
    pregunta: "¿Cuál es la misteriosa y enigmática última palabra que pronuncia Charles Foster Kane antes de morir en 'Ciudadano Kane' (1941)?",
    opciones: [
      { id: 'a', texto: 'Rosebud' },
      { id: 'b', texto: 'Xanadu' },
      { id: 'c', texto: 'Dinero' },
      { id: 'd', texto: 'Siempre' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Citizen Kane',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Rosebud era el nombre del trineo con el que jugaba Kane durante su infancia, representando su felicidad perdida."
  },
  {
    id: 31,
    pregunta: "¿Qué carismática pareja de actores protagonizó y bailó junta en el musical moderno de éxito 'La La Land' (2016)?",
    opciones: [
      { id: 'a', texto: 'Brad Pitt y Angelina Jolie' },
      { id: 'b', texto: 'Ryan Gosling y Emma Stone' },
      { id: 'c', texto: 'Leonardo DiCaprio y Kate Winslet' },
      { id: 'd', tracking: 'Bradley Cooper y Lady Gaga' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'La La Land',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Esta fue la tercera película en la que Gosling y Emma Stone actuaron juntos como intereses románticos."
  },
  {
    id: 32,
    pregunta: "En la violenta película de culto 'Scarface' (El precio del poder, 1983), ¿cuál es el nombre del inmigrante cubano encarnado por Al Pacino?",
    opciones: [
      { id: 'a', texto: 'Tony Montana' },
      { id: 'b', texto: 'Manny Ribera' },
      { id: 'c', texto: 'Alejandro Sosa' },
      { id: 'd', texto: 'Carlito Brigante' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Scarface',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Oliver Stone bautizó al personaje como 'Montana' en honor a Joe Montana, su jugador favorito de fútbol americano."
  },
  {
    id: 33,
    pregunta: "En 'Cadena perpetua' (1994), ¿dónde camufla Andy Dufresne el pequeño martillo de geólogo para evitar que los guardias lo confisquen?",
    opciones: [
      { id: 'a', texto: 'Detrás del póster de Rita Hayworth' },
      { id: 'b', texto: 'Dentro de una Biblia troquelada' },
      { id: 'c', texto: 'En las tuberías del desagüe' },
      { id: 'd', texto: 'Bajo el colchón de su celda' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Shawshank Redemption',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Irónicamente, guarda el martillo a partir del Libro del Éxodo, que narra la fuga y liberación del pueblo elegido."
  },
  {
    id: 34,
    pregunta: "¿Con qué alimento cotidiano compara Shrek a los ogros para explicarle a Asno que tienen varias capas complejas?",
    opciones: [
      { id: 'a', texto: 'Con una tarta de chocolate' },
      { id: 'b', texto: 'Con las cebollas' },
      { id: 'c', texto: 'Con las patatas' },
      { id: 'd', texto: 'Con las manzanas' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Shrek',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Asno sugiere como mejor alternativa compararlos con un pastel, alegando que a todo el mundo le gustan los pasteles."
  },
  {
    id: 35,
    pregunta: "¿Cuántos asesinatos rituales inspirados en los pecados capitales investigan en el asfixiante thriller 'Se7en' (1995)?",
    opciones: [
      { id: 'a', texto: '5 asesinatos' },
      { id: 'b', texto: '7 asesinatos' },
      { id: 'c', texto: '6 asesinatos' },
      { id: 'd', texto: '10 asesinatos' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Se7en',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Gula, Avaricia, Pereza, Lujuria, Soberbia, Envidia e Ira estructuran la macabra obra del asesino John Doe."
  },
  {
    id: 36,
    pregunta: "En 'Mad Max: Furia en la carretera' (2015), ¿qué objeto bizarro lleva incorporado el camión del guitarrista ciego de Immortan Joe?",
    opciones: [
      { id: 'a', texto: 'Un cañón de pinchos' },
      { id: 'b', texto: 'Un lanzallamas en el mástil de la guitarra' },
      { id: 'c', texto: 'Una jaula llena de cuervos' },
      { id: 'd', texto: 'Un ariete hidráulico' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Mad Max: Fury Road',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El director George Miller exigió que la guitarra funcionase de verdad y lanzase fuego real mediante control físico."
  },
  {
    id: 37,
    pregunta: "¿En qué inhóspito y remoto planetoide desértico localiza la tripulación de la Nostromo los huevos de Xenomorfo en 'Alien' (1979)?",
    opciones: [
      { id: 'a', texto: 'LV-426' },
      { id: 'b', texto: 'Tatooine' },
      { id: 'c', texto: 'Pandora' },
      { id: 'd', texto: 'Solaris' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Alien',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Posteriormente se convirtió en una colonia humana asolada en la secuela de acción 'Aliens: El regreso'."
  },
  {
    id: 38,
    pregunta: "¿Cómo se llama el aislado y terrorífico complejo hotelero invernal donde Jack Torrance pierde la cordura en 'El Resplandor' (1980)?",
    opciones: [
      { id: 'a', texto: 'Bates Motel' },
      { id: 'b', texto: 'Hotel Overlook' },
      { id: 'c', texto: 'Dolphin Hotel' },
      { id: 'd', texto: 'Hotel Grand Budapest' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Shining',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Stephen King se inspiró en su estancia real en el Stanley Hotel para escribir la aclamada novela de terror."
  },
  {
    id: 39,
    pregunta: "En la mítica película familiar 'E.T., el extraterrestre' (1982), ¿qué dulce utiliza Elliott para ganarse la confianza del tierno alienígena?",
    opciones: [
      { id: 'a', texto: 'M&M\'s' },
      { id: 'b', texto: 'Reese\'s Pieces (Chocolates de cacahuete)' },
      { id: 'c', texto: 'Ositos de gominola' },
      { id: 'd', texto: 'Bastones de caramelo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'E.T. the Extra-Terrestrial',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "M&M's rechazó la oferta publicitaria pensando que el muñeco asustaría a los niños. Las ventas de Reese's se triplicaron tras el estreno."
  },
  {
    id: 40,
    pregunta: "¿Qué icónica película de animación de Pixar estrenada en 1995 revolucionó la industria al ser el primer largometraje creado íntegramente por ordenador?",
    opciones: [
      { id: 'a', texto: 'Bichos' },
      { id: 'b', texto: 'Toy Story' },
      { id: 'c', texto: 'Shrek' },
      { id: 'd', texto: 'Monstruos, S.A.' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Toy Story',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su director, John Lasseter, recibió un premio Óscar especial a los logros técnicos por este monumental hito industrial."
  },
  {
    id: 41,
    pregunta: "¿Quién interpreta con maestría al brillante y trastornado científico Otto Octavius en la aclamada 'Spider-Man 2' (2004)?",
    opciones: [
      { id: 'a', texto: 'Willem Dafoe' },
      { id: 'b', texto: 'Alfred Molina' },
      { id: 'c', texto: 'Thomas Haden Church' },
      { id: 'd', texto: 'Jake Gyllenhaal' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Spider-Man 2',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Alfred Molina aceptó el papel entusiasmado porque es un gran fan de los cómics de Marvel desde su infancia."
  },
  {
    id: 42,
    pregunta: "En la obra maestra de la animación de Disney de 1994, ¿qué cinta se abre con la icónica canción 'El ciclo de la vida'?",
    opciones: [
      { id: 'a', texto: 'Aladdín' },
      { id: 'b', texto: 'El Rey León' },
      { id: 'c', texto: 'La Bella y la Bestia' },
      { id: 'd', texto: 'Pocahontas' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Lion King',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Es una de las películas de animación tradicional más taquilleras de todos los tiempos y se inspiró en Hamlet de Shakespeare."
  },
  {
    id: 43,
    pregunta: "En 'Django Desencadenado' (2012), ¿qué actor se cutó accidentalmente la mano con un cristal y continuó la escena sangrando sin salir del personaje?",
    opciones: [
      { id: 'a', texto: 'Jamie Foxx' },
      { id: 'b', texto: 'Christoph Waltz' },
      { id: 'c', texto: 'Leonardo DiCaprio' },
      { id: 'd', texto: 'Samuel L. Jackson' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'Django Unchained',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Tarantino quedó tan impresionado por la intensidad de DiCaprio que decidió mantener esa toma exacta en el montaje final."
  },
  {
    id: 44,
    pregunta: "Dirigida por James Cameron, ¿cuál es la película más taquillera de la historia del cine (sin ajustar por inflación)?",
    opciones: [
      { id: 'a', texto: 'Avengers: Endgame' },
      { id: 'b', texto: 'Avatar' },
      { id: 'c', texto: 'Titanic' },
      { id: 'd', texto: 'Star Wars: El despertar de la Fuerza' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Avatar',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Perdió el puesto brevemente ante Endgame, pero un posterior reestreno estratégico en cines la devolvió al primer puesto histórico."
  },
  {
    id: 45,
    pregunta: "En la mítica e independiente 'Donnie Darko' (2001), ¿de qué animal es el siniestro disfraz que acecha al protagonista?",
    opciones: [
      { id: 'a', texto: 'Un oso negro' },
      { id: 'b', texto: 'Un conejo gigante' },
      { id: 'c', texto: 'Un ciervo con cuernos' },
      { id: 'd', texto: 'Un lobo gris' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Donnie Darko',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El perturbador diseño de Frank el conejo es uno de los elementos visuales más reconocibles y parodiados del cine independiente americano."
  },
  {
    id: 46,
    pregunta: "¿Qué director es conocido por crear la saga de terror 'Posesión infernal' (Evil Dead) y la primera trilogía cinematográfica de 'Spider-Man'?",
    opciones: [
      { id: 'a', texto: 'Sam Raimi' },
      { id: 'b', texto: 'James Wan' },
      { id: 'c', texto: 'Wes Craven' },
      { id: 'd', texto: 'Guillermo del Toro' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'The Evil Dead',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Raimi suele incluir su coche personal, un Oldsmobile Delta 88 de 1973, haciendo un cameo en casi todas sus producciones."
  },
  {
    id: 47,
    pregunta: "En la estilizada versión cinematográfica 'Romeo + Julieta' (1996), ¿qué elementos modernos sustituyen por completo a las clásicas espadas?",
    opciones: [
      { id: 'a', texto: 'Láseres de neón' },
      { id: 'b', texto: 'Pistolas automáticas' },
      { id: 'c', texto: 'Navajas de afeitar' },
      { id: 'd', texto: 'Bates de béisbol' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Romeo + Juliet',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Las pistolas de los Capuleto y Montesco llevan grabadas palabras como 'Dagger' (Daga) para encajar con los diálogos originales."
  },
  {
    id: 48,
    pregunta: "¿Qué legendario actor estadounidense protagonizó las obras maestras 'La ventana indiscreta' y 'Vértigo' de Alfred Hitchcock?",
    opciones: [
      { id: 'a', texto: 'Cary Grant' },
      { id: 'b', texto: 'James Stewart' },
      { id: 'c', texto: 'Humphrey Bogart' },
      { id: 'd', tracking: 'Gregory Peck' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Rear Window',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "James Stewart colaboró estrechamente con Hitchcock en cuatro de sus películas más complejas y psicológicas."
  },
  {
    id: 49,
    pregunta: "En la aclamada saga Star Wars, ¿cuál es el nombre de la emblemática nave contrabandista capitaneada por Han Solo?",
    opciones: [
      { id: 'a', texto: 'Destructor Estelar' },
      { id: 'b', texto: 'Halcón Milenario' },
      { id: 'c', texto: 'Caza TIE' },
      { id: 'd', texto: 'Enterprise' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Star Wars',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "George Lucas admitió que se inspiró vagamente en la silueta de una hamburguesa mordida con una aceituna al lado."
  },
  {
    id: 50,
    pregunta: "¿Qué película de terror de 1999 popularizó el formato de 'metraje encontrado' narrando la desaparición de tres estudiantes en un bosque?",
    opciones: [
      { id: 'a', texto: 'El proyecto de la bruja de Blair' },
      { id: 'b', texto: 'Paranormal Activity' },
      { id: 'c', texto: 'Rec' },
      { id: 'd', cloverfield: 'Cloverfield' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'The Blair Witch Project',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su campaña de marketing fue tan brillante que mucha gente asistió al cine creyendo que los sucesos y las muertes eran reales."
  },
  {
    id: 51,
    pregunta: "En la aclamada serie 'Breaking Bad', ¿cómo se llama la cadena de comida rápida especializada en pollo frito que utiliza Gus Fring como fachada?",
    opciones: [
      { id: 'a', texto: 'Madre\'s Chicken' },
      { id: 'b', texto: 'Los Pollos Hermanos' },
      { id: 'c', texto: 'Pollos del Desierto' },
      { id: 'd', texto: 'Albuquerque Fried Chicken' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Breaking Bad',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El local real donde se rodaron las escenas es un restaurante llamado 'Twisters' situado en Albuquerque, Nuevo México."
  },
  {
    id: 52,
    pregunta: "En 'Game of Thrones' (Juego de Tronos), ¿qué trágica e icónica canción suena durante los preparativos de la infame 'Boda Roja'?",
    opciones: [
      { id: 'a', texto: 'The Bear and the Maiden Fair' },
      { id: 'b', texto: 'The Rains of Castamere' },
      { id: 'c', texto: 'Jenny of Oldstones' },
      { id: 'd', texto: 'The Light of the Seven' }
    ],
    respuestaCorrecta: 'b',
    youtubeId: 'ECewrAld37M',
    tituloPelicula: 'Game of Thrones',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La letra narra la implacable victoria de Tywin Lannister sobre la rebelión de la Casa Reyne, sirviendo como aviso de muerte para los Stark."
  },
  {
    id: 53,
    pregunta: "En el clásico musical de 1939 'El Mago de Oz', ¿de qué color eran originalmente los zapatos de Dorothy en la novela, antes de cambiarlos por el rojo rubí en el cine?",
    opciones: [
      { id: 'a', texto: 'Dorados' },
      { id: 'b', texto: 'Plateados' },
      { id: 'c', texto: 'Azules' },
      { id: 'd', texto: 'Verdes esmeralda' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Wizard of Oz',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "En el libro eran de plata. Los guionistas los cambiaron a rojo brillante para aprovechar al máximo el nuevo y revolucionario Technicolor."
  },
  {
    id: 54,
    pregunta: "En el tenso thriller 'No es país para viejos' (2007), ¿qué peculiar y silenciosa arma utiliza el implacable asesino Anton Chigurh?",
    opciones: [
      { id: 'a', texto: 'Una pistola con silenciador casero' },
      { id: 'b', texto: 'Un cable de acero de piano' },
      { id: 'c', texto: 'Una pistola de perno cautivo para ganado' },
      { id: 'd', texto: 'Un rifle de francotirador modificado' }
    ],
    respuestaCorrecta: 'c',
    tituloPelicula: 'No Country for Old Men',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La pistola neumática de perno cautivo funciona con tanques de aire comprimido, permitiéndole forzar cerraduras y ejecutar objetivos sin dejar balas."
  },
  {
    id: 55,
    pregunta: "En la serie de culto 'Stranger Things', ¿cuál es el alimento ultraprocesado y congelado por el que Eleven desarrolla una absoluta obsesión?",
    opciones: [
      { id: 'a', texto: 'Gofres Eggo' },
      { id: 'b', texto: 'Barritas Twinkies' },
      { id: 'c', texto: 'Pizzas congeladas' },
      { id: 'd', texto: 'Donuts glaseados' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Stranger Things',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La marca Eggo experimentó un repunte masivo de menciones y ventas tras el estreno de la primera temporada en Netflix."
  },
  {
    id: 56,
    pregunta: "En la aclamada película de suspenso 'El sexto sentido' (1999), ¿qué condición contractual aceptó Bruce Willis que acabó generándole una fortuna histórica?",
    opciones: [
      { id: 'a', texto: 'Cobrar el triple del salario habitual en Hollywood' },
      { id: 'b', texto: 'Un salario bajo a cambio de un porcentaje de la taquilla total' },
      { id: 'c', texto: 'Elegir personalmente al niño protagonista' },
      { id: 'd', texto: 'Derechos totales de propiedad sobre las secuelas' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Sixth Sense',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aceptó solo 14 millones iniciales a cambio del 17% de la recaudación. Al ser un éxito mundial, terminó ganando más de 100 millones de dólares."
  },
  {
    id: 57,
    pregunta: "En el misterioso final de la mítica serie de gángsters 'Los Soprano', ¿qué famosa canción suena en la gramola justo antes del fundido a negro?",
    opciones: [
      { id: 'a', texto: 'My Way de Frank Sinatra' },
      { id: 'b', texto: 'Don\'t Stop Believin\' de Journey' },
      { id: 'c', texto: 'Hotel California de Eagles' },
      { id: 'd', texto: 'Paint It Black de The Rolling Stones' }
    ],
    respuestaCorrecta: 'b',
    youtubeId: 'VcjZk_m0bS0',
    tituloPelicula: 'The Sopranos',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El abrupto corte del audio y vídeo a mitad de la canción provocó que miles de espectadores llamasen a sus operadoras pensando que el cable se había roto."
  },
  {
    id: 58,
    pregunta: "En la obra de Scorsese 'Uno de los nuestros' (Goodfellas, 1990), ¿cómo surgió la icónica y tensa escena de Joe Pesci preguntando '¿Cómo que divertido?'?",
    opciones: [
      { id: 'a', texto: 'Fue totalmente improvisada por los actores basándose en una vivencia real de Pesci' },
      { id: 'b', texto: 'Tomó dos meses de escritura por parte de Scorsese' },
      { id: 'c', texto: 'Fue copiada de un guion clásico de teatro italiano' },
      { id: 'd', texto: 'Surgió por un error de Pesci al olvidar su diálogo real' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Goodfellas',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Pesci le contó a Scorsese que una vez le dijo a un mafioso real que era divertido y este se enfureció. Scorsese lo incluyó ensayándolo a escondidas."
  },
  {
    id: 59,
    pregunta: "En la influyente serie 'Perdidos' (Lost), ¿cuál es la famosa e intrigante secuencia numérica que Hurley utiliza para ganar la lotería?",
    opciones: [
      { id: 'a', texto: '1, 2, 3, 4, 5, 6' },
      { id: 'b', texto: '4, 8, 15, 16, 23, 42' },
      { id: 'c', texto: '7, 14, 21, 28, 35, 49' },
      { id: 'd', texto: '9, 11, 22, 33, 44, 55' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Lost',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Esos números debían ser introducidos cada 108 minutos en el ordenador de la estación 'El Cisne' para supuestamente salvar al mundo."
  },
  {
    id: 60,
    pregunta: "En la revolucionaria secuela de acción 'Terminator 2: El juicio final' (1991), ¿de qué material compuesto está hecho el implacable modelo de villano T-1000?",
    opciones: [
      { id: 'a', texto: 'Titanio reforzado' },
      { id: 'b', texto: 'Polialeación mimética (Metal líquido)' },
      { id: 'c', texto: 'Nanobots de carbono' },
      { id: 'd', texto: 'Plasmorita maleable' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Terminator 2: Judgment Day',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Para lograr el sonido de los impactos de bala abriéndose en el cuerpo de metal líquido, el diseñador de sonido vertió puré de patatas en un cuenco."
  },
  {
    id: 61,
    pregunta: "En la versión estadounidense de la comedia de oficina 'The Office', ¿cuál es el principal producto agrícola que Dwight Schrute cultiva en su granja familiar?",
    opciones: [
      { id: 'a', texto: 'Patatas dulces' },
      { id: 'b', texto: 'Remolachas' },
      { id: 'c', texto: 'Maíz dulce' },
      { id: 'd', texto: 'Zanahorias orgánicas' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Office',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La granja 'Schrute Farms' ofrece además un bizarro servicio de alojamiento turístico (Bed & Breakfast) tematizado."
  },
  {
    id: 62,
    pregunta: "En la sátira criminal 'American Psycho' (2000), ¿por qué compiten de forma desquiciada, enfermiza y obsesiva los ejecutivos de Wall Street?",
    opciones: [
      { id: 'a', texto: 'Por el modelo de reloj de pulsera' },
      { id: 'b', texto: 'Por el diseño de sus tarjetas de visita' },
      { id: 'c', texto: 'Por la marca de su traje hecho a medida' },
      { id: 'd', texto: 'Por el tamaño de sus oficinas de esquina' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'American Psycho',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Patrick Bateman sufre una crisis de ansiedad al ver que la tarjeta de su colega tiene una marca de agua superior y tipografía 'Silian Rail'."
  },
  {
    id: 63,
    pregunta: "En la obra de arte de Studio Ghibli 'El viaje de Chihiro' (2001), ¿en qué animales se transforman los padres de Chihiro tras comer comida sagrada?",
    opciones: [
      { id: 'a', texto: 'En ranas gigantes' },
      { id: 'b', texto: 'En cerdos' },
      { id: 'c', texto: 'En cuervos' },
      { id: 'd', texto: 'En lobos' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Spirited Away',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Hayao Miyazaki explicó que la transformación simboliza cómo la avaricia y el consumismo desmedido transforman a las personas."
  },
  {
    id: 64,
    pregunta: "La revolucionaria serie de misterio 'Twin Peaks' (1990) paralizó al mundo entero bajo una única e inquietante pregunta de marketing. ¿Cuál era?",
    opciones: [
      { id: 'a', texto: '¿Dónde está el agente Cooper?' },
      { id: 'b', texto: '¿Quién mató a Laura Palmer?' },
      { id: 'c', texto: '¿Qué ocurre en el Bosque Blanco?' },
      { id: 'd', texto: '¿Quién es el gigante?' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Twin Peaks',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "David Lynch nunca quiso resolver el misterio, pero la cadena ABC le obligó a revelar el asesino a mitad de la segunda temporada."
  },
  {
    id: 65,
    pregunta: "En el rompecabezas psicológico de Christopher Nolan 'Memento' (2000), ¿qué condición médica sufre el protagonista Leonard Shelby?",
    opciones: [
      { id: 'a', texto: 'Ceguera psicosomática' },
      { id: 'b', texto: 'Amnesia anterógrada (Incapacidad para crear nuevos recuerdos)' },
      { id: 'c', texto: 'Trastorno de identidad disociativo' },
      { id: 'd', texto: 'Esquizofrenia paranoide' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Memento',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Para que el espectador experimente la misma confusión que Leonard, las escenas a color de la película se narran en orden cronológico inverso."
  },
  {
    id: 66,
    pregunta: "En el aclamado spin-off 'Better Call Saul', ¿cuál es el verdadero nombre de nacimiento del abogado antes de adoptar el alias de Saul Goodman?",
    opciones: [
      { id: 'a', texto: 'Kimball Wexler' },
      { id: 'b', texto: 'James Morgan McGill' },
      { id: 'c', texto: 'Howard Hamlin' },
      { id: 'd', texto: 'Charles Lindbergh' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Better Call Saul',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El nombre artístico 'Saul Goodman' proviene de la frase rápida en inglés 'It's all good, man' ('Todo está bien, tío')."
  },
  {
    id: 67,
    pregunta: "¿Qué misterioso, tullido e infame genio criminal articula los hilos del suspenso en la cinta 'Sospechosos habituales' (1995)?",
    opciones: [
      { id: 'a', texto: 'Dean Keaton' },
      { id: 'b', texto: 'Keyser Söze' },
      { id: 'c', texto: 'Kobayashi' },
      { id: 'd', texto: 'Verbal Kint' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Usual Suspects',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El actor Kevin Spacey se pegó los dedos de la mano con pegamento para simular de forma realista la parálisis cerebral de su tapadera."
  },
  {
    id: 68,
    pregunta: "En el drama corporativo 'Succession', ¿cómo se llama el colosal imperio multimillonario de medios de comunicación de la familia Roy?",
    opciones: [
      { id: 'a', texto: 'Ecomedia Corp' },
      { id: 'b', texto: 'Waystar Royco' },
      { id: 'c', texto: 'Pierce Global' },
      { id: 'd', texto: 'ATN Enterprises' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Succession',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La corporación de ficción está fuertemente inspirada en imperios de la vida real como News Corp de la familia Murdoch."
  },
  {
    id: 69,
    pregunta: "En la galardonada cinta histórica 'Amadeus' (1984), ¿qué estridente rasgo de personalidad de Wolfgang Amadeus Mozart saca de quicio a Salieri?",
    opciones: [
      { id: 'a', texto: 'Su hábito de morderse las uñas' },
      { id: 'b', texto: 'Su risa chillona e infantil' },
      { id: 'c', texto: 'Su extrema arrogancia física' },
      { id: 'd', texto: 'Su obsesión por vestir siempre de rojo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Amadeus',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El actor Tom Hulce diseñó esa peculiar risa tras leer cartas históricas de la época donde describían la risa de Mozart como un metal arañado."
  },
  {
    id: 70,
    pregunta: "En la mítica sitcom 'Friends', ¿de dónde salió el icónico sofá naranja del café Central Perk en el que se sientan los protagonistas?",
    opciones: [
      { id: 'a', texto: 'Fue comprado en una subasta de lujo en Nueva York' },
      { id: 'b', texto: 'Fue rescatado del sótano de los estudios de Warner Bros' },
      { id: 'c', texto: 'Lo fabricó a mano el equipo de carpintería del show' },
      { id: 'd', texto: 'Era un mueble personal traído por Jennifer Aniston' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Friends',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El diseñador de producción lo encontró abandonado acumulando polvo en un almacén del estudio y se convirtió en el eje central de la serie."
  },
  {
    id: 71,
    pregunta: "En 'Olvídate de mí' (Eternal Sunshine of the Spotless Mind, 2004), ¿cómo se llama la clínica médica secreta encargada de borrar recuerdos dolorosos?",
    opciones: [
      { id: 'a', texto: 'Lethe Technologies' },
      { id: 'b', texto: 'Lacuna Inc.' },
      { id: 'c', texto: 'Memory Off Corp' },
      { id: 'd', texto: 'Oblivion Diagnostics' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Eternal Sunshine of the Spotless Mind',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El término 'Lacuna' proviene del latín y significa literalmente 'espacio vacío' o 'brecha'."
  },
  {
    id: 72,
    pregunta: "¿En qué ciudad industrial de Inglaterra se ambienta el violento imperio criminal de los Shelby en 'Peaky Blinders'?",
    opciones: [
      { id: 'a', texto: 'Londres' },
      { id: 'b', texto: 'Birmingham' },
      { id: 'c', texto: 'Liverpool' },
      { id: 'd', texto: 'Manchester' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Peaky Blinders',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aunque se ambienta en Birmingham, gran parte de la serie se rodó realmente en Liverpool debido a la arquitectura de época conservada."
  },
  {
    id: 73,
    pregunta: "En la legendaria serie policiaca 'The Wire', ¿qué canción infantil silba de forma siniestra el justiciero callejero Omar Little antes de cometer un asalto?",
    opciones: [
      { id: 'a', texto: 'Twinkle Twinkle Little Star' },
      { id: 'b', texto: 'The Farmer in the Dell' },
      { id: 'c', texto: 'London Bridge Is Falling Down' },
      { id: 'd', texto: 'Humpty Dumpty' }
    ],
    respuestaCorrecta: 'b',
    youtubeId: 'e2Z0r6g_4IE',
    tituloPelicula: 'The Wire',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El silbido infundía tal terror en las esquinas de Baltimore que los camellos huían despavoridos con solo oír las primeras notas."
  },
  {
    id: 74,
    pregunta: "En la asfixiante película de terror folk 'Midsommar' (2019), ¿en qué país europeo se localiza la remota y siniestra comuna del festival del solsticio?",
    opciones: [
      { id: 'a', texto: 'Islandia' },
      { id: 'b', texto: 'Suecia' },
      { id: 'c', texto: 'Noruega' },
      { id: 'd', texto: 'Finlandia' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Midsommar',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aunque la historia transcurre en Suecia, las leyes del país prohibían rodar tantas horas bajo el sol a niños, por lo que se rodó en Hungría."
  },
  {
    id: 75,
    pregunta: "En la compleja serie alemana de viajes en el tiempo 'Dark' (Netflix), ¿cómo se llama el misterioso pueblo rodeado de bosques y presidido por una planta nuclear?",
    opciones: [
      { id: 'a', texto: 'Bramsche' },
      { id: 'b', texto: 'Winden' },
      { id: 'c', texto: 'Schwarzwald' },
      { id: 'd', texto: 'Heidelberg' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Dark',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El pueblo de Winden no existe como tal; es un nombre ficticio creado combinando la palabra alemana para 'giro' o 'bucle' (Wendung)."
  },
  {
    id: 76,
    pregunta: "En la aclamada serie dramática 'Mad Men', ¿cuál es la verdadera identidad de nacimiento que oculta el carismático publicista Don Draper?",
    opciones: [
      { id: 'a', texto: 'Roger Sterling' },
      { id: 'b', texto: 'Dick Whitman' },
      { id: 'c', texto: 'Robert Campbell' },
      { id: 'd', texto: 'Arthur Miller' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Mad Men',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Intercambió sus placas de identificación con su teniente fallecido durante la Guerra de Corea para forjarse un futuro limpio."
  },
  {
    id: 77,
    pregunta: "En el universo de ciencia ficción de 'Dune', ¿cuál es el nombre de la valiosa sustancia psicotrópica codiciada por todo el imperio galáctico?",
    opciones: [
      { id: 'a', texto: 'El Elíxir de Arrakis' },
      { id: 'b', texto: 'La Especia Melange' },
      { id: 'c', texto: 'El Polvo Estelar' },
      { id: 'd', texto: 'La Esencia de Shai-Hulud' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Dune',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La especia permite la navegación interestelar y prolonga la vida, pero tiñe los ojos de los consumidores habituales de un color azul intenso."
  },
  {
    id: 78,
    pregunta: "En la multipremiada miniserie histórica 'Chernobyl' (2019), ¿qué material nuclear esparcido por el suelo del tejado intentan ocultar los oficiales?",
    opciones: [
      { id: 'a', texto: 'Uranio líquido' },
      { id: 'b', texto: 'Bloques de grafito del núcleo' },
      { id: 'c', texto: 'Placas de plomo derretido' },
      { id: 'd', texto: 'Barra de cesio radiactivo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Chernobyl',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La presencia de grafito en el exterior demostraba de forma indiscutible que el núcleo del reactor había explotado, desmintiendo la versión oficial."
  },
  {
    id: 79,
    pregunta: "En la cinta de terror psicológico 'Déjame salir' (Get Out, 2017), ¿cómo se llama la dimensión hipnótica y vacía a la que es enviado el protagonista?",
    opciones: [
      { id: 'a', texto: 'La Prisión Mental' },
      { id: 'b', texto: 'El Lugar Hundido (The Sunken Place)' },
      { id: 'c', texto: 'El Vacío Oscuro' },
      { id: 'd', texto: 'La Dimensión del Olvido' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Get Out',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El director Jordan Peele explicó que representa la parálisis y la supresión de la voz de las minorías marginadas."
  },
  {
    id: 80,
    pregunta: "En el episodio piloto de 'Los Simpson' emitido en 1989, ¿qué garrafal error de animación sufrió el personaje de Waylon Smithers?",
    opciones: [
      { id: 'a', texto: 'Tenía tres brazos' },
      { id: 'b', texto: 'Fue pintado con la piel de color negro' },
      { id: 'c', texto: 'No tenía pelo' },
      { id: 'd', texto: 'Su voz estaba distorsionada electrónicamente' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Simpsons',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El coloreado inicial fue un error técnico de los animadores en Corea. Decidieron corregirlo en el siguiente episodio para evitar malentendidos."
  },
  {
    id: 81,
    pregunta: "En la salvaje obra de culto coreana 'Oldboy' (2003), ¿qué impactante hazaña gastronómica real realizó el actor Choi Min-sik en una toma?",
    opciones: [
      { id: 'a', texto: 'Beber dos litros de alcohol puro' },
      { id: 'b', texto: 'Comerse un pulpo vivo entero' },
      { id: 'c', texto: 'Masticar cristales de azúcar simulados' },
      { id: 'd', texto: 'Tragar un pez globo venenoso cocinado' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Oldboy',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El actor es budista vegetariano y tuvo que rezar pidiendo perdón a cada uno de los 4 pulpos vivos que tuvo que comerse durante los rodajes."
  },
  {
    id: 82,
    pregunta: "En el fenómeno global de Netflix 'El juego del calamar', ¿cuál es el primer y letal juego infantil de eliminación masiva al que se enfrentan?",
    opciones: [
      { id: 'a', texto: 'El juego de la cuerda' },
      { id: 'b', texto: 'Luz roja, luz verde' },
      { id: 'c', texto: 'El panal de azúcar' },
      { id: 'd', texto: 'Las canicas' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Squid Game',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La muñeca robótica gigante existe en la realidad y custodia la entrada de un museo de carruajes en Jincheon, Corea del Sur."
  },
  {
    id: 83,
    pregunta: "La obra maestra del cine judicial '12 hombres sin piedad' (1957) destaca por una extrema limitación de escenario. ¿Cuál?",
    opciones: [
      { id: 'a', texto: 'Se rodó íntegramente de noche en exteriores' },
      { id: 'b', texto: 'Casi el 95% de la cinta transcurre dentro de la misma sala de deliberación' },
      { id: 'c', texto: 'Fue filmada usando una sola toma continua sin cortes' },
      { id: 'd', texto: 'Los actores nunca se sientan en toda la película' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: '12 Angry Men',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Para acentuar la claustrofobia y la tensión del debate, el director Sidney Lumet cambió los lentes de cámara a focales cada vez más cerradas."
  },
  {
    id: 84,
    pregunta: "En la sofisticada adaptación de la BBC 'Sherlock', ¿cuál es la mítica dirección de la calle de Londres donde se ubica el apartamento de Holmes?",
    opciones: [
      { id: 'a', texto: '10 Downing Street' },
      { id: 'b', texto: '221B Baker Street' },
      { id: 'c', texto: '4 Privet Drive' },
      { id: 'd', texto: '742 Evergreen Terrace' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Sherlock',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Como la calle Baker Street real está plagada de turistas y carteles de Sherlock, rodaron las fachadas en North Gower Street."
  },
  {
    id: 85,
    pregunta: "¿Qué espectacular hito histórico comparte la colosal película épica 'Ben-Hur' (1959) junto a 'Titanic' y 'El retorno del rey'?",
    opciones: [
      { id: 'a', texto: 'Haber tardado más de diez años en rodarse' },
      { id: 'b', texto: 'Poseer el récord histórico de mayor número de premios Óscar ganados (11)' },
      { id: 'c', texto: 'No haber usado dobles de acción en ninguna toma' },
      { id: 'd', texto: 'Haber quebrado las finanzas del estudio antes del estreno' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Ben-Hur',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Ben-Hur fue la primera en lograr los 11 galardones, un récord imbatible en la historia moderna de la Academia."
  },
  {
    id: 86,
    pregunta: "Tanto la película original de 1996 como la aclamada serie antológica 'Fargo' abren siempre cada episodio con un texto que afirma:",
    opciones: [
      { id: 'a', texto: 'Que es una parodia de eventos reales' },
      { id: 'b', texto: 'Que los hechos narrados se basan estrictamente en una historia real' },
      { id: 'c', texto: 'Que todo es producto de la imaginación de un novelista' },
      { id: 'd', texto: 'Que los nombres reales han sido mantenidos por ley' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Fargo',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "¡Es mentira! Los hermanos Coen admitieron que toda la historia es 100% ficción y que pusieron el texto como un truco para atrapar al espectador."
  },
  {
    id: 87,
    pregunta: "En la desgarradora joya brasileña 'Ciudad de Dios' (2002), ¿cuál es el apodo del joven fotógrafo protagonista que narra la guerra de favelas?",
    opciones: [
      { id: 'a', texto: 'Zé Pequeno' },
      { id: 'b', texto: 'Buscapé (Cohete)' },
      { id: 'c', texto: 'Bené' },
      { id: 'd', texto: 'Sandro Cenoura' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'City of God',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La mayoría de los actores eran jóvenes residentes reales de las favelas de Río de Janeiro sin experiencia previa en cine."
  },
  {
    id: 88,
    pregunta: "La serie histórica de Netflix 'The Crown' desató una inmensa polémica en la industria televisiva tras revelarse un dato sobre el salario de Claire Foy (la reina Isabel):",
    opciones: [
      { id: 'a', texto: 'Cobraba el doble que el resto del elenco junto' },
      { id: 'b', texto: 'Cobraba menos dinero que Matt Smith, el actor secundario que hacía de su marido' },
      { id: 'c', texto: 'Se le denegó el sueldo del piloto por normativas británicas' },
      { id: 'd', texto: 'Donó el 90% de sus ganancias a la Corona real' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Crown',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La productora se disculpó alegando que Smith venía de protagonizar Doctor Who, comprometiéndose a que nadie ganaría más que la Reina en adelante."
  },
  {
    id: 89,
    pregunta: "En el monumental spaghetti western 'Hasta que llegó su hora' (1968), ¿qué bizarra técnica musical usó Sergio Leone con Ennio Morricone?",
    opciones: [
      { id: 'a', texto: 'Compuso la música después de destrozar los sets de rodaje' },
      { id: 'b', texto: 'La banda sonora se compuso ANTES del rodaje y se reproducía en altavoces durante las tomas' },
      { id: 'c', texto: 'Usó sonidos reales de disparos sampleados en un teclado' },
      { id: 'd', texto: 'Prohibió la música instrumental usando solo silbidos humanos' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Once Upon a Time in the West',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Esto permitía a los actores como Charles Bronson sincronizar sus miradas y movimientos físicos al compás melódico de la escena."
  },
  {
    id: 90,
    pregunta: "¿A qué elemento tecnológico cotidiano e inanimado hace referencia directa el título de la distópica serie británica 'Black Mirror'?",
    opciones: [
      { id: 'a', texto: 'A las cámaras de seguridad públicas' },
      { id: 'b', texto: 'A las pantallas apagadas de móviles, teles y ordenadores' },
      { id: 'c', texto: 'A los servidores de datos oscuros' },
      { id: 'd', texto: 'A los visores de realidad virtual premium' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Black Mirror',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su creador, Charlie Brooker, explicó que cuando la tecnología nos da la espalda o se apaga, lo único que queda es un frío espejo negro."
  },
  {
    id: 91,
    pregunta: "Durante el rodaje del icónico y feliz número de baile bajo la lluvia en 'Cantando bajo la lluvia' (1952), ¿en qué precario estado de salud se encontraba Gene Kelly?",
    opciones: [
      { id: 'a', texto: 'Tenía una pierna fracturada oculta bajo el pantalón' },
      { id: 'b', texto: 'Tenía más de 39°C de fiebre y delirios climáticos' },
      { id: 'c', texto: 'Estaba completamente sordo temporalmente' },
      { id: 'd', texto: 'Sufrió una ceguera temporal provocada por los focos' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Singin\' in the Rain',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "A pesar del severo malestar físico por la fiebre, Kelly completó la legendaria coreografía chapoteando en el agua en solo un par de tomas."
  },
  {
    id: 92,
    pregunta: "En la magistral primera temporada de la serie policiaca 'True Detective' (2014), ¿qué actor encarnó de forma mítica al filosófico y nihilista detective Rust Cohle?",
    opciones: [
      { id: 'a', texto: 'Woody Harrelson' },
      { id: 'b', texto: 'Matthew McConaughey' },
      { id: 'c', texto: 'Colin Farrell' },
      { id: 'd', texto: 'Mahershala Ali' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'True Detective',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "McConaughey escribió un documento de análisis de 450 páginas titulado 'Las cuatro etapas de Rust Cohle' para entender al personaje."
  },
  {
    id: 93,
    pregunta: "En el estilizado thriller neo-noir 'Drive' (2011), ¿qué icónico animal lleva bordado en hilo dorado la chaqueta de satén blanca de Ryan Gosling?",
    opciones: [
      { id: 'a', texto: 'Un lobo aullando' },
      { id: 'b', texto: 'Un escorpión' },
      { id: 'c', texto: 'Una cobra real' },
      { id: 'd', texto: 'Un águila calva' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Drive',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El diseño se inspiró en la famosa fábula de 'El escorpión y la rana', haciendo alusión a la inevitable naturaleza violenta del conductor."
  },
  {
    id: 94,
    pregunta: "En la serie del universo de Star Wars 'The Mandalorian', ¿cuál es el verdadero nombre biológico de la criatura conocida popularmente en internet como 'Baby Yoda'?",
    opciones: [
      { id: 'a', texto: 'Yaddle' },
      { id: 'b', texto: 'Grogu' },
      { id: 'c', texto: 'Din Grojan' },
      { id: 'd', texto: 'Ahsoka' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Mandalorian',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El secreto de su nombre y apariencia se guardó con tal celo que Disney sacrificó millones de dólares al no fabricar juguetes para Navidad."
  },
  {
    id: 95,
    pregunta: "¿Qué hito técnico e histórico supuso la obra de sátira política antifascista 'El gran dictador' (1940) para la carrera de Charles Chaplin?",
    opciones: [
      { id: 'a', texto: 'Fue su última película grabada en blanco y negro' },
      { id: 'b', texto: 'Fue su primera película completamente hablada (Cine sonoro)' },
      { id: 'c', texto: 'Fue su primera cinta financiada de forma pública' },
      { id: 'd', texto: 'Supuso el primer uso de pantallas verdes primitivas' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Great Dictator',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Chaplin se había resistido firmemente al cine sonoro durante más de una década, continuando con películas mudas magistrales."
  },
  {
    id: 96,
    pregunta: "En la serie de suspense criminal 'Dexter', ¿cuál es la profesión oficial diurna que ejerce el asesino en serie dentro del departamento de policía?",
    opciones: [
      { id: 'a', texto: 'Dibujante de retratos robots' },
      { id: 'b', texto: 'Analista forense de salpicaduras de sangre' },
      { id: 'c', texto: 'Técnico de archivos informáticos' },
      { id: 'd', texto: 'Fotógrafo de escenas del crimen' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Dexter',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su posición privilegiada le permitía destruir u ocultar pruebas de sus propios crímenes de manera impecable."
  },
  {
    id: 97,
    pregunta: "Durante la grabación de la tensa película 'Zodiac' (2007), ¿qué rasgo del director David Fincher llevó al límite la paciencia de Robert Downey Jr.?",
    opciones: [
      { id: 'a', texto: 'Su negativa rotunda a usar guiones escritos en papel' },
      { id: 'b', texto: 'Su obsesión por grabar decenas y decenas de tomas de una misma escena (Más de 70 veces)' },
      { id: 'c', texto: 'Su manía de rodar con frío real extremo dentro del set' },
      { id: 'd', texto: 'Su exigencia de que los actores improvisasen todo el diálogo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Zodiac',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Downey Jr. protestó dejando tarros de orina escondidos por el set debido a que Fincher no les daba descansos ni para ir al servicio."
  },
  {
    id: 98,
    pregunta: "La aclamada comedia dramática de Phoebe Waller-Bridge 'Fleabag' destaca críticamente por el uso brillante de qué recurso teatral y narrativo?",
    opciones: [
      { id: 'a', texto: 'El uso exclusivo de monólogos sin interacción' },
      { id: 'b', texto: 'Romper la cuarta pared (Hablar y mirar directamente a la cámara)' },
      { id: 'c', texto: 'Narrar toda la trama a través de saltos de tiempo futuros' },
      { id: 'd', texto: 'Tener una protagonista que jamás dice una sola palabra' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Fleabag',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "En la segunda temporada, el recurso se eleva genialmente cuando otro personaje (el cura) se da cuenta de que ella se evade hablando a la cámara."
  },
  {
    id: 99,
    pregunta: "En el clásico noir 'El crepúsculo de los dioses' (Sunset Boulevard, 1950), ¿cuál es la mítica e inolvidable frase final que pronuncia la delirante Norma Desmond?",
    opciones: [
      { id: 'a', texto: 'El cine ha muerto, larga vida a la televisión' },
      { id: 'b', texto: 'De acuerdo, Sr. DeMille, estoy lista para mi primer plano' },
      { id: 'c', texto: 'Nunca olviden que yo sigo siendo una gran estrella' },
      { id: 'd', texto: 'Las luces se apagan, pero mi nombre brillará siempre' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Sunset Boulevard',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La frase resume de forma desgarradora la locura de la actriz atrapada en la época dorada del cine mudo, creyendo que rueda una película en vez de ser arrestada."
  },
  {
    id: 100,
    pregunta: "En la película biográfica 'Oppenheimer' (2023), ¿qué complejo hito visual impuso el director Christopher Nolan al equipo de efectos visuales?",
    opciones: [
      { id: 'a', texto: 'Recrear la explosión de la prueba Trinity usando exclusivamente maquetas de hielo' },
      { id: 'b', texto: 'Recrear los efectos cuánticos e históricos sin utilizar un solo plano generado por ordenador (Cero CGI)' },
      { id: 'c', texto: 'Grabar la película entera usando cámaras de visión nocturna militar' },
      { id: 'd', texto: 'Obligar a recrear una detonación atómica real a escala reducida' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Oppenheimer',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Para simular la explosión atómica y las partículas de energía subatómica, combinaron reacciones químicas reales, pólvora, magnesio y gasolina."
  },
  {
    id: 101,
    pregunta: "En la mítica película de aventuras 'En busca del arca perdida' (1981), ¿por qué se decidió que Indiana Jones disparase al imponente espadachín en lugar de tener una larga pelea coreografiada?",
    opciones: [
      { id: 'a', texto: 'El especialista del espadachín se lesionó el brazo' },
      { id: 'b', texto: 'Harrison Ford tenía disentería y estaba exhausto para rodar la pelea completa' },
      { id: 'c', texto: 'Se quedaron sin presupuesto para los efectos de esa escena' },
      { id: 'd', texto: 'Steven Spielberg lo ideó como un chiste de última hora en el montaje' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Raiders of the Lost Ark',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La escena original contemplaba un duelo épico de tres páginas de guion, pero Ford propuso 'simplemente dispararle' para poder ir al baño debido a su enfermedad."
  },
  {
    id: 102,
    pregunta: "En la multipremiada comedia de oficina 'Ted Lasso', ¿qué palabra motivacional está escrita en el icónico cartel amarillo colgado sobre la puerta del despacho del entrenador?",
    opciones: [
      { id: 'a', texto: 'BELIEVE (Cree)' },
      { id: 'b', texto: 'WIN (Gana)' },
      { id: 'c', texto: 'TEAM (Equipo)' },
      { id: 'd', texto: 'SMILE (Sonríe)' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Ted Lasso',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El letrero amarillo torcido se convirtió en el absoluto símbolo de la serie, representando el optimismo inquebrantable de Ted."
  },
  {
    id: 103,
    pregunta: "En la aclamada obra maestra de ciencia ficción y terror 'La cosa' (The Thing, 1982), ¿cómo arranca de forma impactante la película?",
    opciones: [
      { id: 'a', texto: 'Con una transmisión de radio rota desde una base científica' },
      { id: 'b', texto: 'Con un helicóptero persiguiendo y disparando a un perro en la nieve' },
      { id: 'c', texto: 'Con el desentierro de una gigantesca nave bajo el hielo' },
      { id: 'd', texto: 'Con la muerte misteriosa del comandante de la base' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Thing',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Dirigida por John Carpenter, el perro perseguido por los noruegos es en realidad la criatura alienígena infiltrándose en la base americana."
  },
  {
    id: 104,
    pregunta: "En la obra maestra de Stanley Kubrick 'La naranja mecánica' (1971), ¿qué icónica canción canta Alex DeLarge mientras comete el brutal asalto en la casa del escritor?",
    opciones: [
      { id: 'a', texto: 'La Novena Sinfonía de Beethoven' },
      { id: 'b', texto: 'Singin\' in the Rain' },
      { id: 'c', texto: 'Blue Danube' },
      { id: 'd', texto: 'Bohemian Rhapsody' }
    ],
    respuestaCorrecta: 'b',
    youtubeId: 'pL6fM8Y8vLI',
    tituloPelicula: 'A Clockwork Orange',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Fue completamente improvisado por Malcolm McDowell. Kubrick estaba frustrado porque la escena no funcionaba, y le pidió a McDowell que bailara o cantara algo libremente."
  },
  {
    id: 105,
    pregunta: "En la exitosa serie de ciencia ficción y conspiraciones 'Expediente X' (The X-Files), ¿cómo se llamaba la hermana de Fox Mulder cuya abducción obsesionó su carrera?",
    opciones: [
      { id: 'a', texto: 'Samantha' },
      { id: 'b', texto: 'Melissa' },
      { id: 'c', texto: 'Dana' },
      { id: 'd', texto: 'Margaret' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'The X-Files',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La desaparición de Samantha cuando Fox tenía solo 12 años fue el motor principal que le llevó a investigar los Expedientes X del FBI."
  },
  {
    id: 106,
    pregunta: "En la oscarizada película 'Salvar al soldado Ryan' (1998), ¿cuál era la profesión civil en la vida real del capitán John Miller (Tom Hanks) antes de la guerra?",
    opciones: [
      { id: 'a', texto: 'Abogado criminalista' },
      { id: 'b', texto: 'Profesor de literatura de instituto' },
      { id: 'c', texto: 'Mecánico de trenes' },
      { id: 'd', texto: 'Entrenador de béisbol' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Saving Private Ryan',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El personaje guardaba celosamente su profesión para mantener la mística de mando frente a sus soldados, revelándola para calmar una tensa disputa interna."
  },
  {
    id: 107,
    pregunta: "En la aclamada película de animación de Pixar 'Monstruos, S.A.' (2001), ¿cuál es el verdadero nombre de pila de la adorable niña humana Boo?",
    opciones: [
      { id: 'a', texto: 'Emily' },
      { id: 'b', texto: 'Mary' },
      { id: 'c', texto: 'Lily' },
      { id: 'd', texto: 'Alice' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Monsters, Inc.',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aunque nunca se dice en los diálogos, su nombre real es Mary, visible brevemente escrito a mano en uno de los dibujos de su habitación."
  },
  {
    id: 108,
    pregunta: "En la tensa y frenética serie de cocina 'The Bear' (2022), ¿cuál era el nombre original del modesto restaurante de bocadillos de la familia antes de su transformación?",
    opciones: [
      { id: 'a', texto: 'The Original Beef of Chicagoland' },
      { id: 'b', texto: 'Carmy\'s Diner' },
      { id: 'c', texto: 'The Italian Sandwich Shop' },
      { id: 'd', texto: 'Michael\'s Bistro' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'The Bear',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El local real en el que se basa la serie es un establecimiento clásico de Chicago llamado 'Mr. Beef', fundado en 1979."
  },
  {
    id: 109,
    pregunta: "En la película clásica de 1939 'Lo que el viento se llevó', ¿cuál es la legendaria última frase que Rhett Butler le espeta a Scarlett O'Hara?",
    opciones: [
      { id: 'a', texto: 'El mañana será otro día' },
      { id: 'b', texto: 'Sinceramente, querida, me importa un bledo' },
      { id: 'c', texto: 'Nunca volverás a pasar hambre' },
      { id: 'd', texto: 'Fuiste el único amor de mi vida' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Gone with the Wind',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La frase en inglés ('Frankly, my dear, I don\'t give a damn') casi es censurada por la junta de moral de la época por incluir la palabra 'damn'."
  },
  {
    id: 110,
    pregunta: "En el clásico cinematográfico de Alfred Hitchcock 'Vértigo' (De entre los muertos, 1958), ¿qué revolucionario efecto de cámara se inventó para simular la fobia a las alturas?",
    opciones: [
      { id: 'a', texto: 'El barrido panorámico' },
      { id: 'b', texto: 'El Dolly Zoom o "Efecto Vértigo"' },
      { id: 'c', texto: 'La cámara lenta por obturación' },
      { id: 'd', texto: 'El plano holandés extremo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Vertigo',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Se consigue alejando la cámara sobre un raíl a la vez que se acciona el zoom hacia adelante (o viceversa), distorsionando la perspectiva del fondo."
  },
  {
    id: 111,
    pregunta: "En el electrizante largometraje de Quentin Tarantino 'Kill Bill: Vol. 1' (2003), ¿qué famosa melodía silbada suena en el hospital antes del intento de asesinato de La Novia?",
    opciones: [
      { id: 'a', texto: 'Battle Without Honor or Humanity' },
      { id: 'b', texto: 'Twisted Nerve' },
      { id: 'c', texto: 'Bang Bang (My Baby Shot Me Down)' },
      { id: 'd', texto: 'Don\'t Let Me Be Misunderstood' }
    ],
    respuestaCorrecta: 'b',
    youtubeId: 'E84OWq6z3IQ',
    tituloPelicula: 'Kill Bill: Vol. 1',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Compuesta por Bernard Herrmann para la película de 1968 'Twisted Nerve', Tarantino la rescató popularizándola mundialmente en internet."
  },
  {
    id: 112,
    pregunta: "En la serie de superhéroes irreverente 'The Boys', ¿con qué bizarro y polémico líquido muestra el villano Homelander una fijación psicológica recurrente?",
    opciones: [
      { id: 'a', texto: 'Champán de oro líquido' },
      { id: 'b', texto: 'Leche materna humana' },
      { id: 'c', texto: 'Suero compuesto V puro' },
      { id: 'd', texto: 'Agua destilada glacial' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Boys',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Esta fijación visual y perturbadora subraya las profundas carencias maternas y el retorcido complejo de Edipo que arrastra el personaje."
  },
  {
    id: 113,
    pregunta: "En la mítica e independiente comedia 'Schitt\'s Creek', ¿cómo se llama el bizarro y extravagante estilo de vestir y actuar de la matriarca Moira Rose?",
    opciones: [
      { id: 'a', texto: 'Uso constante de pelucas de diseño y un acento transatlántico exagerado' },
      { id: 'b', texto: 'Vestir únicamente ropa deportiva fluorescente' },
      { id: 'c', texto: 'Hablar siempre rimando sus frases' },
      { id: 'd', texto: 'Llevar máscaras teatrales de Venecia en el set' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Schitt\'s Creek',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La actriz Catherine O'Hara eligió personalmente cada una de las pelucas de Moira y creó ese acento indescifrable que fascinó a la crítica."
  },
  {
    id: 114,
    pregunta: "En el aclamado filme de David Fincher 'La red social' (2010), ¿qué tajante sugerencia le hace Sean Parker (Justin Timberlake) a Zuckerberg respecto al nombre de la web?",
    opciones: [
      { id: 'a', texto: 'Que lo registre como un dominio gubernamental (.gov)' },
      { id: 'b', texto: 'Que le quite el \'The\' inicial para dejarlo simplemente en \'Facebook\'' },
      { id: 'c', texto: 'Que lo llame \'FaceBook\' con la letra B mayúscula obligatoria' },
      { id: 'd', texto: 'Que utilice colores amarillos en lugar de azules' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Social Network',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La frase exacta del guion de Aaron Sorkin es: 'Quítale el \'The\'. Queda más limpio: Facebook'."
  },
  {
    id: 115,
    pregunta: "En el icónico film de terror de culto 'El exorcista' (1973), ¿qué alimento común de supermercado utilizó el equipo de efectos para simular el espeso vómito de Regan?",
    opciones: [
      { id: 'a', texto: 'Puré de espinacas concentrado' },
      { id: 'b', texto: 'Sopa de guisantes de la marca Andersen\'s' },
      { id: 'c', texto: 'Guacamole mezclado con leche' },
      { id: 'd', texto: 'Crema de espárragos con colorante vegetal' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Exorcist',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El actor Jason Miller (el padre Karras) no sabía que la sopa saldría disparada a su cara con tanta presión, por lo que su reacción de asco es 100% real."
  },
  {
    id: 116,
    pregunta: "En la mítica película de acción y ciencia ficción 'Predator' (Depredador, 1987), ¿cuál es la famosa frase de urgencia que Arnold Schwarzenegger grita con fuerza hacia la cámara?",
    opciones: [
      { id: 'a', texto: '¡Sayonara, baby!' },
      { id: 'b', texto: '¡Get to the chopper! (¡Al helicóptero!)' },
      { id: 'c', texto: '¡Si sangra, podemos matarlo!' },
      { id: 'd', texto: '¡Volveré!' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Predator',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La entrega vocal de Arnold convirtió esta frase en uno de los memes sonoros más imitados y queridos de la cultura pop."
  },
  {
    id: 117,
    pregunta: "En 'Star Wars: Episodio V - El Imperio Contraataca' (1980), ¿cuál es la línea exacta que Darth Vader le dice a Luke desmintiendo uno de los mitos más grandes del cine?",
    opciones: [
      { id: 'a', texto: 'Luke, yo soy tu padre' },
      { id: 'b', texto: 'No, yo soy tu padre' },
      { id: 'c', texto: 'Tu padre está muerto, yo lo asesiné' },
      { id: 'd', texto: 'Obi-Wan nunca te contó la verdad' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Empire Strikes Back',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Es uno de los 'Efectos Mandela' más famosos. La gente suele citar 'Luke, yo soy tu padre', pero la palabra 'Luke' no figura en esa frase."
  },
  {
    id: 118,
    pregunta: "Durante el accidentado rodaje de la clásica película dramática 'Rocky' (1976), ¿de quién era el perro real que aparece entrenando junto a Sylvester Stallone?",
    opciones: [
      { id: 'a', texto: 'Del propio Sylvester Stallone, ya que no tenía dinero para mantenerlo' },
      { id: 'b', texto: 'De los productores ejecutivos de la cinta' },
      { id: 'c', texto: 'Fue alquilado a una perrera municipal de Filadelfia' },
      { id: 'd', texto: 'Era la mascota del director John G. Avildsen' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Rocky',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Stallone estaba tan arruinado antes de vender el guion que vendió a su perro Butkus por 40 dólares. Cuando le compraron el guion, fue a recuperarlo pagando 15,000 dólares."
  },
  {
    id: 119,
    pregunta: "En la comedia negra criminal de Tarantino 'Reservoir Dogs' (1992), ¿por qué protesta enérgicamente el personaje interpretado por Steve Buscemi?",
    opciones: [
      { id: 'a', texto: 'Porque no quiere usar armas de fuego reales' },
      { id: 'b', texto: 'Porque le asignaron el alias de Sr. Rosa (Mr. Pink)' },
      { id: 'c', texto: 'Porque exige una mayor parte del botín de diamantes' },
      { id: 'd', texto: 'Porque odia tener que vestir un traje negro ajustado' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Reservoir Dogs',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Joe Cabot le asigna los nombres de colores al azar para evitar que los criminales se conozcan entre sí. El Sr. Rosa argumenta que el nombre suena afeminado."
  },
  {
    id: 120,
    pregunta: "En el clásico e imponente spaghetti western 'El bueno, el feo y el malo' (1966), ¿cómo se llama el cementerio circular real reconstruido en Burgos para el duelo final?",
    opciones: [
      { id: 'a', texto: 'Cementerio de San Jerónimo' },
      { id: 'b', texto: 'Cementerio de Sad Hill' },
      { id: 'c', texto: 'Cementerio del Desierto de Almería' },
      { id: 'd', texto: 'Cementerio de Santa Cruz' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Good, the Bad and the Ugly',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El cementerio de Sad Hill fue construido por el ejército español de la época y restaurado íntegramente por voluntarios y fans de la película décadas después."
  },
  {
    id: 121,
    pregunta: "En la mítica obra de animación de Disney 'Aladdín' (1992), ¿qué inusual condición de grabación impuso Robin Williams para dar voz al Genio?",
    opciones: [
      { id: 'a', texto: 'Grabar únicamente a altas horas de la madrugada' },
      { id: 'b', texto: 'Improvisar casi la totalidad de sus diálogos (Grabando más de 16 horas libres)' },
      { id: 'c', texto: 'Exigir que su nombre no figurase en ningún cartel' },
      { id: 'd', texto: 'Que el Genio fuese rediseñado para parecerse a él físicamente' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Aladdin',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su nivel de improvisación fue tan colosal que la película fue descalificada en la categoría de Mejor Guion Adaptado de los Premios Óscar."
  },
  {
    id: 122,
    pregunta: "En la aclamada película de animación 'Wall-E' (2008), ¿cómo se llama el gigantesco monopolio corporativo dueño de la nave Axiom que gobierna la Tierra desértica?",
    opciones: [
      { id: 'a', texto: 'Omni Consumer Products' },
      { id: 'b', texto: 'Buy n Large (BnL)' },
      { id: 'c', texto: 'Cyberdyne Systems' },
      { id: 'd', texto: 'Weyland-Yutani' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'WALL-E',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su logo e ingeniosas canciones publicitarias aparecen en casi todos los residuos, pantallas y productos abandonados en el planeta."
  },
  {
    id: 123,
    pregunta: "En la desgarradora obra de drama fantástico 'La milla verde' (1999), ¿qué reveladora frase pronuncia John Coffey respecto a su propio apellido?",
    opciones: [
      { id: 'a', texto: 'Que es un nombre de origen mitológico anglosajón' },
      { id: 'b', texto: 'Como la bebida, pero no se escribe igual (Like the drink, only not spelled the same)' },
      { id: 'c', texto: 'Que fue inventado por los guardias de la prisión' },
      { id: 'd', texto: 'Que proviene de una palabra africana antigua' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Green Mile',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El papel interpretado magistralmente por Michael Clarke Duncan le valió una nominación al Óscar y el amor eterno del público."
  },
  {
    id: 124,
    pregunta: "En el aclamado clásico de comedia televisiva 'Parks and Recreation', ¿cómo se llama el célebre poni miniatura adorado fanáticamente por los ciudadanos de Pawnee?",
    opciones: [
      { id: 'a', texto: 'Burt Macklin' },
      { id: 'b', texto: 'Li\'l Sebastian (Pequeño Sebastián)' },
      { id: 'c', texto: 'Duke Silver' },
      { id: 'd', texto: 'Champion' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Parks and Recreation',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El personaje de Ben Wyatt es el único en toda la serie que se muestra perplejo ante el absurdo culto masivo que rodea al pequeño animal."
  },
  {
    id: 125,
    pregunta: "En la tensa y claustrofóbica película policiaca 'Heat' (1995), ¿qué hito histórico de Hollywood reunió por primera vez a Al Pacino y Robert De Niro compartiendo escena?",
    opciones: [
      { id: 'a', texto: 'La icónica conversación cara a cara en una mesa de cafetería' },
      { id: 'b', texto: 'El tiroteo masivo a las salidas del banco central' },
      { id: 'c', texto: 'La persecución final en las pistas del aeropuerto' },
      { id: 'd', texto: 'El arresto inicial en el muelle de carga' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Heat',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aunque ambos coincidieron previamente en 'El Padrino II', pertenecían a épocas distintas del relato y jamás cruzaron miradas en pantalla hasta 'Heat'."
  },
  {
    id: 126,
    pregunta: "En la poética y melancólica cinta de romance y ciencia ficción 'Her' (2013), ¿qué famosa actriz dio voz al avanzado sistema operativo inteligente Samantha?",
    opciones: [
      { id: 'a', texto: 'Amy Adams' },
      { id: 'b', texto: 'Scarlett Johansson' },
      { id: 'c', texto: 'Rooney Mara' },
      { id: 'd', texto: 'Natalie Portman' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Her',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Originalmente, el papel fue grabado por Samantha Morton, pero el director Spike Jonze sintió en el montaje que necesitaba una voz con matices distintos."
  },
  {
    id: 127,
    pregunta: "En la mítica película de animación tradicional 'La princesa Mononoke' (1997), ¿cómo se denominan los icónicos y diminutos espíritus que habitan los árboles del bosque sagrado?",
    opciones: [
      { id: 'a', texto: 'Susuwatari' },
      { id: 'b', texto: 'Kodamas' },
      { id: 'c', texto: 'Totoros' },
      { id: 'd', texto: 'Kami' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Princess Mononoke',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Los kodamas hacen un característico sonido de clic seco con la cabeza y su presencia indica que el ecosistema forestal goza de perfecta salud."
  },
  {
    id: 128,
    pregunta: "A pesar de una dilatada e icónica carrera cinematográfica, ¿con qué película logró el legendario director Martin Scorsese ganar su primer y único premio Óscar competitivo a Mejor Director?",
    opciones: [
      { id: 'a', texto: 'Taxi Driver' },
      { id: 'b', texto: 'Infiltrados (The Departed, 2006)' },
      { id: 'c', texto: 'Toro Salvaje' },
      { id: 'd', texto: 'Uno de los nuestros' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Departed',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La estatuilla le fue entregada de manos de sus amigos contemporáneos: Steven Spielberg, George Lucas y Francis Ford Coppola."
  },
  {
    id: 129,
    pregunta: "En la taquillera epopeya de acción '300' (2006), ¿qué frase histórica grita el rey Leónidas (Gerard Butler) justo antes de patear al emisario persa hacia el pozo profundo?",
    opciones: [
      { id: 'a', texto: '¡Por el honor de Grecia!' },
      { id: 'b', texto: '¡Esto es Esparta! (This is Sparta!)' },
      { id: 'c', texto: '¡Cenaremos en el infierno!' },
      { id: 'd', texto: '¡No daremos cuartel!' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: '300',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "En los ensayos, Butler probó a decir la frase en un susurro amenazante, pero al director Zack Snyder le pareció mucho más épico e impactante el grito ensordecedor."
  },
  {
    id: 130,
    pregunta: "En la mítica e irreverente comedia de acción de 1984 'Los Cazafantasmas' (Ghostbusters), ¿cómo se llama el glotón, pegajoso y verde fantasma que se convierte en la mascota no oficial del equipo?",
    opciones: [
      { id: 'a', texto: 'Gozer' },
      { id: 'b', texto: 'Slimer (Moquete)' },
      { id: 'c', texto: 'Zuul' },
      { id: 'd', texto: 'Stay Puft' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Ghostbusters',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El equipo de diseño ideó a Slimer basándose de forma cómica e interna en el espíritu fiestero del fallecido actor John Belushi."
  },
  {
    id: 131,
    pregunta: "En la mítica película de fantasía y aventuras 'La princesa prometida' (1987), ¿cuál es el célebre y repetido discurso de venganza que Íñigo Montoya ensaya constantemente?",
    opciones: [
      { id: 'a', texto: '¡Por la guardia real, ríndete o muere!' },
      { id: 'b', texto: 'Hola, me llamo Íñigo Montoya, tú mataste a mi padre, prepárate a morir' },
      { id: 'c', texto: 'Un espadachín de seis dedos no merece piedad en este reino' },
      { id: 'd', texto: 'Roba mi espada pero jamás escapes de mi acero' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Princess Bride',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El actor Mandy Patinkin confesó que canalizó el dolor real de la pérdida de su propio padre enfermo para rodar con ferocidad la escena final."
  },
  {
    id: 132,
    pregunta: "En el clásico thriller de Hitchcock 'Con la muerte en los talones' (1959), ¿sobre las colosales caras de qué monumento nacional de EE. UU. se produce el tenso clímax final?",
    opciones: [
      { id: 'a', texto: 'La Estatua de la Libertad' },
      { id: 'b', texto: 'El Monte Rushmore' },
      { id: 'c', texto: 'El Monumento a Lincoln' },
      { id: 'd', texto: 'La presa Hoover' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'North by Northwest',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Las autoridades gubernamentales prohibieron rodar escenas violentas sobre las efigies reales, por lo que el equipo recreó réplicas exactas en maquetas de estudio."
  },
  {
    id: 133,
    pregunta: "Antes de asignarle el papel definitivo de villano a Arnold Schwarzenegger en 'Terminator' (1984), ¿qué famosa celebridad estadounidense fue considerada seriamente por los productores?",
    opciones: [
      { id: 'a', texto: 'Sylvester Stallone' },
      { id: 'b', texto: 'O.J. Simpson' },
      { id: 'c', texto: 'Mel Gibson' },
      { id: 'd', texto: 'Tom Selleck' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Terminator',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El director James Cameron descartó la idea porque pensó que O.J. Simpson lucía 'demasiado tierno y amigable' como para que el público creyese que era un asesino frío."
  },
  {
    id: 134,
    pregunta: "En la oscarizada película de animación de Pixar 'Ratatouille' (2007), ¿cómo se llama el implacable, sombrío y gélido crítico gastronómico cuyo veredicto puede quebrar un restaurante?",
    opciones: [
      { id: 'a', texto: 'Auguste Gusteau' },
      { id: 'b', texto: 'Anton Ego' },
      { id: 'c', texto: 'Skinner' },
      { id: 'd', texto: 'Alfredo Linguini' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Ratatouille',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su oficina de redacción fue diseñada deliberadamente con la silueta exacta de un ataúd clásico para acentuar su naturaleza fúnebre."
  },
  {
    id: 135,
    pregunta: "En la mítica comedia televisiva 'Cómo conocí a vuestra madre' (HIMYM), ¿cuál es el objeto cotidiano de color brillante que simboliza el destino y la unión romántica con la Madre?",
    opciones: [
      { id: 'a', texto: 'Un paraguas amarillo' },
      { id: 'b', texto: 'Una corbata de patitos' },
      { id: 'c', texto: 'Un sombrero de copa azul' },
      { id: 'd', texto: 'Una gabardina roja' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'How I Met Your Mother',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El paraguas amarillo va cambiando de manos accidentalmente entre Ted y Tracy a lo largo de las temporadas antes de conocerse."
  },
  {
    id: 136,
    pregunta: "En el tenso thriller de ciencia ficción alienígena 'La llegada' (Arrival, 2016), ¿qué peculiar fisionomía geométrica presentan las naves espaciales que se ciernen sobre la Tierra?",
    opciones: [
      { id: 'a', texto: 'Platillos circulares clásicos metálicos' },
      { id: 'b', texto: 'Monolitos oblongos y convexos de piedra oscura, flotando verticalmente' },
      { id: 'c', texto: 'Pirámides invertidas translúcidas' },
      { id: 'd', texto: 'Estructuras modulares con forma de panal' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Arrival',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El diseño de Denis Villeneuve se alejó deliberadamente de la tecnología tradicional buscando una apariencia mineral y prehistórica."
  },
  {
    id: 137,
    pregunta: "En el aclamado filme satírico de culto 'Network' (Un mundo implacable, 1976), ¿qué mítica e incendiaria frase grita en directo el presentador Howard Beale animando a la audiencia?",
    opciones: [
      { id: 'a', texto: '¡El gobierno nos está mintiendo en la cara!' },
      { id: 'b', texto: '¡Estoy más que harto y no pienso seguir tolerándolo!' },
      { id: 'c', texto: '¡Apaguen sus malditos televisores ahora mismo!' },
      { id: 'd', texto: '¡Somos títeres de una corporación global!' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Network',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La frase original en inglés ('I\'m as mad as hell, and I\'m not going to take this anymore!') se convirtió en el eslogan antisistema definitivo del cine setentero."
  },
  {
    id: 138,
    pregunta: "En la multipremiada serie de comedia familiar 'Modern Family', ¿cuál es el alter ego artístico y profesional por el que Cameron Tucker muestra un orgullo desmedido?",
    opciones: [
      { id: 'a', texto: 'Un cantante de ópera barítono' },
      { id: 'b', texto: 'Fizbo, el payaso de eventos' },
      { id: 'c', texto: 'Un director de teatro de vanguardia' },
      { id: 'd', texto: 'Un coreógrafo de claqué francés' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Modern Family',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El actor Eric Stonestreet es en la realidad un payaso titulado desde su infancia; adoptó el nombre de Fizbo mucho antes de incorporarse a la serie."
  },
  {
    id: 139,
    pregunta: "En la influyente epopeya histórica de Ridley Scott 'Gladiator' (2000), ¿cómo reacciona Joaquín Phoenix (Cómodo) de forma improvisada, aterrorizando genuinamente a Connie Nielsen en una escena?",
    opciones: [
      { id: 'a', texto: 'Lanzando una copa de vino real contra su rostro' },
      { id: 'b', texto: 'Gritándole a escasos centímetros de la cara la frase: \'¡¿No soy un hombre compasivo?!\'' },
      { id: 'c', texto: 'Desenvainando un puñal real no contemplado en los ensayos' },
      { id: 'd', texto: 'Rompiendo a llorar de forma violenta en el suelo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Gladiator',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El guion contemplaba un tono conversacional, pero Phoenix estalló con tal ferocidad que los temblores y el espanto de la actriz en esa toma son reales."
  },
  {
    id: 140,
    pregunta: "En la magistral serie apocalíptica 'The Last of Us' (2023), ¿cómo se denomina científicamente el hongo mutado causante del colapso social masivo?",
    opciones: [
      { id: 'a', texto: 'Amanita Phalloides' },
      { id: 'b', texto: 'Cordyceps' },
      { id: 'c', texto: 'Mycena Lux' },
      { id: 'd', texto: 'Claviceps Purpurea' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Last of Us',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El hongo existe de verdad en el planeta y zombifica insectos y hormigas controlando sus sistemas nerviosos, aunque no afecta a humanos."
  },
  {
    id: 141,
    pregunta: "En la mítica y violenta cinta de acción de ciencia ficción 'Matrix' (1999), ¿qué revelador dato contiene la primera página del pasaporte legal de Neo que se muestra en un plano detalle?",
    opciones: [
      { id: 'a', texto: 'Que su fecha de nacimiento es idéntica a la de Morfeo' },
      { id: 'b', texto: 'La fecha de caducidad exacta marca el 11 de septiembre de 2001' },
      { id: 'c', texto: 'Que su lugar de origen está listado como una simulación militar' },
      { id: 'd', texto: 'Que su tipo de sangre es inexistente en la biología real' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Matrix',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Es una de las coincidencias y teorías conspiranoicas más citadas en foros de cine, dado que la película se estrenó dos años antes de los atentados de las Torres Gemelas."
  },
  {
    id: 142,
    pregunta: "En la laureada comedia dramática de época 'El Gran Hotel Budapest' (2014), ¿cómo se llama la codiciada e icónica pastelería de cajas rosas que vertebra varios hilos del relato?",
    opciones: [
      { id: 'a', texto: 'Madame D.\'s' },
      { id: 'b', texto: 'Mendl\'s' },
      { id: 'c', texto: 'L\'Air de Panache' },
      { id: 'd', texto: 'Zubrowka Sweets' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Grand Budapest Hotel',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Wes Anderson encargó a un maestro pastelero de Görlitz el diseño real de las complejas torres de pastelillos llamadas 'Courtesan au Chocolat'."
  },
  {
    id: 143,
    pregunta: "En la aclamada y retorcida serie de ciencia ficción 'Severance' (Separación), ¿cuál es el bizarro incentivo alimenticio que reciben los empleados al completar una cuota trimestral de datos?",
    opciones: [
      { id: 'a', texto: 'Una copa de champán rosado de lujo' },
      { id: 'b', texto: 'Una fiesta de gofres o barritas de caramelo seleccionadas' },
      { id: 'c', texto: 'Una cena con carne de wagyu' },
      { id: 'd', texto: 'Un bufé libre de marisco premium' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Severance',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La 'Waffle Party' de Industrias Lumon esconde un ritual pseudo-religioso marcadamente perturbador para el empleado seleccionado."
  },
  {
    id: 144,
    pregunta: "En la inolvidable obra maestra de Roberto Benigni 'La vida es bella' (1997), ¿cuál es la mentira que el tierno Guido le cuenta a su pequeño hijo para ocultarle el horror del campo de concentración?",
    opciones: [
      { id: 'a', texto: 'Que están grabando un ambicioso largometraje de época' },
      { id: 'b', texto: 'Que participan en un complejo juego de puntos cuyo gran premio es un tanque real' },
      { id: 'c', texto: 'Que se encuentran en un campamento de vacaciones veraniegas' },
      { id: 'd', texto: 'Que los guardias nazis son actores disfrazados para un circo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Life Is Beautiful',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La cinta conmovió profundamente al mundo y se alzó con tres premios Óscar, incluyendo el de Mejor Película de Habla No Inglesa."
  },
  {
    id: 145,
    pregunta: "En el aclamado drama bélico 'Braveheart' (1995), ¿qué sustancia histórica utilizaban los guerreros escoceses liderados por Mel Gibson para teñirse la cara de azul?",
    opciones: [
      { id: 'a', texto: 'Colorante extraído de arándanos silvestres' },
      { id: 'b', texto: 'Glasto o \'Isatis tinctoria\' (Una planta usada en el tinte azul celta)' },
      { id: 'c', texto: 'Polvo de lapislázuli machacado' },
      { id: 'd', texto: 'Sangre de animal mezclada con cenizas fluviales' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Braveheart',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aunque históricamente el uso del 'glasto' correspondía a los pictos siglos antes de la época de William Wallace, la estética azul marcó la identidad visual del film."
  },
  {
    id: 146,
    pregunta: "En el brillante fenómeno animado de Netflix 'BoJack Horseman', ¿cómo se llama la desgastada, disfuncional y aristocrática madre de BoJack que amarga su psicología?",
    opciones: [
      { id: 'a', texto: 'Princess Carolyn' },
      { id: 'b', texto: 'Beatrice Horseman' },
      { id: 'c', texto: 'Hollyhock' },
      { id: 'd', texto: 'Diane Nguyen' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'BoJack Horseman',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El episodio de la última temporada centrado en su demencia senil y sus recuerdos fragmentados ('Time\'s Arrow') es considerado una obra maestra de la televisión."
  },
  {
    id: 147,
    pregunta: "En la galardonada serie de drama aristocrático 'Downton Abbey', ¿cómo se llama la majestuosa residencia señorial campestre de la familia Crawley en la vida real?",
    opciones: [
      { id: 'a', texto: 'Palacio de Blenheim' },
      { id: 'b', texto: 'Castillo de Highclere' },
      { id: 'c', texto: 'Castillo de Howard' },
      { id: 'd', texto: 'Mansión Chatsworth' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Downton Abbey',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La propiedad pertenece verdaderamente a los condes de Carnarvon y sus estancias principales sirvieron como sets reales de rodaje de la serie."
  },
  {
    id: 148,
    pregunta: "En el universo de Marvel Studios, ¿cuál es el nombre de la ultra avanzada, tecnológica e hiperaislada nación africana oculta bajo el manto de un bosque tropical?",
    opciones: [
      { id: 'a', texto: 'Sokovia' },
      { id: 'b', texto: 'Wakanda' },
      { id: 'c', texto: 'Latveria' },
      { id: 'd', texto: 'Talokan' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Black Panther',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su inmensa riqueza y desarrollo se sustentan en el control absoluto del Vibranium, un meteorito metálico alienígena caído en su suelo milenios atrás."
  },
  {
    id: 149,
    pregunta: "En el clásico de acción de 1988 'Die Hard' (La jungla de cristal), ¿cómo se llama el rascacielos corporativo de Los Ángeles asaltado por el grupo terrorista de Hans Gruber?",
    opciones: [
      { id: 'a', texto: 'Plaza Fox' },
      { id: 'b', texto: 'Nakatomi Plaza' },
      { id: 'c', texto: 'Century Tower' },
      { id: 'd', texto: 'Gruber Building' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Die Hard',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El edificio era en realidad la sede central de 20th Century Fox, que estaba aún en plenas fases de construcción final durante los rodajes."
  },
  {
    id: 150,
    pregunta: "En la serie policiaca e histórica 'Vikings' (Vikingos), ¿cuál es el macabro método de ejecución en el pozo al que es sometido el legendario rey Ragnar Lothbrok?",
    opciones: [
      { id: 'a', texto: 'Ser decapitado frente al pueblo anglosajón' },
      { id: 'b', texto: 'Ser arrojado vivo a un pozo profundo plagado de serpientes venenosas' },
      { id: 'c', texto: 'Someterlo al suplicio de la asfixia por agua' },
      { id: 'd', texto: 'La tortura rítmica del águila de sangre' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Vikings',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La escena recrea fielmente las sagas nórdicas tradicionales del siglo IX, donde se narra que la muerte de Ragnar a manos del rey Aelle desencadenó la invasión del Gran Ejército Pagano."
  },
  {
    id: 151,
    pregunta: "En la espectacular película de ciencia ficción 'Interstellar' (2014) de Christopher Nolan, ¿qué peculiaridad esconde la banda sonora de Hans Zimmer en el planeta de Miller (el planeta de agua)?",
    opciones: [
      { id: 'a', texto: 'Un sonido de ballenas invertido cada diez minutos' },
      { id: 'b', texto: 'Un constante tic-tac de reloj donde cada tic representa un día entero en la Tierra' },
      { id: 'c', texto: 'El Himno Nacional de EE. UU. tocado en reversa' },
      { id: 'd', texto: 'Una grabación real de frecuencias electromagnéticas de Saturno' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Interstellar',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Hans Zimmer diseñó el compás a 1.25 tics por segundo. Debido a la dilatación temporal extrema cerca del agujero negro Gargantúa, cada segundo que pasa en ese planeta equivale a 17 horas en la Tierra."
  },
  {
    id: 152,
    pregunta: "En la aclamada serie de HBO 'Succession', ¿cuál es la mítica e hiriente frase de dos palabras que el patriarca Logan Roy suele espetar a sus hijos y empleados cuando pierde la paciencia?",
    opciones: [
      { id: 'a', texto: 'Shut up! (¡Cállate!)' },
      { id: 'b', texto: 'Fuck off! (¡A la mierda! / ¡Vete a la mierda!)' },
      { id: 'c', texto: 'You\'re fired! (¡Estás despedido!)' },
      { id: 'd', texto: 'Grow up! (¡Madura!)' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Succession',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La icónica entrega de esa frase por el actor Brian Cox se convirtió en el sello definitivo de la serie, hasta el punto de que los fans le pedían por la calle que se la gritase."
  },
  {
    id: 153,
    pregunta: "En la histórica obra maestra del suspense 'Tiburón' (Jaws, 1975), ¿cómo surgió la legendaria frase 'Vas a necesitar un barco más grande' pronunciada por el jefe Brody?",
    opciones: [
      { id: 'a', texto: 'Estaba en la novela original de Peter Benchley palabra por palabra' },
      { id: 'b', texto: 'Fue una improvisación de Roy Scheider que se usaba como broma interna del equipo durante el rodaje' },
      { id: 'c', texto: 'La impuso Steven Spielberg tras ver el tamaño de la maqueta final del tiburón' },
      { id: 'd', texto: 'Se añadió en el doblaje de postproducción para tapar un fallo de sonido' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Jaws',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El equipo de rodaje solía quejarse de que el barco productor era demasiado pequeño para los equipos. Scheider empezó a meter la frase en varias escenas hasta que encajó perfectamente en el montaje final."
  },
  {
    id: 154,
    pregunta: "En el aclamado drama criminal 'Breaking Bad', ¿qué famoso momento doméstico se convirtió en leyenda televisiva al ser filmado por Bryan Cranston en una sola toma perfecta sin efectos?",
    opciones: [
      { id: 'a', texto: 'El lanzamiento de una pizza entera que aterriza perfectamente en el tejado de la casa' },
      { id: 'b', texto: 'El aplastamiento de una mosca con un matamoscas desde el aire' },
      { id: 'c', texto: 'La caída accidental de un fajo de billetes dentro del conducto de ventilación' },
      { id: 'd', texto: 'El disparo que destroza el osito de peluche rosa en la piscina' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'Breaking Bad',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El equipo de producción tenía preparadas decenas de pizzas esperando repetir la escena durante horas, pero Cranston lo clavó al primer intento. La casa real sufrió durante años el acoso de fans que intentaban imitarlo."
  },
  {
    id: 155,
    pregunta: "En el clásico cinematográfico de Alfred Hitchcock 'Psicosis' (1960), ¿qué producto de alimentación común se utilizó para simular la sangre derramada en la icónica escena de la ducha?",
    opciones: [
      { id: 'a', texto: 'Kétchup diluido en agua tibia' },
      { id: 'b', texto: 'Sirope de chocolate de la marca Hershey\'s' },
      { id: 'c', texto: 'Mermelada de fresa tamizada' },
      { id: 'd', texto: 'Salsa de tomate con colorante negro' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Psycho',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Al filmarse la película en blanco y negro, el sirope de chocolate ofrecía una densidad y un contraste visual en el desagüe mucho más realista y terrorífico que la sangre falsa convencional."
  },
  {
    id: 156,
    pregunta: "En la enrevesada película de suspense y sueños 'Origen' (Inception, 2010), ¿cuál es el verdadero 'tótem' que delata si el protagonista Cobb (Leonardo DiCaprio) está o no en el mundo real?",
    opciones: [
      { id: 'a', texto: 'La peonza de metal que gira sin detenerse' },
      { id: 'b', texto: 'Su anillo de bodas (solo lo lleva puesto dentro de los sueños)' },
      { id: 'c', texto: 'Un dado cargado con un peso imperceptible' },
      { id: 'd', texto: 'El color de sus zapatos deportivos' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Inception',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aunque la película desvía la atención hacia la peonza (que originalmente era el tótem de su esposa Mal), el anillo es la pista definitiva oculta por Nolan para descifrar el ambiguo final."
  },
  {
    id: 157,
    pregunta: "En la transgresora película 'El club de la lucha' (Fight Club, 1999), ¿cómo introduce sutilmente el director David Fincher la presencia de Tyler Durden antes de que el narrador lo conozca formalmente?",
    opciones: [
      { id: 'a', texto: 'Haciendo que su silueta aparezca reflejada en los espejos del fondo' },
      { id: 'b', texto: 'Insertando a Tyler de forma subliminal en fotogramas individuales aislados en momentos de estrés' },
      { id: 'c', texto: 'Susurrando su nombre en la pista de audio izquierda' },
      { id: 'd', texto: 'Colocando un cartel publicitario con su rostro en el apartamento' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Fight Club',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Brad Pitt parpadea en la pantalla durante exactamente un veinticuatroavo de segundo en cuatro ocasiones distintas al principio del film, presagiando la naturaleza de su trastorno mental."
  },
  {
    id: 158,
    pregunta: "En la legendaria e imperecedera telecomedia 'Friends', ¿de dónde salió el famoso sofá naranja de la cafetería Central Perk en el que se reúne el grupo?",
    opciones: [
      { id: 'a', texto: 'Fue diseñado a medida por una prestigiosa firma de muebles de Nueva York' },
      { id: 'b', texto: 'Se rescató del sótano de los estudios de Warner Bros. para ahorrar presupuesto en el piloto' },
      { id: 'c', texto: 'Pertenecía a la casa real de la actriz Jennifer Aniston' },
      { id: 'd', texto: 'Fue una donación de un mercadillo benéfico de pulgas' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Friends',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El escenógrafo de la serie lo encontró arrumbado y cubierto de polvo en un almacén viejo del estudio. Se convirtió en uno de los muebles más famosos y valiosos de la historia de la televisión."
  },
  {
    id: 159,
    pregunta: "En el hito cinematográfico 'Parque Jurásico' (Jurassic Park, 1993), ¿cómo logró el equipo de efectos recrear la mítica vibración concéntrica del vaso de agua que anuncia la llegada del T-Rex?",
    opciones: [
      { id: 'a', texto: 'Utilizando un motor magnético oculto bajo la mesa del coche' },
      { id: 'b', texto: 'Tensando y tocando una cuerda de guitarra sujeta al suelo debajo del salpicadero' },
      { id: 'c', texto: 'Haciendo saltar al propio Steven Spielberg al lado del vehículo' },
      { id: 'd', texto: 'Mediante un sutil efecto digital añadido en postproducción' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Jurassic Park',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Michael Lantieri, encargado de efectos especiales, pasó noches enteras buscando la frecuencia exacta. Logró los anillos perfectos en el agua rasgando una cuerda de guitarra afinada en una nota específica."
  },
  {
    id: 160,
    pregunta: "En la obra cumbre del cine mafioso 'El Padrino' (1972), ¿cuál es el origen del gato que Don Vito Corleone acaricia calmadamente durante la boda de su hija?",
    opciones: [
      { id: 'a', texto: 'Era la mascota entrenada contratada para el largometraje' },
      { id: 'b', texto: 'Era un gato callejero que merodeaba por el estudio y que Coppola puso en el regazo de Brando en el último segundo' },
      { id: 'c', texto: 'Fue una exigencia cómica del guion de Mario Puzo' },
      { id: 'd', texto: 'Pertenecía al actor Al Pacino, quien lo llevó al set' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Godfather',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El gato estaba tan cómodo y rascaba con tanta fuerza que su ronroneo tapó parte de los diálogos de Marlon Brando, obligando al equipo a regrabar las líneas de voz en postproducción."
  },
  {
    id: 161,
    pregunta: "En el electrizante y tenso drama musical 'Whiplash' (2014), ¿qué ocurrió realmente en la intensa escena donde el implacable Fletcher abofetea repetidamente al estudiante Andrew?",
    opciones: [
      { id: 'a', texto: 'Se usó un doble de manos digitalizado en postproducción' },
      { id: 'b', texto: 'Tras varias tomas falsas simuladas, J.K. Simmons abofeteó de verdad a Miles Teller con su consentimiento' },
      { id: 'c', texto: 'Se grabó el sonido por separado golpeando un filete de carne' },
      { id: 'd', texto: 'Miles Teller se autolesionó para dar dramatismo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Whiplash',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Esa toma en concreto fue la que se mantuvo en la película. El impacto real ayudó a generar la atmósfera genuina de violencia psicológica que requería la cumbre dramática del film."
  },
  {
    id: 162,
    pregunta: "En la icónica película de terror alienígena 'Alien, el octavo pasajero' (1979), ¿por qué las reacciones de pánico y asco de los actores en la escena del 'rompepechos' (Chestburster) son tan escalofriantemente realistas?",
    opciones: [
      { id: 'a', texto: 'Estaban bajo los efectos de sustancias hipnóticas ligeras' },
      { id: 'b', texto: 'No sabían que la criatura saldría rompiendo la camisa ni que salpicaría tal cantidad de sangre real de carnicería' },
      { id: 'c', texto: 'Ridley Scott les amenazó con despedirlos si no gritaban con fuerza' },
      { id: 'd', texto: 'Llevaban rodando 48 horas seguidas sin dormir' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Alien',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Solo John Hurt conocía el mecanismo del efecto. A los demás actores se les dijo vagamente lo que pasaría, por lo que el susto de Veronica Cartwright al recibir un chorro de sangre en la cara es 100% auténtico."
  },
  {
    id: 163,
    pregunta: "En la aclamada obra criminal 'Pulp Fiction' (1994) de Quentin Tarantino, ¿a quién pertenecía el coche clásico Chevrolet Malibu de 1964 que conduce Vincent Vega?",
    opciones: [
      { id: 'a', texto: 'Fue alquilado a un coleccionista privado de Las Vegas' },
      { id: 'b', texto: 'Era propiedad del propio Quentin Tarantino y fue robado durante el rodaje de la película' },
      { id: 'c', texto: 'Pertenecía a la productora Miramax Films' },
      { id: 'd', texto: 'Fue comprado en un desguace por John Travolta' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Pulp Fiction',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El coche desapareció misteriosamente del set en 1994 y no fue localizado por las autoridades policiales hasta casi dos décadas después, en el año 2013."
  },
  {
    id: 164,
    pregunta: "En la épica secuela de fantasía 'El Señor de los Anillos: Las dos torres' (2002), ¿qué dolorosa lesión real sufrió Viggo Mortensen en la escena donde patea con rabia un casco de orco?",
    opciones: [
      { id: 'a', texto: 'Se dislocó la articulación del hombro derecho' },
      { id: 'b', texto: 'Se rompió dos dedos del pie al golpear el casco de hierro macizo' },
      { id: 'c', texto: 'Sufrió un desgarro muscular severo en el muslo' },
      { id: 'd', texto: 'Se clavó un fragmento de metal en el tobillo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Lord of the Rings: The Two Towers',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Peter Jackson mantuvo la toma porque el grito agónico de dolor de Aragorn encajaba perfectamente con la desesperación de creer que Merry y Pippin habían muerto."
  },
  {
    id: 165,
    pregunta: "En la colosal producción romántica y dramática 'Titanic' (1997), ¿de quién son las manos reales que aparecen dibujando el icónico retrato al carboncillo de Rose (Kate Winslet)?",
    opciones: [
      { id: 'a', texto: 'Del propio Leonardo DiCaprio' },
      { id: 'b', texto: 'Del director James Cameron, quien además es un talentoso dibujante' },
      { id: 'c', texto: 'De un artista callejero contratado en París' },
      { id: 'd', texto: 'Del director de fotografía de la película' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Titanic',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Como Cameron es zurdo y DiCaprio es diestro, la imagen tuvo que ser completamente invertida de forma digital en postproducción para mantener la coherencia con el personaje de Jack."
  },
  {
    id: 166,
    pregunta: "En la apocalíptica película de acción salvaje 'Mad Max: Furia en la carretera' (2015), ¿qué asombroso detalle técnico rodea al bizarro guitarrista ciego (Doof Warrior) que encabeza las tropas?",
    opciones: [
      { id: 'a', texto: 'La guitarra era una maqueta de plástico ligera' },
      { id: 'b', texto: 'La guitarra pesaba 60 kilos y lanzaba fuego real controlado mediante un mecanismo operativo' },
      { id: 'c', texto: 'El personaje fue metido íntegramente mediante ordenador (CGI)' },
      { id: 'd', texto: 'Fue interpretado por el director George Miller disfrazado' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Mad Max: Fury Road',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El músico australiano iOTA interpretó al personaje. La guitarra funcionaba de verdad, pesaba muchísimo y el lanzallamas se accionaba usando la palanca de trémolo del instrumento."
  },
  {
    id: 167,
    pregunta: "En la aclamada e inolvidable serie de fantasía medieval 'Juego de Tronos', ¿qué impresionante tarea realizó el actor Charles Dance (Tywin Lannister) en su primera escena en pantalla?",
    opciones: [
      { id: 'a', texto: 'Cabalgar un semental negro salvaje sin usar dobles' },
      { id: 'b', texto: 'Desollar y destripar un ciervo real muerto el día anterior' },
      { id: 'c', texto: 'Forjar una espada de hierro fundido real en directo' },
      { id: 'd', texto: 'Beber una jarra entera de vino de un solo trago' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Game of Thrones',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Un carnicero local le dio una clase rápida de una hora antes de rodar. La escena sirvió como metáfora visual perfecta de la destrucción de la casa Baratheon (cuyo emblema es un ciervo)."
  },
  {
    id: 168,
    pregunta: "En la legendaria película de terror slasher 'Scream' (1996), ¿qué ingeniosa técnica utilizó Wes Craven para que los actores mostraran un miedo real durante las llamadas telefónicas de Ghostface?",
    opciones: [
      { id: 'a', texto: 'Usar grabaciones pregrabadas distorsionadas al azar' },
      { id: 'b', texto: 'Hacer que el actor de voz Roger L. Jackson llamase realmente en vivo desde un teléfono oculto en el set sin que los actores le viesen' },
      { id: 'c', texto: 'Poner ruidos de sirenas de policía de fondo' },
      { id: 'd', texto: 'Hacer las llamadas con un retraso de sonido molesto' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Scream',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Craven prohibió expresamente que el elenco conociera físicamente a Roger L. Jackson durante los meses de rodaje para preservar el misterio y la tensión psicológica de la voz."
  },
  {
    id: 169,
    pregunta: "En la obra de terror psicológico de Stanley Kubrick 'El resplandor' (1980), ¿cuál es el origen de la mítica frase '¡Aquí está Johnny!' (Here\'s Johnny!) que Jack Nicholson grita a través de la puerta rota?",
    opciones: [
      { id: 'a', texto: 'Venía redactada textualmente en la novela de Stephen King' },
      { id: 'b', texto: 'Fue una improvisación absoluta de Nicholson calcando la introducción del programa televisivo \'The Tonight Show Starring Johnny Carson\'' },
      { id: 'c', texto: 'Fue una sugerencia de última hora del montador cinematográfico' },
      { id: 'd', texto: 'Nació de un error de Nicholson al olvidar su línea original' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Shining',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Como Kubrick llevaba viviendo en Inglaterra muchos años, no entendió la referencia televisiva estadounidense y casi descarta la toma en el montaje final."
  },
  {
    id: 170,
    pregunta: "En la ultraviolenta película de Tarantino 'Django desencadenado' (2012), ¿qué impactante imprevisto real sufrió Leonardo DiCaprio durante la tensa cena en la plantación?",
    opciones: [
      { id: 'a', texto: 'Se le cayó un candelabro caliente sobre el hombro' },
      { id: 'b', texto: 'Golpeó la mesa con tal fuerza que rompió un vaso de cristal, cortándose la mano y sangrando de verdad durante el monólogo' },
      { id: 'c', texto: 'Sufrió una intoxicación alimentaria en mitad de la frase' },
      { id: 'd', texto: 'Se torció la muñeca al desenfundar el revólver de época' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Django Unchained',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "DiCaprio ignoró por completo el dolor y el corte profundo, continuó actuando metido en su perturbador personaje e incluso llegó a usar la sangre para manchar el rostro de Kerry Washington."
  },
  {
    id: 171,
    pregunta: "En la aclamada e hipnótica serie alemana de Netflix 'Dark', ¿cada cuántos años se repiten cíclicamente los misteriosos eventos temporales y desapariciones en el pueblo de Winden?",
    opciones: [
      { id: 'a', texto: 'Cada 12 años' },
      { id: 'b', texto: 'Cada 33 años' },
      { id: 'c', texto: 'Cada 50 años' },
      { id: 'd', texto: 'Cada 100 años' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Dark',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El ciclo de 33 años conecta los años 1953, 1986, 2019, alineándose con teorías astrológicas y lunares presentadas a lo largo de su trama."
  },
  {
    id: 172,
    pregunta: "En la aclamada e imponente película de cómics 'El caballero oscuro' (The Dark Knight, 2008), ¿qué momento clave del Joker de Heath Ledger fue fruto de una brillante improvisación actoral en el set?",
    opciones: [
      { id: 'a', texto: 'El truco de magia de desaparición del lápiz' },
      { id: 'b', texto: 'Los aplausos sarcásticos y lentos dentro de la celda de la comisaría cuando ascienden a Jim Gordon' },
      { id: 'c', texto: 'La amenaza con el cuchillo en la boca a Rachel Dawes' },
      { id: 'd', texto: 'El discurso sobre las cicatrices frente a la mafia' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Dark Knight',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El guion no indicaba que el Joker reaccionara al nombramiento de Gordon. Christopher Nolan alabó el gesto y ordenó a los operadores de cámara que siguieran filmando a Ledger."
  },
  {
    id: 173,
    pregunta: "En la icónica película de supervivencia 'Náufrago' (Cast Away, 2000), ¿qué objeto inanimado de la marca Wilson se convierte en el entrañable compañero de locura de Tom Hanks?",
    opciones: [
      { id: 'a', texto: 'Un balón de fútbol americano' },
      { id: 'b', texto: 'Un balón de voleibol' },
      { id: 'c', texto: 'Una raqueta de tenis de madera' },
      { id: 'd', texto: 'Una caja de herramientas oxidada' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Cast Away',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El rostro de la pelota se pintó usando la propia sangre de la mano herida de Chuck Noland. Uno de los balones originales del rodaje se subastó posteriormente por más de 300,000 dólares."
  },
  {
    id: 174,
    pregunta: "En la legendaria y misteriosa serie de televisión 'Perdidos' (Lost), ¿cuál es la mítica combinación numérica maldita que Hurley juega en la lotería y que aparece en la escotilla?",
    opciones: [
      { id: 'a', texto: '1, 2, 3, 4, 5, 6' },
      { id: 'b', texto: '4, 8, 15, 16, 23, 42' },
      { id: 'c', texto: '7, 14, 21, 28, 35, 49' },
      { id: 'd', texto: '9, 11, 21, 31, 41, 51' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Lost',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La secuencia numérica se convirtió en un absoluto fenómeno de masas global, llevando a miles de fans reales de la serie a jugarla en loterías de todo el mundo."
  },
  {
    id: 175,
    pregunta: "Para el musical romántico 'La La Land' (2016), ¿qué asombroso esfuerzo profesional realizó el actor Ryan Gosling para interpretar a Sebastian?",
    opciones: [
      { id: 'a', texto: 'Pasar tres meses cantando bajo el agua' },
      { id: 'b', texto: 'Aprender a tocar jazz al piano desde cero ensayando 2 horas diarias, rodando todas las escenas de manos sin dobles ni CGI' },
      { id: 'c', texto: 'Tomar clases intensivas de ballet clásico en Rusia' },
      { id: 'd', texto: 'Componer en secreto la melodía principal del film' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'La La Land',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su coestrella John Legend, que sí es un músico pianista profesional de carrera, admitió sentirse sumamente celoso de lo rápido que Gosling dominó el instrumento."
  },
  {
    id: 176,
    pregunta: "En la mítica película de comedia y drama 'Forrest Gump' (1994), ¿en qué basó Tom Hanks el icónico y pausado acento sureño del protagonista?",
    opciones: [
      { id: 'a', texto: 'En cintas de discursos antiguos de la Alabama del siglo XIX' },
      { id: 'b', texto: 'En la forma de hablar real del niño Michael Conner Humphreys, quien interpretó al joven Forrest en la infancia' },
      { id: 'c', texto: 'Fue una invención cómica del director Robert Zemeckis' },
      { id: 'd', texto: 'Imitó el tono de voz de su propia madre biológica' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Forrest Gump',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Michael Humphreys hablaba así de forma natural. A Tom Hanks le fascinó tanto su acento que decidió incorporarlo y adaptarlo para su versión adulta del personaje."
  },
  {
    id: 177,
    pregunta: "En la espectacular producción de acción arácnida 'Spider-Man' (2002) de Sam Raimi, ¿qué icónica hazaña física realizó Tobey Maguire en el comedor del instituto sin trucos digitales?",
    opciones: [
      { id: 'a', texto: 'Un salto mortal hacia atrás saltando sobre tres mesas' },
      { id: 'b', texto: 'Atrapar en el aire el almuerzo completo de Mary Jane (incluyendo un sándwich, un yogur y una manzana) directamente sobre una bandeja metálica' },
      { id: 'c', texto: 'Escalar una pared de ladrillo real de diez metros' },
      { id: 'd', texto: 'Atrapar una mosca viva con un palillo de dientes' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Spider-Man',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Para lograrlo, la producción pegó ligeramente la bandeja a la mano de Maguire con imanes. Le costó un total de 156 tomas clavar el lanzamiento exacto de los alimentos al aire."
  },
  {
    id: 178,
    pregunta: "En la serie criminal británica 'Peaky Blinders', ¿qué curioso e inusual dato rodea el rodaje de las escenas de tabaco del personaje de Cillian Murphy (Thomas Shelby)?",
    opciones: [
      { id: 'a', texto: 'Fumaba puros cubanos de contrabando reales' },
      { id: 'b', texto: 'Consumía cigarrillos herbales sin nicotina de sabor a rosa, llegando a fumar más de 3,000 en una sola temporada' },
      { id: 'c', texto: 'El humo se añadía digitalmente en postproducción' },
      { id: 'd', texto: 'Los cigarrillos eran de plástico y soplaba talco' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Peaky Blinders',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Cillian Murphy no fuma en la vida real. Los cigarrillos de hierbas se usan habitualmente en sets cinematográficos para evitar la adicción y proteger la salud pulmonar del elenco."
  },
  {
    id: 179,
    pregunta: "En la obra de culto de animación 'Shrek' (2001), ¿qué trágico suceso obligó a cambiar por completo al actor principal de doblaje y reescribir parte de la personalidad del ogro?",
    opciones: [
      { id: 'a', texto: 'El abandono de Nicolas Cage por disputas de sueldo' },
      { id: 'b', texto: 'El inesperado fallecimiento del cómico Chris Farley, quien ya había grabado casi el 90% de los diálogos del film' },
      { id: 'c', texto: 'La pérdida de voz crónica del actor Tom Hanks' },
      { id: 'd', texto: 'Una demanda legal de la junta de censura infantil' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Shrek',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Tras la muerte de Farley en 1997, DreamWorks contrató a su compañero de SNL, Mike Myers, quien decidió darle a Shrek su ya legendario e inolvidable acento escocés."
  },
  {
    id: 180,
    pregunta: "En la taquillera saga de aventuras 'Piratas del Caribe: La maldición de la Perla Negra' (2003), ¿qué detalle estético real de Johnny Depp asustó a los ejecutivos de Disney?",
    opciones: [
      { id: 'a', texto: 'Se tatuó un barco pirata real en la espalda' },
      { id: 'b', texto: 'Se implantó coronas de oro reales en sus dientes y se negó a quitárselas hasta terminar la trilogía' },
      { id: 'c', texto: 'Se cortó parte de la ceja derecha para simular una cicatriz' },
      { id: 'd', texto: 'Rehusó ducharse durante los meses de rodaje en el mar' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Pirates of the Caribbean: The Curse of the Black Pearl',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Depp acudió a su dentista para ponerse más dientes de oro de los que pedía el guion. Ante las quejas del director ejecutivo de Disney, Depp amenazó con quitárselos todos o ninguno."
  },
  {
    id: 181,
    pregunta: "En la mítica obra maestra de ciencia ficción distópica 'Blade Runner' (1982), ¿quién reescribió y acortó el célebre monólogo final de las 'Lágrimas en la lluvia' (Tears in rain)?",
    opciones: [
      { id: 'a', texto: 'El director Ridley Scott en el set' },
      { id: 'b', texto: 'El propio actor Rutger Hauer (Roy Batty) la noche antes de rodar la escena' },
      { id: 'c', texto: 'El autor de la novela Philip K. Dick' },
      { id: 'd', texto: 'Harrison Ford para tener menos líneas que escuchar' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Blade Runner',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El guion original contemplaba un discurso poético larguísimo. Hauer recortó varias frases redundantes y añadió de su propia cosecha la conmovedora línea: 'Todos esos momentos se perderán en el tiempo, como lágrimas en la lluvia'."
  },
  {
    id: 182,
    pregunta: "En el aclamado filme de animación de Disney y Pixar 'Coco' (2017), ¿qué flor tradicional mexicana de color naranja brillante es el único puente místico entre el mundo de los vivos y los muertos?",
    opciones: [
      { id: 'a', texto: 'La dalia roja' },
      { id: 'b', texto: 'El cempasúchil (Caléndula azteca)' },
      { id: 'c', texto: 'La flor de nardo' },
      { id: 'd', texto: 'La orquídea de campo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Coco',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Su color radiante y su intenso aroma guían, según la arraigada mitología y tradición mexicana del Día de Muertos, a las almas de regreso a sus altares familiares."
  },
  {
    id: 183,
    pregunta: "En el electrizante drama bélico de Sam Mendes '1917' (2019), ¿qué sofisticada e inmersiva técnica de filmación se utilizó para narrar el viaje de los soldados?",
    opciones: [
      { id: 'a', texto: 'Grabar en blanco y negro para colorearlo después' },
      { id: 'b', texto: 'Diseñar y montar toda la película para dar la ilusión visual de estar filmada en un único plano secuencia continuo' },
      { id: 'c', texto: 'Utilizar únicamente cámaras estáticas fijas en el suelo' },
      { id: 'd', texto: 'Filmar las escenas de acción a velocidad doble' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: '1917',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Se requirió una planificación milimétrica. Los cortes de cámara se camuflaban ingeniosamente aprovechando pasadas por zonas de oscuridad extrema, cortinas de humo o pasos tras paredes y escombros."
  },
  {
    id: 184,
    pregunta: "En la taquillera y apoteósica conclusión de Marvel Studios 'Vengadores: Endgame' (2019), ¿cuál es el tierno origen de la mítica frase 'Te quiero tres mil' (I love you 3000)?",
    opciones: [
      { id: 'a', texto: 'Venía de una viñeta clásica de los cómics de Stan Lee de los años 60' },
      { id: 'b', texto: 'Es una frase real que los hijos de Robert Downey Jr. le decían a su padre en la vida real' },
      { id: 'c', texto: 'Representa la suma exacta de minutos de metraje de todas las películas de Marvel hasta la fecha' },
      { id: 'd', texto: 'Fue una improvisación espontánea de la pequeña actriz Lexi Rabe' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Avengers: Endgame',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Downey Jr. le contó la anécdota a los directores Anthony y Joe Russo durante los ensayos, y a estos les pareció tan genuina que decidieron sustituir la línea original del guion por esta."
  },
  {
    id: 185,
    pregunta: "En la desternillante serie de comedia criminal 'Brooklyn Nine-Nine', ¿qué peculiar fobia absurda sufre el rudo e imponente sargento Terry Jeffords (Terry Crews)?",
    opciones: [
      { id: 'a', texto: 'Miedo extremo a los gatos persas' },
      { id: 'b', texto: 'Pánico incontrolable a quedarse sin sus preciados yogures de frutas' },
      { id: 'c', texto: 'Fobia irracional a los payasos de cumpleaños' },
      { id: 'd', texto: 'Miedo a los ascensores cerrados de la comisaría' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Brooklyn Nine-Nine',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El amor pasional de Terry por los yogures y su icónica frase dramática '¡A Terry le encanta el yogur!' se convirtieron en uno de los gags más memorables del show."
  },
  {
    id: 186,
    pregunta: "En la mítica cinta de aventuras espaciales 'Star Wars: Episodio IV - Una nueva esperanza' (1977), ¿qué inusual material cotidiano se usó para recrear el característico zumbido del sable de luz?",
    opciones: [
      { id: 'a', texto: 'El zumbido de un secador de pelo combinado con una batidora de mano' },
      { id: 'b', texto: 'El zumbido de motores de proyectores de cine viejos combinado con la interferencia de un televisor de tubo' },
      { id: 'c', texto: 'Un silbato de tren modificado digitalmente' },
      { id: 'd', texto: 'El ruido de un cable de alta tensión frotado con metal' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Star Wars: Episode IV - A New Hope',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El diseñador de sonido Ben Burtt descubrió el tono exacto por puro accidente al pasar caminando con un micrófono averiado cerca de la parte trasera de un televisor encendido."
  },
  {
    id: 187,
    pregunta: "En el desgarrador y multipremiado drama histórico 'La lista de Schindler' (1993), ¿cuál es el único elemento visual de color que rompe el estricto blanco y negro de la película?",
    opciones: [
      { id: 'a', texto: 'Un coche de oficiales nazi de color azul' },
      { id: 'b', texto: 'El abrigo rojo de una pequeña niña judía que camina sola por el gueto de Cracovia' },
      { id: 'c', texto: 'La bandera de las fuerzas aliadas del tramo final' },
      { id: 'd', texto: 'El vino vertido en la copa de Oskar Schindler' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Schindler\'s List',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Steven Spielberg introdujo este sutil detalle cromático para simbolizar cómo los altos cargos del gobierno de EE. UU. sabían que el Holocausto estaba ocurriendo pero miraron hacia otro lado."
  },
  {
    id: 188,
    pregunta: "En la aclamada distopía de terror tecnológico 'Black Mirror', ¿a qué se refiere exactamente el perturbador título conceptual de la serie?",
    opciones: [
      { id: 'a', texto: 'A un espejo retrovisor maldito de un coche autónomo' },
      { id: 'b', texto: 'A la pantalla fría, apagada y oscura de cualquier smartphone, televisor u ordenador' },
      { id: 'c', texto: 'A una inteligencia artificial que duplica identidades' },
      { id: 'd', texto: 'Al cristal de una sala de interrogatorios policiales' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Black Mirror',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El creador Charlie Brooker explicó que el espejo negro está en la pared, en la mesa y en la palma de la mano de cada espectador que consume tecnología de forma obsesiva."
  },
  {
    id: 189,
    pregunta: "En el magistral e icónico thriller neo-noir 'Seven' (Se7en, 1995), ¿qué inusual condición contractual impuso el actor Kevin Spacey (John Doe) a la productora?",
    opciones: [
      { id: 'a', texto: 'Cobrar el triple del presupuesto asignado a Brad Pitt' },
      { id: 'b', texto: 'Que su nombre no apareciera en ningún póster publicitario ni en los créditos de apertura de la película para mantener en absoluto secreto la identidad del asesino' },
      { id: 'c', texto: 'Llevar su propio vestuario de presidiario real' },
      { id: 'd', texto: 'No realizar entrevistas de prensa promocionales tras el estreno' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Se7en',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Como compensación por no aparecer al inicio, el nombre de Kevin Spacey figura como la absoluta primera línea visible de los extensos créditos de cierre del film."
  },
  {
    id: 190,
    pregunta: "En la mítica y oscarizada obra maestra de suspense 'El silencio de los corderos' (1991), ¿cuánto tiempo total en pantalla le bastó a Anthony Hopkins para ganar el Óscar a Mejor Actor Principal?",
    opciones: [
      { id: 'a', texto: 'Apenas unos 16 minutos totales de metraje' },
      { id: 'b', texto: 'Aproximadamente 45 minutos enteros' },
      { id: 'c', texto: 'Poco más de una hora de película' },
      { id: 'd', texto: 'Exactamente 5 minutos en la escena de la celda' }
    ],
    respuestaCorrecta: 'a',
    tituloPelicula: 'The Silence of the Lambs',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Es una de las interpretaciones principales más cortas de la historia de los Premios de la Academia en alzarse con la estatuilla dorada a Mejor Actor."
  },
  {
    id: 191,
    pregunta: "En la aclamada película de animación japonesa 'El viaje de Chihiro' (2001), ¿qué bizarro método utilizó la actriz de voz de la madre para sonar realista comiendo en el banquete prohibido?",
    opciones: [
      { id: 'a', texto: 'Masticar chicle con gran cantidad de saliva' },
      { id: 'b', texto: 'Grabar sus líneas de diálogo devorando piezas de pollo frito real frente al micrófono de estudio' },
      { id: 'c', texto: 'Colocarse un trozo de silicona blanda en el paladar' },
      { id: 'd', texto: 'Hacer ruidos de succión con un globo de látex húmedo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Spirited Away',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El director Hayao Miyazaki exigió el máximo realismo orgánico. La actriz Yasuko Sawaguchi dobló la escena comiendo muslos de pollo de un restaurante cercano."
  },
  {
    id: 192,
    pregunta: "En la célebre película de ciencia ficción cyberpunk 'The Matrix' (1999), ¿cuál es el verdadero e insólito origen del famoso código digital de cascada verde?",
    opciones: [
      { id: 'a', texto: 'Algoritmos militares rusos encriptados desclasificados' },
      { id: 'b', texto: 'Caracteres escaneados directamente de un libro de recetas de sushi de la esposa del diseñador de producción' },
      { id: 'c', texto: 'Fórmulas matemáticas complejas de física cuántica' },
      { id: 'd', texto: 'Un fallo aleatorio de una tarjeta gráfica estropeada' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Matrix',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El diseñador Simon Whiteley escaneó las letras japonesas (Katana, Hiragana) de un libro de cocina. Por tanto, el código de Matrix son, literalmente, recetas de rollos de sushi."
  },
  {
    id: 193,
    pregunta: "En la mítica e inolvidable telecomedia de los años 90 'El príncipe de Bel-Air', ¿cuál es la verdadera razón por la que el personaje de Will Smith se llama exactamente igual que él en la vida real?",
    opciones: [
      { id: 'a', texto: 'Fue una imposición contractual de la cadena NBC' },
      { id: 'b', texto: 'Alfonso Ribeiro (Carlton) le sugirió que eligiera su propio nombre real para evitar que el público masivo lo llamara por un alias el resto de su vida' },
      { id: 'c', texto: 'Will Smith olvidaba constantemente los nombres de los personajes en los ensayos' },
      { id: 'd', texto: 'Nació como un homenaje encubierto a su abuelo paterno' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Fresh Prince of Bel-Air',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Ribeiro acertó de lleno con el consejo. Décadas después, el público sigue reconociendo a Smith mundialmente bajo su identidad propia vinculada al show."
  },
  {
    id: 194,
    pregunta: "En la tensa y claustrofóbica película de terror psicológico 'El faro' (The Lighthouse, 2019) de Robert Eggers, ¿qué técnica de época se utilizó para lograr ese look visual tan vintage?",
    opciones: [
      { id: 'a', texto: 'Se usaron filtros de Instagram modificados en postproducción' },
      { id: 'b', texto: 'Fue filmada enteramente con cámaras analógicas de 35mm en blanco y negro real con un formato de pantalla casi cuadrado (1.19:1)' },
      { id: 'c', texto: 'Se rodó en color digital y se eliminó la saturación al mínimo' },
      { id: 'd', texto: 'Utilizaron lentes sucias de cámaras de los años 80' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Lighthouse',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El director empleó lentes vintage de los años 30 y filtros ortocromáticos antiguos que acentuaban las arrugas, imperfecciones de la piel y la crudeza del entorno marino."
  },
  {
    id: 195,
    pregunta: "En la aclamada obra satírica 'El lobo de Wall Street' (2013), ¿qué sustancia inocua y saludable se utilizó para simular la ingente cantidad de cocaína que esnifan los personajes?",
    opciones: [
      { id: 'a', texto: 'Harina de trigo tamizada' },
      { id: 'b', texto: 'Vitamina B en polvo machacada' },
      { id: 'c', texto: 'Azúcar glass con edulcorante' },
      { id: 'd', texto: 'Tiza blanca molida fina' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Wolf of Wall Street',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Aunque inofensivo, aspirar tal cantidad de polvo durante meses provocó que el actor Jonah Hill desarrollara una bronquitis severa que le obligó a ingresar en un hospital."
  },
  {
    id: 196,
    pregunta: "En la legendaria y oscura serie animada de culto 'Batman: La serie animada' (1992), ¿qué revolucionaria técnica artística idearon los creadores para plasmar Gotham?",
    opciones: [
      { id: 'a', texto: 'Dibujar los bocetos sobre papel de periódico viejo' },
      { id: 'b', texto: 'Pintar los fondos enteramente sobre láminas de papel de color negro liso (Dark Deco) en lugar de papel blanco común' },
      { id: 'c', texto: 'Modelar primero las calles en arcilla real' },
      { id: 'd', texto: 'Fotografiar maquetas oscuras y calcarlas a mano' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Batman: The Animated Series',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Esta técnica obligaba a los artistas a pintar la luz saliendo desde la absoluta oscuridad profunda, otorgando a la serie esa atmósfera gótica, sombría e inmortal única."
  },
  {
    id: 197,
    pregunta: "En la mítica y oscarizada película de ciencia ficción de Denis Villeneuve 'Dune' (2021), ¿cómo se llama el característico estilo de caminar rítmicamente que usan en el desierto para evitar llamar la atención de los gusanos de arena?",
    opciones: [
      { id: 'a', texto: 'Paso Sombra' },
      { id: 'b', texto: 'Andar del desierto (Sandwalk)' },
      { id: 'c', texto: 'Paso de la Especia' },
      { id: 'd', texto: 'Marcha de los Fremen' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Dune',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "Consiste en dar pasos sin un patrón o ritmo uniforme predecible, imitando el caótico sonido natural del viento rozando las dunas para no generar vibraciones sísmicas mecánicas."
  },
  {
    id: 198,
    pregunta: "En la laureada comedia televisiva 'The Office' (US), ¿qué bizarro accidente doméstico sufre Michael Scott al intentar despertarse con el olor a beicon fresco por las mañanas?",
    opciones: [
      { id: 'a', texto: 'Se le quema la alfombra de la habitación' },
      { id: 'b', texto: 'Se pisa el pie derecho con una parrilla eléctrica George Foreman que dejó encendida en el suelo al lado de la cama' },
      { id: 'c', texto: 'Inunda la cocina al romper una tubería' },
      { id: 'd', texto: 'Su perro se come su desayuno completo' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'The Office',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El episodio donde acude a la oficina con el pie completamente vendado con plástico de burbujas exigiendo cuidados especiales es uno de los picos cómicos de la serie."
  },
  {
    id: 199,
    pregunta: "En la obra maestra del cine romántico clásico 'Casablanca' (1942), ¿cuál es la famosa e icónica frase de despedida que Rick le dice a Ilsa en la mítica pista de despegue envuelta en niebla?",
    opciones: [
      { id: 'a', texto: 'Tócala otra vez, Sam' },
      { id: 'b', texto: 'Siempre nos quedará París' },
      { id: 'c', texto: 'Bésame como si fuera la última vez' },
      { id: 'd', texto: 'El mundo se derrumba y nosotros nos enamoramos' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'Casablanca',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "La otra frase erróneamente citada por el público pop ('Tócala otra vez, Sam') jamás se llega a pronunciar así de forma textual en todo el metraje de la cinta."
  },
  {
    id: 200,
    pregunta: "En la impactante primera temporada de la serie antológica 'True Detective' (2014), ¿qué hito técnico de dirección fascinó a la crítica en el clímax criminal del episodio 4?",
    opciones: [
      { id: 'a', texto: 'Un tiroteo coreografiado marcha atrás' },
      { id: 'b', texto: 'Un impresionante y tenso plano secuencia real sin cortes de 6 minutos de duración donde Rust Cohle escapa de un asalto vecinal' },
      { id: 'c', texto: 'Filmar la escena usando únicamente la luz de un mechero' },
      { id: 'd', texto: 'Un salto de cámara desde un helicóptero real en movimiento' }
    ],
    respuestaCorrecta: 'b',
    tituloPelicula: 'True Detective',
    imagenUrlFallback: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80',
    curiosidad: "El director Cary Fukunaga ensayó la compleja escena durante días con Matthew McConaughey, cruzando casas, vallas y calles sin una sola interrupción de metraje."
  }
];