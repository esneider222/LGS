// Carreras, universidades y niveles (propuesta PPI).
export const LEVELS = [
  { id: 'basico', name: 'Nivel básico' },
  { id: 'intermedio', name: 'Nivel intermedio' },
  { id: 'avanzado', name: 'Nivel avanzado' },
]

export const UNIS = {
  pb: 'Institución Universitaria Pascual Bravo',
  udea: 'Universidad de Antioquia',
  unal: 'Universidad Nacional de Colombia (Medellín)',
}

// Formatos REFERENCIALES de piloto: reemplazar por datos oficiales de cada admisión.
export const EXAM_FORMATS = {
  pb: { n: 20, min: 40 },
  udea: { n: 25, min: 50 },
  unal: { n: 30, min: 60 },
}

export const CAREERS = [
  {
    id: 'lengua',
    icon: '\u2712\uFE0F',
    name: 'Lic. en Lengua Castellana, Literatura e Inglés',
    area: 'Humanidades y educación',
    unis: ['pb', 'udea', 'unal'],
    levels: {
      basico: ['fonetica', 'morfosintaxis', 'semantica'],
      intermedio: ['sociolinguistica', 'discurso', 'literatura', 'ingles-lengua'],
      avanzado: ['didactica', 'ingles-literatura', 'ingles-didactica'],
    },
  },
  {
    id: 'sistemas',
    icon: '\u{1F4BB}',
    name: 'Ingeniería de Sistemas / Software',
    area: 'Ingeniería',
    unis: ['pb', 'udea', 'unal'],
  },
  {
    id: 'derecho',
    icon: '\u2696\uFE0F',
    name: 'Derecho',
    area: 'Ciencias sociales',
    unis: ['udea', 'unal'],
  },
]