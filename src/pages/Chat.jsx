import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { loadJSON, saveJSON } from '../utils/storage'
import { useCarrera } from '../hooks/useCarrera'
import { LENGUA_MODULES, EXTRA_MODULES } from '../data/contenido'

// URL del Worker desde .env.local (no hardcodeada en el repo)
const WORKER_URL = (import.meta.env.VITE_TUTOR_URL || '').replace(/\/+$/, '')
const TUTOR_ENDPOINT = WORKER_URL ? WORKER_URL + '/' : ''

const CHAT_KEY = 'lyl_chat_v2'
const MODE_KEY = 'lyl_chat_mode'
const CHAT_MAX_STORED = 40

const MODES = {
  explicar: { label: '💡 Explicar', ph: 'Escribe tu pregunta sobre la carrera…' },
  examinar: { label: '🎯 Examinarme', ph: '¿Sobre qué tema quieres que te examine?' },
  corregir: { label: '✍️ Corregir texto', ph: 'Pega aquí el texto que quieres que corrija…' },
  plan: { label: '🗓 Plan de estudio', ph: 'Cuéntame tu meta y cuánto tiempo tienes…' },
  ingles: { label: '🌐 Inglés', ph: 'Write or ask in English (or Spanish)…' },
}

const DEFAULT_SUGGESTIONS = [
  '¿Cuál es la diferencia entre fonética y fonología?',
  'Explícame los actos de habla con un ejemplo cotidiano',
  '¿Qué es la hipótesis del input comprensible?',
  'Dame 3 autores clave del Boom latinoamericano',
  '¿Cómo estudio para un examen de morfosintaxis en una semana?',
]

const CONTEXT_SUGGESTIONS = [
  'Resúmeme este módulo en 5 ideas clave',
  'Ponme 3 preguntas de práctica sobre este módulo',
  '¿Qué errores comunes cometen los estudiantes con este tema?',
  'Explícamelo con un ejemplo cotidiano',
]

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineMd(s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function isTableSep(l) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.indexOf('-') > -1
}

function splitRow(l) {
  return l
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

function mdToHtml(src) {
  const lines = String(src || '').replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0
  let para = []

  const flushPara = () => {
    if (!para.length) return
    out.push('<p>' + inlineMd(escapeHtml(para.join(' '))) + '</p>')
    para = []
  }

  while (i < lines.length) {
    const line = lines[i]
    const t = line.trim()

    if (!t) {
      flushPara()
      i++
      continue
    }

    if (/^```/.test(t)) {
      flushPara()
      const code = []
      i++
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        code.push(lines[i])
        i++
      }
      i++
      out.push('<pre><code>' + escapeHtml(code.join('\n')) + '</code></pre>')
      continue
    }

    const hm = t.match(/^(#{1,3})\s+(.+)$/)
    if (hm) {
      flushPara()
      const level = hm[1].length
      out.push(`<h${level + 2}>` + inlineMd(escapeHtml(hm[2])) + `</h${level + 2}>`)
      i++
      continue
    }

    if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) {
      flushPara()
      const ordered = /^\d+\.\s+/.test(t)
      const items = []
      while (i < lines.length) {
        const lt = lines[i].trim()
        if (!lt) break
        if (ordered && !/^\d+\.\s+/.test(lt)) break
        if (!ordered && !/^[-*]\s+/.test(lt)) break
        items.push(lt.replace(/^([-*]|\d+\.)\s+/, ''))
        i++
      }
      const tag = ordered ? 'ol' : 'ul'
      out.push(
        `<${tag}>` +
          items.map((it) => '<li>' + inlineMd(escapeHtml(it)) + '</li>').join('') +
          `</${tag}>`
      )
      continue
    }

    if (t.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      flushPara()
      const headers = splitRow(t)
      i += 2
      const rows = []
      while (i < lines.length && lines[i].includes('|') && !isTableSep(lines[i])) {
        rows.push(splitRow(lines[i]))
        i++
      }
      out.push(
        '<table><thead><tr>' +
          headers.map((h) => '<th>' + inlineMd(escapeHtml(h)) + '</th>').join('') +
          '</tr></thead><tbody>' +
          rows
            .map(
              (r) =>
                '<tr>' +
                r.map((c) => '<td>' + inlineMd(escapeHtml(c)) + '</td>').join('') +
                '</tr>'
            )
            .join('') +
          '</tbody></table>'
      )
      continue
    }

    para.push(t)
    i++
  }
  flushPara()
  return out.join('') || '<p></p>'
}

function sanitizeStored(arr) {
  if (!Array.isArray(arr)) return []
  return arr
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim()
    )
    .slice(-CHAT_MAX_STORED)
}

function moduloContext(moduloId, carreraId) {
  if (!moduloId) return null
  let mods = []
  if (carreraId === 'lengua') mods = LENGUA_MODULES
  else if (EXTRA_MODULES[carreraId]) mods = EXTRA_MODULES[carreraId]
  const m = mods.find((x) => x.id === moduloId)
  if (!m) return null
  const text = [
    `Módulo: ${m.title}`,
    m.intro || '',
    ...(m.concepts || []).map((c) => `${c.h}: ${String(c.p).replace(/<[^>]+>/g, '')}`),
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 2500)
  return { id: m.id, title: m.title, text }
}

export default function Chat() {
  const location = useLocation()
  const { sel } = useCarrera()
  const logRef = useRef(null)
  const abortRef = useRef(null)
  const inputRef = useRef(null)

  const [history, setHistory] = useState(() => sanitizeStored(loadJSON(CHAT_KEY, [])))
  const [mode, setMode] = useState(() => {
    const m = loadJSON(MODE_KEY, 'explicar')
    return MODES[m] ? m : 'explicar'
  })
  const [context, setContext] = useState(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState({ kind: 'unknown', msg: 'Comprobando tutor…' })
  const [streamText, setStreamText] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showChips, setShowChips] = useState(() => sanitizeStored(loadJSON(CHAT_KEY, [])).length === 0)

  const applyLocationState = useCallback(
    (st) => {
      if (!st) return

      if (st.moduloId) {
        const ctx = moduloContext(st.moduloId, sel?.career)
        if (ctx) {
          setContext(ctx)
          setMode('explicar')
          saveJSON(MODE_KEY, 'explicar')
        }
      }

      if (st.borrador) {
        const { titulo, consigna, texto } = st.borrador
        const msg =
          `Ejercicio: «${titulo}»` +
          (consigna ? `\nConsigna: ${consigna}` : '') +
          `\n\nMi texto:\n"""\n${texto}\n"""`
        setMode('corregir')
        saveJSON(MODE_KEY, 'corregir')
        setInput(msg)
        setShowChips(false)
      }

      window.history.replaceState({}, '')
    },
    [sel?.career]
  )

  useEffect(() => {
    const st = location.state
    if (!st) return
    const id = window.setTimeout(() => {
      applyLocationState(st)
    }, 0)
    return () => window.clearTimeout(id)
  }, [location.state, applyLocationState])

  useEffect(() => {
    saveJSON(CHAT_KEY, history.slice(-CHAT_MAX_STORED))
  }, [history])

  useEffect(() => {
    saveJSON(MODE_KEY, mode)
  }, [mode])

  const scrollBottom = useCallback((force) => {
    const el = logRef.current
    if (!el) return
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 90
    if (force || near) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    scrollBottom(true)
  }, [history, streamText, errorMsg, scrollBottom])

  const checkTutorStatus = useCallback(async () => {
    if (!TUTOR_ENDPOINT) {
      setStatus({ kind: 'err', msg: 'Falta configurar VITE_TUTOR_URL en .env.local' })
      return
    }
    try {
      const r = await fetch(TUTOR_ENDPOINT, { method: 'GET' })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      const data = await r.json()
      if (data && data.ok) {
        setStatus({ kind: 'ok', msg: 'Tutor conectado · Gemini' })
      } else {
        setStatus({ kind: 'warn', msg: 'Tutor responde, pero no está configurado del todo' })
      }
    } catch {
      setStatus({ kind: 'err', msg: 'No se pudo contactar al tutor (red o CORS)' })
    }
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      void checkTutorStatus()
    }, 0)
    return () => window.clearTimeout(id)
  }, [checkTutorStatus])

  async function readSSE(resp, onEvent) {
    const reader = resp.body.getReader()
    const dec = new TextDecoder()
    let buf = ''
    const flush = (chunk) => {
      buf += chunk
      const parts = buf.split('\n\n')
      buf = parts.pop() || ''
      for (const block of parts) {
        const lines = block.split('\n')
        let data = ''
        for (const line of lines) {
          if (line.startsWith('data:')) data += line.slice(5).trim()
        }
        if (!data || data === '[DONE]') continue
        try {
          onEvent(JSON.parse(data))
        } catch {
          //
        }
      }
    }
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      flush(dec.decode(value, { stream: true }))
    }
    if (buf.trim()) flush('\n\n')
  }

  async function streamOnce(payload, signal, onText) {
    const resp = await fetch(TUTOR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })
    const ctype = resp.headers.get('content-type') || ''
    if (!resp.ok) {
      let msg = 'Error del tutor (' + resp.status + ')'
      try {
        const j = await resp.json()
        if (j && j.error) msg = j.error
      } catch {
        /* */
      }
      throw new Error(msg)
    }
    if (ctype.includes('text/event-stream')) {
      let truncated = false
      await readSSE(resp, (ev) => {
        if (ev.t) onText(ev.t)
        if (ev.done) truncated = !!ev.truncated
        if (ev.error) throw new Error(ev.error)
      })
      return { truncated }
    }
    const data = await resp.json()
    if (data.reply) onText(data.reply)
    return { truncated: !!data.truncated }
  }

  async function requestTutor(turns, signal, onText) {
    const payload = {
      messages: turns,
      mode,
      stream: true,
    }
    if (sel) {
      payload.career = sel.career
      payload.university = sel.uni
    }
    if (context) payload.context = context.text

    let got = false
    const meta = await streamOnce(payload, signal, (t) => {
      got = true
      onText(t)
    })
    if (!got) throw new Error('El tutor no devolvió texto.')
    return meta
  }

  async function sendChat(text, opts = {}) {
    const cleaned = String(text || '').trim()
    if (!cleaned || busy) return

    if (!TUTOR_ENDPOINT) {
      setErrorMsg('Falta configurar VITE_TUTOR_URL en .env.local')
      setStatus({ kind: 'err', msg: 'Falta VITE_TUTOR_URL en .env.local' })
      return
    }

    setShowChips(false)
    setErrorMsg('')
    setStreamText('')
    setBusy(true)

    const turns = [...history, { role: 'user', content: cleaned }].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    setHistory((h) => [...h, { role: 'user', content: cleaned }])
    if (!opts.keepInput) setInput('')

    abortRef.current = new AbortController()
    let acc = ''

    try {
      const meta = await requestTutor(turns, abortRef.current.signal, (delta) => {
        acc += delta
        setStreamText(acc)
      })
      setHistory((h) => [...h, { role: 'assistant', content: acc }])
      setStreamText('')
      if (status.kind !== 'ok') setStatus({ kind: 'ok', msg: 'Tutor conectado · Gemini' })
      if (meta.truncated) {
        /* opcional */
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        if (acc) {
          setHistory((h) => [...h, { role: 'assistant', content: acc }])
          setStreamText('')
        } else {
          setHistory((h) => h.slice(0, -1))
          setInput(cleaned)
        }
      } else {
        const msg = err?.message || 'Error desconocido.'
        if (acc) {
          setHistory((h) => [...h, { role: 'assistant', content: acc }])
          setStreamText('')
        } else {
          setHistory((h) => h.slice(0, -1))
          setErrorMsg(msg)
          setInput(cleaned)
        }
        setStatus({ kind: 'err', msg: msg.length > 70 ? msg.slice(0, 67) + '…' : msg })
      }
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  function regenerate() {
    if (busy || history.length < 2) return
    const n = history.length
    if (history[n - 2].role !== 'user' || history[n - 1].role !== 'assistant') return
    const text = history[n - 2].content
    setHistory((h) => h.slice(0, -2))
    sendChat(text)
  }

  function clearChat() {
    if (busy) return
    if (!window.confirm('¿Borrar todo el historial del tutor?')) return
    setHistory([])
    setStreamText('')
    setErrorMsg('')
    setShowChips(true)
    saveJSON(CHAT_KEY, [])
  }

  async function exportChat() {
    const lines = history.map((m) => (m.role === 'user' ? 'Tú: ' : 'Tutor: ') + m.content)
    const text = lines.join('\n\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lgs-tutor.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  function stop() {
    if (abortRef.current) abortRef.current.abort()
  }

  const suggestions = context ? CONTEXT_SUGGESTIONS : DEFAULT_SUGGESTIONS
  const placeholder =
    context && mode === 'explicar'
      ? `Pregunta lo que quieras sobre «${context.title}»…`
      : MODES[mode].ph

  return (
    <section className="panel active chat-panel">
      <div className="section-head" style={{ marginBottom: 12 }}>
        <p className="eyebrow">TUTOR IA</p>
        <h1>Pregunta, examínate o pide feedback</h1>
        <p className="small text-secondary mb-0">
          Respuestas vía Gemini. No inventa datos oficiales de admisión: verifícalos en la universidad.
        </p>
      </div>

      <div className="chat-shell card">
        <div className="chat-toolbar d-flex flex-wrap align-items-center gap-2">
          <div className="chat-modes d-flex flex-wrap gap-1" role="tablist">
            {Object.keys(MODES).map((k) => (
              <button
                key={k}
                type="button"
                className={'mode-chip' + (mode === k ? ' active' : '')}
                data-mode={k}
                onClick={() => setMode(k)}
                disabled={busy}
              >
                {MODES[k].label}
              </button>
            ))}
          </div>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <span
              className={
                'chat-dot ' +
                (status.kind === 'ok' ? 'ok' : status.kind === 'err' ? 'err' : status.kind === 'warn' ? 'warn' : '')
              }
              title={status.msg}
            />
            <span className="small text-secondary d-none d-md-inline">{status.msg}</span>
            <button type="button" className="btn btn-outline btn-sm" onClick={clearChat} disabled={busy}>
              Limpiar
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={exportChat} disabled={!history.length}>
              Exportar
            </button>
          </div>
        </div>

        {context && (
          <div className="chat-ctx">
            <span>
              Contexto: <b>{context.title}</b>
            </span>
            <button type="button" aria-label="Quitar contexto" onClick={() => setContext(null)}>
              ×
            </button>
          </div>
        )}

        <div className="chat-log" ref={logRef}>
          {history.length === 0 && !streamText && !errorMsg && (
            <div className="msg bot">
              <div
                className="msg-body"
                dangerouslySetInnerHTML={{
                  __html: mdToHtml(
                    'Soy el tutor de **LGS**. Puedo explicarte temas de tu carrera, examinarte, corregir un texto, armar un plan de estudio o practicar inglés académico.\n\nElige un modo arriba o escribe tu pregunta.'
                  ),
                }}
              />
            </div>
          )}

          {history.map((m, i) => (
            <div key={i} className={'msg ' + (m.role === 'user' ? 'user' : 'bot')}>
              {m.role === 'user' ? (
                <div className="msg-body">{m.content}</div>
              ) : (
                <div className="msg-body" dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }} />
              )}
              {m.role === 'assistant' && i === history.length - 1 && !busy && (
                <div className="msg-actions">
                  <button type="button" onClick={regenerate}>
                    ↻ Regenerar
                  </button>
                </div>
              )}
            </div>
          ))}

          {streamText && (
            <div className="msg bot streaming">
              <div className="msg-body" dangerouslySetInnerHTML={{ __html: mdToHtml(streamText) }} />
            </div>
          )}

          {errorMsg && (
            <div className="msg error">
              <div className="msg-body">
                <p>⚠ {errorMsg}</p>
              </div>
              <div className="msg-actions">
                <button
                  type="button"
                  onClick={() => {
                    const t = input
                    setErrorMsg('')
                    if (t) sendChat(t)
                  }}
                >
                  ↻ Reintentar
                </button>
              </div>
            </div>
          )}
        </div>

        {showChips && !busy && (
          <div className="chat-suggest">
            {suggestions.map((s) => (
              <button key={s} type="button" className="suggest-chip" onClick={() => sendChat(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="chat-compose">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            placeholder={placeholder}
            disabled={busy}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendChat(input)
              }
            }}
          />
          <div className="chat-compose-bar">
            <span className="small text-secondary">{input.length}/6000</span>
            {busy ? (
              <button type="button" className="btn btn-outline btn-sm" onClick={stop}>
                Detener
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-oxblood btn-sm"
                disabled={!input.trim()}
                onClick={() => sendChat(input)}
              >
                Enviar
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}