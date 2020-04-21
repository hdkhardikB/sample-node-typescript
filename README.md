# Typescript Node Sample

Sample node js server built using trypscript. This is a part of a running project which uses task scheduling also. To make task scheduling work, we've used 
[Node-agenda](https://github.com/agenda/agenda).

**Note**: The code is a part of actual running project. This is just to demonstrate the code and acrhitecture, the code may not run.

## Build Setup

```bash
# install dependencies
$ npm install
$ npm install -g knex

# database migrate
$ npm run migrate
# or
$ npx knex migrate:latest

# serve
$ npm start
```

## Dependencies

#### dependencies

| Package     | Description                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| body-parser | Express 4 middleware.                                                                                 |
| bookshelf   | JavaScript ORM for Node.js, build on the Knex.                                                        |
| dotenv      | Loads environment variables from .env file.                                                           |
| express     | Node.js web framework.                                                                                |
| knex        | SQL query builder.                                                                                    |
| lusca       | Web application security for express apps.                                                            |
| morgan      | HTTP request logger middleware for node.js                                                            |
| mysql2      | fast node-mysql compatible mysql driver for node.js                                                   |
| validatorjs | A data validation library in JavaScript for the browser and Node.js, inspired by Laravel's Validator. |

#### devDependencies

| Package                | Description                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------- |
| chai                   | assertion library                                                                      |
| concurrently           | Utility that manages multiple concurrent tasks. Used with npm scripts                  |
| cross-env              | Cross platform setting of environment scripts.                                         |
| debug                  | A tiny JavaScript debugging utility modelled after Node.js core's debugging technique. |
| mocha                  | JavaScript test framework                                                              |
| mock-knex              | a knex mock adapter for simulating a db during testing.                                |
| nodemon                | automatically restart                                                                  |
| supertest              | HTTP assertion library.                                                                |
| ts-node                | TypeScript execution environment for node.                                             |
| tsconfig-paths         | Load node modules according to tsconfig paths                                          |
| tslint                 | Linter (similar to ESLint) for TypeScript files                                        |
| tslint-config-standard | A TSLint config for JavaScript Standard Style.                                         |
| typescript             | JavaScript compiler/type checker that boosts JavaScript productivity                   |
