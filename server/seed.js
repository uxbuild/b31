const express = require("express");
const app = express();
const PORT = 3000;
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_hr_db"
);
 async function seed(){
    try {
        await client.connect();
        const SQL = `DROP TABLE IF EXISTS users;
         CREATE TABLE users(
          id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100),
          is_admin BOOLEAN DEFAULT FALSE 
        );
            INSERT INTO users(name, is_admin) VALUES('Tom', true);
            INSERT INTO users(name, is_admin) VALUES('Jerry', true);
        `;
        await client.query(SQL);
      } catch (error) {
        console.error(error);
      }
}
seed();