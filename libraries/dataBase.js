const dotenv = require("dotenv")
const pg = require('pg');
const { Pool } = pg;

dotenv.config();

class Database {
  constructor() {

    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Heroku
      },
    }) 


  }

  async query(text, params) {
    this.client = await this.pool.connect();
      
    const res = await this.client.query(text, params);
       
    await this.close();
    return res;
  }

  async close() {
    await this.client.release();
    console.log('Closed database connection');
  }
}

module.exports = new Database();