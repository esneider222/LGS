import * as pdfjs from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const MAX_PAGES = 80
const MAX_TEXT_LENGTH = 10000

export async function extractPdfText(file) {
  const document = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
  try {
    if (document.numPages > MAX_PAGES) {
      throw new Error(`El PDF tiene ${document.numPages} páginas; el máximo permitido es ${MAX_PAGES}.`)
    }

    const pages = []
    let length = 0
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber)
      const content = await page.getTextContent()
      const text = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .filter(Boolean)
        .join(' ')
      if (text) pages.push(text)
      length += text.length
      if (length > MAX_TEXT_LENGTH) {
        throw new Error(`El texto del PDF supera el límite de ${MAX_TEXT_LENGTH.toLocaleString()} caracteres.`)
      }
    }

    const text = pages.join('\n\n').trim()
    if (!text) {
      throw new Error('No se encontró texto seleccionable. Los PDF escaneados requieren OCR y aún no son compatibles.')
    }
    return { text, pages: document.numPages }
  } finally {
    await document.destroy()
  }
}
