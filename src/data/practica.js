import { WRITING_PROMPTS, READING, GRAMMAR_DRILLS, FLASHCARDS } from './contenido'

/*Ingeniería de Sistemas*/
const SISTEMAS = {
  tallerTitulo: 'Taller de lógica y código',
  consignas: [
    {
      id: 'sis-ensayo',
      title: 'Ensayo: la IA y el trabajo del programador',
      brief: '¿La inteligencia artificial reemplazará a los programadores o solo cambiará su trabajo? Defiende una tesis con al menos dos argumentos y un contraargumento refutado.',
    },
    {
      id: 'sis-informe',
      title: 'Informe técnico breve',
      brief: 'Describe qué ocurre desde que un usuario pulsa un botón en una aplicación web hasta que ve la respuesta: cliente, servidor y base de datos.',
    },
    {
      id: 'sis-explicacion',
      title: 'Explícaselo a un novato',
      brief: 'Explica qué es un algoritmo con un ejemplo cotidiano (como una receta) y luego con un ejemplo en pseudocódigo. Usa un lenguaje que entienda alguien sin conocimientos técnicos.',
    },
    {
      id: 'sis-columna',
      title: 'Columna: privacidad de los datos',
      brief: '¿Deben las empresas poder usar tus datos personales a cambio de servicios gratuitos? Escribe una columna corta con tu postura y un ejemplo concreto.',
    },
  ],
  lecturas: [
    {
      title: 'La deuda técnica',
      text: 'En el desarrollo de software, la llamada deuda técnica describe el costo futuro de elegir hoy una solución rápida en lugar de la mejor. Escribir código sin pruebas o copiar una solución sin entenderla permite entregar a tiempo, pero cada atajo deja trabajo pendiente: más errores, cambios más lentos y equipos que temen tocar el código existente. Como una deuda financiera, genera «intereses» que crecen con el tiempo. Sin embargo, no toda deuda es mala: a veces conviene aceptarla de forma deliberada para validar una idea con usuarios reales, siempre que el equipo la registre y planifique pagarla.',
      qs: [
        {
          q: 'Según el texto, ¿qué describe la deuda técnica?',
          opts: [
            'El dinero que cuesta contratar programadores',
            'El costo futuro de elegir hoy una solución rápida en vez de la mejor',
            'La cantidad de líneas de código de un programa',
            'Los errores que cometen los usuarios',
          ],
          correct: 1,
        },
        {
          q: '¿En qué caso considera el texto aceptable asumir deuda técnica?',
          opts: [
            'Cuando nadie va a revisar el código',
            'Cuando se hace de forma deliberada, se registra y se planea pagarla',
            'Siempre que el plazo de entrega sea corto',
            'Nunca: el texto la rechaza por completo',
          ],
          correct: 1,
        },
      ],
    },
    {
      title: 'La nube no es magia',
      text: 'Cuando abres una aplicación en tu celular, rara vez todo ocurre en el aparato. El teléfono, llamado cliente, envía una petición por internet a un servidor: un computador que guarda datos y ejecuta la lógica del servicio. El servidor consulta una base de datos, prepara una respuesta y la devuelve al cliente, que la muestra en pantalla. La «nube» es simplemente la renta de servidores de otra empresa, ubicados en centros de datos, en lugar de comprarlos y mantenerlos uno mismo. Su ventaja es que se puede pedir más capacidad cuando hay mucha demanda; su riesgo, depender de un proveedor externo.',
      qs: [
        {
          q: '¿Qué papel cumple el servidor en el texto?',
          opts: [
            'Mostrar la pantalla al usuario',
            'Guardar datos y ejecutar la lógica del servicio para responder al cliente',
            'Fabricar los teléfonos',
            'Reemplazar la conexión a internet',
          ],
          correct: 1,
        },
        {
          q: '¿Qué es la «nube», según el texto?',
          opts: [
            'Un programa que flota en internet sin ubicación física',
            'La renta de servidores de otra empresa en centros de datos',
            'Una base de datos gratuita',
            'Un tipo de teléfono',
          ],
          correct: 1,
        },
      ],
    },
  ],
  taller: [
    { prompt: '¿Cuánto vale x después de ejecutar: x = 3; x = x + 2 * 4? (escribe el número)', answers: ['11'], note: 'Primero se multiplica (2 * 4 = 8) y luego se suma: 3 + 8 = 11.' },
    { prompt: 'En binario, el número decimal 5 se escribe ____ (solo ceros y unos).', answers: ['101'], note: '5 = 4 + 0 + 1, es decir, 101 en base 2.' },
    { prompt: 'Para traer todos los registros de la tabla estudiantes, la consulta SQL es: SELECT ____ FROM estudiantes;', answers: ['*'], note: 'El asterisco selecciona todas las columnas.' },
    { prompt: 'La estructura de datos en la que el último elemento en entrar es el primero en salir (como una pila de platos) se llama ____.', answers: ['pila', 'stack'], note: 'Es LIFO: Last In, First Out.' },
    { prompt: '¿Cuántas veces se imprime «hola» si un ciclo repite la instrucción para los valores i = 1, 2, 3 y 4? (escribe el número)', answers: ['4'], note: 'El ciclo recorre cuatro valores, así que son cuatro repeticiones.' },
    { prompt: 'En HTML, para crear un enlace se usa una etiqueta de una sola letra: ____.', answers: ['a'], note: 'La etiqueta a (de «anchor»), con el atributo href que indica el destino.' },
    { prompt: 'Si A es verdadero y B es falso, ¿cuál es el resultado de A AND B? (verdadero o falso)', answers: ['falso', 'false'], note: 'AND solo es verdadero cuando ambas condiciones lo son.' },
    { prompt: '¿Cuál es el resultado de 17 % 5, es decir, el residuo de dividir 17 entre 5? (escribe el número)', answers: ['2'], note: '17 = 3 × 5 + 2, por lo que el residuo es 2.' },
  ],
  tarjetas: [
    { f: 'Algoritmo', b: 'Secuencia finita y ordenada de pasos que resuelve un problema o realiza una tarea.' },
    { f: 'Variable', b: 'Espacio con nombre en la memoria donde un programa guarda un valor que puede cambiar.' },
    { f: 'Condicional', b: 'Estructura que ejecuta un bloque de código solo si una condición es verdadera (if / else).' },
    { f: 'Bucle (ciclo)', b: 'Estructura que repite un bloque de instrucciones mientras se cumpla una condición o un número fijo de veces.' },
    { f: 'Función', b: 'Bloque de código con nombre que recibe datos, realiza una tarea y puede devolver un resultado; permite reutilizarlo.' },
    { f: 'Arreglo (array)', b: 'Colección ordenada de elementos a los que se accede por su posición, llamada índice.' },
    { f: 'Pila y cola', b: 'La pila es LIFO (el último en entrar sale primero); la cola es FIFO (el primero en entrar sale primero).' },
    { f: 'Recursividad', b: 'Técnica en la que una función se llama a sí misma; necesita un caso base que detenga las llamadas.' },
    { f: 'Base de datos', b: 'Conjunto organizado de datos almacenados para consultarlos, modificarlos y relacionarlos de forma eficiente.' },
    { f: 'SQL', b: 'Lenguaje estándar para consultar y modificar bases de datos relacionales (SELECT, INSERT, UPDATE, DELETE).' },
    { f: 'Llave primaria', b: 'Campo (o conjunto de campos) que identifica de forma única cada registro de una tabla.' },
    { f: 'API', b: 'Interfaz que define cómo un programa puede pedirle servicios o datos a otro.' },
    { f: 'Cliente–servidor', b: 'Modelo en el que un cliente envía peticiones y un servidor las procesa y responde.' },
    { f: 'Control de versiones', b: 'Sistema (como Git) que registra los cambios del código, permite volver atrás y facilita el trabajo en equipo.' },
    { f: 'Bug', b: 'Error en el código que produce un resultado inesperado o incorrecto.' },
    { f: 'Sistema binario', b: 'Sistema de numeración de base 2 que usa solo los dígitos 0 y 1; es la base de cómo los computadores representan la información.' },
  ],
}

/*Derecho*/
const DERECHO = {
  tallerTitulo: 'Taller de conceptos jurídicos',
  consignas: [
    {
      id: 'der-ensayo',
      title: 'Ensayo: ¿toda ley legal es justa?',
      brief: '¿Una ley puede ser legal pero injusta? Defiende una tesis con al menos dos argumentos y un contraargumento refutado.',
    },
    {
      id: 'der-caso',
      title: 'Análisis de un caso cotidiano',
      brief: 'Describe una situación cotidiana (un contrato de arriendo o una compra en línea) e identifica qué derechos y qué deberes tiene cada una de las partes.',
    },
    {
      id: 'der-columna',
      title: 'Columna: libertad de expresión en redes',
      brief: '¿Hasta dónde llega la libertad de expresión en redes sociales cuando afecta la honra de otra persona? Escribe una columna corta con tu postura.',
    },
    {
      id: 'der-poderes',
      title: 'Explica la separación de poderes',
      brief: 'Explica con tus palabras por qué el poder público se divide en ramas y qué podría ocurrir si una sola rama concentrara todo el poder.',
    },
  ],
  lecturas: [
    {
      title: 'El Estado social de derecho',
      text: 'La Constitución Política de Colombia de 1991 define al país como un Estado social de derecho. Esto significa dos cosas a la vez: que el poder está sometido a la ley —nadie, ni siquiera las autoridades, puede actuar por encima de ella— y que el Estado tiene la obligación de garantizar condiciones mínimas de vida digna, como la salud, la educación y el trabajo. Para hacer efectivos esos derechos, la Constitución creó mecanismos como la acción de tutela, que permite a cualquier persona pedir a un juez la protección inmediata de un derecho fundamental cuando está amenazado.',
      qs: [
        {
          q: '¿Qué implica que el poder esté sometido a la ley?',
          opts: [
            'Que solo los ciudadanos deben cumplir las normas',
            'Que ni siquiera las autoridades pueden actuar por encima de la ley',
            'Que las leyes pueden cambiarse en cualquier momento por decreto',
            'Que los jueces no deben aplicar la Constitución',
          ],
          correct: 1,
        },
        {
          q: '¿Para qué sirve la acción de tutela según el texto?',
          opts: [
            'Para crear nuevas leyes',
            'Para pedir a un juez la protección inmediata de un derecho fundamental',
            'Para elegir a los magistrados',
            'Para cobrar deudas entre particulares',
          ],
          correct: 1,
        },
      ],
    },
    {
      title: 'La jerarquía de las normas',
      text: 'No todas las normas tienen el mismo valor. En la cúspide del ordenamiento jurídico está la Constitución, norma de normas: ninguna ley puede contradecirla. Debajo se ubican las leyes expedidas por el Congreso y luego los decretos y reglamentos del gobierno, que desarrollan las leyes sin poder contrariarlas. Cuando una norma inferior choca con una superior, prevalece la superior y la inferior puede ser anulada. Esta jerarquía da seguridad jurídica, porque cualquier persona puede saber qué regla se impone en caso de conflicto.',
      qs: [
        {
          q: '¿Qué ocurre cuando una norma inferior contradice a una superior?',
          opts: [
            'Prevalece la inferior por ser más reciente',
            'Prevalece la superior y la inferior puede ser anulada',
            'Se aplican las dos por igual',
            'El conflicto no tiene solución',
          ],
          correct: 1,
        },
        {
          q: 'Según el texto, ¿qué ventaja ofrece la jerarquía normativa?',
          opts: [
            'Permite cambiar las leyes sin ningún control',
            'Da seguridad jurídica porque se sabe qué regla se impone',
            'Elimina la necesidad de jueces',
            'Hace que todas las normas valgan lo mismo',
          ],
          correct: 1,
        },
      ],
    },
  ],
  taller: [
    { prompt: 'La norma de mayor jerarquía en el ordenamiento jurídico colombiano es la ____.', answers: ['constitución', 'constitucion', 'constitución política', 'constitucion politica'], note: 'Es la «norma de normas»: ninguna ley puede contradecirla.' },
    { prompt: 'El mecanismo que permite pedir a un juez la protección inmediata de un derecho fundamental se llama acción de ____.', answers: ['tutela'], note: 'La acción de tutela está prevista en la Constitución de 1991.' },
    { prompt: 'Las tres ramas clásicas del poder público son la legislativa, la ejecutiva y la ____.', answers: ['judicial'], note: 'La Constitución prevé además organismos autónomos de control y electorales.' },
    { prompt: 'El Congreso de la República, que hace las leyes, pertenece a la rama ____.', answers: ['legislativa'], note: 'La rama legislativa expide las leyes.' },
    { prompt: 'El principio según el cual toda persona es inocente mientras no se demuestre lo contrario se llama presunción de ____.', answers: ['inocencia'], note: 'Hace parte de las garantías del debido proceso.' },
    { prompt: 'En Colombia se alcanza la mayoría de edad a los ____ años. (escribe el número)', answers: ['18', 'dieciocho'], note: 'Desde 1977 la mayoría de edad se alcanza a los 18 años.' },
    { prompt: 'La rama del derecho que regula las relaciones entre las personas (contratos, familia, propiedad) se llama derecho ____.', answers: ['civil'], note: 'El derecho civil regula las relaciones entre particulares.' },
    { prompt: 'Cuando una norma inferior contradice a una superior, prevalece la ____.', answers: ['superior'], note: 'Por eso la Constitución está por encima de la ley.' },
  ],
  tarjetas: [
    { f: 'Constitución', b: 'Norma de normas: organiza el Estado, reconoce los derechos fundamentales y está por encima de las demás normas.' },
    { f: 'Ley', b: 'Norma de carácter general expedida por el Congreso, obligatoria para todos.' },
    { f: 'Decreto', b: 'Norma expedida por el Gobierno, generalmente para reglamentar o desarrollar las leyes.' },
    { f: 'Jurisprudencia', b: 'Conjunto de decisiones de los jueces y las altas cortes que sirve de guía para interpretar y aplicar las normas.' },
    { f: 'Acción de tutela', b: 'Mecanismo para pedir a un juez la protección inmediata de un derecho fundamental amenazado o vulnerado.' },
    { f: 'Debido proceso', b: 'Garantía de que toda actuación judicial o administrativa se hace con reglas claras, derecho de defensa y juez competente.' },
    { f: 'Presunción de inocencia', b: 'Toda persona se considera inocente hasta que una sentencia demuestre lo contrario.' },
    { f: 'Estado social de derecho', b: 'Estado sometido a la ley que, además, debe garantizar condiciones mínimas de vida digna.' },
    { f: 'Separación de poderes', b: 'División del poder en ramas (legislativa, ejecutiva y judicial) que se controlan entre sí para evitar abusos.' },
    { f: 'Derecho público', b: 'Regula la organización del Estado y sus relaciones con los ciudadanos.' },
    { f: 'Derecho privado', b: 'Regula las relaciones entre particulares, como contratos, familia y propiedad.' },
    { f: 'Contrato', b: 'Acuerdo de voluntades entre dos o más partes que genera obligaciones.' },
    { f: 'Principio de legalidad', b: 'Nadie puede ser juzgado sino conforme a leyes preexistentes al acto que se le imputa.' },
    { f: 'Fuentes del derecho', b: 'Origen de las normas: la Constitución, la ley, la costumbre, la jurisprudencia y la doctrina.' },
  ],
}

export const PRACTICA = {
  lengua: {
    tallerTitulo: 'Taller de gramática',
    consignas: WRITING_PROMPTS,
    lecturas: READING,
    taller: GRAMMAR_DRILLS,
    tarjetas: FLASHCARDS,
  },
  sistemas: SISTEMAS,
  derecho: DERECHO,
}