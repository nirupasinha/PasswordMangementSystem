const express = require('express');
const controller = require('../controllers');
const { jwt: { verifyJWTToken } } = require('../middleware');


const router = express.Router();

router.post('/view', verifyJWTToken, controller.user.view)
router.post('/update', verifyJWTToken, controller.user.update)
module.exports = router;