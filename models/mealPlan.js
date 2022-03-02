"use strict";

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class MealPlan {

    static async createMealPlan(id, recipe_id, day) {
        console.log('create meal', id, recipe_id, day)
        const result = await db.query(
            `INSERT INTO user_mealplan
                (user_id, recipe_id, day)
                VALUES ($1, $2, $3) 
                RETURNING user_id AS "id", recipe_id, day`,
            [id, recipe_id, day]
        )
        // console.log('backend result', result.rows[0])
        return result.rows[0]
    }

    static async getMealPlan(id) {
        const result = await db.query(
            `SELECT m.id, m.day, r.recipe_id, r.name, r.ww_points
            FROM user_mealplan m
            JOIN recipes r
            ON r.recipe_id = m.recipe_id
            WHERE m.user_id = $1;`,
            [id]
        )
            console.log('got meal plan', result.rows)
        return result.rows
    }

    static async deleteMeal(id) {
        const result = await db.query(
            `DELETE
            FROM user_mealplan
            WHERE id = $1
            RETURNING id`,
            [id],
        )

        const deleted = result.rows[0];

        if (!deleted) throw new NotFoundError(`No id: ${id}`);
    }



}


module.exports = MealPlan;