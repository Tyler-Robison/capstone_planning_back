"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class Recipe {
    /** authenticate user with username, password.
     *
     * Returns { id, username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    // static async authenticate(username, password) {
    //     // try to find the user first
    //     // console.log('inside User.auth')
    //     const result = await db.query(
    //         `SELECT id, 
    //               username,
    //               password,
    //               first_name AS "firstName",
    //               last_name AS "lastName",
    //               email,
    //               is_admin AS "isAdmin"
    //        FROM users
    //        WHERE username = $1`,
    //         [username],
    //     );

    //     const user = result.rows[0];

    //     if (user) {
    //         // compare hashed password to a new hash from password
    //         const isValid = await bcrypt.compare(password, user.password);
    //         if (isValid === true) {
    //             delete user.password;
    //             return user;
    //         }
    //     }

    //     throw new UnauthorizedError("Invalid username/password");
    // }

    /** Register user with data.
     *
     * Returns { id, username, firstName, lastName, email, isAdmin }
     *
     * Throws BadRequestError on duplicates.
     **/

    // static async register(
    //     { username, password, firstName, lastName, email, isAdmin }) {
    //     const duplicateCheck = await db.query(
    //         `SELECT username
    //        FROM users
    //        WHERE username = $1`,
    //         [username],
    //     );

    //     if (duplicateCheck.rows[0]) {
    //         throw new BadRequestError(`Duplicate username: ${username}`);
    //     }

    //     const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    //     const result = await db.query(
    //         `INSERT INTO users
    //        (username,
    //         password,
    //         first_name,
    //         last_name,
    //         email,
    //         is_admin)
    //        VALUES ($1, $2, $3, $4, $5, $6)
    //        RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin", id`,
    //         // added id
    //         [
    //             username,
    //             hashedPassword,
    //             firstName,
    //             lastName,
    //             email,
    //             isAdmin
    //         ],
    //     );

    //     const user = result.rows[0];

    //     return user;
    // }

    static async saveRecipe(userId, name, recipeId ) {

        const result = await db.query(
            `INSERT INTO user_recipes
          (user_id,
            name,
            recipe_id)
            VALUES ($1, $2, $3)`,
            [userId, name, recipeId]
        )

        const savedData = result.rows[0];

        return savedData;
    }

    // returns all of a users saved recipes
    static async getRecipes(userId) {
        const result = await db.query(`
            SELECT name, recipe_id
            FROM user_recipes
            WHERE user_id=$1`, [userId]
        )
      
        const savedRecipes = result.rows
        return savedRecipes
    }

    static async remove(userId, recipeId) {
        const result = await db.query(
            `DELETE FROM user_recipes 
            WHERE user_id = $1 AND recipe_id = $2
            RETURNING name
        `, [userId, recipeId])
        if (!result) throw new NotFoundError(`Table does not contain userId: ${userId}, recipeId ${recipeId} combination.`)
        return result.rows
    }

    /** Find all users.
     *
     * Returns [{ username, first_name, last_name, email, is_admin }, ...]
     **/

    //   static async findAll() {
    //     const result = await db.query(
    //       `SELECT id, username,
    //                   first_name AS "firstName",
    //                   last_name AS "lastName",
    //                   email,
    //                   is_admin AS "isAdmin"
    //            FROM users
    //            ORDER BY username`,
    //     );

    //     return result.rows;
    //   }

    /** Given a username, return data about a specific user.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws NotFoundError if user not found.
     **/

    //   static async get(username) {
    //     console.log('user model', username)
    //     const userRes = await db.query(
    //       `SELECT id, username,
    //                   first_name AS "firstName",
    //                   last_name AS "lastName",
    //                   email,
    //                   is_admin AS "isAdmin"
    //            FROM users
    //            WHERE username = $1`,
    //       [username],
    //     );

    //     const user = userRes.rows[0];

    //     if (!user) throw new NotFoundError(`No user: ${username}`);

    //     return user;
    //   }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { firstName, lastName, password, email, isAdmin }
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: update can set a new password or make a user an admin.
     * MUST USE userUpdate validation to eliminate risk of creating admin
     * MUST ENSURE correctUser or admin access for password update
     */

    //   static async update(username, data) {
    //     if (data.password) {
    //       data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    //     }

    //     const { setCols, values } = sqlForPartialUpdate(
    //       data,
    //       {
    //         firstName: "first_name",
    //         lastName: "last_name",
    //         isAdmin: "is_admin",
    //       });
    //     const usernameVarIdx = "$" + (values.length + 1);

    //     const querySql = `UPDATE users 
    //                       SET ${setCols} 
    //                       WHERE username = ${usernameVarIdx} 
    //                       RETURNING username,
    //                                 first_name AS "firstName",
    //                                 last_name AS "lastName",
    //                                 email,
    //                                 is_admin AS "isAdmin"`;
    //     const result = await db.query(querySql, [...values, username]);
    //     const user = result.rows[0];

    //     if (!user) throw new NotFoundError(`No user: ${username}`);

    //     delete user.password;
    //     return user;
    //   }

    /** Delete given user from database; returns 	"deleted": user_name */

    //   static async remove(username) {
    //     let result = await db.query(
    //       `DELETE
    //            FROM users
    //            WHERE username = $1
    //            RETURNING username`,
    //       [username],
    //     );
    //     const user = result.rows[0];

    //     if (!user) throw new NotFoundError(`No user: ${username}`);
    //   }


}


module.exports = Recipe;