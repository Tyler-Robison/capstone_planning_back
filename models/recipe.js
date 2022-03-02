"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

/** Related functions for Recipes. */

class Recipe {

    static async saveRecipe(userId, name, recipeId, wwPoints) {

        const duplicateCheck = await db.query(
            `SELECT recipe_id
                 FROM users_recipes
                 WHERE recipe_id = $1`,
            [recipeId],
        );
        let isDuplicateRecipe = false

        if (duplicateCheck.rows[0]) {
            isDuplicateRecipe = true;
            console.log(`ERROR: duplicate recipe, name: ${name}`)
        }

        // if current or a diff user has already put recipe in db
        // don't try to add again
        if (!isDuplicateRecipe) {
            await db.query(
                `INSERT INTO recipes
            (name,
            recipe_id,
            ww_points)
            VALUES ($1, $2, $3)`,
                [name, recipeId, wwPoints]
            )
        }

        // check if currUser has already saved this recipe
        const duplicateCheck2 = await db.query(
            `SELECT recipe_id
                 FROM users_recipes
                 WHERE recipe_id = $1 AND user_id = $2`,
            [recipeId, userId],
        );

        let isDuplicateJoin = false

        if (duplicateCheck2.rows[0]) {
            isDuplicateJoin = true;
            console.log(`ERROR: duplicate join userId: ${userId} recId ${recipeId}`)
        }

        if (!isDuplicateJoin) {
            await db.query(
                `INSERT INTO users_recipes (user_id, recipe_id)
            VALUES ($1, $2)`,
                [userId, recipeId]
            )
        }
    }

    // returns all of a users saved recipes
    static async getRecipes(userId) {
        const result = await db.query(`
            SELECT r.name, r.recipe_id, r.ww_points
            FROM users_recipes u 
            JOIN recipes r
            ON r.recipe_id = u.recipe_id
            WHERE user_id=$1`, [userId]
        )

        const savedRecipes = result.rows
        return savedRecipes
    }

    static async remove(recipeId) {
        const result = await db.query(
            `DELETE FROM recipes 
            WHERE recipe_id = $1
            RETURNING name
        `, [recipeId])
        if (!result) throw new NotFoundError(`Table does not contain recipeId: ${recipeId}.`)
        return result.rows
    }

}


module.exports = Recipe;