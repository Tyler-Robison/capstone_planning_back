


const axios = require("axios");
const { query } = require("express");
const express = require("express");
const User = require('../models/user')
const { BadRequestError } = require("../expressError");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const SPOON_API_KEY = require('../secret');
const MealPlan = require("../models/mealPlan");
const router = new express.Router();
const generateMealPlanURL = 'https://api.spoonacular.com/mealplanner/generate'

// req.body = JSON body
// req.query = query string
// req.params = URL params

router.patch('/:id/points', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const id = req.params.id
        const points = req.body.points
        console.log('id', id)
        console.log('points', points)
        const pointsRes = await User.setPoints(id, points)
        // change to 201 status
        return res.json({ savedRecipe: pointsRes })

    } catch (err) {
        return next(err);
    }
})

router.post('/:id/meal', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const id = req.params.id
        const { recipe_id, day } = req.body
        // console.log('id', id)
        // console.log('recipe id', recipe_id)
        // console.log('day', day)
        const mealRes = await MealPlan.createMealPlan(id, recipe_id, day)
        console.log('back test', mealRes)
        return res.json(mealRes)
    } catch (err) {
        return next(err)
    }
})

router.delete('/:id/:meal_id', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const { meal_id } = req.params
        const mealRes = await MealPlan.deleteMeal(meal_id)
        console.log(mealRes)
        return res.json(mealRes)
    } catch (err) {
        return next(err)
    }
})



module.exports = router;