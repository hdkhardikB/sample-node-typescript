// Update with your config settings.
require('dotenv').config()

module.exports = {
  test: {
    client: 'mysql2',
    debug: false
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    version: '11.6',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: true
    }
  },

  staging: {
    client: 'pg',
    version: '11.6',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: true
    }
  }
}
