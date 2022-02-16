


const axios = require("axios");
const express = require("express");

const { BadRequestError } = require("../expressError");
const SPOON_API_KEY = require('../secret')
const router = new express.Router();
const generateMealPlanURL = 'https://api.spoonacular.com/mealplanner/generate'

// req.body = JSON body
// req.query = query string
// req.params = URL params


router.get('/ingredient', async (req, res, next) => {
    try {

        const { ingredients } = req.query
        console.log('ingred', ingredients)
        const numResults = 5;

        const formattedIngredients = formatIngredients(ingredients);

        // const axiosRes = await axios.get(recipeIngredientURL, params)

        const axiosRes = await axios.get(`${recipeIngredientURL}?ingredients=${formattedIngredients}&number=${numResults}&apiKey=${SPOON_API_KEY}`)
        const recipes = axiosRes.data
        console.log('axios res recipeByIng', recipes)
        return res.status(200).json(recipes)
    } catch (err) {
        return next(err);
    }
})

router.get('/', async (req, res, next) => {
    try {

        const { calories } = req.query


        const axiosRes = await axios.get(`${generateMealPlanURL}?apiKey=${SPOON_API_KEY}&timeFrame=day&targetCalories=${calories}`)
        const meals = axiosRes.data
        console.log('axios res meals', meals)

        // const recipes = axiosRes.data
        // console.log('axios res recipeByIng', recipes)
        return res.status(200).json(meals)
    } catch (err) {
        return next(err);
    }
})



module.exports = router;