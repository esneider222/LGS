import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveJSON } from '../utils/storage'

function nuevaSuma() {
  return {
    a: 2 + Math.floor(Math.random() * 8),
    b: 2 + Math.floor(Math.random() * 8),
  }
}

function Login() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [suma, setSuma] = useState(nuevaSuma)
  const [respuesta, setRespuesta] = useState('')
  const [error, setError] = useState('')

  // Al entrar al login se cierra cualquier sesión anterior.
  useEffect(() => {
    saveJSON('lyl_session', null)
  }, [])

  function regenerar() {
    setSuma(nuevaSuma())
    setRespuesta('')
  }

  function enviar(e) {
    e.preventDefault()
    const user = usuario.trim()
    if (!user || !clave) {
      setError('Escribe tu usuario y tu contraseña.')
      return
    }
    if (parseInt(respuesta, 10) !== suma.a + suma.b) {
      setError('La verificación no coincide. Resuelve la nueva suma.')
      regenerar()
      return
    }
    saveJSON('lyl_session', { user })
    navigate('/seleccion')
  }

  return (
    <main className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="card w-100" style={{ maxWidth: '440px' }}>
        <div className="card-body p-4 p-md-5">
          <p className="eyebrow mb-1">LGS · Luz Guía Superior</p>
          <h1 className="h3 mb-1" style={{ fontFamily: 'var(--serif-display)' }}>Ingresa a tu cuenta</h1>
          <p className="text-secondary small mb-4">
            Después elegirás la carrera y la universidad para las que quieres prepararte.
          </p>
          <form id="loginForm" noValidate onSubmit={enviar}>
            <div className="mb-3">
              <label htmlFor="loginUser" className="form-label">Usuario</label>
              <input
                id="loginUser"
                className="form-control"
                type="text"
                autoComplete="username"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPass" className="form-label">Contraseña</label>
              <input
                id="loginPass"
                className="form-control"
                type="password"
                autoComplete="current-password"
                required
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="capA" className="form-label">
                Verificación: resuelve <b>{suma.a} + {suma.b}</b>
              </label>
              <div className="input-group">
                <input
                  id="capA"
                  className="form-control"
                  type="text"
                  inputMode="numeric"
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                />
                <button className="btn btn-outline" type="button" aria-label="Nueva suma" onClick={regenerar}>
                  ↻
                </button>
              </div>
            </div>
            {error && (
              <div className="alert alert-danger py-2 small" role="alert">{error}</div>
            )}
            <button className="btn btn-oxblood w-100" type="submit">Ingresar</button>
          </form>
          <div className="alert alert-warning small mt-4 mb-0">
            Prototipo: aún no hay cuentas reales, así que cualquier usuario y contraseña permiten continuar.
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login