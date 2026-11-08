import { useState } from 'react'
import { loadJSON, saveJSON } from '../utils/storage'
import { CAREERS, LEVELS, EXAM_FORMATS } from '../data/catalogo'
import { LENGUA_MODULES, QUIZ_BANK, EXTRA_MODULES, EXTRA_BANK } from '../data/contenido'

// Datos de la carrera elegida y progreso de estudio, se guarda en localStorage.
export function useCarrera() {
  const [sel] = useState(() => loadJSON('lyl_sel', null))
  const [studied, setStudiedState] = useState(() => loadJSON('lyl_studied', {}))
  const [demo, setDemoState] = useState(() => loadJSON('lyl_demo', false))

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
    saveJSON('lyl_studied', next)
  }

  function activarDemo() {
    setDemoState(true)
    saveJSON('lyl_demo', true)
  }

  return {
    sel, carrera, modulos, banco, formato, studied,
    levelMods, levelDone, levelUnlocked, guideDone, examUnlocked,
    setStudied, activarDemo,
  }
}