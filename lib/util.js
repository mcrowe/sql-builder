"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isString(x) {
    return typeof x == 'string';
}
function isNumber(x) {
    return typeof x == 'number';
}
function isBoolean(x) {
    return typeof x == 'boolean';
}
function isNull(x) {
    return x === null;
}
function isUndefined(x) {
    return typeof x == 'undefined';
}
function isDate(x) {
    return x instanceof Date && !isNaN(x.valueOf());
}
function values(o) {
    const vs = [];
    for (let key in o) {
        vs.push(o[key]);
    }
    return vs;
}
function mapObject(o, fn) {
    const vs = [];
    for (let key in o) {
        vs.push(fn(o[key], key));
    }
    return vs;
}
exports.default = {
    isString,
    isNumber,
    isBoolean,
    isNull,
    isUndefined,
    isDate,
    values,
    mapObject
};
