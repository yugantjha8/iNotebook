const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator'); //it is used to validate inputs
const res = require('express/lib/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "KalaPelaNeela";

// creating/singup a user using post method- /api/auth/createuser -- No login required
router.post('/createuser', [
    //below are the validation for input from user
    body('name', 'Name length should be 5 to 20 characters').isLength({ min: 5 }),
    body('password', 'Password length should be 5 to 20 characters').isLength({ min: 5 }),
    body('email', 'Enter valid email address').isEmail()
], async (req, res) => {
    // for errs and bad request, like if validation fails
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        // finding a user with given email if exists then err, otherwise creating user
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: 'Email already exists!!!' });
        }

        // hashing the password
        const pass = req.body.password.toString();
        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(pass, salt);
        // adding user in the db
        user = await User.create({
            name: req.body.name.toString(),
            email: req.body.email.toString(),
            password: securedPassword //adding hashed pass to db
        })
        // res.json(user); --> instead of sending user obj we will send auth token to verify user at any step

        //using this we can get the whole user object when user provide authToken
        const data = {
            user: {
                id: user.id
            }
            // id: user.id
        }
        //used to check the auth of the user at any stage
        const authToken = jwt.sign(data, JWT_SECRET);//instead of data --> { id: user.id }
        success = true;
        res.json({ success, authToken });
    } catch (err) {
        // if unknown err occurs
        return res.status(500).send("Internal server error");
    }
});

// login a user using post- /api/auth/login -> no login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail().exists(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    // if err then return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email } = req.body; // destructuring so that we can get email and pass from req body
    const password = req.body.password.toString();

    try {
        //getting user from db if not exists then return error
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: 'Please enter correct credentials' });
        }

        const comparedPass = await bcrypt.compare(password, user.password);
        if (!comparedPass) {
            return res.status(400).json({ success, error: 'Please enter correct credentials' });
        }

        const data = {
            user: {
                id: user.id
            }
            // id: user.id
        }
        //used to check the auth of the user at any stage
        const authToken = jwt.sign(data, JWT_SECRET);//instead of data --> { id: user.id }
        success = true;
        res.json({ success, authToken });
    } catch (err) {
        // if unknown err occurs
        console.log(err);
        return res.status(500).send("Internal server error");
    }
});

// getting loggedin user details- /api/auth/getuser -> login required
// fetchuser is a middleware-- so that we can use it anywhere we want just by calling it
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log(userId);
        const user = await User.findById(userId).select('-password');
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error!!!' });
    }
})

module.exports = router;