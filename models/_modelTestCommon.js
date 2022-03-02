const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(25) NOT NULL,
//   password TEXT NOT NULL,
//   is_admin BOOLEAN NOT NULL DEFAULT FALSE,
//   points INTEGER
// );

async function commonBeforeAll() { 
    await db.query("DELETE FROM users");

    await db.query(`
    INSERT INTO users(username,
                      password,
                      is_admin)
    VALUES ('user1', $1, false),
           ('user2', $2, true)
    RETURNING username`,
  [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
  ]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};