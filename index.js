
const log = require('./log')
const hqs = require('./hqs')
const robots = {
  download: require('./robots/download'),
  pdf: require('./robots/pdf')
}


main()


async function main() {
  for (hq of hqs) {
    log(`crawling ${hq}...`)
    const content = await robots.download(hq)
    const pdf = await robots.pdf(content)
    log(`crwaling of ${hq} finished! output: ${pdf}`)
  }
}
