import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveJSON, loadJSON } from '../utils/storage'
import { login as apiLogin, register as apiRegister } from '../api'

function nuevaSuma() {
  return {
    a: 2 + Math.floor(Math.random() * 8),
    b: 2 + Math.floor(Math.random() * 8),
  }
}

function Login() {
  const navigate = useNavigate()
  const [modo, setModo] = useState('login') // 'login' | 'register'
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [nombre, setNombre] = useState('')
  const [suma, setSuma] = useState(nuevaSuma)
  const [respuesta, setRespuesta] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [animating, setAnimating] = useState(false)

  // Si ya hay sesión: ir al lobby si ya eligió carrera, si no a selección
  useEffect(() => {
    const session = loadJSON('lyl_session', null)
    if (session?.token && session?.user) {
      const sel = loadJSON('lyl_sel', null)
      navigate(sel?.career && sel?.uni ? '/inicio' : '/seleccion', { replace: true })
    }
  }, [navigate])

  function regenerar() {
    setSuma(nuevaSuma())
    setRespuesta('')
  }

  function limpiarError() {
    if (error) setError('')
  }

  function cambiarModo(nuevo) {
    if (nuevo === modo || animating) return
    setAnimating(true)
    setError('')
    setRespuesta('')
    regenerar()
    // Pequeña animación de salida/entrada
    window.setTimeout(() => {
      setModo(nuevo)
      setAnimating(false)
    }, 180)
  }

  async function enviar(e) {
    e.preventDefault()
    const user = usuario.trim()
    const pass = clave

    if (!user || !pass) {
      setError('Escribe tu usuario y tu contraseña.')
      return
    }

    if (modo === 'register' && pass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (parseInt(respuesta, 10) !== suma.a + suma.b) {
      setError('La verificación no coincide. Resuelve la nueva suma.')
      regenerar()
      return
    }

    setBusy(true)
    setError('')

    try {
      let data
      if (modo === 'register') {
        data = await apiRegister({
          username: user,
          password: pass,
          name: nombre.trim() || user,
        })
      } else {
        data = await apiLogin({ username: user, password: pass })
      }

      saveJSON('lyl_session', {
        token: data.token,
        user: data.user?.username || user,
        name: data.user?.name || user,
        id: data.user?.id,
      })

      // Si ya tenía carrera elegida → lobby; si no → selección
      const sel = loadJSON('lyl_sel', null)
      navigate(sel?.career && sel?.uni ? '/inicio' : '/seleccion')
    } catch (err) {
      const msg =
        err?.message ||
        (err?.status === 409
          ? 'Ese usuario ya existe. Prueba con otro o inicia sesión.'
          : err?.status === 401
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo conectar con el servidor. ¿Está corriendo el backend?')
      setError(msg)
      regenerar()
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="card w-100" style={{ maxWidth: '440px' }}>
        <div className="card-body p-4 p-md-5">
          <p className="eyebrow mb-1">LGS · Luz Guía Superior</p>
          <h1 className="h3 mb-1" style={{ fontFamily: 'var(--serif-display)' }}>
            {modo === 'login' ? 'Ingresa a tu cuenta' : 'Crea tu cuenta'}
          </h1>
          <p className="text-secondary small mb-4">
            {modo === 'login'
              ? 'Después continuarás con tu carrera y universidad guardadas, o las elegirás si es la primera vez.'
              : 'Regístrate para guardar tu progreso y usar el tutor con tu cuenta.'}
          </p>

          <div
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(6px)' : 'translateY(0)',
              transition: 'opacity 0.18s ease, transform 0.18s ease',
            }}
          >
            <form id="loginForm" noValidate onSubmit={enviar}>
              {modo === 'register' && (
                <div className="mb-3">
                  <label htmlFor="loginName" className="form-label">
                    Nombre (opcional)
                  </label>
                  <input
                    id="loginName"
                    className="form-control"
                    type="text"
                    autoComplete="name"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value)
                      limpiarError()
                    }}
                    disabled={busy}
                  />
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="loginUser" className="form-label">
                  Usuario
                </label>
                <input
                  id="loginUser"
                  className="form-control"
                  type="text"
                  autoComplete="username"
                  required
                  minLength={3}
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value)
                    limpiarError()
                  }}
                  disabled={busy}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="loginPass" className="form-label">
                  Contraseña
                </label>
                <input
                  id="loginPass"
                  className="form-control"
                  type="password"
                  autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  value={clave}
                  onChange={(e) => {
                    setClave(e.target.value)
                    limpiarError()
                  }}
                  disabled={busy}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="capA" className="form-label">
                  Verificación: resuelve <b>
                    {suma.a} + {suma.b}
                  </b>
                </label>
                <div className="input-group">
                  <input
                    id="capA"
                    className="form-control"
                    type="text"
                    inputMode="numeric"
                    value={respuesta}
                    onChange={(e) => setRespuesta(e.target.value)}
                    disabled={busy}
                  />
                  <button
                    className="btn btn-outline"
                    type="button"
                    aria-label="Nueva suma"
                    onClick={regenerar}
                    disabled={busy}
                  >
                    ↻
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {error}
                </div>
              )}

              <button className="btn btn-oxblood w-100" type="submit" disabled={busy}>
                {busy
                  ? modo === 'login'
                    ? 'Entrando…'
                    : 'Creando cuenta…'
                  : modo === 'login'
                    ? 'Ingresar'
                    : 'Crear cuenta'}
              </button>
            </form>
          </div>

          <p className="text-secondary small mt-4 mb-0 text-center">
            {modo === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 align-baseline"
                  onClick={() => cambiarModo('register')}
                  disabled={busy || animating}
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 align-baseline"
                  onClick={() => cambiarModo('login')}
                  disabled={busy || animating}
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  )
}

export default Login