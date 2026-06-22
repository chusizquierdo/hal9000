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
  }
];