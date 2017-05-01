function isString(x): boolean {
  return typeof x == 'string'
}


function isNumber(x): boolean {
  return typeof x == 'number'
}


function isBoolean(x): boolean {
  return typeof x == 'boolean'
}


function isNull(x): boolean {
  return x === null
}


function isUndefined(x): boolean {
  return typeof x == 'undefined'
}


function isDate(x): boolean {
  return x instanceof Date && !isNaN(x.valueOf())
}


function values(o) {
  const vs = []
  for (let key in o) {
    vs.push(o[key])
  }

  return vs
}


function mapObject(o, fn) {
  const vs = []
  for (let key in o) {
    vs.push(fn(o[key], key))
  }

  return vs
}


export default {
  isString,
  isNumber,
  isBoolean,
  isNull,
  isUndefined,
  isDate,
  values,
  mapObject
}