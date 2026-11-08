import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrera } from '../hooks/useCarrera'
import { LEVELS } from '../data/catalogo'
import Rich from '../components/Rich'

function Guia() {
    const navigate = useNavigate()
    const {
        studied, levelMods, levelDone, levelUnlocked, examUnlocked,
        setStudied, activarDemo,
    } = useCarrera()

    const [nivelElegido, setNivelElegido] = useState('basico')
    const [filtro, setFiltro] = useState('all')
    const [abiertas, setAbiertas] = useState({})
    const [aviso, setAviso] = useState('')

    // Si el nivel elegido quedó bloqueado, se vuelve al básico.
    const nivel = levelUnlocked(nivelElegido) ? nivelElegido : 'basico'
    const delNivel = levelMods(nivel)
    const visibles = filtro === 'all' ? delNivel : delNivel.filter((m) => m.id === filtro)

    function elegirNivel(id) {
        if (!levelUnlocked(id)) {
            setAviso('Completa el nivel anterior para desbloquear este.')
            return
        }
        setAviso('')
        setNivelElegido(id)
        setFiltro('all')
    }

    function marcar(modulo, valor) {
        const eraCompleto = levelDone(modulo.level)
        const ahoraCompleto = levelMods(modulo.level).every((m) => (m.id === modulo.id ? valor : studied[m.id]))
        setStudied(modulo.id, valor)
        if (!eraCompleto && ahoraCompleto) {
            const todo = LEVELS.every((l) => (l.id === modulo.level ? ahoraCompleto : levelDone(l.id)))
            setAviso(todo
                ? 'Guía completa: ya puedes presentar el simulacro de ingreso.'
                : '¡Nivel completado! Se desbloqueó el siguiente.')
        } else {
            setAviso('')
        }
    }

    function alternarSolucionario(id) {
        setAbiertas({ ...abiertas, [id]: !abiertas[id] })
    }

    function preguntarAlTutor(modulo) {
        navigate('/chat', { state: { moduloId: modulo.id } })
    }

    function desbloquearTodo() {
        activarDemo()
        setAviso('Modo demostración: niveles y simulacro desbloqueados.')
    }

    return (
        <section className="panel active">
            <div className="section-head">
                <p className="eyebrow">GUÍA DE ESTUDIO</p>
                <h1>Guía por niveles</h1>
                <p>Avanza de nivel en nivel: el siguiente se desbloquea cuando marcas como estudiados todos los módulos del anterior.</p>
            </div>

            {aviso && <div className="alert alert-warning small" role="status">{aviso}</div>}

            <div className="row g-3 mb-4">
                {LEVELS.map((l) => {
                    const ms = levelMods(l.id)
                    const hechos = ms.filter((m) => studied[m.id]).length
                    const bloqueado = !levelUnlocked(l.id)
                    return (
                        <div className="col-md-4" key={l.id}>
                            <button
                                type="button"
                                className={'level-card w-100' + (l.id === nivel ? ' active' : '') + (bloqueado ? ' locked' : '')}
                                aria-disabled={bloqueado ? 'true' : undefined}
                                onClick={() => elegirNivel(l.id)}
                            >
                                <b>{bloqueado ? '🔒 ' : ''}{l.name}</b>
                                <small>
                                    {hechos} de {ms.length} módulos{bloqueado ? ' · completa el nivel anterior' : ''}
                                </small>
                                <div className="progress mt-2" style={{ height: '6px' }} role="progressbar">
                                    <div className="progress-bar" style={{ width: (ms.length ? (hechos / ms.length) * 100 : 0) + '%' }}></div>
                                </div>
                            </button>
                        </div>
                    )
                })}
            </div>

            <div className="module-nav">
                <button className={'mtab' + (filtro === 'all' ? ' active' : '')} onClick={() => setFiltro('all')}>
                    Todo el nivel
                </button>
                {delNivel.map((m) => (
                    <button
                        key={m.id}
                        className={'mtab' + (filtro === m.id ? ' active' : '')}
                        onClick={() => setFiltro(m.id)}
                    >
                        {m.icon} {m.title}
                    </button>
                ))}
            </div>

            <div>
                {visibles.map((m) => (
                    <div className="module card" id={'mod-' + m.id} key={m.id}>
                        <div className="module-head">
                            <h2>{m.icon} {m.title}</h2>
                            <span className="module-area">{m.area}</span>
                            <button className="btn btn-outline btn-sm" type="button" onClick={() => preguntarAlTutor(m)}>
                                💬 Preguntar al tutor
                            </button>
                        </div>
                        <p className="module-intro"><Rich texto={m.intro} /></p>
                        {m.concepts.map((c) => (
                            <div className="concept" key={c.h}>
                                <h3>{c.h}</h3>
                                <p><Rich texto={c.p} /></p>
                            </div>
                        ))}
                        <div className="taller">
                            <h4>Taller práctico</h4>
                            <ol>
                                {m.taller.q.map((q) => (
                                    <li key={q}><Rich texto={q} /></li>
                                ))}
                            </ol>
                            <button
                                className="btn btn-outline btn-sm reveal-btn"
                                type="button"
                                onClick={() => alternarSolucionario(m.id)}
                            >
                                {abiertas[m.id] ? 'Ocultar solucionario' : 'Ver solucionario'}
                            </button>
                            <div className={'answer-box' + (abiertas[m.id] ? ' show' : '')}>
                                <b>Solucionario:</b> <Rich texto={m.taller.a} />
                            </div>
                        </div>
                        <label
                            className="mark-studied"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink-soft)' }}
                        >
                            <input
                                type="checkbox"
                                checked={Boolean(studied[m.id])}
                                onChange={(e) => marcar(m, e.target.checked)}
                            />{' '}
                            Marcar módulo como estudiado
                        </label>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '22px' }}>
                {examUnlocked ? (
                    <Link className="btn btn-oxblood" to="/examen">Ir al simulacro de ingreso</Link>
                ) : (
                    <>
                        <p className="alert alert-warning note">Completa los tres niveles para desbloquear el simulacro de ingreso.</p>
                        <button className="btn btn-outline btn-sm" type="button" onClick={desbloquearTodo}>
                            Desbloquear todo (modo demostración)
                        </button>
                    </>
                )}
            </div>
        </section>
    )
}

export default Guia