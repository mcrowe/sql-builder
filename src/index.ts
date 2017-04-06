const _ = require('lodash')


export interface UpsertOptions {
  constraint?: string[]
}


function quotify(str: string): string {
  return "'" + str + "'"
}


function escapeQuotes(str: string): string {
  return str.replace(/'/g, "''")
}


function isLiteral(value: any): boolean {
  return _.isString(value) && value.startsWith('__') && value.endsWith('__')
}


function stripLiteral(value) {
  return value.slice(2, value.length - 2)
}


function formatValue(value: any) {
  const type = typeof value

  // Literals allow us to pass raw sql commands into the query like 'now()', without
  // them being quoted as strings. They are formatted as '__now()__'
  if (isLiteral(value)) {
    return stripLiteral(value)
  }

  if (_.isNumber(value) || _.isBoolean(value) || _.isNull(value)) {
    return JSON.stringify(value)
  }

  if (_.isString(value)) {
    return quotify(escapeQuotes(value))
  }

  if  (_.isDate(value)) {
    return quotify(value.toISOString())
  }

  if (_.isUndefined(value)) {
    return 'null'
  }

  if (_.isArray(value)) {
    return 'ARRAY[' + stringifyArrayValues(value) + ']'
  }

  throw new Error('Invalid value: "' + value + '"')
}

function stringifyArrayValues(arrayValues) {
  const sqlFormatArray = _.map(arrayValues, function(value) {
    return "'" + (JSON.stringify(value)) + "'"
  })

  return sqlFormatArray
}



function mergeInsertTimestamps(params) {
  return _.merge(params, {created_at: NOW, updated_at: NOW})
}


function mergeUpdateTimestamps(params) {
  return _.merge(params, {updated_at: NOW})
}


function columnsClause(fields): string {
  return '(' + _.keys(fields).join(', ') + ')'
}


function valuesClause(fields): string {
  return '(' + _.values(fields).map(formatValue).join(', ') + ')'
}


function insert(table: string, fields): string {
  const insertFields = mergeInsertTimestamps(fields)

  return `INSERT INTO ${table} ${columnsClause(insertFields)} VALUES ${valuesClause(insertFields)}`
}


function bulkInsert(table: string, rows): string {
  const columns = columnsClause(rows[0])
  const values = rows.map(valuesClause).join(', ')
  return `INSERT INTO ${table} ${columns} VALUES ${values}`
}


function setClause(fields): string {
  fields = mergeUpdateTimestamps(fields)
  return 'SET ' + _.map(fields, (v, k) => `${k} = ${formatValue(v)}`).join(', ')
}


function whereClause(conditions): string {
  return 'WHERE ' + _.map(conditions, (v, k) => `${k} = ${formatValue(v)}`).join(' AND ')
}


function update(table: string, conditions, fields): string {
  return `UPDATE ${table} ${setClause(fields)} ${whereClause(conditions)}`
}


function upsert(table: string, fields, options: UpsertOptions = {}): string {
  let constraint = ''
  if (options.constraint) {
    constraint = '(' + options.constraint.join(', ') + ') '
  }

  return `${insert(table, fields)} ON CONFLICT ${constraint}DO UPDATE ${setClause(fields)}`
}


// TODO: Handle SQL injection
function find(table: string, id: number): string {
  return `SELECT * FROM ${table} WHERE id = ${id}`
}


function all(table: string, conditions?): string {
  const select = 'SELECT * FROM ' + table

  if (conditions) {
    return select + ' ' + whereClause(conditions)
  } else {
    return select
  }
}


const NOW = '__now()__'


export default { formatValue, insert, bulkInsert, update, upsert, mergeInsertTimestamps, find, all, NOW }