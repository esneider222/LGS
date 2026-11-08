import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarrera } from '../hooks/useCarrera'
import { loadJSON, saveJSON } from '../utils/storage'
import { PRACTICA } from '../data/practica'
import Rich from '../components/Rich'

const LISTA_CONTROL = [
  'Tiene introducción con tesis clara',
  'El desarrollo presenta evidencia o ejemplos',
  'Hay conclusión que retoma la tesis',
  'Revisé ortografía, tildes y concordancia',
  'Leí el texto en voz alta para revisar el ritmo',
]

const contarPalabras = (texto) => texto.trim().split(/\s+/).filter(Boolean).length
const normalizar = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!?¡¿]+$/, '')

/*Redacción*/
function Redaccion({ consignas }) {
  const navigate = useNavigate()
  const [borradores, setBorradores] = useState(() => loadJSON('lyl_drafts', {}))
  const [consignaId, setConsignaId] = useState(null)
  const [marcas, setMarcas] = useState({})
  const [aviso, setAviso] = useState('')

  const consigna = consignas.find((p) => p.id === consignaId)
  const texto = consigna ? borradores[consigna.id] || '' : ''

  function elegir(id) {
    setConsignaId(id)
    setMarcas({})
    setAviso('')
  }

  function escribir(e) {
    const nuevos = { ...borradores, [consigna.id]: e.target.value }
    setBorradores(nuevos)
    saveJSON('lyl_drafts', nuevos)
  }

  function borrar() {
    const nuevos = { ...borradores, [consigna.id]: '' }
    setBorradores(nuevos)
    saveJSON('lyl_drafts', nuevos)
  }

  function descargar() {
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = consigna.id + '.txt'
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    URL.revokeObjectURL(url)
    setAviso('Borrador guardado.')
  }

  function pedirFeedback() {
    if (contarPalabras(texto) < 25) {
      setAviso('Escribe al menos unas 25 palabras para recibir feedback.')
      return
    }
    navigate('/chat', {
      state: { borrador: { titulo: consigna.title, consigna: consigna.brief, texto: texto.trim().slice(0, 5000) } },
    })
  }

  return (
    <div className="tool-pane active">
      <div className="prompt-list">
        {consignas.map((p) => (
          <div
            key={p.id}
            className={'prompt-item' + (p.id === consignaId ? ' active' : '')}
            role="button"
            tabIndex={0}
            onClick={() => elegir(p.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && elegir(p.id)}
          >
            <h4>{p.title}</h4>
            <p>{p.brief}</p>
          </div>
        ))}
      </div>

      {consigna && (
        <div>
          <h3 style={{ fontFamily: 'var(--serif-display)' }}>{consigna.title}</h3>
          <textarea
            className="writer"
            placeholder="Empieza a escribir aquí…"
            value={texto}
            onChange={escribir}
          ></textarea>
          <div className="writer-meta">
            <span>{contarPalabras(texto)} palabras</span>
            <span>Se guarda automáticamente</span>
          </div>
          <ul className="checklist">
            {LISTA_CONTROL.map((item, i) => (
              <li key={item}>
                <input
                  type="checkbox"
                  checked={Boolean(marcas[i])}
                  onChange={(e) => setMarcas({ ...marcas, [i]: e.target.checked })}
                />{' '}
                {item}
              </li>
            ))}
          </ul>
          {aviso && <div className="alert alert-warning small" role="status">{aviso}</div>}
          <div className="writer-actions">
            <button className="btn btn-primary btn-sm" type="button" onClick={pedirFeedback}>
              💬 Pedir feedback al tutor
            </button>
            <button className="btn btn-outline btn-sm" type="button" onClick={descargar}>
              Descargar borrador (.txt)
            </button>
            <button className="btn btn-outline btn-sm" type="button" onClick={borrar}>
              Borrar borrador
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/*Comprensión lectora*/
function Lectura({ lecturas }) {
  const [elegidas, setElegidas] = useState({})
  const [revision, setRevision] = useState({})

  function revisar(ri) {
    const lectura = lecturas[ri]
    const aciertos = lectura.qs.filter((q, qi) => elegidas[ri + '-' + qi] === q.correct).length
    setRevision({ ...revision, [ri]: { aciertos, elegidas: { ...elegidas } } })
  }

  return (
    <div className="tool-pane active">
      {lecturas.map((r, ri) => (
        <div key={r.title}>
          <div className="reading-pass">
            <h4>{r.title}</h4>
            <p><Rich texto={r.text} /></p>
          </div>
          <div className="card" style={{ padding: '20px 22px', marginBottom: '30px' }}>
            {r.qs.map((q, qi) => (
              <div className="quiz-q" key={qi}>
                <p className="qtext">{qi + 1}. <Rich texto={q.q} /></p>
                <div className="quiz-opts">
                  {q.opts.map((o, oi) => {
                    const rev = revision[ri]
                    let clase = ''
                    if (rev) {
                      if (oi === q.correct) clase = ' correct'
                      else if (rev.elegidas[ri + '-' + qi] === oi) clase = ' incorrect'
                    }
                    return (
                      <label className={'quiz-opt' + clase} key={oi}>
                        <input
                          type="radio"
                          name={'read-' + ri + '-' + qi}
                          checked={elegidas[ri + '-' + qi] === oi}
                          onChange={() => setElegidas({ ...elegidas, [ri + '-' + qi]: oi })}
                        />{' '}
                        <Rich texto={o} />
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
            <button
              className="btn btn-primary btn-sm"
              type="button"
              style={{ marginTop: '8px' }}
              onClick={() => revisar(ri)}
            >
              Revisar respuestas
            </button>
            <div className={'score-banner' + (revision[ri] ? ' show' : '')}>
              {revision[ri] && 'Obtuviste ' + revision[ri].aciertos + ' de ' + r.qs.length + ' correctas.'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/*Taller de gramática*/
function Gramatica({ items }) {
  const [valores, setValores] = useState({})
  const [resultados, setResultados] = useState({})

  function revisar(i) {
    const valor = normalizar(valores[i] || '')
    const ok = items[i].answers.some((a) => normalizar(a) === valor)
    setResultados({ ...resultados, [i]: ok })
  }

  return (
    <div className="tool-pane active">
      <div className="card" style={{ padding: '20px 24px' }}>
        {items.map((d, i) => (
          <div className="drill-item" key={i}>
            <p>{i + 1}. <Rich texto={d.prompt} /></p>
            <input
              type="text"
              placeholder="tu respuesta"
              value={valores[i] || ''}
              onChange={(e) => setValores({ ...valores, [i]: e.target.value })}
            />{' '}
            <button className="btn btn-outline btn-sm" type="button" onClick={() => revisar(i)}>Revisar</button>{' '}
            {i in resultados && (
              <span className={'drill-fb ' + (resultados[i] ? 'ok' : 'bad')}>
                {resultados[i] ? '✓ Correcto' : '✗ Respuesta esperada: ' + d.answers[0]}
              </span>
            )}
            <div style={{ fontSize: '12px', color: 'var(--ink-faint)', marginTop: '6px', fontFamily: 'var(--mono)' }}>
              <Rich texto={d.note} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/*Flashcards*/
function Tarjetas({ tarjetas }) {
  const [volteadas, setVolteadas] = useState({})
  const voltear = (i) => setVolteadas({ ...volteadas, [i]: !volteadas[i] })

  return (
    <div className="tool-pane active">
      <div className="flash-grid">
        {tarjetas.map((c, i) => (
          <div
            key={c.f}
            className={'flash' + (volteadas[i] ? ' flipped' : '')}
            role="button"
            tabIndex={0}
            onClick={() => voltear(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && voltear(i)}
          >
            <div className="flash-inner">
              <div className="flash-face flash-front"><Rich texto={c.f} /></div>
              <div className="flash-face flash-back"><Rich texto={c.b} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/*Página*/
function Practica() {
  const { carrera } = useCarrera()
  const [herramienta, setHerramienta] = useState('redaccion')

  // Todo el contenido depende de la carrera elegida.
  const datos = PRACTICA[carrera.id]
  const herramientas = [
    { id: 'redaccion', texto: 'Redacción' },
    { id: 'lectura', texto: 'Comprensión lectora' },
    { id: 'gramatica', texto: datos.tallerTitulo },
    { id: 'vocab', texto: 'Flashcards' },
  ]

  return (
    <section className="panel active">
      <div className="section-head">
        <p className="eyebrow">ESTACIONES DE PRÁCTICA · {carrera.name.toUpperCase()}</p>
        <h1>De la teoría al hábito</h1>
        <p>Redacta, lee, practica y memoriza con contenido de tu carrera. Cada estación guarda tu progreso localmente.</p>
      </div>

      <div className="tool-tabs">
        {herramientas.map((h) => (
          <button
            key={h.id}
            className={'tool-tab' + (herramienta === h.id ? ' active' : '')}
            type="button"
            onClick={() => setHerramienta(h.id)}
          >
            {h.texto}
          </button>
        ))}
      </div>

      {herramienta === 'redaccion' && <Redaccion consignas={datos.consignas} />}
      {herramienta === 'lectura' && <Lectura lecturas={datos.lecturas} />}
      {herramienta === 'gramatica' && <Gramatica items={datos.taller} />}
      {herramienta === 'vocab' && <Tarjetas tarjetas={datos.tarjetas} />}
    </section>
  )
}

export default Practica