import { useState } from 'react'
import { API_URL, getToken } from '../api'
import { loadJSON, saveJSON } from '../utils/storage'

const MAX_MB = 10

function Material() {
  const [archivos, setArchivos] = useState(() => {
    const stored = loadJSON('lyl_pdfs', [])
    if (!Array.isArray(stored)) return []
    return stored
      .filter((file) => file && typeof file.name === 'string' && Number.isFinite(file.size))
      .map((file, index) => ({ ...file, id: file.id || `saved-${index}-${file.name}` }))
  })
  const [textos, setTextos] = useState({})
  const [analizando, setAnalizando] = useState(null)
  const [resultados, setResultados] = useState({})
  const [aviso, setAviso] = useState('')

  async function agregar(e) {
    const seleccionados = Array.from(e.target.files || [])
    e.target.value = ''
    setAviso('')
    let listaActual = archivos

    for (const file of seleccionados) {
      if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
        setAviso(`«${file.name}» no es un PDF.`)
        continue
      }
      if (file.size > MAX_MB * 1048576) {
        setAviso(`«${file.name}» supera los ${MAX_MB} MB.`)
        continue
      }
      const existing = listaActual.find((item) => item.name === file.name && item.size === file.size)
      setAnalizando(file.name)
      try {
        const { extractPdfText } = await import('../utils/pdf')
        const extracted = await extractPdfText(file)
        const id = existing?.id || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const entry = { id, name: file.name, size: file.size, pages: extracted.pages }
        const lista = existing
          ? listaActual.map((archivo) => archivo.id === existing.id ? entry : archivo)
          : [...listaActual, entry]
        listaActual = lista
        setArchivos(lista)
        saveJSON('lyl_pdfs', lista)
        setTextos((current) => ({ ...current, [id]: extracted.text }))
      } catch (error) {
        setAviso(`${file.name}: ${error.message || 'No se pudo leer el PDF.'}`)
      } finally {
        setAnalizando(null)
      }
    }
  }

  function quitar(id) {
    const lista = archivos.filter((archivo) => archivo.id !== id)
    setArchivos(lista)
    saveJSON('lyl_pdfs', lista)
    setTextos((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== id)))
    setResultados((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== id)))
  }

  async function generarEjercicios(archivo) {
    const text = textos[archivo.id]
    if (!text || analizando) return
    setAnalizando(archivo.id)
    setAviso('')
    try {
      const response = await fetch(`${API_URL}/api/tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          mode: 'material',
          messages: [{
            role: 'user',
            content: `Crea ejercicios de comprensión a partir del siguiente material titulado «${archivo.name}».\n\nTexto extraído:\n${text}`,
          }],
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || `Error del tutor (${response.status}).`)
      setResultados((current) => ({ ...current, [archivo.id]: data.reply }))
    } catch (error) {
      setAviso(error.message || 'No fue posible generar ejercicios.')
    } finally {
      setAnalizando(null)
    }
  }

  return (
    <section className="panel active">
      <div className="section-head">
        <p className="eyebrow">MI MATERIAL</p>
        <h1>Sube tus apuntes en PDF</h1>
        <p>Aquí reunirás tus guías y resúmenes para convertirlos en ejercicios y juegos propios.</p>
      </div>

      <p className="alert alert-info note">
        El texto se extrae en este navegador. Solo se envía al tutor para generar ejercicios cuando lo solicitas; el PDF original no se sube ni se guarda.
      </p>

      {aviso && <div className="alert alert-danger small" role="alert">{aviso}</div>}
      {analizando && <p className="small text-secondary" role="status">Procesando {analizando}…</p>}

      <label className="field" style={{ maxWidth: '480px' }}>
        Elegir archivo PDF (máx. {MAX_MB} MB y 80 páginas)
        <input id="pdfInput" type="file" accept="application/pdf,.pdf" multiple disabled={Boolean(analizando)} onChange={agregar} />
      </label>

      <div>
        {archivos.length ? (
          <>
            {archivos.map((archivo) => (
              <article className="card p-3 mb-3" key={archivo.id || `${archivo.name}-${archivo.size}`}>
                <div className="file-row">
                  <span>
                    📄 {archivo.name}{' '}
                    <small style={{ color: 'var(--ink-faint)' }}>({(archivo.size / 1048576).toFixed(1)} MB{archivo.pages ? ` · ${archivo.pages} páginas` : ''})</small>
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      disabled={!textos[archivo.id] || Boolean(analizando)}
                      onClick={() => generarEjercicios(archivo)}
                    >
                      {analizando === archivo.id ? 'Generando…' : textos[archivo.id] ? 'Generar ejercicios' : 'Vuelve a seleccionar para analizar'}
                    </button>
                    <button className="btn btn-outline btn-sm" type="button" disabled={Boolean(analizando)} onClick={() => quitar(archivo.id)}>Quitar</button>
                  </div>
                </div>
                {resultados[archivo.id] && (
                  <div className="mt-3" aria-live="polite">
                    <h2 className="h5">Ejercicios · {archivo.name}</h2>
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{resultados[archivo.id]}</p>
                  </div>
                )}
              </article>
            ))}
          </>
        ) : (
          <p style={{ color: 'var(--ink-soft)', fontSize: '14px' }}>Aún no has agregado material.</p>
        )}
      </div>
    </section>
  )
}

export default Material