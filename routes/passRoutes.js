const express = require('express');
const controller = require('../controllers');
const { jwt: { verifyJWTToken } } = require('../middleware');

const router = express.Router();

router.post('/add-password', verifyJWTToken, controller.password.addPassword);
module.exports = router;