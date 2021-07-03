const express = require('express');
const controller = require('../controllers');
const { jwt: { verifyJWTToken } } = require('../middleware');

const router = express.Router();

router.post('/add-password', verifyJWTToken, controller.password.insert);
router.post('/update-password', verifyJWTToken, controller.password.update);
router.post('/delete-password', verifyJWTToken, controller.password.delete);
router.post('/view-password', verifyJWTToken, controller.password.view);
module.exports = router;