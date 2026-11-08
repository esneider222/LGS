import { useState } from 'react'
import { loadJSON, saveJSON } from '../utils/storage'

const MAX_MB = 10

function Material() {
  const [archivos, setArchivos] = useState(() => loadJSON('lyl_pdfs', []))
  const [aviso, setAviso] = useState('')

  // CREAR: agrega a la lista los PDF elegidos (solo se guarda su nombre y tamaño).
  function agregar(e) {
    const nuevos = []
    const rechazados = []
    Array.from(e.target.files).forEach((f) => {
      const esPdf = /\.pdf$/i.test(f.name) || f.type === 'application/pdf'
      if (!esPdf) rechazados.push('«' + f.name + '» no es un PDF.')
      else if (f.size > MAX_MB * 1048576) rechazados.push('«' + f.name + '» supera los ' + MAX_MB + ' MB.')
      else nuevos.push({ name: f.name, size: f.size })
    })
    if (nuevos.length) {
      const lista = [...archivos, ...nuevos]
      setArchivos(lista)
      saveJSON('lyl_pdfs', lista)
    }
    setAviso(rechazados.join(' '))
    e.target.value = ''
  }

  // BORRAR: quita un archivo de la lista.
  function quitar(indice) {
    const lista = archivos.filter((_, i) => i !== indice)
    setArchivos(lista)
    saveJSON('lyl_pdfs', lista)
  }

  return (
    <section className="panel active">
      <div className="section-head">
        <p className="eyebrow">MI MATERIAL</p>
        <h1>Sube tus apuntes en PDF</h1>
        <p>Aquí reunirás tus guías y resúmenes para convertirlos en ejercicios y juegos propios.</p>
      </div>

      <p className="alert alert-warning note">
        Estado del prototipo: puedes seleccionar y listar tus PDF, pero el análisis automático con IA se conectará en una fase posterior.
      </p>

      {aviso && <div className="alert alert-danger small" role="alert">{aviso}</div>}

      <label className="field" style={{ maxWidth: '480px' }}>
        Elegir archivos PDF (máx. {MAX_MB} MB cada uno)
        <input id="pdfInput" type="file" accept="application/pdf,.pdf" multiple onChange={agregar} />
      </label>

      {/*LISTAR*/}
      <div>
        {archivos.length ? (
          <>
            {archivos.map((f, i) => (
              <div className="file-row" key={i}>
                <span>
                  📄 {f.name}{' '}
                  <small style={{ color: 'var(--ink-faint)' }}>({(f.size / 1048576).toFixed(1)} MB)</small>
                </span>
                <button className="btn btn-outline btn-sm" type="button" onClick={() => quitar(i)}>Quitar</button>
              </div>
            ))}
            <p className="alert alert-warning note" style={{ marginTop: '14px' }}>
              La generación automática de ejercicios y juegos a partir de estos PDF llegará con la fase de IA.
            </p>
          </>
        ) : (
          <p style={{ color: 'var(--ink-soft)', fontSize: '14px' }}>Aún no has agregado material.</p>
        )}
      </div>
    </section>
  )
}

export default Material