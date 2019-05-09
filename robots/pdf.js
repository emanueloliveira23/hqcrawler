
const fs = require('fs')
const imagesToPdf = require('images-to-pdf')
const request = require('request')
const md5 = require('md5')
const mimeTypes = require('mime-types')
const log = require('../log')

async function pdf(content) {

  const { title, images } = content

  log(`creating pdf for ${title}`)
  log(`total of pages ${images.length}`)

  const pdfPath = createPdfPath(title)
  const paths = await downloadAllImages(images)
  await imagesToPdf(paths, pdfPath)

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


  async function downloadAllImages(images) {
    const imagesCount = images.length
    const imagesPaths = []
    for (let idx = 0; idx < imagesCount; idx++) {
      const image = images[idx]
      const imageNumber = idx + 1
      log(`downloading image ${imageNumber}/${imagesCount}...`)
      const path = await downloadOneImage(image)
      imagesPaths.push(path)
    }
    return imagesPaths
  }

  async function downloadOneImage(image) {
    log(`dowloading image url ${image}...`)
    const imagePath = await createImagePath(image)
    return new Promise((resolve, reject) => {
      request(image).pipe(fs.createWriteStream(imagePath))
        .on('close', () => resolve(imagePath))
        .on('error', reason => reject(reason))
    })
  }

  async function createImagePath(image) {
    const filename = await createImageFilename(image)
    const basePath = './images/'
    return `${basePath}${filename}`
  }

  async function createImageFilename(image) {
    return new Promise((resolve, reject) => {
      request.head(image, (err, response, body) => {
        if (err) reject(err)
        const contentType = response.headers['content-type']
        const extension = mimeTypes.extension(contentType)
        const hashName = md5(image)
        const filename = `${hashName}.${extension}`
        resolve(filename)
      })
    })
    
  }

}

module.exports = pdf
