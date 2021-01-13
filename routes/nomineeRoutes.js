const express = require('express');
const controller = require('../controllers');
const { jwt: { verifyJWTToken } } = require('../middleware');

const router = express.Router();

router.post('/add-nominee', verifyJWTToken, controller.nominee.insert);
router.post('/update-nominee', verifyJWTToken, controller.nominee.update);
router.post('/view-nominee', verifyJWTToken, controller.nominee.view);
router.post('/send-mail', controller.nominee.sendMail);
//router.post('/delete-nominee', verifyJWTToken, controller.nominee.update);
module.exports = router;