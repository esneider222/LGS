import { useNavigate } from 'react-router-dom'
import { useCarrera } from '../hooks/useCarrera'
import { UNIS } from '../data/catalogo'

const titulo = { fontFamily: 'var(--serif-display)', fontSize: '22px' }
const parrafo = { fontFamily: 'var(--serif-body)', color: 'var(--ink-soft)', maxWidth: '70ch', lineHeight: 1.6 }
const textoTarjeta = { fontSize: '13.5px', color: 'var(--ink-soft)', margin: 0 }

function Inicio() {
  const navigate = useNavigate()
  const { sel, carrera, modulos, formato, studied, levelUnlocked, setStudied } = useCarrera()

  const esLengua = carrera.id === 'lengua'
  const hechos = modulos.filter((m) => studied[m.id]).length
  const porcentaje = modulos.length ? (hechos / modulos.length) * 100 : 0

  const estadisticas = [
    [modulos.length, 'Módulos organizados en tres niveles de avance'],
    [formato.n, 'Preguntas del simulacro de ingreso'],
    [formato.min, 'Minutos para resolverlo'],
    ['∞', 'Preguntas que puedes hacerle al tutor IA'],
  ]

  return (
    <section className="panel active">
      <div className="hero">
        <p className="eyebrow">PREPARACIÓN PARA {UNIS[sel.uni].toUpperCase()}</p>
        <h1>
          {esLengua
            ? 'Todo lo que tu carrera te va a pedir, antes de que te lo pida.'
            : 'Prepárate para ingresar a ' + carrera.name + '.'}
        </h1>
        <p className="lead">
          {esLengua
            ? 'Una plataforma para prepararte por tu cuenta antes de — y durante — tu licenciatura: diez módulos de fundamentos lingüísticos y literarios, un tutor con IA para resolver dudas al vuelo, ejercicios de redacción y lectura, y juegos que convierten la teoría en reflejo.'
            : 'Estudia por niveles, practica con un simulacro con el formato de tu universidad y pregúntale al tutor con IA lo que no te quede claro.'}
        </p>
        <div className="hero-actions">
          <button className="btn btn-oxblood" onClick={() => navigate('/guia')}>Empezar por la guía</button>
          <button className="btn btn-outline" onClick={() => navigate('/chat')}>Preguntarle al tutor IA</button>
        </div>
      </div>

      <div className="stat-row">
        {estadisticas.map((s) => (
          <div className="stat" key={s[1]}>
            <b>{s[0]}</b>
            <span>{s[1]}</span>
          </div>
        ))}
      </div>

      {esLengua && (
        <div>
          <hr className="rule" />
          <h2 style={titulo}>Mapa de la carrera</h2>
          <p style={parrafo}>
            La Licenciatura en Lengua Castellana e Idiomas (o Lenguas Extranjeras, según el programa) forma docentes e
            investigadores del lenguaje. Se apoya en dos grandes troncos: la <b>lingüística</b> — cómo funciona el lenguaje
            como sistema — y los <b>estudios literarios y culturales</b> — cómo el lenguaje produce sentido, identidad y
            arte — más un componente de <b>pedagogía</b> que enseña a transformar ese saber en enseñanza efectiva de lengua
            materna y lengua extranjera (inglés).
          </p>
          <div className="grid grid-3" style={{ marginTop: '18px' }}>
            <div className="card" style={{ padding: '18px' }}>
              <div className="chip chip-tag" style={{ marginBottom: '10px' }}>Eje lingüístico</div>
              <p style={textoTarjeta}>Fonética, morfosintaxis, semántica, pragmática y sociolingüística: cómo se organiza y varía la lengua.</p>
            </div>
            <div className="card" style={{ padding: '18px' }}>
              <div className="chip chip-tag" style={{ marginBottom: '10px' }}>Eje literario-cultural</div>
              <p style={textoTarjeta}>Historia literaria, teoría y análisis del discurso: cómo se lee, interpreta y critica un texto.</p>
            </div>
            <div className="card" style={{ padding: '18px' }}>
              <div className="chip chip-tag" style={{ marginBottom: '10px' }}>Eje pedagógico y lengua extranjera</div>
              <p style={textoTarjeta}>Adquisición de segundas lenguas, didáctica e inglés (fonética, gramática, literatura y metodología).</p>
            </div>
          </div>
        </div>
      )}

      <hr className="rule" />
      <h2 style={titulo}>Tu avance por módulo</h2>
      <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', marginTop: '-6px' }}>
        Marca lo que ya dominas — se guarda automáticamente en este navegador.
      </p>
      <div className="progress-wrap">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: porcentaje + '%' }}></div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-faint)', marginTop: '6px' }}>
          {hechos} de {modulos.length} módulos estudiados
        </div>
      </div>
      <ul className="module-check-list">
        {modulos.map((m) => (
          <li key={m.id}>
            <input
              type="checkbox"
              id={'chk-' + m.id}
              checked={Boolean(studied[m.id])}
              disabled={!levelUnlocked(m.level)}
              onChange={(e) => setStudied(m.id, e.target.checked)}
            />{' '}
            <label htmlFor={'chk-' + m.id}>{m.icon} {m.title}</label>
          </li>
        ))}
      </ul>

      {esLengua && (
        <div>
          <hr className="rule" />
          <h2 style={titulo}>Plan autodidacta sugerido de 8 semanas</h2>
          <div className="scrollx">
            <table className="plan-table">
              <thead>
                <tr><th>Semanas</th><th>Enfoque</th><th>Entregable autodidacta</th></tr>
              </thead>
              <tbody>
                <tr><td>1–2</td><td>Fonética, fonología y AFI (español e inglés)</td><td>Transcripción fonética de 20 palabras difíciles en ambas lenguas</td></tr>
                <tr><td>3–4</td><td>Morfosintaxis y lectura graduada</td><td>Análisis de sintagmas en 5 artículos breves de prensa</td></tr>
                <tr><td>5–6</td><td>Literatura, sociolingüística y análisis del discurso</td><td>Reseña crítica de una obra + comparación de dos titulares de prensa</td></tr>
                <tr><td>7–8</td><td>Didáctica, producción escrita y método Feynman</td><td>Grabar un audio de 5 min explicando un concepto lingüístico, y escribir un ensayo argumentativo</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

export default Inicio