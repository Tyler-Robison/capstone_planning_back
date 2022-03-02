


const axios = require("axios");
const express = require("express");

const { BadRequestError } = require("../expressError");
const SPOON_API_KEY = require('../secret')
const router = new express.Router();
const recipeIngredientURL = 'https://api.spoonacular.com/recipes/findByIngredients'
const complexSearch = 'https://api.spoonacular.com/recipes/complexSearch'
const { formatIngredients } = require('../Support/helpers')
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Recipe = require("../models/recipe");


// req.body = JSON body
// req.query = query string
// req.params = URL params

// both of these should require logged in!!!!!!!
// TODO: login verification

// router.get('/ingredient', async (req, res, next) => {
//     try {

//         const { ingredients } = req.query
//         console.log('ingred', ingredients)
//         const numResults = 5;

//         const formattedIngredients = formatIngredients(ingredients);

//         // const axiosRes = await axios.get(recipeIngredientURL, params)

//         const axiosRes = await axios.get(`${recipeIngredientURL}?ingredients=${formattedIngredients}&number=${numResults}&apiKey=${SPOON_API_KEY}`)
//         const recipes = axiosRes.data
//         console.log('axios res recipeByIng', recipes)
//         return res.status(200).json(recipes)
//     } catch (err) {
//         return next(err);
//     }
// })


router.get('/complex', async (req, res, next) => {
    try {

        const { ingredients, nutrientObj } = req.query
        const formattedNutrients = JSON.parse(nutrientObj)

        // constructs URL nutrient string, skips any nutrients user didn't include in form. 
        // &calories=800&sodium=600
        const nutrientArr = [];
        for (const [key, value] of Object.entries(formattedNutrients)) {
            // if nutrient form isn't touched values will be null. 
            // blank string if nutrient form submitted with blank fields. 
            if (value !== '' && value !== null) {
                nutrientArr.push(`&${key}=${value}`)
            }
        }

        const nutrientStr = nutrientArr.join('');
        console.log('nut str', nutrientStr)
        const numResults = 5;
        const formattedIngredients = formatIngredients(ingredients);
        let axiosRes
        // handles empty nutrient string if user doesn't filter by any min/max nutrients. 
        if (nutrientStr.length === 0) {
            axiosRes = await axios.get(`${complexSearch}?includeIngredients=${formattedIngredients}&number=${numResults}&fillIngredients=true&apiKey=${SPOON_API_KEY}`)
            console.log('no constraints added')
        } else {
            axiosRes = await axios.get(`${complexSearch}?includeIngredients=${formattedIngredients}${nutrientStr}&number=${numResults}&fillIngredients=true&apiKey=${SPOON_API_KEY}`)
            console.log('constraints added')
        }

        const recipes = axiosRes.data
        console.log('axios recipes res', recipes)
        return res.status(200).json(recipes)

    } catch (err) {
        return next(err)
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
router.get('/:id', ensureCorrectUserOrAdmin, async (req, res, next) => {
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
router.post('/save/:id', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        const recipeDetail = req.body;
        const recipeId = recipeDetail.id;
        const recipeName = recipeDetail.title;
        const token = res.locals.user;
        const userId = token.id;
        const wwPoints = recipeDetail.weightWatcherSmartPoints;
        // console.log('rec detail', recipeDetail)

        const recipeRes = await Recipe.saveRecipe(userId, recipeName, recipeId, wwPoints)
        // change to 201 status
        return res.json({ savedRecipe: recipeRes })
    } catch (err) {
        console.log(err)
    }
})

// deletion is based on user/recipe id, both of which are in URL params
router.delete('/delete/:id/:recipeId', ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
        // const token = res.locals.user
        // const userId = token.id
        const { recipeId } = req.params
        const deleteRes = await Recipe.remove(recipeId)
        return res.json({ deleted: deleteRes });
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;