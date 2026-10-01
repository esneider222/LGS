/* LGS — datos compartidos entre páginas */
function loadJSON(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } }
function saveJSON(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }

/* ============================================================
   DATA — Carreras, universidades, niveles (propuesta PPI)
   ============================================================ */
const LEVELS = [{id:'basico',name:'Nivel básico'},{id:'intermedio',name:'Nivel intermedio'},{id:'avanzado',name:'Nivel avanzado'}];
const UNIS = {pb:'Institución Universitaria Pascual Bravo', udea:'Universidad de Antioquia', unal:'Universidad Nacional de Colombia (Medellín)'};
/* Formatos REFERENCIALES de piloto: reemplazar por datos oficiales de cada admisión. */
const EXAM_FORMATS = {pb:{n:20,min:40}, udea:{n:25,min:50}, unal:{n:30,min:60}};
const CAREERS = [
 {id:'lengua', icon:'✒️', name:'Lic. en Lengua Castellana, Literatura e Inglés', area:'Humanidades y educación', unis:['pb','udea','unal'],
  levels:{basico:['fonetica','morfosintaxis','semantica'], intermedio:['sociolinguistica','discurso','literatura','ingles-lengua'], avanzado:['didactica','ingles-literatura','ingles-didactica']}},
 {id:'sistemas', icon:'💻', name:'Ingeniería de Sistemas / Software', area:'Ingeniería', unis:['pb','udea','unal']},
 {id:'derecho', icon:'⚖️', name:'Derecho', area:'Ciencias sociales', unis:['udea','unal']}
];
const EXTRA_MODULES = {
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
const EXTRA_BANK = {
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

