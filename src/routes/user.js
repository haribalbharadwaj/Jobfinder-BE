const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validateUser');

const {
    getUser,
    signUpUser,
    loginUser
} = require('../controller/user');

router.get('/users', getUser);

router.post('/users/signup',validateUser,signUpUser);

router.post('/users/login',loginUser);

module.exports =router;