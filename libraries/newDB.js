const dotenv = require("dotenv")
const pg = require('pg');
const { Pool  } = pg;


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Heroku
    },
  }) ;


module.exports = pool;

