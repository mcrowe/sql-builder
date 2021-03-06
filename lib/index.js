"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
function quotify(str) {
    return "'" + str + "'";
}
function escapeQuotes(str) {
    return str.replace(/'/g, "''");
}
function isLiteral(value) {
    return util_1.default.isString(value) && value.startsWith('__') && value.endsWith('__');
}
function stripLiteral(value) {
    return value.slice(2, value.length - 2);
}
function formatValue(value) {
    const type = typeof value;
    // Literals allow us to pass raw sql commands into the query like 'now()', without
    // them being quoted as strings. They are formatted as '__now()__'
    if (isLiteral(value)) {
        return stripLiteral(value);
    }
    if (util_1.default.isNumber(value) || util_1.default.isBoolean(value) || util_1.default.isNull(value)) {
        return JSON.stringify(value);
    }
    if (util_1.default.isString(value)) {
        return quotify(escapeQuotes(value));
    }
    if (util_1.default.isDate(value)) {
        return quotify(value.toISOString());
    }
    if (util_1.default.isUndefined(value)) {
        return 'null';
    }
    if (Array.isArray(value)) {
        return 'ARRAY[' + stringifyArrayValues(value) + ']';
    }
    throw new Error('Invalid value: "' + value + '"');
}
function stringifyArrayValues(arrayValues) {
    return arrayValues.map(value => "'" + (JSON.stringify(value)) + "'");
}
function mergeInsertTimestamps(params) {
    return Object.assign({}, params, { created_at: NOW, updated_at: NOW });
}
function mergeUpdateTimestamps(params) {
    return Object.assign({}, params, { updated_at: NOW });
}
function columnsClause(fields) {
    return '(' + Object.keys(fields).join(', ') + ')';
}
function valuesClause(fields) {
    return '(' + util_1.default.values(fields).map(formatValue).join(', ') + ')';
}
function insert(table, fields) {
    const insertFields = mergeInsertTimestamps(fields);
    return `INSERT INTO ${table} ${columnsClause(insertFields)} VALUES ${valuesClause(insertFields)}`;
}
function bulkInsert(table, rows) {
    const columns = columnsClause(rows[0]);
    const values = rows.map(valuesClause).join(', ');
    return `INSERT INTO ${table} ${columns} VALUES ${values}`;
}
function setClause(fields) {
    fields = mergeUpdateTimestamps(fields);
    return 'SET ' + util_1.default.mapObject(fields, (v, k) => `${k} = ${formatValue(v)}`).join(', ');
}
function whereClause(conditions) {
    return 'WHERE ' + util_1.default.mapObject(conditions, (v, k) => `${k} = ${formatValue(v)}`).join(' AND ');
}
function update(table, conditions, fields) {
    return `UPDATE ${table} ${setClause(fields)} ${whereClause(conditions)}`;
}
function upsert(table, fields, options = {}) {
    let constraint = '';
    if (options.constraint) {
        constraint = '(' + options.constraint.join(', ') + ') ';
    }
    return `${insert(table, fields)} ON CONFLICT ${constraint}DO UPDATE ${setClause(fields)}`;
}
// TODO: Handle SQL injection
function find(table, id) {
    return `SELECT * FROM ${table} WHERE id = ${id}`;
}
function all(table, conditions) {
    const select = 'SELECT * FROM ' + table;
    if (conditions) {
        return select + ' ' + whereClause(conditions);
    }
    else {
        return select;
    }
}
const NOW = '__now()__';
exports.default = { formatValue, insert, bulkInsert, update, upsert, mergeInsertTimestamps, find, all, NOW };
