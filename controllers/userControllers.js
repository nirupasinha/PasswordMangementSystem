const { User } = require("../models");
const db = require("../utils/dbHelper")
const { responseHandler } = require("../utils/responseHandler")
const bcrypt = require("../utils/bcrypt")
module.exports = {
    update: (req, res) => {
        const userObject = req.body;
        let newUserObject = new Object();
        if (userObject.name && userObject.name !== '') {
            newUserObject.name = userObject.name;
        }
        if (userObject.phone && userObject.phone !== "") {
            newUserObject.phone = userObject.phone;
        }
        if (userObject.email && userObject.email !== "") {
            newUserObject.email = userObject.email;
        }
        if (userObject.role && userObject.role !== "") {
            newUserObject.role = userObject.role;
        }
        let filter = { email: req.userMail };
        db.updateProfile(User, filter, newUserObject).then(function successResponse(dbData) {
            if (!dbData) {
                let message = `user does not exist in database`;
                return responseHandler(res, 200, message, null, dbData)
            } else {
                let message = `Update User Profile successfully`;
                return responseHandler(res, 200, message, null, dbData)
            }
        }).catch(function errorFunction(err) {
            let message = `error...`;
            return responseHandler(res, 500, message, err)
        })
    },
    delete: (req, res) => {

    },
    view: (req, res) => {
        const userObject = req.body;
        db.getUserDetails(User, userObject).then(function successResponse(dbData) {
            if (!dbData) {
                let message = `User does not exist`;
                return responseHandler(res, 400, message, null, dbData)
            } else {
                console.log("get data", dbData);
                let message = `User Details find Successfully!!!!`;
                return responseHandler(res, 200, message, null, dbData)
            }
        }).catch(function errorResponse(err) {
            let message = `e`;
            return responseHandler(res, 500, message, err)
        })
    }


}