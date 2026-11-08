import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { loadJSON, saveJSON } from '../utils/storage'
import { CAREERS, UNIS, EXAM_FORMATS } from '../data/catalogo'

function Seleccion() {
  const navigate = useNavigate()
  const [session] = useState(() => loadJSON('lyl_session', null))
  const [prev] = useState(() => loadJSON('lyl_sel', null))
  const [pick, setPick] = useState({
    career: prev ? prev.career : null,
    uni: prev ? prev.uni : null,
  })

  // Sin sesión no se puede elegir carrera: vuelve al login.
  if (!session) return <Navigate to="/" replace />

  const carrera = CAREERS.find((c) => c.id === pick.career)
  const formato = pick.uni ? EXAM_FORMATS[pick.uni] : null

  function elegirCarrera(id) {
    if (pick.career !== id) setPick({ career: id, uni: null })
  }

  function elegirUni(e) {
    setPick({ ...pick, uni: e.target.value || null })
  }

  function continuar() {
    if (!(pick.career && pick.uni)) return
    // Si cambió la elección, se borra el chat anterior del tutor.
    if (!prev || prev.career !== pick.career || prev.uni !== pick.uni) {
      try {
        localStorage.removeItem('lyl_chat_v2')
      } catch {
        // sin acceso a localStorage: no pasa nada
      }
    }
    saveJSON('lyl_sel', { career: pick.career, uni: pick.uni })
    navigate('/guia')
  }

  return (
    <main className="container py-4 py-md-5" style={{ maxWidth: '980px' }}>
      <div className="card">
        <div className="card-body p-4 p-md-5">
          <p className="eyebrow mb-1">Hola, {session.user}</p>
          <h1 className="h3 mb-1" style={{ fontFamily: 'var(--serif-display)' }}>
            ¿Qué quieres estudiar y dónde?
          </h1>
          <p className="text-secondary small mb-0">
            La guía, el simulacro de examen y el tutor se adaptan a tu elección. Puedes cambiarla cuando quieras.
          </p>

          <div className="row row-cols-1 row-cols-md-3 g-3 my-3" role="group" aria-label="Carreras disponibles">
            {CAREERS.map((c) => (
              <div className="col" key={c.id}>
                <button
                  type="button"
                  className="career-opt card h-100 w-100 text-start p-3"
                  aria-pressed={pick.career === c.id}
                  onClick={() => elegirCarrera(c.id)}
                >
                  <span className="small text-secondary">{c.icon} {c.area}</span>
                  <b>{c.name}</b>
                </button>
              </div>
            ))}
          </div>

          <div className="mb-3" style={{ maxWidth: '520px' }}>
            <label htmlFor="uniSelect" className="form-label">Universidad</label>
            <select
              id="uniSelect"
              className="form-select"
              disabled={!carrera}
              value={pick.uni || ''}
              onChange={elegirUni}
            >
              {carrera ? (
                <>
                  <option value="">Elige una universidad</option>
                  {carrera.unis.map((u) => (
                    <option key={u} value={u}>{UNIS[u]}</option>
                  ))}
                </>
              ) : (
                <option value="">Primero elige una carrera</option>
              )}
            </select>
          </div>

          {formato && (
            <div className="alert alert-warning small">
              Simulacro de referencia: {formato.n} preguntas en {formato.min} minutos. Verifica el formato oficial en la página de admisiones.
            </div>
          )}

          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-oxblood"
              type="button"
              disabled={!(carrera && pick.uni)}
              onClick={continuar}
            >
              Continuar a la guía de estudio
            </button>
            <Link className="btn btn-outline" to="/">Cerrar sesión</Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Seleccion