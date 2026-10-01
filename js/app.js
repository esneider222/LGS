(function(){

"use strict";

/* ============================================================
   CONFIGURACIÓN DEL TUTOR IA
   ------------------------------------------------------------
   WORKER_URL: la URL pública de tu Cloudflare Worker (worker.js).
   La clave de Gemini NUNCA va aquí: vive como secreto
   (GEMINI_API_KEY) dentro de Cloudflare.
   ============================================================ */
const WORKER_URL = "https://autumn-surf-ee82.esneideragt.workers.dev";

/* ============================================================
   DATA — Módulos de la guía
   ============================================================ */
const LENGUA_MODULES = [
{id:'fonetica', area:'Eje lingüístico', title:'Fonética y fonología', icon:'🔊',
 intro:'El primer choque conceptual de la carrera: las letras (grafías) no son los sonidos (fonemas). La ortografía es una convención social; el sonido es un fenómeno físico y mental que se puede describir con precisión.',
 concepts:[
   {h:'Fonética vs. fonología', p:'La <b>fonética</b> estudia el sonido físico producido por el aparato articulador — se anota entre corchetes, <span class="ipa">[p]</span>, <span class="ipa">[t]</span>. La <b>fonología</b> estudia la representación mental del sonido y su capacidad para distinguir significados — se anota entre barras, <span class="ipa">/p/</span> vs <span class="ipa">/b/</span> (como en "peso" vs "beso").'},
   {h:'Tres parámetros de la consonante', p:'Todo sonido consonántico se describe por su <b>punto de articulación</b> (dónde se tocan los órganos: bilabial, labiodental, alveolar, velar…), su <b>modo de articulación</b> (cómo sale el aire: oclusivo, fricativo, nasal…) y su <b>sonoridad</b> (si vibran las cuerdas vocales: sordo <span class="ipa">[p, t, s]</span> vs sonoro <span class="ipa">[b, d, z]</span>).'},
   {h:'El AFI como sistema universal', p:'El Alfabeto Fonético Internacional asigna un símbolo único a cada sonido humano, independiente de la ortografía. En español la letra "c" representa dos sonidos distintos: <span class="ipa">/k/</span> en "casa" y <span class="ipa">/s/</span> en "cero". En inglés, "th" puede ser sorda <span class="ipa">/θ/</span> ("think") o sonora <span class="ipa">/ð/</span> ("this").'},
   {h:'Fonética inglesa: lo que sorprende a un hispanohablante', p:'El inglés distingue vocales por duración y tensión (<span class="ipa">/iː/</span> "sheep" vs <span class="ipa">/ɪ/</span> "ship"), algo que el español no hace. También usa consonantes ausentes en español, como <span class="ipa">/ʃ/</span> ("she") o <span class="ipa">/ʒ/</span> ("vision").'}
 ],
 taller:{q:['Pares mínimos: ¿qué parámetro articulatorio distingue "pino" de "vino"?','¿Es "cata/cada" una diferencia de sonoridad o de modo de articulación?','¿Cuántos sonidos reales tiene la palabra "queso"? ¿Por qué no coinciden con el número de letras?','Transcribe en AFI aproximado la palabra inglesa "think" y explica qué sonido no existe en español.'],
  a:'1) Cambia el punto de articulación y la sonoridad: [p] bilabial sorda vs [b]/[v] bilabial sonora. 2) Es una diferencia de sonoridad: [t] oclusiva sorda, [d] oclusiva sonora (el modo, oclusivo, es el mismo). 3) Tiene 4 sonidos (/k-e-s-o/): la "u" de "que" es muda, solo marca que la "q" suena /k/. 4) /θɪŋk/ — el sonido /θ/ (fricativo interdental sordo) no existe en el sistema fonológico del español general.'}
},
{id:'morfosintaxis', area:'Eje lingüístico', title:'Morfosintaxis', icon:'🏗️',
 intro:'Fusiona la morfología (estructura interna de las palabras) y la sintaxis (reglas de combinación en oraciones). Es el motor gramatical de cualquier idioma, español o inglés.',
 concepts:[
   {h:'Morfemas: la unidad mínima con significado', p:'El <b>morfema léxico o raíz</b> aporta el significado conceptual (<i>niñ-</i> en "niños"). Los <b>morfemas gramaticales/flexivos</b> añaden género, número, tiempo o persona (<i>-o</i>, <i>-s</i>). Los <b>morfemas derivativos</b> crean palabras nuevas: <i>des-</i> + hacer = deshacer.'},
   {h:'Sintagmas: bloques con núcleo', p:'Una oración no es una cadena lineal, sino sintagmas jerárquicos. El <b>sintagma nominal (SN)</b> tiene como núcleo un sustantivo o pronombre; el <b>sintagma verbal (SV)</b> tiene como núcleo un verbo. La regla básica: Oración → SN + SV.'},
   {h:'Ambigüedad sintáctica', p:'Cuando una misma secuencia admite dos árboles distintos surge la ambigüedad estructural: "Vi al hombre con el telescopio" (¿usé el telescopio, o el hombre lo tenía?). El análisis de sintagmas resuelve el problema mostrando a qué se adjunta cada elemento.'},
   {h:'Morfosintaxis del inglés frente al español', p:'El inglés tiene morfología flexiva mucho más pobre que el español (casi no marca género gramatical, y el verbo apenas flexiona: <i>I/you/we/they walk</i> vs <i>he/she/it walks</i>), pero compensa con un <b>orden de palabras rígido</b> (Sujeto–Verbo–Objeto obligatorio), mientras el español permite más libertad gracias a su morfología verbal rica.'}
 ],
 taller:{q:['Segmenta "inaceptables" en prefijo + raíz + sufijo + flexión de plural.','¿Cuál es la raíz primaria de "descentralización"?','En "El profesor de idiomas explicó la lección rápidamente", delimita el SN sujeto y el SV predicado.','Explica los dos significados posibles de "Se venden abrigos de piel de hombre baratos".'],
  a:'1) In- (prefijo) + acept- (raíz) + -able- (sufijo) + -s (plural). 2) La raíz primaria es centr- (de "centro"). 3) SN sujeto = [El profesor de idiomas]; SV predicado = [explicó la lección rápidamente]. 4) (a) abrigos baratos hechos de piel de hombre, o (b) abrigos para hombre, hechos de piel, a buen precio — la ambigüedad está en a qué se adjunta "de hombre" y "baratos".'}
},
{id:'semantica', area:'Eje lingüístico', title:'Semántica y pragmática', icon:'💭',
 intro:'¿Qué dice una oración literalmente y qué quiere decir quien la pronuncia? Ese es el terreno compartido de la semántica (significado codificado) y la pragmática (significado en contexto).',
 concepts:[
   {h:'Denotación vs. connotación', p:'La <b>denotación</b> es el significado objetivo de diccionario. La <b>connotación</b> son los valores emocionales o culturales añadidos. "Zorro" denota un cánido; connota astucia cuando se aplica a una persona.'},
   {h:'Relaciones semánticas', p:'Sinonimia (significados equivalentes), antonimia (significados opuestos) e hiponimia (relación de inclusión: "perro" es hipónimo de "animal") permiten mapear el léxico de una lengua como una red, no como una lista.'},
   {h:'Actos de habla (Austin y Searle)', p:'Al hablar no solo informamos, actuamos. Cada enunciado tiene un <b>acto locutivo</b> (las palabras exactas), un <b>acto ilocutivo</b> (la intención: prometer, pedir, ordenar) y un <b>acto perlocutivo</b> (el efecto real en el oyente). "¿Puedes pasar la sal?" pregunta por una capacidad pero pide un objeto.'},
   {h:'Implicatura conversacional', p:'A veces comunicamos más de lo que decimos literalmente, apoyados en máximas conversacionales compartidas (de cantidad, calidad, relación, modo). Si alguien pregunta "¿vienes a la fiesta?" y responde "tengo que estudiar", implica un "no" sin decirlo.'}
 ],
 taller:{q:['¿Qué acto ilocutivo hay detrás de "hace mucho calor aquí adentro, ¿no?" dicho en una oficina?','Un padre dice a su hijo antes de un examen: "espero que hayas estudiado lo suficiente". ¿Qué función cumple?','Compara el valor denotativo y connotativo de "zorro" aplicado a un animal y a una persona astuta.'],
  a:'1) Es una petición indirecta: se busca que alguien abra la ventana o encienda el aire, no solo informar sobre la temperatura. 2) Es una exhortación velada: bajo la forma de un deseo, en realidad advierte sobre la responsabilidad del hijo. 3) Denotativo: cánido silvestre. Connotativo, aplicado a una persona: astucia, sagacidad, capacidad de salirse con la suya.'}
},
{id:'sociolinguistica', area:'Eje lingüístico', title:'Sociolingüística', icon:'🌎',
 intro:'Ninguna lengua es uniforme ni estática. La variación en el habla está ligada a la clase social, la edad, el género y la región — y esa variación tiene consecuencias de poder y prestigio.',
 concepts:[
   {h:'Tipos de variación', p:'<b>Dialecto</b> (variación geográfica: español rolo, costeño, paisa…), <b>sociolecto</b> (variación por nivel socioeconómico o educativo), <b>cronolecto</b> (variación generacional) y <b>registro</b> (adaptación según formalidad).'},
   {h:'Prestigio lingüístico', p:'Ninguna variedad es "mejor" desde la lingüística, pero la sociedad otorga prestigio al habla de los grupos dominantes y estigmatiza las variedades de comunidades marginadas. El lenguaje es, así, un mecanismo de inclusión y exclusión social.'},
   {h:'Contacto de lenguas y bilingüismo', p:'Cuando conviven dos lenguas (español y lenguas indígenas, o español e inglés) surgen préstamos léxicos, calcos y alternancia de código (<i>code-switching</i>). Ninguno de estos fenómenos es "corrupción" de la lengua: son procesos naturales de contacto.'},
   {h:'La variedad del inglés como lengua global', p:'El inglés funciona hoy como lengua franca con múltiples normas (americano, británico, indio, nigeriano…), lo cual obliga a repensar qué significa "hablar bien" un idioma que ya no tiene un único centro de prestigio.'}
 ],
 taller:{q:['Clasifica: el uso de "parce" entre jóvenes colombianos, ¿es cronolecto, dialecto o registro?','Un médico cambia su léxico al hablar con un paciente frente a un colega. ¿Qué variable sociolingüística ilustra?','¿Por qué "haiga" está estigmatizado mientras "show" o "parking" se perciben como prestigiosos?'],
  a:'1) Es sobre todo cronolecto (uso generacional juvenil), aunque también tiene un componente dialectal colombiano. 2) Ilustra un cambio de registro (informal/divulgativo con el paciente vs. jerga técnica con el colega). 3) "Haiga" está estigmatizado por la norma culta como forma no estándar; los anglicismos, en cambio, se asocian al prestigio económico y cultural global del inglés — el juicio no es lingüístico sino social.'}
},
{id:'discurso', area:'Eje literario-cultural', title:'Análisis del discurso y estudios culturales', icon:'🗞️',
 intro:'Formar un analista crítico capaz de leer los mensajes implícitos, las ideologías y las relaciones de poder detrás de los medios, la literatura y la política.',
 concepts:[
   {h:'Análisis Crítico del Discurso (ACD)', p:'No analiza palabras aisladas, sino el discurso como práctica social: cómo los textos producen y reproducen dominación, sesgos de género o desigualdad.'},
   {h:'Representación (Stuart Hall)', p:'El proceso por el cual una cultura usa el lenguaje para producir significado y construir modelos de la realidad — los medios no reflejan el mundo, lo construyen mediante decisiones de lenguaje.'},
   {h:'Encuadre o framing', p:'La selección de palabras o perspectivas en una noticia orienta la interpretación del lector. "Protestantes destruyen propiedad" vs "Ciudadanos se movilizan contra el gobierno" describen el mismo hecho con agentes y juicios distintos.'},
   {h:'Performatividad (Judith Butler)', p:'Ciertas identidades —como el género— no son esencias fijas sino actos repetidos a través del lenguaje y la conducta. El lenguaje no solo describe identidades, las produce.'}
 ],
 taller:{q:['Compara: "Suben los precios debido a ajustes inevitables" vs "El gobierno incrementa impuestos afectando a los trabajadores". ¿Quién es el agente en cada titular?','¿Qué diferencia ideológica hay entre llamar a un grupo armado "insurgentes", "rebeldes" o "combatientes por la libertad"?'],
  a:'1) El primer titular usa una fuerza abstracta e impersonal ("ajustes inevitables") que diluye la responsabilidad; el segundo atribuye agencia directa al gobierno ("incrementa impuestos"), volviéndolo responsable visible del efecto. 2) Cada término hace un trabajo de encuadre distinto: "insurgentes" y "rebeldes" tienden a criminalizar o relativizar, mientras "combatientes por la libertad" legitima éticamente la causa — la elección léxica nunca es neutral.'}
},
{id:'literatura', area:'Eje literario-cultural', title:'Literatura hispánica: periodos y herramientas de análisis', icon:'📚',
 intro:'La columna vertebral literaria de la carrera: conocer el recorrido histórico de la literatura en español y contar con herramientas de teoría literaria para analizar cualquier texto, de un poema medieval a una novela contemporánea.',
 concepts:[
   {h:'Del Medioevo al Siglo de Oro', p:'La literatura medieval (Mester de Juglaría, Mester de Clerecía, el <i>Cantar de Mio Cid</i>) da paso al <b>Renacimiento</b> y al <b>Barroco</b> del Siglo de Oro español (Garcilaso, Cervantes, Góngora, Quevedo), donde conviven el ideal clásico de equilibrio y el desengaño barroco expresado en artificio formal.'},
   {h:'Romanticismo, Realismo y Modernismo', p:'El <b>Romanticismo</b> exalta la subjetividad y lo nacional; el <b>Realismo</b> (y luego el Naturalismo) observa la sociedad con rigor casi científico; el <b>Modernismo hispanoamericano</b> (Rubén Darío) renueva el lenguaje poético con musicalidad y exotismo, siendo el primer movimiento literario que Hispanoamérica exporta a España.'},
   {h:'Vanguardias y el Boom latinoamericano', p:'Las vanguardias de inicios del siglo XX rompen la sintaxis y la lógica narrativa tradicional. A mediados de siglo, el <b>Boom latinoamericano</b> (García Márquez, Vargas Llosa, Cortázar, Fuentes) internacionaliza la narrativa con el <b>realismo mágico</b> y experimentación estructural.'},
   {h:'Herramientas de análisis: figuras retóricas y niveles del texto', p:'Metáfora (traslado de sentido por semejanza), metonimia (por contigüidad), hipérbaton (alteración del orden sintáctico), anáfora, ironía… Un análisis literario completo revisa el <b>nivel fónico-rítmico</b>, el <b>nivel morfosintáctico</b>, el <b>nivel léxico-semántico</b> y el <b>nivel pragmático-contextual</b> del texto.'},
   {h:'Géneros literarios', p:'La <b>lírica</b> (expresión subjetiva, verso), la <b>narrativa</b> (relato de hechos mediante un narrador: cuento, novela) y el <b>drama</b> (representación mediante diálogo y acción escénica) organizan la tradición occidental, aunque muchos textos contemporáneos cruzan esas fronteras deliberadamente.'}
 ],
 taller:{q:['Identifica la figura retórica en "sus dientes eran perlas" y en "leí todo García Márquez".','¿Qué distingue al realismo mágico de la simple fantasía narrativa?','Elige un poema breve que conozcas y describe qué ocurre en su nivel fónico-rítmico (rima, métrica, ritmo).'],
  a:'1) "Sus dientes eran perlas" es una metáfora (traslado por semejanza); "leí todo García Márquez" es una metonimia (el autor por su obra). 2) El realismo mágico presenta lo extraordinario como parte natural y cotidiana de la realidad narrada, sin que los personajes lo perciban como ruptura — a diferencia de la fantasía, que suele marcar un mundo o una regla claramente distinta de la realidad ordinaria. 3) (Respuesta abierta): revisa el tipo de rima (asonante/consonante), el esquema métrico y cómo el ritmo refuerza o contrasta con el contenido emocional del poema.'}
},
{id:'didactica', area:'Eje pedagógico', title:'Didáctica y pedagogía del lenguaje', icon:'🎓',
 intro:'Cómo se enseña una lengua materna y cómo se aprende una segunda lengua: teorías cognitivas y psicolingüísticas junto con métodos prácticos de enseñanza y diseño curricular.',
 concepts:[
   {h:'Adquisición (L1) vs. aprendizaje (L2)', p:'La <b>adquisición</b> es el proceso natural e implícito de la infancia por exposición continua (Krashen); el <b>aprendizaje</b> es el proceso explícito y consciente de reglas y vocabulario en contextos formales, típico de una segunda lengua en la adultez.'},
   {h:'La hipótesis del input comprensible (i+1)', p:'Para avanzar, el estudiante necesita material un paso por encima de su nivel actual. Si el input es demasiado fácil (i+0) no hay progreso; si es demasiado difícil (i+10) sube el "filtro afectivo" y bloquea el aprendizaje.'},
   {h:'Interlengua y transferencia', p:'La <b>interlengua</b> es el sistema transitorio que construye el estudiante entre su lengua nativa y la meta. La <b>transferencia negativa</b> aplica reglas de la L1 donde no corresponden: decir en inglés "I have 20 years" calcando el español "tengo 20 años" en vez de "I am 20 years old".'},
   {h:'Enfoques de enseñanza de lenguas', p:'Del método gramática-traducción (memorización de reglas) al enfoque comunicativo (uso real de la lengua con fines de comunicación) y al aprendizaje basado en tareas — cada enfoque define de forma distinta qué significa "saber" un idioma.'}
 ],
 taller:{q:['Un hispanohablante escribe en inglés "Is very important to study every day." ¿Por qué omite el sujeto "It"?','Un estudiante dice "I am agree with you". ¿Qué confusión léxico-gramatical ocurre?','Si tu nivel de una lengua extranjera es A2, propone 2 actividades que respeten la condición i+1.'],
  a:'1) En español el sujeto puede ser tácito ("Es importante"); el estudiante transfiere esa regla al inglés, que exige un sujeto explícito ("It"). 2) Confunde "agree" (verbo: "I agree") con un adjetivo, calcando la estructura española "estoy de acuerdo" (ser/estar + adjetivo). 3) (Respuesta abierta): por ejemplo, ver un episodio corto con subtítulos en el idioma meta y anotar 10 palabras nuevas en contexto, o leer noticias graduadas (news in slow language) en vez de literatura clásica avanzada.'}
},
{id:'ingles-lengua', area:'Eje pedagógico', title:'Inglés: fonética y gramática', icon:'🇬🇧',
 intro:'El componente de lengua extranjera exige dominar el sistema fonológico y gramatical del inglés con la misma rigurosidad con que se estudia el español, además de anticipar los puntos donde ambas lenguas chocan.',
 concepts:[
   {h:'El sistema vocálico inglés', p:'El inglés tiene muchas más vocales que el español (que solo tiene 5): distingue por duración y tensión, como <span class="ipa">/iː/</span> "sheep" vs <span class="ipa">/ɪ/</span> "ship", o <span class="ipa">/uː/</span> "fool" vs <span class="ipa">/ʊ/</span> "full". Este contraste no existe en español y es una fuente frecuente de errores de pronunciación.'},
   {h:'El sistema verbal y sus tiempos', p:'A diferencia del español, el inglés distingue de forma sistemática entre <b>aspecto simple, continuo y perfecto</b> en cada tiempo (present simple/continuous/perfect), lo que permite matices que en español suelen resolverse con el contexto o con perífrasis.'},
   {h:'Orden de palabras y auxiliares', p:'El inglés exige un orden Sujeto-Verbo-Objeto casi fijo y usa verbos auxiliares (do/does/did) para preguntas y negaciones donde el español simplemente entona o invierte el orden: "¿Estudias inglés?" vs "Do you study English?".'},
   {h:'Falsos amigos y calcos frecuentes', p:'Palabras como <i>actually</i> (en realidad, no "actualmente"), <i>embarrassed</i> (avergonzado, no "embarazada") o <i>library</i> (biblioteca, no "librería") generan errores sistemáticos por semejanza formal con el español.'}
 ],
 taller:{q:['Explica la diferencia de significado entre "I have lived here for 10 years" y "I lived here for 10 years".','Da un ejemplo de falso amigo entre el español y el inglés distinto a los mencionados arriba.','Transforma a pregunta: "She works in a school." usando el auxiliar correcto.'],
  a:'1) La primera (present perfect) indica una acción que empezó en el pasado y continúa hasta el presente (todavía vive ahí); la segunda (past simple) indica una acción terminada en el pasado (ya no vive ahí). 2) Ejemplos posibles: "sensible" (en inglés significa "sensato", no "sensible/emotivo"); "carpet" (alfombra, no "carpeta"); "exit" (salida, no "éxito"). 3) "Does she work in a school?" — se usa el auxiliar "does" porque el sujeto es de tercera persona singular y el verbo pierde la -s.'}
},
{id:'ingles-literatura', area:'Eje pedagógico', title:'Literatura y cultura en lengua inglesa', icon:'🖋️',
 intro:'Un recorrido panorámico por los movimientos y autores más citados de la literatura en inglés, útil tanto para el análisis literario como para diseñar clases de inglés con contenido cultural real.',
 concepts:[
   {h:'De lo isabelino al romanticismo inglés', p:'El teatro isabelino (Shakespeare, Marlowe) funda buena parte del canon dramático en inglés; el <b>romanticismo inglés</b> (Wordsworth, Coleridge, Byron, Keats) exalta la naturaleza, la imaginación y el individuo frente a la razón ilustrada.'},
   {h:'La novela victoriana y el modernismo anglosajón', p:'El siglo XIX consolida la novela de costumbres y crítica social (Dickens, las hermanas Brontë, Jane Austen). A inicios del XX el <b>modernismo anglosajón</b> (Virginia Woolf, James Joyce, T.S. Eliot) experimenta con el fluir de la conciencia y la fragmentación temporal.'},
   {h:'Literatura estadounidense y voces poscoloniales', p:'De la tradición estadounidense (Whitman, Hemingway, Faulkner, Toni Morrison) a las literaturas poscoloniales en inglés (nigeriana, india, caribeña), el campo ha dejado de tener un único centro geográfico o cultural.'},
   {h:'Leer literatura para enseñar lengua', p:'Un texto literario en inglés no solo enseña vocabulario y gramática en contexto: también expone al estudiante a variedades culturales del idioma, lo cual es un objetivo explícito de la formación en Lenguas Extranjeras.'}
 ],
 taller:{q:['¿Qué caracteriza a la técnica del "fluir de la conciencia" (stream of consciousness)?','Menciona un rasgo temático típico del romanticismo inglés.','¿Por qué es pedagógicamente útil llevar un cuento breve en inglés a una clase de nivel intermedio?'],
  a:'1) Es una técnica narrativa que intenta reproducir el flujo desordenado y asociativo del pensamiento de un personaje, sin la mediación ordenada de un narrador tradicional (ejemplo: Virginia Woolf, James Joyce). 2) La exaltación de la naturaleza como espejo emocional, el culto al individuo y a la imaginación, y una reacción frente al racionalismo ilustrado. 3) (Respuesta abierta): permite trabajar vocabulario y gramática en un contexto significativo, expone variedad cultural real, y da pie a actividades de comprensión, discusión oral y escritura creativa.'}
},
{id:'ingles-didactica', area:'Eje pedagógico', title:'Metodología de enseñanza del inglés (ELT)', icon:'🧑‍🏫',
 intro:'Cómo diseñar y ejecutar una clase de inglés como lengua extranjera con fundamento metodológico, más allá de la intuición.',
 concepts:[
   {h:'Enfoque comunicativo (CLT)', p:'Prioriza que el estudiante use la lengua con fines reales de comunicación por encima de la memorización aislada de reglas. El error se ve como parte natural del proceso, no como una falla a evitar a toda costa.'},
   {h:'Aprendizaje basado en tareas (TBLT)', p:'Organiza la clase alrededor de una tarea con un resultado concreto (planear un viaje, resolver un problema) en la que la lengua es el medio, no el fin explícito — esto aumenta la motivación y el uso espontáneo.'},
   {h:'Las cuatro destrezas y su integración', p:'<i>Listening, speaking, reading, writing</i> rara vez se enseñan de forma aislada en un enfoque moderno: una buena secuencia didáctica integra al menos dos destrezas por sesión (por ejemplo, escuchar un audio y luego discutirlo oralmente).'},
   {h:'Evaluación formativa vs. sumativa', p:'La evaluación <b>formativa</b> acompaña el proceso y da retroalimentación continua (útil para ajustar la enseñanza); la <b>sumativa</b> certifica un nivel al final de un periodo. Un buen diseño curricular necesita ambas, no solo la segunda.'}
 ],
 taller:{q:['Diseña brevemente una tarea comunicativa para practicar el "past simple" en un grupo de nivel A2.','¿Por qué el enfoque comunicativo tolera más el error que el método gramática-traducción?','Da un ejemplo de evaluación formativa distinto de un examen escrito.'],
  a:'1) (Respuesta abierta): por ejemplo, pedir a los estudiantes que entrevisten a un compañero sobre su último fin de semana usando el pasado simple, y luego presenten oralmente lo que descubrieron. 2) Porque su objetivo es la comunicación efectiva, no la corrección formal perfecta; corregir cada error rompe el flujo comunicativo y puede subir el filtro afectivo del estudiante. 3) Ejemplos: observación con lista de cotejo durante una actividad oral, un diario de aprendizaje, o retroalimentación entre pares (peer feedback) sobre un borrador de escritura.'}
}
];

/* ============================================================
   DATA — Prompts de escritura
   ============================================================ */
const WRITING_PROMPTS = [
 {id:'ensayo', title:'Ensayo argumentativo', brief:'¿El bilingüismo debería ser obligatorio desde la educación inicial? Defiende una tesis con al menos dos argumentos y un contraargumento refutado.'},
 {id:'resena', title:'Reseña literaria', brief:'Escribe una reseña crítica (no un resumen) de una obra del Boom latinoamericano o de la literatura en inglés que hayas leído, evaluando su propuesta estética.'},
 {id:'columna', title:'Columna de opinión', brief:'Escribe una columna corta sobre el prestigio lingüístico: ¿por qué ciertos acentos o formas de hablar se estigmatizan y otros no?'},
 {id:'cuento', title:'Microrrelato', brief:'Escribe un microrrelato de máximo 300 palabras que use al menos una figura retórica de forma deliberada (metáfora, hipérbaton, ironía…).'}
];

/* ============================================================
   DATA — Lectura y comprensión
   ============================================================ */
const READING = [
 {title:'El acento que juzga antes de escuchar',
  text:'En cualquier ciudad de habla hispana, basta con abrir la boca para que alguien decida, en menos de tres segundos, de dónde venimos, cuánto ganamos y qué tan educados somos. Ese juicio instantáneo rara vez tiene que ver con la gramática y casi todo con el prestigio: hablar con determinado acento capitalino suele leerse como neutralidad, mientras que un acento rural o costero se asocia, sin ninguna base lingüística real, con menor formación. La lingüística lleva décadas repitiendo que ninguna variedad de una lengua es intrínsecamente superior a otra; lo que cambia es el poder social de quienes la hablan. Aun así, ese conocimiento académico rara vez baja hasta el aula de clase, donde todavía se corrige el habla regional como si fuera un error y no una variante legítima.',
  qs:[
   {q:'¿Cuál es la idea principal del texto?', opts:['El acento revela con precisión el nivel educativo real de una persona.','El juicio social sobre los acentos no tiene una base lingüística, sino de prestigio.','Todos los acentos suenan igual de neutrales en español.'], correct:1},
   {q:'Según el texto, ¿qué suele ocurrir en el aula frente al habla regional?', opts:['Se enseña como una riqueza cultural equivalente a la variedad estándar.','Se corrige como si fuera un error, no una variante legítima.','No se menciona en absoluto en las clases.'], correct:1}
  ]},
 {title:'The invention that wasn\'t supposed to work',
  text:'Most people assume useful inventions arrive because someone set out to build them. Often the opposite is true. Many everyday materials and processes were first dismissed as failed experiments, and only years later did someone notice a use for the "mistake" hiding inside them. This pattern shows up again and again in the history of science: an experiment fails at its original goal, gets shelved, and is later rediscovered by a different researcher solving a completely different problem. The lesson is not that failure is secretly success in disguise, but that keeping careful records of what does not work is just as valuable as recording what does — because someone, eventually, will need exactly that "failed" result.',
  qs:[
   {q:'What is the main point of the passage?', opts:['Inventions always happen exactly as planned.','Failed experiments can become valuable later if recorded carefully.','Scientists should stop recording failed experiments.'], correct:1},
   {q:'According to the text, why should failed experiments be documented?', opts:['Because failure is actually the same as success.','Because someone else might need that result for a different problem later.','Because it is required by law in most laboratories.'], correct:1}
  ]}
];

/* ============================================================
   DATA — Taller de gramática (drills)
   ============================================================ */
const GRAMMAR_DRILLS = [
 {prompt:'El profesor exige que los estudiantes ____ (llegar) a tiempo.', answers:['lleguen'], note:'Subjuntivo presente tras verbo de influencia ("exigir que").'},
 {prompt:'Ojalá ____ (llover) mañana para el paseo.', answers:['llueva'], note:'Subjuntivo presente tras "ojalá".'},
 {prompt:'Si yo ____ (tener) más tiempo, estudiaría lingüística comparada.', answers:['tuviera','tuviese'], note:'Condicional irreal: imperfecto de subjuntivo en la prótasis.'},
 {prompt:'"Haiga" es una forma no estándar; la forma correcta del subjuntivo de "haber" es ____.', answers:['haya'], note:'Forma normativa: "que haya llegado", no "que haiga llegado".'},
 {prompt:'She ____ (live) in Bogotá since 2019.', answers:['has lived'], note:'Present perfect: acción que empezó en el pasado y continúa.'},
 {prompt:'If I ____ (be) you, I would study phonetics first.', answers:['were'], note:'Segundo condicional: "were" para todas las personas en la prótasis irreal.'},
 {prompt:'By the time she arrived, we ____ (already/finish) the class.', answers:['had already finished','had finished already'], note:'Past perfect: una acción anterior a otra acción pasada.'},
 {prompt:'He ____ (not/agree) with the new methodology at first.', answers:['did not agree','didn\'t agree'], note:'Pasado simple negativo con auxiliar "did".'},
 {prompt:'Esta oración tiene hipérbaton: "____ mi corazón triste canta". Reordénala al orden lógico SVO.', answers:['mi corazón triste canta','mi triste corazon canta'], note:'El hipérbaton altera el orden esperado por razones rítmicas o expresivas.'},
 {prompt:'"El perro es hipónimo de ____" — completa con el hiperónimo correcto.', answers:['animal'], note:'Hiponimia: relación de inclusión de significado (perro ⊂ animal).'}
];

/* ============================================================
   DATA — Flashcards
   ============================================================ */
const FLASHCARDS = [
 {f:'Fonema', b:'Unidad mínima abstracta del sistema sonoro que distingue significados. Se escribe entre barras: /p/.'},
 {f:'Morfema', b:'Unidad mínima con significado dentro de una palabra (raíz, flexivo o derivativo).'},
 {f:'Sintagma', b:'Grupo de palabras organizado en torno a un núcleo (nominal, verbal, etc.).'},
 {f:'Connotación', b:'Valor emocional o cultural secundario de una palabra, más allá de su significado literal.'},
 {f:'Acto ilocutivo', b:'La intención real detrás de un enunciado: prometer, pedir, ordenar, advertir.'},
 {f:'Sociolecto', b:'Variedad lingüística asociada al nivel socioeconómico o educativo de un grupo.'},
 {f:'Framing (encuadre)', b:'Selección de palabras o perspectivas para orientar la interpretación de una noticia o discurso.'},
 {f:'Realismo mágico', b:'Presentar lo extraordinario como parte natural de la realidad narrada, sin que sea percibido como ruptura.'},
 {f:'Metonimia', b:'Figura retórica que nombra algo por su relación de contigüidad (la parte por el todo, el autor por su obra).'},
 {f:'Hipérbaton', b:'Alteración del orden sintáctico habitual con fines rítmicos o expresivos.'},
 {f:'Interlengua', b:'Sistema lingüístico transitorio que construye un estudiante entre su L1 y la lengua meta.'},
 {f:'Input comprensible (i+1)', b:'Material de aprendizaje un paso por encima del nivel actual del estudiante (hipótesis de Krashen).'},
 {f:'Stream of consciousness', b:'Técnica narrativa que reproduce el flujo asociativo y desordenado del pensamiento de un personaje.'},
 {f:'Code-switching', b:'Alternancia entre dos lenguas o variedades dentro de una misma conversación o enunciado.'},
 {f:'Present perfect', b:'Tiempo verbal inglés que conecta una acción pasada con el presente: "I have lived here for 10 years".'},
 {f:'Falso amigo', b:'Palabra que se parece formalmente a otra en otra lengua pero tiene un significado distinto (embarrassed ≠ embarazada).'}
];

/* ============================================================
   DATA — Quiz relámpago (banco de preguntas)
   ============================================================ */
const QUIZ_BANK = [
 {q:'¿Entre qué signos se escribe un fonema?', opts:['Corchetes [ ]','Barras / /','Paréntesis ( )'], c:1},
 {q:'¿Qué parámetro describe si vibran las cuerdas vocales?', opts:['Punto de articulación','Modo de articulación','Sonoridad'], c:2},
 {q:'El morfema "-s" de "niños" es...', opts:['Un morfema léxico','Un morfema flexivo','Un morfema derivativo'], c:1},
 {q:'¿Cuál es el núcleo de un sintagma verbal (SV)?', opts:['Un sustantivo','Un verbo','Un adjetivo'], c:1},
 {q:'"Zorro" aplicado a una persona astuta es un ejemplo de...', opts:['Denotación','Connotación','Hiponimia'], c:1},
 {q:'El acto ilocutivo de "¿puedes pasar la sal?" es...', opts:['Preguntar por una capacidad física','Hacer una petición indirecta','Dar una orden directa'], c:1},
 {q:'La variación lingüística asociada a la edad se llama...', opts:['Dialecto','Cronolecto','Sociolecto'], c:1},
 {q:'El framing o encuadre ocurre principalmente en...', opts:['La fonética','La selección léxica y de perspectiva en un texto','La morfología flexiva'], c:1},
 {q:'¿Qué movimiento literario introduce el "realismo mágico"?', opts:['El Boom latinoamericano','El Romanticismo','El Barroco'], c:0},
 {q:'"Leí todo García Márquez" es un ejemplo de...', opts:['Metáfora','Metonimia','Hipérbaton'], c:1},
 {q:'La hipótesis del input comprensible se abrevia como...', opts:['i+1','L1+L2','A2+B1'], c:0},
 {q:'"I have 20 years" en vez de "I am 20 years old" es un ejemplo de...', opts:['Adquisición natural','Transferencia negativa de la L1','Input comprensible'], c:1},
 {q:'¿Qué vocal inglesa distingue "sheep" de "ship"?', opts:['Duración/tensión vocálica','Sonoridad consonántica','Acento tónico'], c:0},
 {q:'"Actually" en inglés significa...', opts:['Actualmente','En realidad','Realmente ahora mismo'], c:1},
 {q:'El enfoque comunicativo (CLT) prioriza...', opts:['La memorización de reglas gramaticales aisladas','El uso real de la lengua con fines comunicativos','La traducción palabra por palabra'], c:1},
 {q:'¿Qué autor se asocia al "stream of consciousness"?', opts:['Virginia Woolf','Gabriel García Márquez','Rubén Darío'], c:0},
 {q:'El Modernismo hispanoamericano está asociado principalmente a...', opts:['Rubén Darío','Miguel de Cervantes','Julio Cortázar'], c:0},
 {q:'"Descentralización" tiene como raíz primaria a...', opts:['des-','centr-','-ización'], c:1},
 {q:'La evaluación que acompaña el proceso de aprendizaje se llama...', opts:['Sumativa','Formativa','Diagnóstica final'], c:1},
 {q:'¿Qué distingue al Realismo del Romanticismo?', opts:['El Realismo exalta la subjetividad; el Romanticismo observa con rigor científico','El Realismo observa la sociedad con rigor casi científico; el Romanticismo exalta lo subjetivo','Son exactamente el mismo movimiento'], c:1},
 {q:'"Library" en inglés significa...', opts:['Librería','Biblioteca','Editorial'], c:1},
 {q:'La sinonimia es una relación semántica de...', opts:['Oposición','Inclusión','Equivalencia de significado'], c:2},
 {q:'¿Qué es la interlengua?', opts:['La lengua materna del estudiante','El sistema transitorio entre L1 y la lengua meta','El examen final de un curso de idiomas'], c:1},
 {q:'El Cantar de Mio Cid pertenece a...', opts:['La literatura medieval','El Boom latinoamericano','El modernismo'], c:0}
];

/* ============================================================
   DATA — Ahorcado
   ============================================================ */
const HANGMAN_WORDS = [
 {w:'METAFORA', hint:'Figura retórica de traslado por semejanza'},
 {w:'MORFEMA', hint:'Unidad mínima con significado'},
 {w:'FONEMA', hint:'Unidad mínima que distingue significados sonoros'},
 {w:'HIPERBATON', hint:'Alteración del orden sintáctico habitual'},
 {w:'SOCIOLECTO', hint:'Variación ligada a la clase social'},
 {w:'CONNOTACION', hint:'Valor emocional añadido a una palabra'},
 {w:'METONIMIA', hint:'Nombrar algo por su contigüidad'},
 {w:'SONETO', hint:'Poema de catorce versos'},
 {w:'DIPTONGO', hint:'Unión de dos vocales en una sílaba'},
 {w:'SINTAGMA', hint:'Grupo de palabras con un núcleo'},
 {w:'IRONIA', hint:'Decir lo contrario de lo que se piensa con intención'},
 {w:'ANAFORA', hint:'Repetición de una palabra al inicio de versos o frases'}
];

/* ============================================================
   DATA — Empareja el movimiento
   ============================================================ */
const MATCH_PAIRS = [
 {a:'Romanticismo', b:'Exalta la subjetividad y lo nacional'},
 {a:'Realismo', b:'Observa la sociedad con rigor casi científico'},
 {a:'Modernismo', b:'Rubén Darío y la musicalidad del verso'},
 {a:'Boom latinoamericano', b:'Realismo mágico y experimentación estructural'},
 {a:'Barroco', b:'Artificio formal y desengaño (Góngora, Quevedo)'},
 {a:'Vanguardias', b:'Rompen la sintaxis y la lógica narrativa tradicional'},
 {a:'Modernismo anglosajón', b:'Fluir de la conciencia (Woolf, Joyce)'},
 {a:'Literatura medieval', b:'Cantar de Mio Cid, Mester de Juglaría'}
];

/* ============================================================
   DATA — Transcriptor AFI
   ============================================================ */
const IPA_WORDS = [
 {w:'gente', a:['xente','xénte'], real:'/xente/'},
 {w:'queso', a:['keso'], real:'/keso/'},
 {w:'zorro', a:['soro','θoro'], real:'/soro/ o /θoro/ (seseo/distinción)'},
 {w:'think', a:['θɪŋk','thingk'], real:'/θɪŋk/'},
 {w:'this', a:['ðɪs'], real:'/ðɪs/'},
 {w:'ship', a:['ʃɪp'], real:'/ʃɪp/'},
 {w:'sheep', a:['ʃiːp','ʃip'], real:'/ʃiːp/'},
 {w:'vision', a:['vɪʒən','viʒn'], real:'/ˈvɪʒən/'}
];

/* ============================================================
   DATA — Detective del discurso
   ============================================================ */
const DISCOURSE_ITEMS = [
 {h:'"Suben los precios debido a ajustes inevitables en la economía."',
  q:'¿Quién es el agente responsable según este titular?',
  opts:['El gobierno, de forma explícita','Una fuerza abstracta e impersonal ("ajustes")','Los consumidores'], c:1,
  exp:'El titular diluye la responsabilidad usando una construcción impersonal: nadie decide, "los ajustes" simplemente ocurren.'},
 {h:'"El gobierno incrementa impuestos afectando el bolsillo de los trabajadores."',
  q:'¿Qué efecto retórico logra nombrar al gobierno como sujeto explícito del verbo?',
  opts:['Vuelve al gobierno agente visible y responsable del efecto negativo','Hace el titular más neutral y objetivo','No tiene ningún efecto retórico'], c:0,
  exp:'Al ser sujeto gramatical de un verbo de acción ("incrementa"), el gobierno queda marcado como responsable directo del efecto negativo descrito.'},
 {h:'"Ciudadanos se movilizan contra el gobierno" vs "Protestantes destruyen propiedad"',
  q:'¿Qué diferencia de encuadre hay entre ambas formas de titular el mismo hecho?',
  opts:['Ninguna, son equivalentes','La primera legitima la acción como ejercicio ciudadano; la segunda la criminaliza centrándose en el daño material','La segunda es más neutral que la primera'], c:1,
  exp:'La elección del verbo y del sustantivo (ciudadanos/movilizan vs. protestantes/destruyen) orienta el juicio del lector hacia la legitimidad o la criminalización del mismo hecho.'}
];

/* ============================================================
   STATE (localStorage-backed)
   ============================================================ */
function loadJSON(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } }
function saveJSON(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }

/* Aviso flotante (reemplaza alert(), que no funciona bien en WebView/APK) */
let toastTimer = null;
function toast(msg, ms){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), ms || 2600);
}

/* Guardar texto como archivo: compartir (móvil) → descarga (navegador) → portapapeles (WebView) */
async function saveTextFile(filename, text, mime){
  mime = mime || 'text/plain';
  try{
    const file = new File([text], filename, { type: mime });
    if(navigator.canShare && navigator.canShare({ files:[file] })){
      await navigator.share({ files:[file], title: filename });
      return 'shared';
    }
  }catch(e){ if(e && e.name === 'AbortError') return 'cancelled'; }
  const isWebView = /; wv\)/.test(navigator.userAgent || '');
  if(!isWebView){
    try{
      const url = URL.createObjectURL(new Blob([text], { type: mime + ';charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 4000);
      return 'downloaded';
    }catch(e){}
  }
  try{
    await navigator.clipboard.writeText(text);
    return 'copied';
  }catch(e){
    try{
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove();
      return ok ? 'copied' : 'failed';
    }catch(_){ return 'failed'; }
  }
}

let studiedModules = loadJSON('lyl_studied', {});
let drafts = loadJSON('lyl_drafts', {});
let currentPromptId = null;

/* ============================================================
   NAVIGATION
   ============================================================ */
const navlinks = document.querySelectorAll('.navlink');
const panels = document.querySelectorAll('.panel');
function showPanel(id){
  panels.forEach(p=>p.classList.toggle('active', p.id === 'panel-'+id));
  navlinks.forEach(n=>n.classList.toggle('active', n.dataset.panel===id));
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  window.scrollTo(0,0);
  try{ history.replaceState(null,'','#'+id); }catch(_){}
  onPanelChange(id);
}
navlinks.forEach(n=>n.addEventListener('click', ()=>goPanel(n.dataset.panel)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click', ()=>goPanel(b.dataset.goto)));

const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
if(menuBtn){
  menuBtn.addEventListener('click', ()=>{ sidebar.classList.add('open'); overlay.classList.add('show'); });
  overlay.addEventListener('click', ()=>{ sidebar.classList.remove('open'); overlay.classList.remove('show'); });
}

/* Theme toggle */
const themeBtns = document.querySelectorAll('.theme-btn');
function applyTheme(mode){
  if(mode==='auto'){ document.documentElement.removeAttribute('data-theme'); }
  else { document.documentElement.setAttribute('data-theme', mode); }
  document.documentElement.setAttribute('data-bs-theme', mode==='auto' ? ((window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light') : mode);
  themeBtns.forEach(b=>b.classList.toggle('active', b.dataset.theme===mode));
  saveJSON('lyl_theme', mode);
}
themeBtns.forEach(b=>b.addEventListener('click', ()=>applyTheme(b.dataset.theme)));
applyTheme(loadJSON('lyl_theme','auto'));

/* ============================================================
   SESIÓN, CARRERA Y NIVELES
   ============================================================ */
let session = loadJSON('lyl_session', null);
let sel = loadJSON('lyl_sel', null);
if(!session){ location.replace('index.html'); return; }
if(!sel || !CAREERS.find(c => c.id === sel.career)){ location.replace('seleccion.html'); return; }
let demoUnlock = loadJSON('lyl_demo', false);
let MODULES = [], EXAM_BANK = [], currentLevel = 'basico';
const moduleNav = document.getElementById('moduleNav');
const moduleContainer = document.getElementById('moduleContainer');
const $ = id => document.getElementById(id);

function career(){ return CAREERS.find(c => sel && c.id === sel.career); }
function modulesFor(c){
  if(c.id === 'lengua') return LENGUA_MODULES.map(m => ({...m, level: LEVELS.find(l => c.levels[l.id].includes(m.id)).id}));
  return EXTRA_MODULES[c.id];
}
function levelMods(l){ return MODULES.filter(m => m.level === l); }
function levelDone(l){ const ms = levelMods(l); return ms.length > 0 && ms.every(m => studiedModules[m.id]); }
function levelUnlocked(l){ const i = LEVELS.findIndex(x => x.id === l); return demoUnlock || i === 0 || levelDone(LEVELS[i-1].id); }
function guideDone(){ return LEVELS.every(l => levelDone(l.id)); }
function examUnlocked(){ return demoUnlock || guideDone(); }
function examFormat(){ const f = EXAM_FORMATS[sel.uni]; return {n: Math.min(f.n, EXAM_BANK.length), min: f.min}; }

/* ---------- Adaptación de toda la plataforma a la carrera elegida ---------- */
const HERO0 = {e:$('heroEyebrow').innerHTML, h:$('heroH1').innerHTML, l:$('heroLead').innerHTML};
function applyCareer(){
  const c = career(); if(!c) return;
  MODULES = modulesFor(c);
  EXAM_BANK = c.id === 'lengua' ? QUIZ_BANK : EXTRA_BANK[c.id];
  const uni = UNIS[sel.uni], f = examFormat(), isL = c.id === 'lengua';
  $('brandSub').textContent = c.name + ' · ' + uni;
  document.title = 'LGS — ' + c.name;
  $('heroEyebrow').textContent = 'PREPARACIÓN PARA ' + uni.toUpperCase();
  $('heroH1').textContent = isL ? HERO0.h : 'Prepárate para ingresar a ' + c.name + '.';
  $('heroLead').innerHTML = isL ? HERO0.l : 'Estudia por niveles, practica con un simulacro con el formato de tu universidad y pregúntale al tutor con IA lo que no te quede claro.';
  $('statRow').innerHTML = [[MODULES.length,'Módulos organizados en tres niveles de avance'],[f.n,'Preguntas del simulacro de ingreso'],[f.min,'Minutos para resolverlo'],['∞','Preguntas que puedes hacerle al tutor IA']]
    .map(s => `<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');
  $('lenguaMap').classList.toggle('hidden', !isL);
  $('lenguaPlan').classList.toggle('hidden', !isL);
  document.querySelectorAll('.pilot-note').forEach(n => n.classList.toggle('hidden', isL));
  $('guideTitle').textContent = 'Guía por niveles';
  $('guideLead').textContent = 'Avanza de nivel en nivel: el siguiente se desbloquea cuando marcas como estudiados todos los módulos del anterior.';
  currentLevel = 'basico';
  renderProgress(); renderGuide(); renderExamHome();
}

/* ---------- Progreso en el inicio ---------- */
function renderProgress(){
  $('moduleCheckList').innerHTML = MODULES.map(m => `
    <li><input type="checkbox" id="chk-${m.id}" ${studiedModules[m.id]?'checked':''} ${levelUnlocked(m.level)?'':'disabled'}> <label for="chk-${m.id}">${m.icon} ${m.title}</label></li>`).join('');
  MODULES.forEach(m => $('chk-'+m.id).addEventListener('change', e => setStudied(m.id, e.target.checked)));
  const done = MODULES.filter(m => studiedModules[m.id]).length;
  $('progressFill').style.width = (MODULES.length ? done/MODULES.length*100 : 0) + '%';
  $('progressLabel').textContent = done + ' de ' + MODULES.length + ' módulos estudiados';
}
function setStudied(id, val){
  const lvl = (MODULES.find(m => m.id === id) || {}).level;
  const was = levelDone(lvl);
  studiedModules[id] = val; saveJSON('lyl_studied', studiedModules);
  renderProgress(); renderLevelBar(); renderGuideNext(); renderExamHome();
  if(!was && levelDone(lvl)) toast(guideDone() ? 'Guía completa: ya puedes presentar el simulacro de ingreso.' : '¡Nivel completado! Se desbloqueó el siguiente.');
}

/* ---------- Guía por niveles ---------- */
function renderLevelBar(){
  $('levelBar').innerHTML = LEVELS.map(l => {
    const ms = levelMods(l.id), d = ms.filter(m => studiedModules[m.id]).length, lock = !levelUnlocked(l.id);
    return `<div class="col-md-4"><button type="button" class="level-card w-100${l.id===currentLevel?' active':''}${lock?' locked':''}" data-level="${l.id}" ${lock?'aria-disabled="true"':''}>
      <b>${lock?'🔒 ':''}${l.name}</b><small>${d} de ${ms.length} módulos${lock?' · completa el nivel anterior':''}</small>
      <div class="progress mt-2" style="height:6px" role="progressbar"><div class="progress-bar" style="width:${ms.length?d/ms.length*100:0}%"></div></div></button></div>`;
  }).join('');
}
function renderGuideNext(){
  $('guideNext').innerHTML = examUnlocked()
    ? '<a class="btn btn-oxblood" href="examen.html">Ir al simulacro de ingreso</a>'
    : '<p class="alert alert-warning note">Completa los tres niveles para desbloquear el simulacro de ingreso.</p><button class="btn btn-outline btn-sm" id="demoUnlockBtn" type="button">Desbloquear todo (modo demostración)</button>';
  const d = $('demoUnlockBtn');
  if(d) d.addEventListener('click', () => { demoUnlock = true; saveJSON('lyl_demo', true); renderProgress(); renderGuide(); renderExamHome(); toast('Modo demostración: niveles y simulacro desbloqueados.'); });
}
function renderGuide(){
  if(!levelUnlocked(currentLevel)) currentLevel = 'basico';
  renderLevelBar(); renderGuideNext();
  moduleNav.innerHTML = '<button class="mtab active" data-m="all">Todo el nivel</button>' + levelMods(currentLevel).map(m => `<button class="mtab" data-m="${m.id}">${m.icon} ${m.title}</button>`).join('');
  renderModules('all');
}
$('levelBar').addEventListener('click', e => {
  const b = e.target.closest('[data-level]'); if(!b) return;
  if(!levelUnlocked(b.dataset.level)){ toast('Completa el nivel anterior para desbloquear este.'); return; }
  currentLevel = b.dataset.level; renderGuide();
});
function renderModules(filter){
  moduleContainer.innerHTML = levelMods(currentLevel).filter(m=>filter==='all'||m.id===filter).map(m=>`
    <div class="module card" id="mod-${m.id}">
      <div class="module-head">
        <h2>${m.icon} ${m.title}</h2>
        <span class="module-area">${m.area}</span>
        <button class="btn btn-outline btn-sm" type="button" data-ask="${m.id}">💬 Preguntar al tutor</button>
      </div>
      <p class="module-intro">${m.intro}</p>
      ${m.concepts.map(c=>`<div class="concept"><h3>${c.h}</h3><p>${c.p}</p></div>`).join('')}
      <div class="taller">
        <h4>Taller práctico</h4>
        <ol>${m.taller.q.map(q=>`<li>${q}</li>`).join('')}</ol>
        <button class="btn btn-outline btn-sm reveal-btn" data-target="ans-${m.id}">Ver solucionario</button>
        <div class="answer-box" id="ans-${m.id}"><b>Solucionario:</b> ${m.taller.a}</div>
      </div>
      <label class="mark-studied" style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-soft);">
        <input type="checkbox" data-mark="${m.id}" ${studiedModules[m.id]?'checked':''}> Marcar módulo como estudiado
      </label>
    </div>`).join('');
  moduleContainer.querySelectorAll('.reveal-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const box = $(btn.dataset.target); box.classList.toggle('show');
      btn.textContent = box.classList.contains('show') ? 'Ocultar solucionario' : 'Ver solucionario';
    });
  });
  moduleContainer.querySelectorAll('[data-mark]').forEach(chk=>chk.addEventListener('change', e=>setStudied(chk.dataset.mark, e.target.checked)));
}
moduleNav.addEventListener('click', e=>{
  if(!e.target.classList.contains('mtab')) return;
  moduleNav.querySelectorAll('.mtab').forEach(b=>b.classList.remove('active'));
  e.target.classList.add('active');
  renderModules(e.target.dataset.m);
});

/* ---------- Simulador de examen de ingreso ---------- */
let exam = null;
function resetExam(){ if(exam) clearInterval(exam.timer); exam = null; }
function fmtClock(s){ return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0'); }
function renderExamHome(){
  const box = $('examBox'); if(!box || !sel || !career()) return;
  if(exam){ renderExam(); return; }
  if(!examUnlocked()){
    box.innerHTML = '<p class="alert alert-warning note">El simulacro se desbloquea al completar los tres niveles de la guía.</p><a class="btn btn-outline" href="guia.html">Volver a la guía</a>';
    return;
  }
  const f = examFormat();
  box.innerHTML = `<div class="card" style="padding:22px;max-width:620px;">
    <h3 style="font-family:var(--serif-display);margin:0 0 6px;">Simulacro · ${UNIS[sel.uni]}</h3>
    <p style="color:var(--ink-soft);margin:0 0 16px;">${f.n} preguntas de opción múltiple · ${f.min} minutos · formato referencial</p>
    <button class="btn btn-oxblood" id="examStart" type="button">Comenzar simulacro</button></div>`;
  $('examStart').addEventListener('click', startExam);
}
function startExam(){
  const f = examFormat();
  exam = {qs: shuffle(EXAM_BANK).slice(0, f.n), ans: {}, left: f.min*60, finished: false, timer: null};
  exam.timer = setInterval(() => {
    exam.left--;
    const c = $('examClock'); if(c) c.textContent = fmtClock(Math.max(exam.left,0));
    if(exam.left <= 0) finishExam();
  }, 1000);
  renderExam();
}
function renderExam(){
  const box = $('examBox'), done = exam.finished;
  const score = exam.qs.filter((q,i) => exam.ans[i] === q.c).length;
  box.innerHTML = (done
    ? `<div class="card" style="padding:22px;margin-bottom:18px;"><h3 style="font-family:var(--serif-display);margin:0 0 6px;">Resultado: ${score} de ${exam.qs.length} (${Math.round(score/exam.qs.length*100)}%)</h3>
       <p style="color:var(--ink-soft);margin:0 0 14px;">Revisa abajo las respuestas correctas y vuelve a la guía en los temas que fallaste.</p>
       <button class="btn btn-oxblood" id="examAgain" type="button">Repetir simulacro</button> <a class="btn btn-outline" href="guia.html">Volver a la guía</a></div>`
    : `<div class="exam-bar"><span>Tiempo: <b id="examClock">${fmtClock(exam.left)}</b></span><span id="examCount">${Object.keys(exam.ans).length} de ${exam.qs.length} respondidas</span></div>`)
    + exam.qs.map((q,i) => `<div class="exam-q"><p><b>${i+1}.</b> ${q.q}</p>${q.opts.map((o,oi) => {
        const cls = done ? (oi===q.c ? ' correct' : (exam.ans[i]===oi ? ' incorrect' : '')) : '';
        return `<label class="exam-opt${cls}"><input class="form-check-input mt-1 flex-shrink-0" type="radio" name="eq-${i}" value="${oi}" ${exam.ans[i]===oi?'checked':''} ${done?'disabled':''}> ${o}</label>`;
      }).join('')}</div>`).join('')
    + (done ? '' : '<button class="btn btn-oxblood" id="examFinish" type="button" style="margin-top:14px;">Entregar examen</button>');
  if(done){ $('examAgain').addEventListener('click', () => { resetExam(); renderExamHome(); }); return; }
  box.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', () => {
    exam.ans[r.name.slice(3)] = parseInt(r.value, 10);
    $('examCount').textContent = Object.keys(exam.ans).length + ' de ' + exam.qs.length + ' respondidas';
  }));
  $('examFinish').addEventListener('click', () => {
    const left = exam.qs.length - Object.keys(exam.ans).length;
    if(left > 0 && !confirm('Te faltan ' + left + ' preguntas por responder. ¿Entregar de todos modos?')) return;
    finishExam();
  });
}
function finishExam(){ if(!exam || exam.finished) return; clearInterval(exam.timer); exam.finished = true; renderExam(); window.scrollTo(0,0); }

/* ---------- Mi material (PDF) ---------- */
let pdfFiles = loadJSON('lyl_pdfs', []);
function renderFiles(){
  $('fileList').innerHTML = pdfFiles.length
    ? pdfFiles.map((f,i) => `<div class="file-row"><span>📄 ${escapeHtml(f.name)} <small style="color:var(--ink-faint);">(${(f.size/1048576).toFixed(1)} MB)</small></span><button class="btn btn-outline btn-sm" data-rm="${i}" type="button">Quitar</button></div>`).join('')
      + '<p class="alert alert-warning note" style="margin-top:14px;">La generación automática de ejercicios y juegos a partir de estos PDF llegará con la fase de IA.</p>'
    : '<p style="color:var(--ink-soft);font-size:14px;">Aún no has agregado material.</p>';
}
$('pdfInput').addEventListener('change', e => {
  Array.from(e.target.files).forEach(f => {
    if(!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf'){ toast('«' + f.name + '» no es un PDF.'); return; }
    if(f.size > 10*1048576){ toast('«' + f.name + '» supera los 10 MB.'); return; }
    pdfFiles.push({name: f.name, size: f.size});
  });
  saveJSON('lyl_pdfs', pdfFiles); e.target.value = ''; renderFiles();
});
$('fileList').addEventListener('click', e => {
  const b = e.target.closest('[data-rm]'); if(!b) return;
  pdfFiles.splice(parseInt(b.dataset.rm,10), 1); saveJSON('lyl_pdfs', pdfFiles); renderFiles();
});

/* ---------- Navegación entre páginas: login → selección → guía → examen ---------- */
const PAGE = document.body.dataset.page;
function goPanel(id){
  if((id === 'guia' || id === 'examen') && id !== PAGE){ location.href = id + '.html'; return; }
  showPanel(id);
}
function route(){ showPanel(PAGE); }
$('logoutLink').addEventListener('click', () => saveJSON('lyl_session', null));

/* ============================================================
   TUTOR IA — chat con Gemini a través del Cloudflare Worker
   ============================================================ */
const TUTOR_ENDPOINT = WORKER_URL.replace(/\/+$/, '') + '/';
const CHAT_KEY = 'lyl_chat_v2';
const MODE_KEY = 'lyl_chat_mode';
const CHAT_MAX_STORED = 40;

const MODES = {
  explicar: { label:'💡 Explicar',        ph:'Escribe tu pregunta sobre la carrera…' },
  examinar: { label:'🎯 Examinarme',      ph:'¿Sobre qué tema quieres que te examine?' },
  corregir: { label:'✍️ Corregir texto',  ph:'Pega aquí el texto que quieres que corrija…' },
  plan:     { label:'🗓 Plan de estudio', ph:'Cuéntame tu meta y cuánto tiempo tienes…' },
  ingles:   { label:'🌐 Inglés',          ph:'Write or ask in English (or Spanish)…' }
};
const DEFAULT_SUGGESTIONS = [
  '¿Cuál es la diferencia entre fonética y fonología?',
  'Explícame los actos de habla con un ejemplo cotidiano',
  '¿Qué es la hipótesis del input comprensible?',
  'Dame 3 autores clave del Boom latinoamericano',
  '¿Cómo estudio para un examen de morfosintaxis en una semana?'
];
const CONTEXT_SUGGESTIONS = [
  'Resúmeme este módulo en 5 ideas clave',
  'Ponme 3 preguntas de práctica sobre este módulo',
  '¿Qué errores comunes cometen los estudiantes con este tema?',
  'Explícamelo con un ejemplo cotidiano'
];

const chatLog     = document.getElementById('chatLog');
const chatInput   = document.getElementById('chatInput');
const chatSend    = document.getElementById('chatSend');
const chatAvail   = document.getElementById('chatAvail');
const chatDot     = document.getElementById('chatDot');
const chatModesEl = document.getElementById('chatModes');
const chatCtxEl   = document.getElementById('chatCtx');
const chatSuggest = document.getElementById('chatSuggest');
const chatCount   = document.getElementById('chatCount');
const chatClearBtn  = document.getElementById('chatClear');
const chatExportBtn = document.getElementById('chatExport');

const isTouchDevice = !!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches);

function sanitizeStored(arr){
  if(!Array.isArray(arr)) return [];
  return arr.filter(m => m && (m.role==='user' || m.role==='assistant') && typeof m.content==='string' && m.content.trim())
            .slice(-CHAT_MAX_STORED);
}
let chatHistory = sanitizeStored(loadJSON(CHAT_KEY, []));
let chatMode    = loadJSON(MODE_KEY, 'explicar');
if(!MODES[chatMode]) chatMode = 'explicar';
let chatContext = null;          // {id, title, text}
let chatBusy    = false;
let chatAbort   = null;
let showChips   = chatHistory.length === 0;
let tutorStatus = 'unknown';     // 'ok' | 'warn' | 'err' | 'unknown'
let pairs       = [];            // [{userEl, botEl}] de respuestas guardadas (para regenerar)
let pendingFail = null;          // {userEl, errEl} del último intento fallido

function saveChat(){ saveJSON(CHAT_KEY, chatHistory.slice(-CHAT_MAX_STORED)); }
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

/* ---------- Markdown → HTML (seguro: primero se escapa TODO el texto) ---------- */
function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function inlineMd(s){ // s ya viene escapado
  const codes = [];
  s = s.replace(/`([^`\n]+)`/g, (m,c)=>{ codes.push(c); return '\u0000' + (codes.length-1) + '\u0000'; });
  s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  s = s.replace(/\*\*([^\n]+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^\w*])\*([^*\s](?:[^*\n]*[^*\s])?)\*(?![\w*])/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^\w])_([^_\s](?:[^_\n]*[^_\s])?)_(?!\w)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (m,i)=>'<code>' + codes[i] + '</code>');
}
const LIST_RE  = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const HEAD_RE  = /^(#{1,4})\s+(.+?)\s*#*\s*$/;
const HR_RE    = /^\s*([-*_])(\s*\1){2,}\s*$/;
const FENCE_RE = /^\s*```\s*[\w+-]*\s*$/;
function isTableSep(l){ return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.indexOf('-') > -1; }
function splitRow(l){ return l.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(c=>c.trim()); }
function renderList(items){
  let html = ''; const stack = [];
  items.forEach(it=>{
    const tag = it.ordered ? 'ol' : 'ul';
    while(stack.length && it.indent < stack[stack.length-1].indent){ html += '</li></' + stack.pop().tag + '>'; }
    if(stack.length && it.indent === stack[stack.length-1].indent){ html += '</li><li>'; }
    else { stack.push({indent:it.indent, tag}); html += '<' + tag + (tag==='ol' && it.num>1 ? ' start="'+it.num+'"' : '') + '><li>'; }
    html += inlineMd(escapeHtml(it.text));
  });
  while(stack.length){ html += '</li></' + stack.pop().tag + '>'; }
  return html;
}
function mdToHtml(src){
  const lines = String(src).replace(/\r\n?/g,'\n').split('\n');
  const out = []; let i = 0;
  const startsBlock = (l, next) => FENCE_RE.test(l) || HEAD_RE.test(l) || HR_RE.test(l) || LIST_RE.test(l) || /^\s*>/.test(l) || (l.indexOf('|')>-1 && next!==undefined && isTableSep(next));
  while(i < lines.length){
    const line = lines[i];
    if(FENCE_RE.test(line)){
      const buf = []; i++;
      while(i < lines.length && !/^\s*```\s*$/.test(lines[i])){ buf.push(lines[i]); i++; }
      i++;
      out.push('<pre><code>' + escapeHtml(buf.join('\n')) + '</code></pre>'); continue;
    }
    if(!line.trim()){ i++; continue; }
    let m = line.match(HEAD_RE);
    if(m){ const lvl = Math.min(m[1].length + 2, 5); out.push('<h'+lvl+'>' + inlineMd(escapeHtml(m[2])) + '</h'+lvl+'>'); i++; continue; }
    if(HR_RE.test(line) && !LIST_RE.test(line)){ out.push('<hr>'); i++; continue; }
    if(line.indexOf('|')>-1 && i+1 < lines.length && isTableSep(lines[i+1])){
      const head = splitRow(line); i += 2;
      const rows = [];
      while(i < lines.length && lines[i].indexOf('|')>-1 && lines[i].trim()){ rows.push(splitRow(lines[i])); i++; }
      out.push('<div class="md-table"><table><thead><tr>' + head.map(c=>'<th>'+inlineMd(escapeHtml(c))+'</th>').join('') + '</tr></thead><tbody>' +
        rows.map(r=>'<tr>' + head.map((_,ci)=>'<td>'+inlineMd(escapeHtml(r[ci]||''))+'</td>').join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }
    if(/^\s*>/.test(line)){
      const buf = [];
      while(i < lines.length && /^\s*>/.test(lines[i])){ buf.push(lines[i].replace(/^\s*>\s?/,'')); i++; }
      out.push('<blockquote>' + buf.map(l=>inlineMd(escapeHtml(l))).join('<br>') + '</blockquote>'); continue;
    }
    if(LIST_RE.test(line)){
      const items = [];
      while(i < lines.length){
        const lm = lines[i].match(LIST_RE);
        if(lm){ items.push({indent: lm[1].replace(/\t/g,'    ').length, ordered: /\d/.test(lm[2]), num: parseInt(lm[2],10)||1, text: lm[3]}); i++; }
        else if(items.length && lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && !startsBlock(lines[i])){ items[items.length-1].text += ' ' + lines[i].trim(); i++; }
        else break;
      }
      out.push(renderList(items)); continue;
    }
    const buf = [line]; i++;
    while(i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines[i+1])){ buf.push(lines[i]); i++; }
    out.push('<p>' + buf.map(l=>inlineMd(escapeHtml(l))).join('<br>') + '</p>');
  }
  return out.join('');
}

/* ---------- Burbujas del chat ---------- */
function nearBottom(){ return chatLog.scrollHeight - chatLog.scrollTop - chatLog.clientHeight < 90; }
function scrollBottom(force){ if(force || nearBottom()) chatLog.scrollTop = chatLog.scrollHeight; }

function addMsg(role, html, cls){
  const div = document.createElement('div');
  div.className = 'msg ' + role + (cls ? ' ' + cls : '');
  div.innerHTML = html;
  chatLog.appendChild(div);
  return div;
}
function addUserMsg(text){ return addMsg('user', escapeHtml(text).replace(/\n/g,'<br>')); }
function addBotMsg(){
  const el = addMsg('bot', '<div class="msg-body"><span class="typing"><span></span><span></span><span></span></span></div>');
  el._raw = '';
  return el;
}
let rafPending = false;
function renderStream(el, text){
  el._raw = text;
  if(rafPending) return;
  rafPending = true;
  requestAnimationFrame(()=>{
    rafPending = false;
    const stick = nearBottom();
    el.querySelector('.msg-body').innerHTML = mdToHtml(el._raw);
    el.classList.add('streaming');
    if(stick) chatLog.scrollTop = chatLog.scrollHeight;
  });
}
function finalizeBot(el, text, opts){
  opts = opts || {};
  el._raw = text;
  el.classList.remove('streaming');
  el.querySelector('.msg-body').innerHTML = mdToHtml(text);
  el.dataset.answer = '1';
  const actions = document.createElement('div');
  actions.className = 'msg-actions';
  actions.innerHTML = '<button type="button" data-act="copy">📋 Copiar</button><button type="button" data-act="regen" class="hidden">🔄 Regenerar</button>';
  el.appendChild(actions);
  if(opts.truncated){
    const note = document.createElement('div');
    note.className = 'msg-note';
    note.innerHTML = 'La respuesta se cortó por longitud. <button type="button" data-act="continue" style="border:0;background:none;color:var(--teal);text-decoration:underline;cursor:pointer;font:inherit;">Continuar</button>';
    el.insertBefore(note, actions);
  }
}
function refreshRegenButtons(){
  chatLog.querySelectorAll('[data-act="regen"]').forEach(b=>b.classList.add('hidden'));
  const last = pairs[pairs.length-1];
  if(last && last.botEl){ const b = last.botEl.querySelector('[data-act="regen"]'); if(b) b.classList.remove('hidden'); }
}
function welcomeHtml(){
  return '<div class="msg-body"><p>Hola 👋 Soy tu tutor de <b>Lengua Castellana, Literatura e Inglés</b>. Puedo explicarte conceptos, examinarte, corregir tus textos o armarte un plan de estudio. Elige un modo arriba y pregúntame lo que quieras.</p></div>';
}
function renderHistory(){
  chatLog.innerHTML = ''; pairs = []; pendingFail = null;
  addMsg('bot', welcomeHtml());
  for(let i = 0; i < chatHistory.length; i++){
    const m = chatHistory[i];
    if(m.role === 'user'){
      const userEl = addUserMsg(m.content);
      const next = chatHistory[i+1];
      if(next && next.role === 'assistant'){
        const botEl = addBotMsg(); finalizeBot(botEl, next.content);
        pairs.push({userEl, botEl}); i++;
      }
    } else {
      const botEl = addBotMsg(); finalizeBot(botEl, m.content);
    }
  }
  refreshRegenButtons();
  chatLog.scrollTop = chatLog.scrollHeight;
}

/* ---------- Estado, modos, contexto, sugerencias ---------- */
function setStatus(kind, msg){
  tutorStatus = kind;
  chatDot.className = 'dot ' + (kind==='unknown' ? '' : kind);
  chatAvail.textContent = msg;
}
function setMode(mode){
  if(!MODES[mode]) return;
  chatMode = mode; saveJSON(MODE_KEY, mode);
  chatModesEl.querySelectorAll('.mode-chip').forEach(b=>{
    const on = b.dataset.mode === mode;
    b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  updatePlaceholder();
}
function updatePlaceholder(){
  chatInput.placeholder = (chatContext && chatMode==='explicar') ? 'Pregunta lo que quieras sobre «' + chatContext.title + '»…' : MODES[chatMode].ph;
}
function renderModes(){
  chatModesEl.innerHTML = Object.keys(MODES).map(k=>'<button type="button" class="mode-chip" data-mode="'+k+'">'+MODES[k].label+'</button>').join('');
  setMode(chatMode);
}
function renderContext(){
  if(!chatContext){ chatCtxEl.classList.add('hidden'); chatCtxEl.innerHTML=''; return; }
  chatCtxEl.classList.remove('hidden');
  chatCtxEl.innerHTML = '<span>📘 Contexto: <b>' + escapeHtml(chatContext.title) + '</b></span><button type="button" id="chatCtxClose" aria-label="Quitar contexto">✕</button>';
}
function renderSuggestions(){
  const list = chatContext ? CONTEXT_SUGGESTIONS : DEFAULT_SUGGESTIONS;
  chatSuggest.innerHTML = list.map(t=>'<button type="button" class="suggest-chip">'+escapeHtml(t)+'</button>').join('');
  chatSuggest.classList.toggle('hidden', !showChips);
}
function autosize(){
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}
function updateCounter(){
  const n = chatInput.value.length;
  chatCount.textContent = n > 3000 ? (n + ' / 4000') : '';
}
function setBusy(b){
  chatBusy = b;
  chatSend.textContent = b ? 'Detener' : 'Enviar';
  chatSend.setAttribute('aria-label', b ? 'Detener respuesta' : 'Enviar mensaje');
}

/* ---------- Comunicación con el Worker ---------- */
async function checkTutorStatus(){
  setStatus('unknown', 'Comprobando conexión…');
  const ctrl = new AbortController();
  const timer = setTimeout(()=>ctrl.abort(), 9000);
  try{
    const r = await fetch(TUTOR_ENDPOINT, { method:'GET', signal: ctrl.signal });
    const j = await r.json();
    if(j && j.ok && j.configured) setStatus('ok', 'Tutor conectado · Gemini');
    else if(j && j.ok) setStatus('warn', 'Servidor sin clave de Gemini (falta GEMINI_API_KEY)');
    else setStatus('err', 'El servidor del tutor no respondió bien');
  }catch(e){
    setStatus('err', navigator.onLine === false ? 'Sin conexión a internet' : 'No se pudo contactar al servidor del tutor');
  }finally{ clearTimeout(timer); }
}

async function readSSE(resp, onEvent){
  const dec = new TextDecoder();
  let buf = '';
  const parseEvt = evt => {
    const lines = evt.split('\n');
    for(let k = 0; k < lines.length; k++){
      if(lines[k].indexOf('data:') !== 0) continue;
      const p = lines[k].slice(5).trim();
      if(!p) continue;
      let obj; try{ obj = JSON.parse(p); }catch(_){ continue; }
      onEvent(obj);
    }
  };
  const flush = chunk => {
    buf += chunk.replace(/\r\n/g,'\n');
    let idx;
    while((idx = buf.indexOf('\n\n')) !== -1){ const evt = buf.slice(0, idx); buf = buf.slice(idx + 2); parseEvt(evt); }
  };
  if(resp.body && resp.body.getReader){
    const reader = resp.body.getReader();
    for(;;){
      const r = await reader.read();
      if(r.done) break;
      flush(dec.decode(r.value, {stream:true}));
    }
    flush(dec.decode() + '\n\n');
  } else {
    flush((await resp.text()) + '\n\n');   // WebView sin streaming: se lee completo
  }
}

async function streamOnce(payload, signal, onText){
  let resp;
  try{
    resp = await fetch(TUTOR_ENDPOINT, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload), signal });
  }catch(e){
    if(e && e.name === 'AbortError') throw e;
    const err = new Error('No se pudo conectar con el servidor del tutor. Revisa tu conexión a internet.');
    err.retryable = true; throw err;
  }
  const ctype = resp.headers.get('content-type') || '';
  if(!resp.ok || ctype.indexOf('text/event-stream') === -1){
    let data = null; try{ data = await resp.json(); }catch(_){}
    const err = new Error((data && data.error) || ('El servidor respondió con el error ' + resp.status + '.'));
    err.status = resp.status;
    err.retryable = (resp.status === 502 || resp.status === 503 || resp.status === 504);
    throw err;
  }
  let done = null;
  try{
    await readSSE(resp, ev=>{
      if(ev.t){ onText(ev.t); }
      else if(ev.error){ const err = new Error(ev.error); err.retryable = !ev.blocked; throw err; }
      else if(ev.done){ done = ev; }
    });
  }catch(e){
    if(e && e.name === 'AbortError') throw e;
    if(e && e.message && e.retryable !== undefined) throw e;
    const err = new Error('Se interrumpió la conexión con el tutor.'); err.retryable = true; throw err;
  }
  return done || {};
}

async function requestTutor(turns, signal, onText){
  const payload = { messages: turns, mode: chatMode, stream: true };
  if(sel){ payload.career = sel.career; payload.university = sel.uni; }
  if(chatContext) payload.context = chatContext.text;
  let attempt = 0;
  for(;;){
    let got = false;
    try{
      return await streamOnce(payload, signal, t=>{ got = true; onText(t); });
    }catch(e){
      if((e && e.name === 'AbortError') || got || !e.retryable || attempt >= 1) throw e;
      attempt++; setStatus('warn', 'Reintentando…'); await sleep(1300);
    }
  }
}

/* ---------- Enviar / detener / reintentar / regenerar ---------- */
async function sendChat(text, opts){
  opts = opts || {};
  text = (text || '').trim();
  if(!text || chatBusy) return;
  if(navigator.onLine === false){ toast('Sin conexión a internet. Inténtalo cuando vuelvas a estar en línea.'); return; }

  if(pendingFail && !opts.isRetry){ pendingFail.userEl.remove(); pendingFail.errEl.remove(); pendingFail = null; }
  showChips = false; chatSuggest.classList.add('hidden');

  const userEl = opts.userEl || addUserMsg(text);
  userEl.classList.remove('unsent');
  chatInput.value = ''; autosize(); updateCounter();

  const turns = chatHistory.concat([{ role:'user', content:text }]);
  const botEl = addBotMsg();
  scrollBottom(true);
  setBusy(true);
  chatAbort = new AbortController();
  let acc = '';

  try{
    const meta = await requestTutor(turns, chatAbort.signal, delta=>{ acc += delta; renderStream(botEl, acc); });
    chatHistory.push({ role:'user', content:text }, { role:'assistant', content:acc });
    saveChat();
    finalizeBot(botEl, acc, { truncated: !!meta.truncated });
    pairs.push({ userEl, botEl }); pendingFail = null;
    refreshRegenButtons();
    if(tutorStatus !== 'ok') setStatus('ok', 'Tutor conectado · Gemini');
    scrollBottom(true);
  }catch(err){
    if(err && err.name === 'AbortError'){
      if(acc){
        chatHistory.push({ role:'user', content:text }, { role:'assistant', content:acc }); saveChat();
        finalizeBot(botEl, acc); pairs.push({ userEl, botEl }); refreshRegenButtons();
      } else {
        botEl.remove(); userEl.remove();
        chatInput.value = text; autosize(); updateCounter();   // devuelve el texto para editarlo
      }
    } else {
      const msg = (err && err.message) ? err.message : 'Error desconocido.';
      if(acc){
        chatHistory.push({ role:'user', content:text }, { role:'assistant', content:acc }); saveChat();
        finalizeBot(botEl, acc); pairs.push({ userEl, botEl }); refreshRegenButtons();
        const note = document.createElement('div'); note.className = 'msg-note'; note.textContent = '⚠ ' + msg;
        botEl.insertBefore(note, botEl.querySelector('.msg-actions'));
      } else {
        botEl.classList.remove('streaming'); botEl.classList.add('error');
        botEl.innerHTML = '<div class="msg-body"><p>⚠ ' + escapeHtml(msg) + '</p></div>' +
          '<div class="msg-actions"><button type="button" data-act="retry">↻ Reintentar</button></div>';
        botEl._retryText = text; botEl._retryUser = userEl;
        userEl.classList.add('unsent');
        pendingFail = { userEl, errEl: botEl };
      }
      setStatus('err', msg.length > 70 ? msg.slice(0,67) + '…' : msg);
      scrollBottom(true);
    }
  }finally{
    setBusy(false); chatAbort = null;
  }
}

function regenerate(){
  if(chatBusy || !pairs.length) return;
  const last = pairs[pairs.length-1];
  const n = chatHistory.length;
  if(n < 2 || chatHistory[n-2].role !== 'user') return;
  const text = chatHistory[n-2].content;
  chatHistory.splice(n-2, 2); saveChat();
  pairs.pop();
  last.botEl.remove(); last.userEl.remove();
  refreshRegenButtons();
  sendChat(text);
}

function onSendClick(){
  if(chatBusy){ if(chatAbort) chatAbort.abort(); return; }
  sendChat(chatInput.value);
}

/* ---------- Copiar / exportar / limpiar ---------- */
async function copyText(t){
  try{ await navigator.clipboard.writeText(t); return true; }catch(e){}
  try{
    const ta = document.createElement('textarea');
    ta.value = t; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  }catch(e){ return false; }
}
async function exportChat(){
  if(!chatHistory.length){ toast('Aún no hay conversación para exportar.'); return; }
  const md = '# Conversación con el Tutor IA — LGS\n_' + new Date().toLocaleString('es-CO') + '_\n\n' +
    chatHistory.map(m => (m.role === 'user' ? '**Tú:** ' : '**Tutor:** ') + m.content).join('\n\n---\n\n');
  const r = await saveTextFile('conversacion-tutor.md', md, 'text/markdown');
  if(r === 'downloaded') toast('Conversación guardada.');
  else if(r === 'copied') toast('Conversación copiada al portapapeles.');
  else if(r === 'failed') toast('No se pudo exportar la conversación.');
}
let clearTimer = null;
function clearChat(){
  if(!chatHistory.length && !chatContext){ toast('La conversación ya está vacía.'); return; }
  if(!chatClearBtn.classList.contains('confirm')){
    chatClearBtn.classList.add('confirm'); chatClearBtn.textContent = '¿Seguro? Toca otra vez';
    clearTimer = setTimeout(resetClearBtn, 3500); return;
  }
  resetClearBtn();
  if(chatAbort) chatAbort.abort();
  chatHistory = []; saveChat();
  chatContext = null; renderContext();
  showChips = true; renderSuggestions(); updatePlaceholder();
  renderHistory();
}
function resetClearBtn(){
  clearTimeout(clearTimer);
  chatClearBtn.classList.remove('confirm'); chatClearBtn.textContent = '🗑 Nueva';
}

/* ---------- Integración con la guía y la práctica ---------- */
function moduleContextText(m){
  const strip = h => { const d = document.createElement('div'); d.innerHTML = h; return (d.textContent || '').replace(/\s+/g,' ').trim(); };
  let t = m.title + ' (' + m.area + '). ' + strip(m.intro);
  (m.concepts || []).forEach(c => { t += '\n- ' + strip(c.h) + ': ' + strip(c.p); });
  return t.slice(0, 2400);
}
function askAboutModule(id){
  const m = MODULES.find(x => x.id === id);
  if(!m) return;
  chatContext = { id: m.id, title: m.title, text: moduleContextText(m) };
  if(chatMode === 'corregir' || chatMode === 'plan') setMode('explicar');
  showChips = true;
  renderContext(); renderSuggestions(); updatePlaceholder();
  showPanel('chat');
  toast('Contexto añadido: ' + m.title);
  if(!isTouchDevice) setTimeout(()=>chatInput.focus(), 60);
}
function sendDraftToTutor(title, brief, draft){
  if(chatBusy){ toast('El tutor aún está respondiendo. Espera un momento.'); return; }
  setMode('corregir'); showPanel('chat');
  const body = draft.slice(0, 5000);
  const msg = 'Ejercicio: «' + title + '»' + (brief ? '\nConsigna: ' + brief : '') +
    '\n\nMi texto:\n"""\n' + body + '\n"""' + (draft.length > 5000 ? '\n(Texto recortado por longitud)' : '');
  sendChat(msg);
}

/* ---------- Navegación: qué hacer al cambiar de panel ---------- */
function onPanelChange(id){
  if(id === 'chat'){
    if(tutorStatus !== 'ok') checkTutorStatus();
    setTimeout(()=>{ chatLog.scrollTop = chatLog.scrollHeight; }, 0);
  }
  if(id === 'juegos') resumeQuiz(); else pauseQuiz();
  if(id === 'examen') renderExamHome();
  if(id === 'material') renderFiles();
}

/* ---------- Eventos ---------- */
chatSend.addEventListener('click', onSendClick);
chatInput.addEventListener('input', ()=>{ autosize(); updateCounter(); });
chatInput.addEventListener('keydown', e=>{
  if(e.key === 'Enter' && !e.shiftKey && !e.isComposing && !isTouchDevice){
    e.preventDefault();
    if(!chatBusy) sendChat(chatInput.value);
  }
});
chatSuggest.addEventListener('click', e=>{
  const chip = e.target.closest('.suggest-chip');
  if(chip) sendChat(chip.textContent);
});
chatModesEl.addEventListener('click', e=>{
  const b = e.target.closest('.mode-chip');
  if(b){ setMode(b.dataset.mode); if(!isTouchDevice) chatInput.focus(); }
});
chatCtxEl.addEventListener('click', e=>{
  if(e.target.id === 'chatCtxClose'){ chatContext = null; renderContext(); renderSuggestions(); updatePlaceholder(); }
});
chatLog.addEventListener('click', e=>{
  const btn = e.target.closest('[data-act]');
  if(!btn) return;
  const msgEl = btn.closest('.msg');
  const act = btn.dataset.act;
  if(act === 'copy'){ copyText(msgEl._raw || msgEl.textContent).then(ok => toast(ok ? 'Respuesta copiada.' : 'No se pudo copiar.')); }
  else if(act === 'regen'){ regenerate(); }
  else if(act === 'retry'){
    const text = msgEl._retryText, userEl = msgEl._retryUser;
    msgEl.remove(); pendingFail = null;
    sendChat(text, { isRetry:true, userEl });
  }
  else if(act === 'continue'){ btn.remove(); sendChat('Continúa desde donde te quedaste.'); }
});
chatClearBtn.addEventListener('click', clearChat);
chatExportBtn.addEventListener('click', exportChat);
moduleContainer.addEventListener('click', e=>{
  const b = e.target.closest('[data-ask]');
  if(b) askAboutModule(b.dataset.ask);
});
window.addEventListener('online',  ()=>{ if(tutorStatus !== 'ok') checkTutorStatus(); });
window.addEventListener('offline', ()=>setStatus('err', 'Sin conexión a internet'));

/* ---------- Arranque del tutor (aislado: si algo falla aquí, el resto de la app sigue funcionando) ---------- */
try{
  renderModes(); renderContext(); renderSuggestions(); renderHistory();
  chatInput.disabled = false; chatSend.disabled = false;
  checkTutorStatus();
}catch(e){
  console.error('Error iniciando el tutor:', e);
}

/* ============================================================
   PRACTICE — tool tabs
   ============================================================ */
document.querySelectorAll('.tool-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.tool-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tool-pane').forEach(p=>p.classList.remove('active'));
    document.getElementById('tool-'+tab.dataset.tool).classList.add('active');
  });
});

/* Writing */
const writingPrompts = document.getElementById('writingPrompts');
writingPrompts.innerHTML = WRITING_PROMPTS.map(p=>`<div class="prompt-item" data-id="${p.id}"><h4>${p.title}</h4><p>${p.brief}</p></div>`).join('');
const writingArea = document.getElementById('writingArea');
const writerBox = document.getElementById('writerBox');
const writingTitle = document.getElementById('writingTitle');
const wordCount = document.getElementById('wordCount');

writingPrompts.addEventListener('click', e=>{
  const item = e.target.closest('.prompt-item');
  if(!item) return;
  writingPrompts.querySelectorAll('.prompt-item').forEach(i=>i.classList.remove('active'));
  item.classList.add('active');
  currentPromptId = item.dataset.id;
  const p = WRITING_PROMPTS.find(x=>x.id===currentPromptId);
  writingTitle.textContent = p.title;
  writerBox.value = drafts[currentPromptId] || '';
  updateWordCount();
  writingArea.classList.remove('hidden');
});
writerBox.addEventListener('input', ()=>{
  if(!currentPromptId) return;
  drafts[currentPromptId] = writerBox.value;
  saveJSON('lyl_drafts', drafts);
  updateWordCount();
});
function updateWordCount(){
  const words = writerBox.value.trim().split(/\s+/).filter(Boolean).length;
  wordCount.textContent = words + ' palabras';
}
document.getElementById('clearDraft').addEventListener('click', ()=>{
  if(!currentPromptId) return;
  writerBox.value=''; drafts[currentPromptId]=''; saveJSON('lyl_drafts', drafts); updateWordCount();
});
document.getElementById('downloadDraft').addEventListener('click', async ()=>{
  if(!currentPromptId) return;
  const r = await saveTextFile((currentPromptId || 'borrador') + '.txt', writerBox.value || '', 'text/plain');
  if(r === 'downloaded') toast('Borrador guardado.');
  else if(r === 'copied') toast('Borrador copiado al portapapeles (pégalo en tus notas).');
  else if(r === 'failed') toast('No se pudo guardar. Selecciona el texto y cópialo manualmente.');
});
document.getElementById('feedbackDraft').addEventListener('click', ()=>{
  if(!currentPromptId) return;
  const draft = writerBox.value.trim();
  const words = draft.split(/\s+/).filter(Boolean).length;
  if(words < 25){ toast('Escribe al menos unas 25 palabras para recibir feedback.'); return; }
  const p = WRITING_PROMPTS.find(x => x.id === currentPromptId);
  sendDraftToTutor(p ? p.title : 'Borrador', p ? p.brief : '', draft);
});

/* Reading comprehension */
const readingPane = document.getElementById('tool-lectura');
readingPane.innerHTML = READING.map((r,ri)=>`
  <div class="reading-pass">
    <h4>${r.title}</h4>
    <p>${r.text}</p>
  </div>
  <div class="card" style="padding:20px 22px;margin-bottom:30px;">
    ${r.qs.map((q,qi)=>`
      <div class="quiz-q" data-r="${ri}" data-qi="${qi}">
        <p class="qtext">${qi+1}. ${q.q}</p>
        <div class="quiz-opts">
          ${q.opts.map((o,oi)=>`<label class="quiz-opt"><input type="radio" name="read-${ri}-${qi}" value="${oi}"> ${o}</label>`).join('')}
        </div>
      </div>`).join('')}
    <button class="btn btn-primary btn-sm" data-check-read="${ri}" style="margin-top:8px;">Revisar respuestas</button>
    <div class="score-banner" id="read-score-${ri}"></div>
  </div>
`).join('');
readingPane.querySelectorAll('[data-check-read]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const ri = btn.dataset.checkRead;
    const r = READING[ri];
    let correct = 0;
    r.qs.forEach((q,qi)=>{
      const chosen = readingPane.querySelector(`input[name="read-${ri}-${qi}"]:checked`);
      const opts = readingPane.querySelectorAll(`.quiz-q[data-r="${ri}"][data-qi="${qi}"] .quiz-opt`);
      opts.forEach((op,oi)=>{
        op.classList.remove('correct','incorrect');
        if(oi===q.correct) op.classList.add('correct');
        else if(chosen && parseInt(chosen.value)===oi) op.classList.add('incorrect');
      });
      if(chosen && parseInt(chosen.value)===q.correct) correct++;
    });
    const banner = document.getElementById('read-score-'+ri);
    banner.textContent = `Obtuviste ${correct} de ${r.qs.length} correctas.`;
    banner.classList.add('show');
  });
});

/* Grammar drills */
const grammarPane = document.getElementById('tool-gramatica');
grammarPane.innerHTML = '<div class="card" style="padding:20px 24px;">' + GRAMMAR_DRILLS.map((d,i)=>`
  <div class="drill-item">
    <p>${i+1}. ${d.prompt}</p>
    <input type="text" data-drill="${i}" placeholder="tu respuesta">
    <button class="btn btn-outline btn-sm" data-check-drill="${i}">Revisar</button>
    <span class="drill-fb" id="drill-fb-${i}"></span>
    <div style="font-size:12px;color:var(--ink-faint);margin-top:6px;font-family:var(--mono);">${d.note}</div>
  </div>
`).join('') + '</div>';
grammarPane.querySelectorAll('[data-check-drill]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const i = btn.dataset.checkDrill;
    const input = grammarPane.querySelector(`input[data-drill="${i}"]`);
    const norm = s => s.trim().toLowerCase().replace(/\s+/g,' ').replace(/[.!?¡¿]+$/,'');
    const val = norm(input.value);
    const ok = GRAMMAR_DRILLS[i].answers.some(a=>norm(a)===val);
    const fb = document.getElementById('drill-fb-'+i);
    fb.textContent = ok ? '✓ Correcto' : '✗ Respuesta esperada: ' + GRAMMAR_DRILLS[i].answers[0];
    fb.className = 'drill-fb ' + (ok?'ok':'bad');
  });
});

/* Flashcards */
const flashGrid = document.getElementById('flashGrid');
flashGrid.innerHTML = FLASHCARDS.map((c,i)=>`
  <div class="flash" data-i="${i}">
    <div class="flash-inner">
      <div class="flash-face flash-front">${c.f}</div>
      <div class="flash-face flash-back">${c.b}</div>
    </div>
  </div>
`).join('');
flashGrid.querySelectorAll('.flash').forEach(f=>f.addEventListener('click', ()=>f.classList.toggle('flipped')));

/* ============================================================
   GAMES
   ============================================================ */

/* --- Quiz relámpago --- */
const quizGameEl = document.getElementById('quizGame');
let quizState = null;
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function startQuiz(){
  const qs = shuffle(QUIZ_BANK).slice(0,10);
  quizState = {qs, idx:0, score:0, timer:null, timeLeft:20, answered:false, finished:false};
  renderQuiz();
}
function renderQuiz(){
  clearInterval(quizState.timer);
  if(quizState.idx >= quizState.qs.length){
    quizState.finished = true;
    quizGameEl.innerHTML = `<div class="score-banner show">Terminaste el quiz: ${quizState.score} de ${quizState.qs.length} correctas.</div>
      <button class="btn btn-primary btn-sm" id="quizRestart" style="margin-top:12px;">Jugar de nuevo</button>`;
    document.getElementById('quizRestart').addEventListener('click', startQuiz);
    return;
  }
  const q = quizState.qs[quizState.idx];
  quizState.timeLeft = 20; quizState.answered = false;
  quizGameEl.innerHTML = `
    <div class="game-hud"><span>Pregunta <b>${quizState.idx+1}</b>/${quizState.qs.length}</span><span>Puntaje: <b id="quizScore">${quizState.score}</b></span><span>Tiempo: <b id="quizTimer">20</b>s</span></div>
    <div class="quiz-q"><p class="qtext">${q.q}</p><div class="quiz-opts">${q.opts.map((o,oi)=>`<label class="quiz-opt"><input type="radio" name="quiz-opt" value="${oi}"> ${o}</label>`).join('')}</div></div>
    <button class="btn btn-primary btn-sm" id="quizNext">Confirmar</button>
    <div class="drill-fb" id="quizMsg" style="margin-top:8px;"></div>
  `;
  quizState.timer = setInterval(()=>{
    quizState.timeLeft--;
    const t = document.getElementById('quizTimer');
    if(t) t.textContent = quizState.timeLeft;
    if(quizState.timeLeft <= 0) resolveQuizQ(null);
  }, 1000);
  document.getElementById('quizNext').addEventListener('click', onQuizNext);
}
function onQuizNext(){
  if(quizState.answered){ quizState.idx++; renderQuiz(); return; }
  const chosen = quizGameEl.querySelector('input[name="quiz-opt"]:checked');
  const msg = document.getElementById('quizMsg');
  if(!chosen){ if(msg){ msg.textContent = 'Elige una opción antes de confirmar.'; msg.className = 'drill-fb bad'; } return; }
  resolveQuizQ(parseInt(chosen.value, 10));
}
function resolveQuizQ(chosen){
  if(!quizState || quizState.answered) return;      // evita contar dos veces
  quizState.answered = true;
  clearInterval(quizState.timer);
  const q = quizState.qs[quizState.idx];
  quizGameEl.querySelectorAll('.quiz-opt').forEach((op,oi)=>{
    op.classList.remove('correct','incorrect');
    if(oi === q.c) op.classList.add('correct'); else if(oi === chosen) op.classList.add('incorrect');
    const inp = op.querySelector('input'); if(inp) inp.disabled = true;
  });
  const ok = (chosen === q.c);
  if(ok) quizState.score++;
  const sc = document.getElementById('quizScore'); if(sc) sc.textContent = quizState.score;
  const msg = document.getElementById('quizMsg');
  if(msg){ msg.textContent = chosen === null ? '⏱ Se acabó el tiempo. La respuesta correcta está marcada.' : (ok ? '✓ ¡Correcto!' : '✗ Incorrecto. La respuesta correcta está marcada.'); msg.className = 'drill-fb ' + (ok ? 'ok' : 'bad'); }
  const next = document.getElementById('quizNext');
  if(next) next.textContent = (quizState.idx + 1 >= quizState.qs.length) ? 'Ver resultado' : 'Siguiente →';
}
/* El quiz solo corre mientras el panel de Juegos está visible (antes el reloj arrancaba al abrir la app) */
function resumeQuiz(){
  if(!quizState){ startQuiz(); return; }
  if(!quizState.finished && !quizState.answered) renderQuiz();   // reinicia el tiempo de la pregunta actual
}
function pauseQuiz(){ if(quizState) clearInterval(quizState.timer); }

/* --- Ahorcado --- */
const hangmanEl = document.getElementById('hangmanGame');
let hgState = null;
function drawHangman(wrong){
  const parts = [];
  parts.push('<line x1="10" y1="130" x2="100" y2="130" stroke="var(--ink)" stroke-width="4"/>');
  parts.push('<line x1="30" y1="130" x2="30" y2="10" stroke="var(--ink)" stroke-width="4"/>');
  parts.push('<line x1="30" y1="10" x2="90" y2="10" stroke="var(--ink)" stroke-width="4"/>');
  parts.push('<line x1="90" y1="10" x2="90" y2="26" stroke="var(--ink)" stroke-width="4"/>');
  if(wrong>0) parts.push('<circle cx="90" cy="38" r="12" fill="none" stroke="var(--oxblood)" stroke-width="3"/>');
  if(wrong>1) parts.push('<line x1="90" y1="50" x2="90" y2="85" stroke="var(--oxblood)" stroke-width="3"/>');
  if(wrong>2) parts.push('<line x1="90" y1="58" x2="72" y2="72" stroke="var(--oxblood)" stroke-width="3"/>');
  if(wrong>3) parts.push('<line x1="90" y1="58" x2="108" y2="72" stroke="var(--oxblood)" stroke-width="3"/>');
  if(wrong>4) parts.push('<line x1="90" y1="85" x2="74" y2="110" stroke="var(--oxblood)" stroke-width="3"/>');
  if(wrong>5) parts.push('<line x1="90" y1="85" x2="106" y2="110" stroke="var(--oxblood)" stroke-width="3"/>');
  return `<svg id="hangman-fig" viewBox="0 0 140 140">${parts.join('')}</svg>`;
}
function startHangman(){
  const pick = HANGMAN_WORDS[Math.floor(Math.random()*HANGMAN_WORDS.length)];
  hgState = {word:pick.w, hint:pick.hint, guessed:[], wrong:0, maxWrong:6};
  renderHangman();
}
function renderHangman(){
  const display = hgState.word.split('').map(l=>hgState.guessed.includes(l)?l:'_').join(' ');
  const lost = hgState.wrong >= hgState.maxWrong;
  const won = !display.includes('_');
  hangmanEl.innerHTML = `
    <div class="game-hud"><span>Pista: <b>${hgState.hint}</b></span><span>Errores: <b>${hgState.wrong}</b>/${hgState.maxWrong}</span></div>
    ${drawHangman(hgState.wrong)}
    <div class="word-display">${display}</div>
    ${lost?`<div class="score-banner show">Perdiste. La palabra era <b>${hgState.word}</b>.</div>`:''}
    ${won?`<div class="score-banner show" style="background:var(--teal-tint);border-color:var(--teal);">¡Acertaste! La palabra era <b>${hgState.word}</b>.</div>`:''}
    ${(lost||won) ? `<button class="btn btn-primary btn-sm" id="hgRestart" style="margin-top:12px;">Jugar otra palabra</button>` : `<div class="keyboard" id="hgKeyboard"></div>`}
  `;
  if(lost||won){ document.getElementById('hgRestart').addEventListener('click', startHangman); return; }
  const kb = document.getElementById('hgKeyboard');
  'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').forEach(letter=>{
    const btn = document.createElement('button');
    btn.className = 'key'; btn.textContent = letter;
    if(hgState.guessed.includes(letter)) btn.disabled = true;
    btn.addEventListener('click', ()=>{
      hgState.guessed.push(letter);
      if(!hgState.word.includes(letter)) hgState.wrong++;
      renderHangman();
    });
    kb.appendChild(btn);
  });
}
startHangman();

/* --- Empareja el movimiento --- */
const matchEl = document.getElementById('matchGame');
let matchState = null;
function startMatch(){
  const cards = [];
  MATCH_PAIRS.forEach((p,i)=>{ cards.push({id:'a'+i, pair:i, text:p.a}); cards.push({id:'b'+i, pair:i, text:p.b}); });
  matchState = {cards: shuffle(cards), selected:[], matched:[]};
  renderMatch();
}
function renderMatch(){
  matchEl.innerHTML = `
    <div class="game-hud"><span>Parejas encontradas: <b>${matchState.matched.length/2}</b>/${MATCH_PAIRS.length}</span></div>
    <div class="match-grid">${matchState.cards.map(c=>`<div class="match-card ${matchState.matched.includes(c.id)?'matched':''} ${matchState.selected.includes(c.id)?'selected':''}" data-id="${c.id}" data-pair="${c.pair}">${c.text}</div>`).join('')}</div>
    ${matchState.matched.length===matchState.cards.length?`<div class="score-banner show" style="margin-top:14px;">¡Completaste todas las parejas!</div><button class="btn btn-primary btn-sm" id="matchRestart" style="margin-top:10px;">Jugar de nuevo</button>`:''}
  `;
  if(matchState.matched.length===matchState.cards.length){
    document.getElementById('matchRestart').addEventListener('click', startMatch);
    return;
  }
  matchEl.querySelectorAll('.match-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const id = card.dataset.id;
      if(matchState.matched.includes(id) || matchState.selected.includes(id)) return;
      if(matchState.selected.length===2) return;
      matchState.selected.push(id);
      renderMatch();
      if(matchState.selected.length===2){
        const [id1,id2] = matchState.selected;
        const c1 = matchState.cards.find(c=>c.id===id1), c2 = matchState.cards.find(c=>c.id===id2);
        if(c1.pair === c2.pair){
          matchState.matched.push(id1,id2);
          matchState.selected = [];
          renderMatch();
        } else {
          setTimeout(()=>{ matchState.selected = []; renderMatch(); }, 700);
        }
      }
    });
  });
}
startMatch();

/* --- Transcriptor AFI --- */
const ipaEl = document.getElementById('ipaGame');
ipaEl.innerHTML = IPA_WORDS.map((it,i)=>`
  <div class="ipa-item">
    <span class="w">${it.w}</span>
    <input type="text" placeholder="/transcripción/" data-ipa="${i}">
    <button class="btn btn-outline btn-sm" data-check-ipa="${i}">Revisar</button>
    <span class="drill-fb" id="ipa-fb-${i}"></span>
  </div>
`).join('');
ipaEl.querySelectorAll('[data-check-ipa]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const i = btn.dataset.checkIpa;
    const raw = ipaEl.querySelector(`input[data-ipa="${i}"]`).value.trim().toLowerCase().replace(/[\/\[\]]/g,'');
    const item = IPA_WORDS[i];
    const ok = item.a.some(a=>a.toLowerCase()===raw);
    const fb = document.getElementById('ipa-fb-'+i);
    fb.textContent = ok ? '✓ Correcto' : '✗ Referencia: ' + item.real;
    fb.className = 'drill-fb ' + (ok?'ok':'bad');
  });
});

/* --- Detective del discurso --- */
const discourseEl = document.getElementById('discourseGame');
discourseEl.innerHTML = DISCOURSE_ITEMS.map((d,i)=>`
  <div class="discourse-item">
    <div class="headline">${d.h}</div>
    <p style="font-size:13.5px;font-weight:600;margin:0 0 10px;">${d.q}</p>
    <div class="quiz-opts">${d.opts.map((o,oi)=>`<label class="quiz-opt"><input type="radio" name="disc-${i}" value="${oi}"> ${o}</label>`).join('')}</div>
    <button class="btn btn-outline btn-sm" data-check-disc="${i}" style="margin-top:10px;">Revisar</button>
    <div class="answer-box" id="disc-ans-${i}">${d.exp}</div>
  </div>
`).join('');
discourseEl.querySelectorAll('[data-check-disc]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const i = btn.dataset.checkDisc;
    const d = DISCOURSE_ITEMS[i];
    const chosen = discourseEl.querySelector(`input[name="disc-${i}"]:checked`);
    const opts = discourseEl.querySelectorAll(`.discourse-item:nth-of-type(${parseInt(i)+1}) .quiz-opt`);
    opts.forEach((op,oi)=>{ op.classList.remove('correct','incorrect'); if(oi===d.c) op.classList.add('correct'); else if(chosen && parseInt(chosen.value)===oi) op.classList.add('incorrect'); });
    document.getElementById('disc-ans-'+i).classList.add('show');
  });
});

/* ---------- Arranque ---------- */
if(sel && career()) applyCareer();
route();

})();
