const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const user = require('../models/User')
const Joi = require('@hapi/joi');
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