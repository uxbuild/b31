// imports here for express and pg
const express = require("express");
const app = express();
const PORT = 3000;
const pg = require("pg");
const path = require('path');

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_hr_db"
);

// static routes here (you only need these for deployment)
// Middleware to serve static files from client directory
app.use(express.static(path.join(__dirname, "../client")));


// app routes here
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "This is my first route" });
// });

app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = `;
           SELECT * FROM users;
       `;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    //   console.error(error);
    next(error);
  }
});

// create your init function
app.listen(PORT, async () => {
  console.log(`I am listening on port number ${PORT}`);

  // seeded data once, using explicit call to 'seed.js' - TRIED THIS OUT SUCCESSFULLY.
  // see package.json, scripts.

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
            INSERT INTO users(name) VALUES('Bugs Bunny');
            INSERT INTO users(name) VALUES('Elmer Fudd');
        `;
    await client.query(SQL);
  } catch (error) {
    console.error(error);
  }
});

// init function invocation
