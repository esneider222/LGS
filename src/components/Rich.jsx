import { Fragment } from 'react'

const ABRE = {
  '<b>': { tag: 'b', props: {} },
  '<i>': { tag: 'i', props: {} },
  '<span class="ipa">': { tag: 'span', props: { className: 'ipa' } },
}
const CIERRA = { '</b>': 'b', '</i>': 'i', '</span>': 'span' }

function armar(texto) {
  const raiz = { hijos: [] }
  const pila = [raiz]
  String(texto)
    .split(/(<b>|<\/b>|<i>|<\/i>|<span class="ipa">|<\/span>)/)
    .forEach((parte) => {
      const actual = pila[pila.length - 1]
      if (ABRE[parte]) {
        const nodo = { ...ABRE[parte], hijos: [] }
        actual.hijos.push(nodo)
        pila.push(nodo)
      } else if (CIERRA[parte]) {
        if (pila.length > 1 && actual.tag === CIERRA[parte]) pila.pop()
      } else if (parte) {
        actual.hijos.push(parte)
      }
    })
  return raiz.hijos
}

function dibujar(hijos) {
  return hijos.map((h, i) => {
    if (typeof h === 'string') return <Fragment key={i}>{h}</Fragment>
    const Etiqueta = h.tag
    return (
      <Etiqueta key={i} {...h.props}>
        {dibujar(h.hijos)}
      </Etiqueta>
    )
  })
}

function Rich({ texto }) {
  return <>{dibujar(armar(texto))}</>
}

export default Rich