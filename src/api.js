const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '')

function getToken() {
  try {
    const session = JSON.parse(localStorage.getItem('lyl_session') || 'null')
    return session?.token || null
  } catch {
    return null
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  let data
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { error: text || 'Respuesta inválida del servidor' }
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `Error ${res.status}`
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

// ── Auth ──────────────────────────────────────────────
export async function register({ username, password, name }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, name }),
  })
}

export async function login({ username, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function me() {
  return request('/api/auth/me')
}

// ── Progress ──────────────────────────────────────────
export async function getProgress() {
  return request('/api/progress')
}

export async function updateProgress(payload) {
  return request('/api/progress', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// ── Chat ──────────────────────────────────────────────
export async function getChat() {
  return request('/api/chat')
}

export async function saveChat(messages) {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  })
}

export async function clearChat() {
  return request('/api/chat', { method: 'DELETE' })
}

// ── Health ────────────────────────────────────────────
export async function health() {
  return request('/api/health')
}

export { API_URL, getToken }