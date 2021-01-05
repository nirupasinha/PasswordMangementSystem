const { validationResult } = require("express-validator");
const { User } = require("../models");
const db = require("../utils/dbHelper")
const { responseHandler } = require("../utils/responseHandler")
const bcrypt = require("../utils/bcrypt")
const { jwt } = require("../middleware");
const { mailHelper: { mailHelper: sendEmail } } = require("../middleware") //call nested object and rename in object destructing
module.exports = {
    signup: (req, res) => {
        const userObject = req.body;
        const errors = validationResult(req);
        console.log(errors);
        db.checkEmail(User, userObject).then(function successResponse(dbData) {
            if (!dbData) {
                bcrypt.hashPassword(userObject.password, function(err, hashedPassword) {
                    if (err) {
                        let message = `error in email`;
                        return handler.responseHandler(res, 400, message, err);
                    } else {
                        userObject.password = hashedPassword;
                        db.insertDocument(User, userObject).then(function successResponse(dbData) {
                            sendEmail(userObject.email)
                            const message = "Users  Registered Successfully";
                            responseHandler(res, 200, message, null, dbData)
                        }).catch(function errorResponse(err) {
                            const message = "Server Error";
                            responseHandler(res, 500, message, err)
                        })
                    }
                })

            } else {
                const message = "Users already Registered";
                responseHandler(res, 200, message, null, dbData)
            }

        }).catch(function errorResponse(err) {
            const message = "Internal Server Error";
            responseHandler(res, 500, message, err)
        })
    },

    login: (req, res) => {
        const userObject = req.body;
        const emailId = userObject.email;
        db.getUserLoginDetails(User, userObject).then(function successResponse(dbData) {
            bcrypt.comparePassword(userObject.password, dbData.password, function(err, passwordMatched) {
                if (err) {
                    return responseHandler(res, 500, "bcrypt error", err);
                } else {
                    const userRole = dbData.role;
                    if (passwordMatched == true) {
                        jwt.createJWTToken(emailId, userRole).then(function successCreate(createdToken) {
                            let message = `User Login Successfully with token created `;
                            return responseHandler(res, 500, message, null, createdToken);
                        }).catch(function errorCreateToken(err) {
                            let message = `error in token generation`;
                            return responseHandler(res, 500, message, err);
                        });
                    } else {
                        let message = `Password does not matched`;
                        return responseHandler(res, 500, message, null, passwordMatched);
                    }
                }
            })
        }).catch(function errorResponse(err) {
            let message = `user does not exist`;
            return responseHandler(res, 500, message, err);
        });
    },
    forgotPassword: (req, res) => {
        // const { email } = req.body;
        const userObject = req.body;
        db.checkEmail(User, userObject).then(function successResponse(dbData) {
            //const taken =
            let message = `user does  exist`;
            return responseHandler(res, 500, message, null, dbData);
        }).catch(function errorResponse(err) {
            let message = `user does not exist`;
            return responseHandler(res, 500, message, err);
        })
    }

}