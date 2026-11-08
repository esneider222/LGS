import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrera } from '../hooks/useCarrera'
import { UNIS } from '../data/catalogo'
import { mezclar } from '../utils/mezclar'
import Rich from '../components/Rich'

function reloj(segundos) {
  const t = Math.max(segundos, 0)
  return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0')
}

function Examen() {
  const { sel, banco, formato, examUnlocked } = useCarrera()
  const [preguntas, setPreguntas] = useState(null)
  const [respuestas, setRespuestas] = useState({})
  const [restante, setRestante] = useState(0)
  const [entregado, setEntregado] = useState(false)

  // El examen termina al entregarlo o cuando se acaba el tiempo.
  const terminado = entregado || (preguntas !== null && restante <= 0)
  const corriendo = preguntas !== null && !terminado

  // Cronómetro: descuenta un segundo mientras el examen está en curso.
  useEffect(() => {
    if (!corriendo) return
    const id = setInterval(() => setRestante((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [corriendo])

  function comenzar() {
    setPreguntas(mezclar(banco).slice(0, formato.n))
    setRespuestas({})
    setRestante(formato.min * 60)
    setEntregado(false)
  }

  function entregar() {
    const faltan = preguntas.length - Object.keys(respuestas).length
    if (faltan > 0 && !window.confirm('Te faltan ' + faltan + ' preguntas por responder. ¿Entregar de todos modos?')) {
      return
    }
    setEntregado(true)
    window.scrollTo(0, 0)
  }

  function reiniciar() {
    setPreguntas(null)
    setRespuestas({})
    setEntregado(false)
  }

  function contenido() {
    // 1) Simulacro bloqueado hasta terminar la guía.
    if (!examUnlocked) {
      return (
        <>
          <p className="alert alert-warning note">El simulacro se desbloquea al completar los tres niveles de la guía.</p>
          <Link className="btn btn-outline" to="/guia">Volver a la guía</Link>
        </>
      )
    }

    // 2) Pantalla de inicio.
    if (!preguntas) {
      return (
        <div className="card" style={{ padding: '22px', maxWidth: '620px' }}>
          <h3 style={{ fontFamily: 'var(--serif-display)', margin: '0 0 6px' }}>Simulacro · {UNIS[sel.uni]}</h3>
          <p style={{ color: 'var(--ink-soft)', margin: '0 0 16px' }}>
            {formato.n} preguntas de opción múltiple · {formato.min} minutos · formato referencial
          </p>
          <button className="btn btn-oxblood" type="button" onClick={comenzar}>Comenzar simulacro</button>
        </div>
      )
    }

    // 3) Examen en curso o resultado.
    const aciertos = preguntas.filter((q, i) => respuestas[i] === q.c).length
    return (
      <>
        {terminado ? (
          <div className="card" style={{ padding: '22px', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'var(--serif-display)', margin: '0 0 6px' }}>
              Resultado: {aciertos} de {preguntas.length} ({Math.round((aciertos / preguntas.length) * 100)}%)
            </h3>
            <p style={{ color: 'var(--ink-soft)', margin: '0 0 14px' }}>
              Revisa abajo las respuestas correctas y vuelve a la guía en los temas que fallaste.
            </p>
            <button className="btn btn-oxblood" type="button" onClick={reiniciar}>Repetir simulacro</button>{' '}
            <Link className="btn btn-outline" to="/guia">Volver a la guía</Link>
          </div>
        ) : (
          <div className="exam-bar">
            <span>Tiempo: <b>{reloj(restante)}</b></span>
            <span>{Object.keys(respuestas).length} de {preguntas.length} respondidas</span>
          </div>
        )}

        {preguntas.map((q, i) => (
          <div className="exam-q" key={i}>
            <p><b>{i + 1}.</b> <Rich texto={q.q} /></p>
            {q.opts.map((o, oi) => {
              const clase = terminado ? (oi === q.c ? ' correct' : respuestas[i] === oi ? ' incorrect' : '') : ''
              return (
                <label className={'exam-opt' + clase} key={oi}>
                  <input
                    className="form-check-input mt-1 flex-shrink-0"
                    type="radio"
                    name={'eq-' + i}
                    value={oi}
                    checked={respuestas[i] === oi}
                    disabled={terminado}
                    onChange={() => setRespuestas({ ...respuestas, [i]: oi })}
                  />{' '}
                  <Rich texto={o} />
                </label>
              )
            })}
          </div>
        ))}

        {!terminado && (
          <button className="btn btn-oxblood" type="button" style={{ marginTop: '14px' }} onClick={entregar}>
            Entregar examen
          </button>
        )}
      </>
    )
  }

  return (
    <section className="panel active">
      <div className="section-head">
        <p className="eyebrow">SIMULADOR DE EXAMEN DE INGRESO</p>
        <h1>Practica con el formato de tu universidad</h1>
        <p>
          El simulacro se desbloquea al terminar los tres niveles de la guía. Su formato es referencial: confirma
          siempre los detalles en la página oficial de admisiones.
        </p>
      </div>
      <div>{contenido()}</div>
    </section>
  )
}

export default Examen