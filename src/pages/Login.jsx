import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveJSON, loadJSON } from '../utils/storage'
import {
  login as apiLogin,
  register as apiRegister,
  forgotPassword as apiForgot,
} from '../api'

function nuevaSuma() {
  return {
    a: 2 + Math.floor(Math.random() * 8),
    b: 2 + Math.floor(Math.random() * 8),
  }
}

function isStrongPassword(pass) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass)
}

function Login() {
  const navigate = useNavigate()
  const [modo, setModo] = useState('login') // 'login' | 'register' | 'forgot'
  const [usuario, setUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [nombre, setNombre] = useState('')
  const [suma, setSuma] = useState(nuevaSuma)
  const [respuesta, setRespuesta] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  const [animating, setAnimating] = useState(false)

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

  function cambiarModo(nuevo) {
    if (nuevo === modo || animating) return
    setAnimating(true)
    setError('')
    setSuccess('')
    setRespuesta('')
    regenerar()
    window.setTimeout(() => {
      setModo(nuevo)
      setAnimating(false)
    }, 180)
  }

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    // ——— Recuperar contraseña ———
    if (modo === 'forgot') {
      const mail = email.trim().toLowerCase()
      if (!mail) {
        setError('Escribe tu email.')
        return
      }
      if (parseInt(respuesta, 10) !== suma.a + suma.b) {
        setError('La verificación no coincide. Resuelve la nueva suma.')
        regenerar()
        return
      }
      setBusy(true)
      try {
        const data = await apiForgot({ email: mail })
        setSuccess(data.message || 'Si el email está registrado, recibirás un enlace.')
        setEmail('')
        regenerar()
      } catch (err) {
        setError(err?.message || 'No se pudo enviar la solicitud.')
        regenerar()
      } finally {
        setBusy(false)
      }
      return
    }

    // ——— Login / Register ———
    const user = usuario.trim()
    const pass = clave
    const mail = email.trim().toLowerCase()

    if (!user || !pass) {
      setError('Escribe tu usuario y tu contraseña.')
      return
    }

    if (modo === 'register') {
      if (!mail) {
        setError('El email es obligatorio.')
        return
      }
      if (!isStrongPassword(pass)) {
        setError('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.')
        return
      }
    }

    if (parseInt(respuesta, 10) !== suma.a + suma.b) {
      setError('La verificación no coincide. Resuelve la nueva suma.')
      regenerar()
      return
    }

    setBusy(true)

    try {
      let data
      if (modo === 'register') {
        data = await apiRegister({
          username: user,
          email: mail,
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
        email: data.user?.email || mail,
        id: data.user?.id,
      })

      const sel = loadJSON('lyl_sel', null)
      navigate(sel?.career && sel?.uni ? '/inicio' : '/seleccion')
    } catch (err) {
      const msg =
        err?.message ||
        (err?.status === 409
          ? 'Ese usuario o email ya existe.'
          : err?.status === 401
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo conectar con el servidor.')
      setError(msg)
      regenerar()
    } finally {
      setBusy(false)
    }
  }

  const titulo =
    modo === 'login'
      ? 'Ingresa a tu cuenta'
      : modo === 'register'
        ? 'Crea tu cuenta'
        : 'Recuperar contraseña'

  const subtitulo =
    modo === 'login'
      ? 'Ingresa con tu usuario (o email) y contraseña.'
      : modo === 'register'
        ? 'Regístrate para guardar tu progreso y usar el tutor.'
        : 'Te enviaremos un enlace para restablecer tu contraseña.'

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="card w-100" style={{ maxWidth: '440px' }}>
        <div className="card-body p-4 p-md-5">
          <p className="eyebrow mb-1">LGS · Luz Guía Superior</p>
          <h1 className="h3 mb-1" style={{ fontFamily: 'var(--serif-display)' }}>
            {titulo}
          </h1>
          <p className="text-secondary small mb-4">{subtitulo}</p>

          <div
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(6px)' : 'translateY(0)',
              transition: 'opacity 0.18s ease, transform 0.18s ease',
            }}
          >
            <form noValidate onSubmit={enviar}>
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
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={busy}
                  />
                </div>
              )}

              {(modo === 'login' || modo === 'register') && (
                <div className="mb-3">
                  <label htmlFor="loginUser" className="form-label">
                    Usuario
                  </label>
                  <input
                    id="loginUser"
                    className="form-control"
                    type="text"
                    autoComplete="username"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    disabled={busy}
                    required
                  />
                </div>
              )}

              {(modo === 'register' || modo === 'forgot') && (
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">
                    Email
                  </label>
                  <input
                    id="loginEmail"
                    className="form-control"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={busy}
                    required
                  />
                </div>
              )}

              {(modo === 'login' || modo === 'register') && (
                <div className="mb-3">
                  <label htmlFor="loginPass" className="form-label">
                    Contraseña
                  </label>
                  <input
                    id="loginPass"
                    className="form-control"
                    type="password"
                    autoComplete={modo === 'register' ? 'new-password' : 'current-password'}
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    disabled={busy}
                    required
                  />
                  {modo === 'register' && (
                    <div className="form-text">
                      Mínimo 8 caracteres, una mayúscula, una minúscula y un número.
                    </div>
                  )}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="capA" className="form-label">
                  Verificación: resuelve{' '}
                  <b>
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
              {success && (
                <div className="alert alert-success py-2 small" role="alert">
                  {success}
                </div>
              )}

              <button className="btn btn-oxblood w-100" type="submit" disabled={busy}>
                {busy
                  ? modo === 'login'
                    ? 'Entrando…'
                    : modo === 'register'
                      ? 'Creando cuenta…'
                      : 'Enviando…'
                  : modo === 'login'
                    ? 'Ingresar'
                    : modo === 'register'
                      ? 'Crear cuenta'
                      : 'Enviar enlace'}
              </button>
            </form>
          </div>

          <div className="text-secondary small mt-4 mb-0 text-center">
            {modo === 'login' && (
              <>
                <p className="mb-2">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 align-baseline"
                    onClick={() => cambiarModo('forgot')}
                    disabled={busy || animating}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </p>
                <p className="mb-0">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 align-baseline"
                    onClick={() => cambiarModo('register')}
                    disabled={busy || animating}
                  >
                    Regístrate
                  </button>
                </p>
              </>
            )}
            {modo === 'register' && (
              <p className="mb-0">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 align-baseline"
                  onClick={() => cambiarModo('login')}
                  disabled={busy || animating}
                >
                  Inicia sesión
                </button>
              </p>
            )}
            {modo === 'forgot' && (
              <p className="mb-0">
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 align-baseline"
                  onClick={() => cambiarModo('login')}
                  disabled={busy || animating}
                >
                  ← Volver a iniciar sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
