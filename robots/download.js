const fs = require('fs')
const request = require('request')
const md5 = require('md5')
const mimeTypes = require('mime-types')
const log = require('../log')

const parsers = [
  require('./parsers/galaxiadosquadrinhos')
]

async function download(hq) {

  const parser = findParser(hq)
  const raw = await downloadPage(hq)
  const content = await parser(raw)
  content.images = await downloadAllImages(content.images)

  return content

  async function downloadPage(hq) {
    return new Promise((resolve, reject) => {
      const uri = hq
      request(uri, (error, _, body) => {
        if (error) reject(error)
        resolve(body)
      })
    })
  }

  function findParser(hq) {
    const found = parsers.find(p => p.test(hq))
    if (found) return found.parse
    else throw new Error(`no parser found for ${hq}`)
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
    const imagePath = await createImagePath(image)
    if (imageAlreadyDownloaded(imagePath)) return Promise.resolve(imagePath)
    else return new Promise((resolve, reject) => {
      request(image)
        .pipe(fs.createWriteStream(imagePath))
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

  function imageAlreadyDownloaded(imagePath) {
    return fs.existsSync(imagePath)
  }

}

module.exports = download
