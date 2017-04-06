# SQL Builder

Javascript/Typescript helpers for building basic SQL queries.

## TODO

- Handle SQL injection on select statements
- Remove peer dependency on lodash

## Usage

> npm install @mcrowe/sql-builder --save

```js
const Q = require('@mcrowe/sql-builder')

Q.insert('things', {name: 'Book', condition: 'good'})
// => INSERT INTO things (name, condition, created_at, updated_at) VALUES ('Book', 'good', now(), now());

// etc.
```

## Development

Install npm modules:

> npm install

Run tests:

> npm test

Build:

> npm run build

Publish to npm:

1. Update the version in `package.json`

2. Build using `npm run build`

3. Publish using `npm publish --access=public`

