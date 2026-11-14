import { useEffect, useState } from 'react'
import { loadJSON, saveJSON } from '../utils/storage'
import { CAREERS, LEVELS, EXAM_FORMATS } from '../data/catalogo'
import { LENGUA_MODULES, QUIZ_BANK, EXTRA_MODULES, EXTRA_BANK } from '../data/contenido'
import { getProgress, updateProgress, getToken } from '../api'

// Guarda local al instante; sincroniza con Mongo en segundo plano (no bloquea la UI).
function syncProgress(payload) {
  if (!getToken()) return
  void updateProgress(payload).catch(() => {
    // Silencioso: la UI ya tiene el dato en localStorage
  })
}

export function useCarrera() {
  const [sel] = useState(() => loadJSON('lyl_sel', null))
  const [studied, setStudiedState] = useState(() => loadJSON('lyl_studied', {}))
  const [demo, setDemoState] = useState(() => loadJSON('lyl_demo', false))
  const [synced, setSynced] = useState(false)

  // Al montar: si hay token, trae el progreso de Mongo y lo mezcla con el local
  useEffect(() => {
    if (!getToken() || synced) return

    let cancelled = false
    ;(async () => {
      try {
        const data = await getProgress()
        if (cancelled || !data) return

        // studied: preferimos el del servidor si trae algo; si no, dejamos el local
        if (data.studied && typeof data.studied === 'object') {
          const local = loadJSON('lyl_studied', {})
          const merged = { ...local, ...data.studied }
          setStudiedState(merged)
          saveJSON('lyl_studied', merged)
        }

        if (typeof data.demo === 'boolean') {
          setDemoState(data.demo)
          saveJSON('lyl_demo', data.demo)
        }

        // Si el servidor tiene carrera/uni y el local no, las recuperamos
        if (data.career && data.uni) {
          const localSel = loadJSON('lyl_sel', null)
          if (!localSel?.career || !localSel?.uni) {
            saveJSON('lyl_sel', { career: data.career, uni: data.uni })
          }
        }
      } catch {
        // Sin red o sin token válido: seguimos con localStorage
      } finally {
        if (!cancelled) setSynced(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [synced])

  const carrera = sel ? CAREERS.find((c) => c.id === sel.career) : null

  let modulos = []
  let banco = []
  if (carrera && carrera.id === 'lengua') {
    modulos = LENGUA_MODULES.map((m) => ({
      ...m,
      level: LEVELS.find((l) => carrera.levels[l.id].includes(m.id)).id,
    }))
    banco = QUIZ_BANK
  } else if (carrera) {
    modulos = EXTRA_MODULES[carrera.id]
    banco = EXTRA_BANK[carrera.id]
  }

  const f = sel ? EXAM_FORMATS[sel.uni] : null
  const formato = f ? { n: Math.min(f.n, banco.length), min: f.min } : { n: 0, min: 0 }

  const levelMods = (l) => modulos.filter((m) => m.level === l)
  const levelDone = (l) => {
    const ms = levelMods(l)
    return ms.length > 0 && ms.every((m) => studied[m.id])
  }
  const levelUnlocked = (l) => {
    const i = LEVELS.findIndex((x) => x.id === l)
    return demo || i === 0 || levelDone(LEVELS[i - 1].id)
  }
  const guideDone = LEVELS.every((l) => levelDone(l.id))
  const examUnlocked = demo || guideDone

  function setStudied(id, val) {
    const next = { ...studied, [id]: val }
    setStudiedState(next)
    saveJSON('lyl_studied', next) // UI inmediata
    syncProgress({ studied: next }) // Mongo en segundo plano
  }

  function activarDemo() {
    setDemoState(true)
    saveJSON('lyl_demo', true)
    syncProgress({ demo: true })
  }

  return {
    sel,
    carrera,
    modulos,
    banco,
    formato,
    studied,
    levelMods,
    levelDone,
    levelUnlocked,
    guideDone,
    examUnlocked,
    setStudied,
    activarDemo,
  }
}