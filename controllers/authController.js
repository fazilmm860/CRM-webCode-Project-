const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const user = require('../models/User')
const Joi = require('@hapi/joi');
const User = require('../models/User');
//Validation of user Inputs
const registerSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    password: Joi.string().min(6).required()
})


//Signup User

module.exports.signup_register = async (req, res) => {

    //Checking if user email already exists

    const emailExist = await user.findOne({ email: req.body.email })

    //if Email exist then return

    if (emailExist) {
        res.status(400).send("Email already Exist")
        return;
    }

    //Hastag the Password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Process of Adding New User

    const User = new user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        //Validation of User Inputs

        const { error } = await registerSchema.validateAsync(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        } else {
            const saveUser = await User.save();
            res.status(200).send('User Created successfully');
        }
    }
    catch (error) {
        res.status(400).send(`error:${error}`)
    }
}

//Login Schema
const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});


//Login User
module.exports.login = async (req, res) => {

    //Checking if user Email Exsists

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json("Incorrect Email")

    // Checking if user password mactches

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("Incorrect Password")

    try {
        //Validation of User Inputs

        const { error } = await loginSchema.validateAsync(req.body);

        if (error) {
            res.status(400).send(error.details[0].message)
            return;
        } else {

            //sending Back the token 
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
            res.header("auth-token", token).send(token)
        }
    }
    catch (err) {
        res.status(400).json(err)
    }
}
module.exports.verify = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access Denied")
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next()

    }
    catch (err) {
        res.status(400).json("Invalid Token")
    }
}

