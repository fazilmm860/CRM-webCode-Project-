const express = require('express');
const authController = require('../controllers/authController')

const router = express.Router();

router
    .post('/register', authController.signup_register);

module.exports = router;