

const imagesToPdf = require('images-to-pdf')

const log = require('../log')

async function pdf(content) {

  const { title, images } = content

  log(`creating pdf for ${title}`)
  log(`total of pages ${images.length}`)

  const pdfPath = createPdfPath(title)
  await imagesToPdf(images, pdfPath)

  return pdfPath


  function createPdfPath(title) {
    const filename = createPdfFilename(title)
    const basePath = './pdfs/'
    return `${basePath}${filename}`
  }

  function createPdfFilename(title) {
    const name = title.replace(/\s/, '_')
    const extension = '.pdf'
    return `${name}${extension}`
  }

}

module.exports = pdf
