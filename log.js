
module.exports = function log(...args) {

  for (arg of args) {
    if (typeof arg === 'object') logObject(arg)
    else logDefault(arg)
  }

  function logObject(obj) {
    console.dir(obj, { depth: null })
  }

  function logDefault(arg) {
    console.log(`> ${arg}`)
  }

}
