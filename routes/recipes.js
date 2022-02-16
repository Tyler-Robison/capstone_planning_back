


const axios = require("axios");
const express = require("express");

const { BadRequestError } = require("../expressError");
const SPOON_API_KEY = require('../secret')
const router = new express.Router();
const recipeIngredientURL = 'https://api.spoonacular.com/recipes/findByIngredients'
const { formatIngredients } = require('../Support/helpers')

// req.body = JSON body
// req.query = query string
// req.params = URL params

// router.post('/ingredient', async (req, res, next) => {
//     try {

//         const { ingredients } = req.body
//         const numResults = 5;

//         const formattedIngredients = formatIngredients(ingredients);

//         // const axiosRes = await axios.get(recipeIngredientURL, params)

//         const axiosRes = await axios.get(`${recipeIngredientURL}?ingredients=${formattedIngredients}&number=${numResults}&apiKey=${SECRET_KEY}`)
//         const recipes = axiosRes.data
//         console.log('axios res recipeByIng', recipes)
//         return res.status(200).json(recipes)
//     } catch (err) {
//         return next(err);
//     }
// })

// router.post('/detail', async (req, res, next) => {
//     try {

//         const { recipeId } = req.body;
//         const axiosRes = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${SECRET_KEY}`)
//         const recipeDetail = axiosRes.data
//         console.log('axios res recDetail', recipeDetail)
//         return res.json(recipeDetail)
//     } catch (err) {
//         return next(err)
//     }
// })

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

router.get('/detail', async (req, res, next) => {
    try {

        const { recipeId } = req.query
        const axiosRes = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${SPOON_API_KEY}`)
        const recipeDetail = axiosRes.data
        const nutritionRes = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${SPOON_API_KEY}`)
        const nutritionDetail = nutritionRes.data
        console.log('nutrition info', nutritionRes.data)
        // console.log('axios res recDetail', recipeDetail)
        return res.json({recipe: recipeDetail, nutrition: nutritionDetail})
    } catch (err) {
        return next(err)
    }
})

module.exports = router;