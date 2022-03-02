"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const MealPlan = require("../models/mealPlan");
const Recipe = require("../models/recipe");

const router = express.Router();


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same user as :username
 **/

router.get("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const id = req.params.id;
    const user = await User.get(id);
    const userMealplan = await MealPlan.getMealPlan(id);
    const recipeRes = await Recipe.getRecipes(id);
    // console.log('user', user)
    // console.log('user mealplan', userMealplan)
    // console.log('user recipes', recipeRes)
    user.mealplan = userMealplan
    user.recipes = recipeRes
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same user as :id
 **/

router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});



module.exports = router;