const express = require('express');
const controller = require('../controllers');
const { body } = require("express-validator")
const { jwt: { verifyForgotPassToken } } = require('../middleware');

const router = express.Router();

router.post('/signup',
    body('email').isEmail().normalizeEmail(),
    body('name').not().isEmpty().trim().escape(),
    controller.auth.signup
);
router.post('/login', controller.auth.login)
router.put('/forgot-password', controller.auth.forgotPassword)
router.put('/reset-password', verifyForgotPassToken, controller.auth.resetPassword)
module.exports = router;