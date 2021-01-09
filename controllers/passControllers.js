const { Password } = require("../models");
const db = require("../utils/dbHelper")
const { responseHandler } = require("../utils/responseHandler")
const Cryptr = require('cryptr');
const cryptr = new Cryptr('PMS_Password_SECRET_KEY');
module.exports = {
    addPassword: (req, res) => {
        userObject = req.body;
        let password = userObject.profilePassword;
        let encryptedPassword = cryptr.encrypt(password);
        userObject.profilePassword = encryptedPassword;
        db.insertDocument(Password, userObject).then(function successResponse(dbData) {
            let message = `Password added !`;
            return responseHandler(res, 200, message, null, dbData);
        }).catch(function errorResponse(err) {
            let message = `error....... `;
            return responseHandler(res, 500, message, err);
        });

    }
}