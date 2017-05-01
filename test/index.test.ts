import assert = require('assert')
import Query from '../src'


test('formatValue', () => {
  // strings
  assert.equal("'hello'", Query.formatValue('hello'))
  // numbers
  assert.equal('5', Query.formatValue(5))
  // booleans
  assert.equal('true', Query.formatValue(true))
  // nulls
  assert.equal('null', Query.formatValue(null))
  assert.equal('null', Query.formatValue(undefined))
  // dates
  assert.equal("'2010-01-01T08:00:00.000Z'", Query.formatValue(new Date(2010, 0, 1)))
  // literals
  assert.equal('now()', Query.formatValue('__now()__'))
  assert.equal("'__now()_'", Query.formatValue('__now()_'))

  // escapes quotes in strings
  assert.equal("'there''s'", Query.formatValue("there's"))
})

test('insert', () => {
  assert.equal("INSERT INTO users (name, age, created_at, updated_at) VALUES ('Mitch', 5, now(), now())", Query.insert('users', {name: 'Mitch', age: 5}))
})

test('update', () => {
  assert.equal("UPDATE users SET name = 'Mitch', age = 5, updated_at = now() WHERE id = 1", Query.update('users', {id: 1}, {name: 'Mitch', age: 5}))
  assert.equal("UPDATE users SET name = 'Mitch', age = 5, updated_at = now() WHERE id = 1 AND name = 'Jim'", Query.update('users', {id: 1, name: 'Jim'}, {name: 'Mitch', age: 5}))
})

test('upsert', () => {
  const expected = "INSERT INTO profiles (user_id, name, age, created_at, updated_at) VALUES (1, 'Mitch', 5, now(), now()) ON CONFLICT DO UPDATE SET user_id = 1, name = 'Mitch', age = 5, updated_at = now()"
  const actual = Query.upsert('profiles', {user_id: 1, name: 'Mitch', age: 5})
  assert.equal(expected, actual)
})

test('upsert with columns', () => {
  const expected = "INSERT INTO profiles (user_id, name, age, created_at, updated_at) VALUES (1, 'Mitch', 5, now(), now()) ON CONFLICT (name) DO UPDATE SET user_id = 1, name = 'Mitch', age = 5, updated_at = now()"
  const actual = Query.upsert('profiles', {user_id: 1, name: 'Mitch', age: 5}, {constraint: ['name']})
  assert.equal(expected, actual)
})

test('bulk insert', () => {
  const rows = [{name: 'Bob', age: 17}, {name: 'Shirley', age: 18}]
  assert.equal("INSERT INTO users (name, age) VALUES ('Bob', 17), ('Shirley', 18)", Query.bulkInsert('users', rows))
})

test('find', () => {
  assert.equal("SELECT * FROM users WHERE id = 1", Query.find('users', 1))
})

