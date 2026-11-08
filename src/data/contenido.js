export const LENGUA_MODULES = [
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

/*DATA — Prompts de escritura*/
export const WRITING_PROMPTS = [
 {id:'ensayo', title:'Ensayo argumentativo', brief:'¿El bilingüismo debería ser obligatorio desde la educación inicial? Defiende una tesis con al menos dos argumentos y un contraargumento refutado.'},
 {id:'resena', title:'Reseña literaria', brief:'Escribe una reseña crítica (no un resumen) de una obra del Boom latinoamericano o de la literatura en inglés que hayas leído, evaluando su propuesta estética.'},
 {id:'columna', title:'Columna de opinión', brief:'Escribe una columna corta sobre el prestigio lingüístico: ¿por qué ciertos acentos o formas de hablar se estigmatizan y otros no?'},
 {id:'cuento', title:'Microrrelato', brief:'Escribe un microrrelato de máximo 300 palabras que use al menos una figura retórica de forma deliberada (metáfora, hipérbaton, ironía…).'}
];

/*DATA — Lectura y comprensión*/
export const READING = [
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

/*DATA — Taller de gramática (drills)*/
export const GRAMMAR_DRILLS = [
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

/*DATA — Flashcards*/
export const FLASHCARDS = [
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

/*DATA — Quiz relámpago (banco de preguntas)*/
export const QUIZ_BANK = [
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

/*DATA — Ahorcado*/
export const HANGMAN_WORDS = [
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

/*DATA — Empareja el movimiento*/
export const MATCH_PAIRS = [
 {a:'Romanticismo', b:'Exalta la subjetividad y lo nacional'},
 {a:'Realismo', b:'Observa la sociedad con rigor casi científico'},
 {a:'Modernismo', b:'Rubén Darío y la musicalidad del verso'},
 {a:'Boom latinoamericano', b:'Realismo mágico y experimentación estructural'},
 {a:'Barroco', b:'Artificio formal y desengaño (Góngora, Quevedo)'},
 {a:'Vanguardias', b:'Rompen la sintaxis y la lógica narrativa tradicional'},
 {a:'Modernismo anglosajón', b:'Fluir de la conciencia (Woolf, Joyce)'},
 {a:'Literatura medieval', b:'Cantar de Mio Cid, Mester de Juglaría'}
];

/*DATA — Transcriptor AFI*/
export const IPA_WORDS = [
 {w:'gente', a:['xente','xénte'], real:'/xente/'},
 {w:'queso', a:['keso'], real:'/keso/'},
 {w:'zorro', a:['soro','θoro'], real:'/soro/ o /θoro/ (seseo/distinción)'},
 {w:'think', a:['θɪŋk','thingk'], real:'/θɪŋk/'},
 {w:'this', a:['ðɪs'], real:'/ðɪs/'},
 {w:'ship', a:['ʃɪp'], real:'/ʃɪp/'},
 {w:'sheep', a:['ʃiːp','ʃip'], real:'/ʃiːp/'},
 {w:'vision', a:['vɪʒən','viʒn'], real:'/ˈvɪʒən/'}
];

/*DATA — Detective del discurso*/
export const DISCOURSE_ITEMS = [
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


export const EXTRA_MODULES = {
 sistemas:[
  {id:'sis-logica', level:'basico', area:'Fundamentos', icon:'🧠', title:'Lógica y pensamiento computacional',
   intro:'Programar empieza por descomponer un problema en pasos precisos que una máquina pueda ejecutar.',
   concepts:[{h:'Algoritmo', p:'Secuencia <b>finita y ordenada</b> de pasos para resolver un problema.'},{h:'Condicionales y bucles', p:'Un <b>condicional</b> decide entre caminos; un <b>bucle</b> repite instrucciones mientras se cumpla una condición.'}],
   taller:{q:['Escribe en pseudocódigo un algoritmo que diga si un número es par.','¿Qué imprime: x=3; si x>2 entonces x=x*2; imprimir x?'], a:'1) Si n mod 2 = 0 → «par»; si no → «impar». 2) Imprime 6.'}},
  {id:'sis-datos', level:'intermedio', area:'Datos', icon:'🗄️', title:'Estructuras de datos y bases de datos',
   intro:'Elegir cómo guardar los datos define qué tan rápido y claro será tu programa.',
   concepts:[{h:'Listas y diccionarios', p:'Una <b>lista</b> guarda elementos en orden; un <b>diccionario</b> guarda pares clave-valor.'},{h:'Bases de datos relacionales', p:'Organizan la información en <b>tablas</b> relacionadas y se consultan con <b>SQL</b>.'}],
   taller:{q:['¿Qué estructura usarías para buscar el teléfono de una persona por su nombre?','¿Qué columna conecta una tabla «pedidos» con una tabla «clientes»?'], a:'1) Un diccionario (clave: nombre, valor: teléfono). 2) Una clave foránea, p. ej. id_cliente.'}},
  {id:'sis-web', level:'avanzado', area:'Desarrollo', icon:'🌐', title:'Desarrollo web y arquitectura',
   intro:'Una aplicación web separa lo que ve el usuario de la lógica que corre en un servidor.',
   concepts:[{h:'Cliente y servidor', p:'El <b>navegador</b> (cliente) pide recursos y el <b>servidor</b> responde; las credenciales sensibles viven solo en el servidor.'},{h:'HTML, CSS y JavaScript', p:'<b>HTML</b> da estructura, <b>CSS</b> da estilo y <b>JavaScript</b> da comportamiento.'}],
   taller:{q:['¿Por qué una clave de API no debe ir en el código del navegador?','¿Qué tecnología cambia el color de un botón?'], a:'1) Porque cualquiera podría leerla desde el navegador. 2) CSS (y JavaScript si el cambio es dinámico).'}}],
 derecho:[
  {id:'der-constitucion', level:'basico', area:'Fundamentos', icon:'⚖️', title:'Constitución y Estado social de derecho',
   intro:'La Constitución es la norma de normas: organiza el poder y reconoce los derechos de las personas.',
   concepts:[{h:'Constitución de 1991', p:'Define a Colombia como <b>Estado social de derecho</b> y reconoce derechos fundamentales.'},{h:'Ramas del poder', p:'Legislativa (hace las leyes), ejecutiva (las aplica) y judicial (las interpreta y resuelve conflictos).'}],
   taller:{q:['¿Qué rama expide las leyes?','¿Qué mecanismo protege rápidamente un derecho fundamental?'], a:'1) La rama legislativa (Congreso). 2) La acción de tutela.'}},
  {id:'der-fuentes', level:'intermedio', area:'Teoría del derecho', icon:'📜', title:'Fuentes del derecho y jerarquía normativa',
   intro:'No todas las normas pesan igual: cuando chocan, prevalece la de mayor jerarquía.',
   concepts:[{h:'Jerarquía', p:'La <b>Constitución</b> prevalece sobre la ley, y la ley sobre los decretos y demás normas inferiores.'},{h:'Jurisprudencia', p:'Son las decisiones de jueces y altas cortes que orientan cómo se interpreta la ley.'}],
   taller:{q:['Si una ley contradice la Constitución, ¿cuál prevalece?','¿Qué es la jurisprudencia?'], a:'1) La Constitución. 2) Las decisiones reiteradas de los jueces y cortes que interpretan las normas.'}},
  {id:'der-argum', level:'avanzado', area:'Práctica jurídica', icon:'🗣️', title:'Argumentación jurídica',
   intro:'Argumentar es justificar una decisión con normas, hechos y razones, no solo opinar.',
   concepts:[{h:'Razonamiento deductivo', p:'Parte de una <b>regla general</b>, la aplica a un <b>caso</b> y concluye.'},{h:'Estructura básica', p:'Hechos → norma aplicable → análisis → conclusión.'}],
   taller:{q:['Ordena: conclusión, hechos, análisis, norma aplicable.','¿Por qué una opinión sin norma no es argumento jurídico?'], a:'1) Hechos, norma aplicable, análisis, conclusión. 2) Porque no justifica la decisión con una fuente reconocida.'}}]
};
export const EXTRA_BANK = {
 sistemas:[
  {q:'¿Qué estructura almacena pares clave-valor?', opts:['Lista','Diccionario','Pila'], c:1},
  {q:'¿Qué lenguaje define la estructura de una página web?', opts:['CSS','HTML','SQL'], c:1},
  {q:'SQL se usa principalmente para...', opts:['Dar estilo a páginas','Consultar y modificar bases de datos relacionales','Compilar programas'], c:1},
  {q:'Un algoritmo es...', opts:['Un lenguaje de programación','Una secuencia finita de pasos para resolver un problema','Un tipo de hardware'], c:1},
  {q:'Un bucle sirve para...', opts:['Repetir instrucciones mientras se cumpla una condición','Guardar datos en disco','Conectarse a internet'], c:0},
  {q:'En el modelo cliente-servidor, el navegador actúa como...', opts:['Servidor','Cliente','Base de datos'], c:1}],
 derecho:[
  {q:'¿En qué año se expidió la actual Constitución Política de Colombia?', opts:['1886','1991','2001'], c:1},
  {q:'¿Qué mecanismo protege de forma rápida los derechos fundamentales?', opts:['Acción de tutela','Referendo','Conciliación'], c:0},
  {q:'En la jerarquía normativa, ¿qué norma prevalece sobre las demás?', opts:['La ley','El decreto','La Constitución'], c:2},
  {q:'¿Qué rama del poder público expide las leyes?', opts:['Legislativa','Ejecutiva','Judicial'], c:0},
  {q:'Un razonamiento deductivo parte de...', opts:['Un caso aislado sin norma','Una regla general aplicada a un caso','Una opinión personal'], c:1},
  {q:'La jurisprudencia es...', opts:['Una ley del Congreso','El conjunto de decisiones de jueces y cortes','Un decreto presidencial'], c:1}]
};