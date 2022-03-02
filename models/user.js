"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { id, username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    // console.log('inside User.auth')
    const result = await db.query(
      `SELECT id, 
                  username,
                  password,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { id, username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
    { username, password, isAdmin }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password,
            is_admin)
           VALUES ($1, $2, $3)
           RETURNING username, is_admin AS "isAdmin", id`,
      // added id
      [
        username,
        hashedPassword,
        isAdmin
      ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT id, username,
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }

  /** Given a username, return data about a specific user.
   *
   * Returns { username, is_admin }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(id) {
    const userRes = await db.query(
      `SELECT id, username,
                  is_admin AS "isAdmin",
                  points
           FROM users
           WHERE id = $1`,
      [id],
    );

    const user = userRes.rows[0];
    console.log('got user', user)

    if (!user) throw new NotFoundError(`No user: ${id}`);

    return user;
  }

  static async setPoints(id, data) {
    const result = await db.query(`UPDATE users 
                      SET points = $2
                      WHERE id = $1 
                      RETURNING id, points`, [id, data]);
    return result.rows[0]
  }

  /** Delete given user from database; returns 	"deleted": user_name */

  static async remove(id) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE id = $1
           RETURNING username`,
      [id],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${id}`);
  }


}


module.exports = User;