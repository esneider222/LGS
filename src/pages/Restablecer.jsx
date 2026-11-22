import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveJSON, loadJSON } from '../utils/storage'
import { resetPassword as apiReset } from '../api'

function isStrongPassword(pass) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass)
}

function Restablecer() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Enlace inválido. Solicita uno nuevo desde la pantalla de inicio de sesión.')
      return
    }
    if (!isStrongPassword(password)) {
      setError('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setBusy(true)
    try {
      const data = await apiReset({ token, password })
      setSuccess(data.message || 'Contraseña actualizada.')

      // Iniciar sesión automáticamente
      if (data.token && data.user) {
        saveJSON('lyl_session', {
          token: data.token,
          user: data.user.username,
          name: data.user.name,
          email: data.user.email,
          id: data.user.id,
        })
        const sel = loadJSON('lyl_sel', null)
        setTimeout(() => {
          navigate(sel?.career && sel?.uni ? '/inicio' : '/seleccion', { replace: true })
        }, 1200)
      }
    } catch (err) {
      setError(err?.message || 'No se pudo restablecer la contraseña.')
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
            Nueva contraseña
          </h1>
          <p className="text-secondary small mb-4">
            Elige una contraseña segura para tu cuenta.
          </p>

          <form noValidate onSubmit={enviar}>
            <div className="mb-3">
              <label htmlFor="newPass" className="form-label">
                Nueva contraseña
              </label>
              <input
                id="newPass"
                className="form-control"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                required
              />
              <div className="form-text">
                Mínimo 8 caracteres, una mayúscula, una minúscula y un número.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPass" className="form-label">
                Confirmar contraseña
              </label>
              <input
                id="confirmPass"
                className="form-control"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={busy}
                required
              />
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

            <button className="btn btn-oxblood w-100" type="submit" disabled={busy || !token}>
              {busy ? 'Guardando…' : 'Guardar nueva contraseña'}
            </button>
          </form>

          <p className="text-secondary small mt-4 mb-0 text-center">
            <button
              type="button"
              className="btn btn-link btn-sm p-0 align-baseline"
              onClick={() => navigate('/')}
              disabled={busy}
            >
              ← Volver al inicio de sesión
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}

export default Restablecer
