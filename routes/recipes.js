


const axios = require("axios");
const express = require("express");

const { BadRequestError } = require("../expressError");
const SPOON_API_KEY = require('../secret')
const router = new express.Router();
const recipeIngredientURL = 'https://api.spoonacular.com/recipes/findByIngredients'
const { formatIngredients } = require('../Support/helpers')
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Recipe = require("../models/recipe");


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
        // console.log('nutrition info', nutritionRes.data)
        // console.log('axios res recDetail', recipeDetail)
        return res.json({ recipe: recipeDetail, nutrition: nutritionDetail })
    } catch (err) {
        return next(err)
    }
})

// get all saved recipes for a given user
router.get('/:username', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const token = res.locals.user
        const userId = token.id
        const recipeRes = await Recipe.getRecipes(userId)
        return res.json({ recipes: recipeRes })
    } catch (err) {
        console.log(err)
    }
})

// save recipe for a given user
router.post('/save/:username', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        
        const recipeDetail = req.body
        const recipeId = recipeDetail.id
        const recipeName = recipeDetail.title
        const token = res.locals.user
        const userId = token.id

        const recipeRes = await Recipe.saveRecipe(userId, recipeName, recipeId)
        // change to 201 status
        return res.json({ savedRecipe: recipeRes })
    } catch (err) {
        console.log(err)
    }
})

// deletion should be based on user/recipe id, both of which should be in URL params
// ensureCorrentUserOrAdmin is setup to check username only
router.delete('/delete/:username', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const token = res.locals.user
        const userId = token.id
        const deleteRes = await Recipe.remove()
    } catch(err) {
        console.log(err)
    }
})

module.exports = router;