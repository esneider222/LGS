import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { loadJSON, saveJSON } from '../utils/storage'
import { CAREERS, UNIS } from '../data/catalogo'

const PANELES = [
  { ruta: '/inicio', icono: '🏛', texto: 'Inicio' },
  { ruta: '/guia', icono: '📖', texto: 'Guía de estudio' },
  { ruta: '/examen', icono: '📝', texto: 'Examen de ingreso' },
  { ruta: '/chat', icono: '💬', texto: 'Tutor IA' },
  { ruta: '/practica', icono: '✍️', texto: 'Práctica' },
  { ruta: '/juegos', icono: '🎲', texto: 'Juegos' },
  { ruta: '/material', icono: '📄', texto: 'Mi material' },
  { ruta: '/recursos', icono: '🔗', texto: 'Recursos' },
]

const TEMAS = [
  { valor: 'auto', texto: 'Auto' },
  { valor: 'light', texto: 'Claro' },
  { valor: 'dark', texto: 'Oscuro' },
]

function aplicarTema(modo) {
  const html = document.documentElement
  if (modo === 'auto') html.removeAttribute('data-theme')
  else html.setAttribute('data-theme', modo)
  const oscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  html.setAttribute('data-bs-theme', modo === 'auto' ? (oscuro ? 'dark' : 'light') : modo)
}

function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [session] = useState(() => loadJSON('lyl_session', null))
  const [sel] = useState(() => loadJSON('lyl_sel', null))
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [tema, setTema] = useState(() => loadJSON('lyl_theme', 'auto'))

  const carrera = sel ? CAREERS.find((c) => c.id === sel.career) : null

  // Aplica y guarda el tema (claro / oscuro / automático).
  useEffect(() => {
    aplicarTema(tema)
    saveJSON('lyl_theme', tema)
  }, [tema])

  // Título de la pestaña según la carrera elegida.
  useEffect(() => {
    if (carrera) document.title = 'LGS — ' + carrera.name
  }, [carrera])

  // Sin sesión o sin carrera elegida, no se puede entrar al panel.
  if (!session) return <Navigate to="/" replace />
  if (!carrera) return <Navigate to="/seleccion" replace />

  function irA(ruta) {
    setMenuAbierto(false)
    window.scrollTo(0, 0)
    navigate(ruta)
  }

  return (
    <div id="app">
      <div className={'overlay' + (menuAbierto ? ' show' : '')} onClick={() => setMenuAbierto(false)}></div>

      <aside className={'sidebar' + (menuAbierto ? ' open' : '')} id="sidebar">
        <div className="brand">
          <span className="brand-mark">🧭</span>
          <div className="brand-title">LGS</div>
          <div className="brand-sub fw-semibold">Luz Guía Superior</div>
          <div className="brand-sub">{carrera.name} · {UNIS[sel.uni]}</div>
        </div>

        <ul className="navlist">
          {PANELES.map((p) => (
            <li key={p.ruta}>
              <button
                className={'navlink' + (pathname === p.ruta ? ' active' : '')}
                onClick={() => irA(p.ruta)}
              >
                <span className="ic">{p.icono}</span> {p.texto}
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-foot">
          <p style={{ margin: '0 0 10px' }}>
            <Link to="/seleccion">Cambiar carrera o universidad</Link>
            <br />
            <Link to="/">Cerrar sesión</Link>
          </p>
          <div className="theme-toggle">
            {TEMAS.map((t) => (
              <button
                key={t.valor}
                className={'theme-btn' + (tema === t.valor ? ' active' : '')}
                onClick={() => setTema(t.valor)}
              >
                {t.texto}
              </button>
            ))}
          </div>
          Tu progreso se guarda solo en este dispositivo.
        </div>
      </aside>

      <main>
        <div className="mobile-topbar">
          <button className="menu-btn" aria-label="Abrir menú" onClick={() => setMenuAbierto(true)}>☰</button>
          <div className="brand-title">🧭 LGS</div>
          <span style={{ width: '38px' }}></span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout