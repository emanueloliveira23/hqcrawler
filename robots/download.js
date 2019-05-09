const request = require('request')

const parsers = [
  require('./parsers/galaxiadosquadrinhos')
]

async function download(hq) {

  const parser = findParser(hq)
  const raw = await download(hq)
  const content = await parser(raw)

  return content

  async function download(hq) {
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

}

module.exports = download
