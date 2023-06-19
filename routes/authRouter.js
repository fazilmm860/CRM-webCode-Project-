const express = require('express');
const authController = require('../controllers/authController');
const { verify } = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


router
    .post('/register', authController.signup_register);

router
    .post('/login', authController.login);
router
    .get('/allusers', verify, async (req, res) => {
        try {
            const result = await User.find();
            res.send(result)
        }
        catch (error) {
            res.status(400).send(error)
        }
    })

module.exports = router;