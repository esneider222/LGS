import { useEffect, useMemo, useState } from 'react'
import { mezclar } from '../utils/mezclar'
import {
  QUIZ_BANK,
  EXTRA_BANK,
  HANGMAN_WORDS,
  MATCH_PAIRS,
  IPA_WORDS,
  DISCOURSE_ITEMS,
} from '../data/contenido'
import { useCarrera } from '../hooks/useCarrera'

const HANGMAN_BY_CAREER = {
  lengua: HANGMAN_WORDS.map((x) => ({ w: x.w, hint: x.hint })),
  sistemas: [
    { w: 'ALGORITMO', hint: 'Secuencia finita de pasos para resolver un problema' },
    { w: 'VARIABLE', hint: 'Espacio con nombre que guarda un valor' },
    { w: 'BUCLE', hint: 'Repite instrucciones mientras se cumpla una condición' },
    { w: 'FUNCION', hint: 'Bloque reutilizable de código con nombre' },
    { w: 'ARREGLO', hint: 'Colección ordenada accesible por índice' },
    { w: 'RECURSIVIDAD', hint: 'Una función que se llama a sí misma' },
    { w: 'COMPILADOR', hint: 'Traduce el código fuente a lenguaje de máquina' },
    { w: 'BASEDEDATOS', hint: 'Sistema organizado para guardar y consultar datos' },
    { w: 'INTERFAZ', hint: 'Punto de contacto entre usuario y sistema' },
    { w: 'PROTOCOLO', hint: 'Conjunto de reglas para comunicar sistemas' },
  ],
  derecho: [
    { w: 'CONSTITUCION', hint: 'Norma de normas que organiza el Estado' },
    { w: 'TUTELA', hint: 'Mecanismo rápido de protección de derechos fundamentales' },
    { w: 'JURISPRUDENCIA', hint: 'Decisiones reiteradas de jueces y cortes' },
    { w: 'LEGISLATIVA', hint: 'Rama del poder que expide las leyes' },
    { w: 'DEBIDO PROCESO', hint: 'Garantía de defensa y juez competente' },
    { w: 'NORMA', hint: 'Regla de conducta con fuerza jurídica' },
    { w: 'DEMANDA', hint: 'Escrito con el que se inicia un proceso judicial' },
    { w: 'SENTENCIA', hint: 'Decisión final de un juez o tribunal' },
    { w: 'RECURSO', hint: 'Medio para impugnar una decisión judicial' },
    { w: 'DOCTRINA', hint: 'Opiniones de juristas que orientan la interpretación' },
  ],
}

const MATCH_BY_CAREER = {
  lengua: MATCH_PAIRS,
  sistemas: [
    { a: 'Lista / arreglo', b: 'Colección ordenada por índice' },
    { a: 'Diccionario', b: 'Pares clave-valor' },
    { a: 'Pila', b: 'LIFO: último en entrar, primero en salir' },
    { a: 'Cola', b: 'FIFO: primero en entrar, primero en salir' },
    { a: 'HTML', b: 'Define la estructura de una página web' },
    { a: 'SQL', b: 'Consulta y modifica bases de datos relacionales' },
    { a: 'Cliente', b: 'En el modelo cliente-servidor, el navegador actúa como…' },
    { a: 'Algoritmo', b: 'Secuencia finita de pasos para resolver un problema' },
  ],
  derecho: [
    { a: 'Constitución', b: 'Norma superior del ordenamiento jurídico' },
    { a: 'Acción de tutela', b: 'Protege de forma rápida derechos fundamentales' },
    { a: 'Rama legislativa', b: 'Expide las leyes' },
    { a: 'Jurisprudencia', b: 'Decisiones reiteradas de jueces y cortes' },
    { a: 'Razonamiento deductivo', b: 'Parte de una regla general aplicada a un caso' },
    { a: 'Estado social de derecho', b: 'Poder sometido a la ley y garantías mínimas de vida digna' },
    { a: 'Debido proceso', b: 'Derecho de defensa y juez competente' },
    { a: 'Fuentes del derecho', b: 'Constitución, ley, costumbre, jurisprudencia, doctrina' },
  ],
}

function quizBankFor(carreraId, bancoHook) {
  if (bancoHook && bancoHook.length) return bancoHook
  if (carreraId === 'lengua') return QUIZ_BANK
  if (carreraId && EXTRA_BANK[carreraId]) return EXTRA_BANK[carreraId]
  return QUIZ_BANK
}

/*Quiz relámpago*/
function QuizRelampago({ banco }) {
  const [state, setState] = useState(null)

  function start() {
    const qs = mezclar(banco).slice(0, Math.min(10, banco.length))
    setState({
      qs,
      idx: 0,
      score: 0,
      timeLeft: 20,
      answered: false,
      finished: false,
      chosen: null,
      feedback: '',
    })
  }

  useEffect(() => {
    if (!state || state.finished || state.answered) return undefined
    if (state.timeLeft <= 0) {
      resolve(null)
      return undefined
    }
    const t = setTimeout(() => {
      setState((s) => (s && !s.answered ? { ...s, timeLeft: s.timeLeft - 1 } : s))
    }, 1000)
    return () => clearTimeout(t)
  })

  function resolve(chosen) {
    setState((s) => {
      if (!s || s.answered) return s
      const q = s.qs[s.idx]
      const ok = chosen !== null && chosen === q.c
      return {
        ...s,
        answered: true,
        chosen,
        score: ok ? s.score + 1 : s.score,
        feedback: ok ? 'Correcto.' : `Incorrecto. Respuesta: ${q.opts[q.c]}`,
      }
    })
  }

  function next() {
    setState((s) => {
      if (!s) return s
      if (s.idx + 1 >= s.qs.length) return { ...s, finished: true }
      return {
        ...s,
        idx: s.idx + 1,
        timeLeft: 20,
        answered: false,
        chosen: null,
        feedback: '',
      }
    })
  }

  if (!banco || banco.length === 0) {
    return <p className="small text-secondary">No hay preguntas disponibles para esta carrera.</p>
  }

  if (!state) {
    return (
      <button type="button" className="btn btn-primary" onClick={start}>
        Empezar quiz
      </button>
    )
  }

  if (state.finished) {
    return (
      <div>
        <p>
          Resultado: <b>{state.score}</b> / {state.qs.length}
        </p>
        <button type="button" className="btn btn-primary" onClick={start}>
          Reiniciar
        </button>
      </div>
    )
  }

  const q = state.qs[state.idx]

  return (
    <div>
      <div className="quiz-meta d-flex justify-content-between small mb-2">
        <span>
          Pregunta {state.idx + 1} / {state.qs.length}
        </span>
        <span>⏱ {state.timeLeft}s</span>
        <span>Puntos: {state.score}</span>
      </div>
      <p className="qtext">{q.q}</p>
      <div className="quiz-opts">
        {q.opts.map((opt, i) => (
          <button
            key={i}
            type="button"
            className={
              'btn btn-sm me-1 mb-1 ' +
              (state.answered
                ? i === q.c
                  ? 'btn-oxblood'
                  : state.chosen === i
                    ? 'btn-outline'
                    : 'btn-outline'
                : 'btn-outline')
            }
            disabled={state.answered}
            onClick={() => resolve(i)}
          >
            {opt}
          </button>
        ))}
      </div>
      {state.answered && (
        <button type="button" className="btn btn-primary btn-sm mt-2" onClick={next}>
          {state.idx + 1 >= state.qs.length ? 'Ver resultado' : 'Siguiente'}
        </button>
      )}
      {state.feedback && (
        <div className={'drill-fb ' + (state.feedback.startsWith('Correcto') ? 'ok' : 'bad')}>
          {state.feedback}
        </div>
      )}
    </div>
  )
}

/*Ahorcado*/
function Ahorcado({ palabras }) {
  const [selectedWord, setSelectedWord] = useState(() => {
    if (!palabras || !palabras.length) return null
    return palabras[Math.floor(Math.random() * palabras.length)]
  })
  const [reveladas, setReveladas] = useState(() => new Set())
  const [fallos, setFallos] = useState(0)
  const [msg, setMsg] = useState('')
  const maxFallos = 6

  const actual = useMemo(() => {
    if (!selectedWord) return { palabra: '', pista: '' }
    return {
      palabra: String(selectedWord.w).toUpperCase().replace(/\s+/g, ''),
      pista: selectedWord.hint || '',
    }
  }, [selectedWord])

  const { palabra, pista } = actual

  function nueva() {
    if (!palabras || !palabras.length) return
    setSelectedWord(palabras[Math.floor(Math.random() * palabras.length)])
    setReveladas(new Set())
    setFallos(0)
    setMsg('')
  }

  function probar(letra) {
    if (!palabra || msg) return
    const L = letra.toUpperCase()
    if (reveladas.has(L)) return
    const next = new Set(reveladas)
    next.add(L)
    setReveladas(next)
    if (!palabra.includes(L)) {
      const f = fallos + 1
      setFallos(f)
      if (f >= maxFallos) setMsg('Perdiste. Era: ' + palabra)
    } else {
      const ganado = [...palabra].every((ch) => next.has(ch) || !/[A-ZÁÉÍÓÚÜÑ]/.test(ch))
      if (ganado) setMsg('¡Ganaste!')
    }
  }

  const abecedario = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')

  if (!palabras || !palabras.length) {
    return <p className="small text-secondary">No hay palabras de ahorcado para esta carrera.</p>
  }

  return (
    <div>
      {pista && <p className="small text-secondary">Pista: {pista}</p>}
      <p className="hang-word" style={{ letterSpacing: 4, fontSize: 22, fontFamily: 'var(--mono)' }}>
        {[...palabra]
          .map((ch) => (reveladas.has(ch) || msg.startsWith('Perdiste') ? ch : '_'))
          .join(' ')}
      </p>
      <p className="small">
        Fallos: {fallos}/{maxFallos}
      </p>
      <div className="d-flex flex-wrap gap-1 mb-2">
        {abecedario.map((L) => (
          <button
            key={L}
            type="button"
            className="btn btn-outline btn-sm"
            disabled={reveladas.has(L) || !!msg}
            onClick={() => probar(L)}
          >
            {L}
          </button>
        ))}
      </div>
      {msg && <div className={'drill-fb ' + (msg.startsWith('¡') ? 'ok' : 'bad')}>{msg}</div>}
      <button className="btn btn-primary btn-sm" type="button" onClick={nueva}>
        Nueva palabra
      </button>
    </div>
  )
}

/*Emparejar*/
function Emparejar({ paresBase }) {
  const [round, setRound] = useState(0)
  const [sel, setSel] = useState(null)
  const [aciertos, setAciertos] = useState(0)
  const [bloqueados, setBloqueados] = useState(() => new Set())

  const pares = useMemo(() => {
    if (!paresBase || !paresBase.length) return []
    const base = mezclar(paresBase).slice(0, Math.min(6, paresBase.length))
    return mezclar([
      ...base.map((p, i) => ({ id: `a${round}-${i}`, pair: i, text: p.a })),
      ...base.map((p, i) => ({ id: `b${round}-${i}`, pair: i, text: p.b })),
    ])
  }, [paresBase, round])

  function reiniciar() {
    setSel(null)
    setAciertos(0)
    setBloqueados(new Set())
    setRound((r) => r + 1)
  }

  function click(card) {
    if (bloqueados.has(card.id) || (sel && sel.id === card.id)) return
    if (!sel) {
      setSel(card)
      return
    }
    if (sel.pair === card.pair) {
      setBloqueados((b) => new Set([...b, sel.id, card.id]))
      setAciertos((n) => n + 1)
      setSel(null)
    } else {
      setSel(null)
    }
  }

  if (!paresBase || !paresBase.length) {
    return <p className="small text-secondary">No hay pares para esta carrera.</p>
  }

  return (
    <div>
      <p className="small">
        Aciertos: {aciertos} / {pares.length / 2 || 0}
      </p>
      <div className="match-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {pares.map((c) => (
          <button
            key={c.id}
            type="button"
            className={
              'btn btn-sm ' +
              (bloqueados.has(c.id) ? 'btn-oxblood' : sel?.id === c.id ? 'btn-primary' : 'btn-outline')
            }
            disabled={bloqueados.has(c.id)}
            onClick={() => click(c)}
          >
            {c.text}
          </button>
        ))}
      </div>
      <button className="btn btn-primary btn-sm mt-2" type="button" onClick={reiniciar}>
        Reiniciar
      </button>
    </div>
  )
}

/*IPA*/
function JuegoIPA() {
  const items = IPA_WORDS
  const [idx, setIdx] = useState(0)
  const [msg, setMsg] = useState('')

  const item = items.length ? items[idx % items.length] : null

  const opts = useMemo(() => {
    if (!item) return []
    const correct = item.a[0]
    const distractors = items
      .filter((_, i) => i !== idx % items.length)
      .flatMap((x) => x.a)
      .filter((x) => x !== correct)
    return mezclar([correct, ...mezclar(distractors).slice(0, 3)])
  }, [item, idx, items])

  function check(opt) {
    if (!item) return
    if (item.a.includes(opt)) {
      setMsg('Correcto. ' + (item.real || ''))
      setTimeout(() => {
        setMsg('')
        setIdx((i) => i + 1)
      }, 900)
    } else {
      setMsg('No. Forma esperada: ' + (item.real || item.a[0]))
    }
  }

  if (!item) return <p className="small text-secondary">Sin datos IPA.</p>

  return (
    <div>
      <p className="qtext">
        ¿Cómo se transcribe «<b>{item.w}</b>»?
      </p>
      <div className="quiz-opts">
        {opts.map((o) => (
          <button key={o} type="button" className="btn btn-outline btn-sm me-1 mb-1" onClick={() => check(o)}>
            {o}
          </button>
        ))}
      </div>
      {msg && <div className={'drill-fb ' + (msg.startsWith('Correcto') ? 'ok' : 'bad')}>{msg}</div>}
    </div>
  )
}

/*Detective del discurso*/
function JuegoDiscurso() {
  const items = DISCOURSE_ITEMS
  const [idx, setIdx] = useState(0)
  const [msg, setMsg] = useState('')

  function check(opt) {
    const item = items[idx % items.length]
    if (opt === item.c) {
      setMsg('Correcto. ' + (item.exp || ''))
      setTimeout(() => {
        setMsg('')
        setIdx((i) => i + 1)
      }, 1200)
    } else {
      setMsg('Incorrecto. ' + (item.exp || ''))
    }
  }

  if (!items.length) return <p className="small text-secondary">Sin ítems de discurso.</p>
  const item = items[idx % items.length]

  return (
    <div>
      {item.h && <p className="small text-secondary fst-italic">«{item.h}»</p>}
      <p className="qtext">{item.q}</p>
      <div className="quiz-opts">
        {item.opts.map((o, i) => (
          <button
            key={i}
            type="button"
            className="btn btn-outline btn-sm d-block mb-1 text-start"
            onClick={() => check(i)}
          >
            {o}
          </button>
        ))}
      </div>
      {msg && <div className={'drill-fb ' + (msg.startsWith('Correcto') ? 'ok' : 'bad')}>{msg}</div>}
    </div>
  )
}

/*Página principal*/
export default function Juegos() {
  const { carrera, banco } = useCarrera()
  const careerId = carrera?.id || null

  const quizBank = useMemo(() => quizBankFor(careerId, banco), [careerId, banco])
  const hangmanWords = useMemo(() => {
    if (!careerId) return HANGMAN_BY_CAREER.lengua
    return HANGMAN_BY_CAREER[careerId] || HANGMAN_BY_CAREER.lengua
  }, [careerId])
  const matchPairs = useMemo(() => {
    if (!careerId) return MATCH_BY_CAREER.lengua
    return MATCH_BY_CAREER[careerId] || MATCH_BY_CAREER.lengua
  }, [careerId])

  const esLengua = careerId === 'lengua' || !careerId
  const tituloCarrera = carrera?.name || 'tu carrera'

  return (
    <section className="panel active">
      <div className="section-head">
        <p className="eyebrow">JUEGOS</p>
        <h1>Practica con velocidad y memoria</h1>
        <p>
          Contenido adaptado a <b>{tituloCarrera}</b>
          {careerId ? ` (${careerId})` : ''}. El quiz, el ahorcado y el emparejamiento cambian según la
          carrera; IPA y discurso son de Lengua.
        </p>
      </div>

      {!careerId && (
        <p className="alert alert-warning note">
          No hay carrera seleccionada. Se muestran juegos de Lengua por defecto. Elige carrera en
          Selección para personalizarlos.
        </p>
      )}

      {!esLengua && (
        <p className="alert alert-warning note">
          Para <b>{tituloCarrera}</b> tienes quiz, ahorcado y emparejar con su propio banco. IPA y
          detective del discurso siguen siendo de Lengua (se ocultan aquí).
        </p>
      )}

      <div className="card game-card mb-3">
        <h3>⚡ Quiz relámpago</h3>
        <p className="desc">
          Preguntas de {careerId === 'sistemas' ? 'Sistemas' : careerId === 'derecho' ? 'Derecho' : 'Lengua'}{' '}
          · 20 s por pregunta.
        </p>
        <QuizRelampago banco={quizBank} />
      </div>

      <div className="card game-card mb-3">
        <h3>🪢 Ahorcado</h3>
        <p className="desc">Términos de {tituloCarrera}.</p>
        <Ahorcado key={`hang-${careerId || 'lengua'}`} palabras={hangmanWords} />
      </div>

      <div className="card game-card mb-3">
        <h3>🧩 Empareja conceptos</h3>
        <p className="desc">Une cada concepto con su definición ({tituloCarrera}).</p>
        <Emparejar paresBase={matchPairs} />
      </div>

      {esLengua && (
        <>
          <div className="card game-card mb-3">
            <h3>🔊 Transcripción IPA</h3>
            <p className="desc">Elige la transcripción más adecuada.</p>
            <JuegoIPA />
          </div>

          <div className="card game-card mb-3">
            <h3>🗣️ Detective del discurso</h3>
            <p className="desc">Identifica el encuadre o el agente en el titular.</p>
            <JuegoDiscurso />
          </div>
        </>
      )}
    </section>
  )
}