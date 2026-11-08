import { useCarrera } from '../hooks/useCarrera'

const RECURSOS_POR_CARRERA = {
  lengua: [
    {
      url: 'https://www.rae.es',
      nombre: 'Diccionario de la lengua española (RAE)',
      desc: 'Consulta normativa de significados, etimologías y conjugaciones',
    },
    {
      url: 'https://www.fundeu.es',
      nombre: 'Fundéu',
      desc: 'Dudas de uso, neologismos y estilo periodístico en español',
    },
    {
      url: 'https://www.rae.es/banco-de-datos/crea-anotado',
      nombre: 'CREA / CORPES (RAE)',
      desc: 'Corpus de referencia del español para ver palabras en contexto real',
    },
    {
      url: 'https://dictionary.cambridge.org',
      nombre: 'Cambridge Dictionary',
      desc: 'Definiciones, pronunciación AFI y ejemplos en inglés',
    },
    {
      url: 'https://owl.purdue.edu',
      nombre: 'Purdue OWL',
      desc: 'Guías de escritura académica, citación y gramática inglesa',
    },
    {
      url: 'https://www.britishcouncil.org',
      nombre: 'British Council — LearnEnglish',
      desc: 'Recursos de gramática, listening y metodología ELT',
    },
  ],

  sistemas: [
    {
      url: 'https://developer.mozilla.org/es/',
      nombre: 'MDN Web Docs',
      desc: 'Referencia oficial de HTML, CSS, JavaScript y APIs web',
    },
    {
      url: 'https://react.dev',
      nombre: 'React Docs',
      desc: 'Documentación oficial de React (hooks, componentes, patrones)',
    },
    {
      url: 'https://stackoverflow.com',
      nombre: 'Stack Overflow',
      desc: 'Comunidad para resolver errores y dudas de programación',
    },
    {
      url: 'https://github.com',
      nombre: 'GitHub',
      desc: 'Repositorios, control de versiones y proyectos open source',
    },
    {
      url: 'https://www.freecodecamp.org',
      nombre: 'freeCodeCamp',
      desc: 'Cursos prácticos de desarrollo web y algoritmos',
    },
    {
      url: 'https://leetcode.com',
      nombre: 'LeetCode',
      desc: 'Problemas de algoritmos y estructuras de datos para práctica',
    },
  ],

  derecho: [
    {
      url: 'https://www.corteconstitucional.gov.co',
      nombre: 'Corte Constitucional de Colombia',
      desc: 'Sentencias, comunicados y jurisprudencia constitucional',
    },
    {
      url: 'https://www.consejodestado.gov.co',
      nombre: 'Consejo de Estado',
      desc: 'Jurisprudencia de lo contencioso administrativo',
    },
    {
      url: 'https://www.ramajudicial.gov.co',
      nombre: 'Rama Judicial',
      desc: 'Acceso a juzgados, despachos y servicios judiciales',
    },
    {
      url: 'https://www.suin-juriscol.gov.co',
      nombre: 'SUIN-Juriscol',
      desc: 'Sistema Único de Información Normativa (leyes y decretos)',
    },
    {
      url: 'https://www.funcionpublica.gov.co/eva/gestornormativo',
      nombre: 'Gestor Normativo (Función Pública)',
      desc: 'Normas, decretos y circulares del ordenamiento colombiano',
    },
    {
      url: 'https://www.corteconstitucional.gov.co/relatoria/',
      nombre: 'Relatoría Corte Constitucional',
      desc: 'Buscador de sentencias por tema, año y magistrado',
    },
  ],
}

// Recursos genéricos cuando aún no hay carrera elegida
const RECURSOS_DEFAULT = RECURSOS_POR_CARRERA.lengua

function Recursos() {
  const { carrera } = useCarrera()
  const careerId = carrera?.id || null

  const lista =
    careerId && RECURSOS_POR_CARRERA[careerId]
      ? RECURSOS_POR_CARRERA[careerId]
      : RECURSOS_DEFAULT

  const tituloCarrera = carrera?.name || 'tu carrera'
  const esDefault = !careerId

  return (
    <section className="panel active">
      <div className="section-head">
        <p className="eyebrow">RECURSOS</p>
        <h1>Herramientas para seguir profundizando</h1>
        <p>
          {esDefault
            ? 'Diccionarios, corpus y guías de referencia. Elige una carrera en Selección para ver recursos específicos.'
            : `Recursos recomendados para ${tituloCarrera}.`}
        </p>
      </div>

      {esDefault && (
        <p className="alert alert-warning note">
          No hay carrera seleccionada. Se muestran recursos de Lengua por defecto.
        </p>
      )}

      <ul className="res-list">
        {lista.map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noopener noreferrer">
              {r.nombre}
            </a>
            <span>{r.desc}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Recursos