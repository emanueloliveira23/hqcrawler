const cheerio = require("cheerio")

function parse(raw) {
  const $ = cheerio.load(raw)
  const images = $('article .post-body a').map((_, anchor) => anchor.attribs.href)
  const title = $('article h1').text().trim()
  const content = { title, images }
  return content
}

function test(hq) {
  return hq.match('galaxiadosquadrinhos') !== null
}

module.exports = { 
  test,
  parse
}
