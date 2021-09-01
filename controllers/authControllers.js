const { validationResult } = require("express-validator");
const { User } = require("../models");
const db = require("../utils/dbHelper")
const { responseHandler } = require("../utils/responseHandler")
const bcrypt = require("../utils/bcrypt")
const { jwt } = require("../middleware");
const { mailHelper: { mailHelper: sendEmail } } = require("../middleware") //call nested object and rename in object destructing
const { v4: uuidv4 } = require('uuid');

module.exports = {
    signup: (req, res) => {
        const userObject = req.body;
        const errors = validationResult(req);
        const emailId = userObject.email;
        userObject.id = uuidv4();
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
                            let mailOptions = {
                                from: 'nirupasinha99@gmail.com',
                                to: emailId,
                                subject: 'Password Management System',
                                text: `Your Registration is Done .`

                            };
                            // sendEmail(mailOptions)
                            const message = "Users  Registered Successfully";
                            responseHandler(res, 200, message, null, dbData)
                        }).catch(function errorResponse(err) {
                            console.log("Errror ===>>> ",err)
                            const message = "Server Error";
                            responseHandler(res, 500, message, err)
                        })
                    }
                })

            } else {
                const message = "Users already Registered";
                responseHandler(res, 400, message, null, dbData)
            }

        }).catch(function errorResponse(err) {
            const message = "Internal Server Error";
            responseHandler(res, 500, message, err)
        })
    },

    login: (req, res) => {
        const userObject = req.body;
        const emailId = userObject.email;
        console.log("user data from postman", userObject, emailId)
        db.getUserLoginDetails(User, userObject).then(function successResponse(dbData) {
            console.log("data after get method in controller", dbData)
            bcrypt.comparePassword(userObject.password, dbData.password, function(err, passwordMatched) {
                if (err) {
                    return responseHandler(res, 500, "bcrypt error", err);
                } else {
                    const userRole = dbData.role;
                    if (passwordMatched == true) {
                        jwt.createJWTToken(emailId, userRole).then(function successCreate(createdToken) {
                            let message = `User Login Successfully with token created `;
                            return responseHandler(res, 200, message, null, createdToken);
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
        const emailId = userObject.email;
        db.checkEmail(User, userObject).then(function successResponse(dbData) {
            jwt.createForgotPassToken(dbData.email).then(function successCreate(createdToken) {
                let mailOptions = {
                    from: 'nirupasinha99@gmail.com',
                    to: emailId,
                    subject: 'Password Reset Link',
                    html: `<h2>Please click on given link to reset your password</h2>
                    <p>Reset password Token:- ${createdToken}</p>`
                };
                sendEmail(mailOptions)
                let filter = { email: emailId };
                let update = {
                    resetLink: createdToken
                }
                db.updateProfile(User, filter, update).then(function successResponse(dbData) {
                    if (dbData) {
                        let message = `Reset link sent your email Id is Successfully , Please Check your Email Id and reset your Password`;
                        return responseHandler(res, 200, message, null, null)
                    }
                }).catch(function errorResponse(err) {
                    let message = `error...`;
                    return responseHandler(res, 500, message, err)
                })
            }).catch(function errorCreateToken(err) {
                let message = `error in token generation`;
                return responseHandler(res, 500, message, err);
            });
        }).catch(function errorResponse(err) {
            let message = `user does not exist`;
            return responseHandler(res, 500, message, err);
        })
    },
    resetPassword: (req, res) => {
        userObject = req.body
        newPassword = userObject.newPassword;
        const token = req.headers.authorization;
        emailId = req.email;
        console.log(token, emailId);
        bcrypt.hashPassword(newPassword, function(err, hashedPassword) {
            if (err) {
                let message = `error in hashing password`;
                return handler.responseHandler(res, 400, message, err);
            } else {
                let filter = { resetLink: token };
                let update = {
                    password: hashedPassword
                }
                db.updateProfile(User, filter, update).then(function successResponse(dbData) {
                    console.log("after update hashed password", dbData);
                    let message = `Your Password is Changed`;
                    return responseHandler(res, 200, message, null, dbData)

                }).catch(function errorResponse(err) {
                    let message = `error...`;
                    return responseHandler(res, 500, message, err)
                })
            }
        })

    }
}