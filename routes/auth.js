
const express = require("express");

const { BadRequestError } = require("../expressError");
const router = new express.Router();
const jsonschema = require("json-schema");
const User = require('../models/user')
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");


/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        console.log('login user', user)
        const token = createToken(user);
        console.log('login token', token)
        // return res.json({ token, user });
        // modify in attempt to get user info to front-end
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

/** POST /auth/register:   { user } => { token }
*
* user must include { username, password, firstName, lastName, email }
*
* Returns JWT token which can be used to authenticate further requests.
*
* Authorization required: none
*/

router.post("/register", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newUser = await User.register({ ...req.body, isAdmin: false });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;