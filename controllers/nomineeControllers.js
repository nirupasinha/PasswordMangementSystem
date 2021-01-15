const { Nominee, User } = require("../models");
const db = require("../utils/dbHelper")
const { responseHandler } = require("../utils/responseHandler")
const { mailHelper: { mailHelper: sendEmail } } = require("../middleware") //call nested object and rename in object destructing
const rn = require('random-number');
module.exports = {
    insert: (req, res) => {
        userObject = req.body;
        let emailId = req.userMail; //this come from jwt.js file after verify jwt token 
        db.insertDocument(Nominee, userObject).then(function successResponse(dbData) {
            if (dbData !== null) {
                let filter = { email: emailId }
                let update = {
                        $push: {
                            nominee: dbData._id
                        }
                    }
                    //console.log("insert data after inserting in vault model", dbData, filter, update);
                db.updateProfile(User, filter, update).then(function successResponse(dbData) {
                    //console.log("update profile", dbData);
                    if (!dbData) {
                        let message = `user does not exist in database`;
                        return responseHandler(res, 404, message, err)
                    } else {
                        let message = `Update User Profile successfully`;
                        return responseHandler(res, 200, message, null, dbData)
                    }
                }).catch(function errorResponse(err) {
                    let message = `error...`;
                    return responseHandler(res, 400, message, err)
                })
            } else {
                let message = `Nominees added !`;
                return responseHandler(res, 200, message, null, dbData);
            }

        }).catch(function errorResponse(err) {
            let message = `error....... `;
            return responseHandler(res, 500, message, err);
        });
    },
    update: (req, res) => {
        let message;
        const userObject = req.body;
        let newUserObject = new Object();
        if (userObject.name && userObject.name !== "") {
            newUserObject.name = userObject.name;
        }
        if (userObject.phone && userObject.phone !== "") {
            newUserObject.phone = userObject.phone;
        }
        if (userObject.email && userObject.email !== "") {
            newUserObject.email = userObject.email;
        }
        if (userObject.relation && userObject.relation !== "") {
            newUserObject.relation = userObject.relation;
        }
        if (userObject.age && userObject.age !== "") {
            newUserObject.age = userObject.age;
        }
        if (userObject.address && userObject.address !== "") {
            newUserObject.address = userObject.address;
        }
        let filter = { _id: userObject._id };
        db.updateProfile(Nominee, filter, newUserObject).then(function successResponse(dbData) {
            if (!dbData) {
                message = `user does not exist in database`;
                return responseHandler(res, 200, message, null, dbData)
            } else {
                message = `Update User Profile successfully`;
                return responseHandler(res, 200, message, null, dbData)
            }
        }).catch(function errorFunction(err) {
            message = `error...`;
            return responseHandler(res, 500, message, err)
        })

    },
    delete: (req, res) => {


    },
    view: (req, res) => {
        let message;
        let emailId = req.userMail;
        let filter = { email: emailId };
        db.getUserDetails(User, filter).then(function successResponse(dbData) {
            // console.log("user details ", dbData[0].nominee);
            if (!dbData) {
                message = `error in getting User Details`;
                return responseHandler(res, 404, message, err)
            }
            let passFilter = { "_id": { "$in": dbData[0].nominee } }
            db.getUserDetails(Nominee, passFilter).then(function successResponse(dbData) {
                if (!dbData) {
                    message = `error in getting User password Details`;
                    return responseHandler(res, 404, message, err)
                }
                message = `get User password Details`;
                return responseHandler(res, 200, message, null, dbData)

            }).catch(function errorResponse(err) {
                message = `error in getting user password details`;
                return responseHandler(res, 400, message, err)
            })

        }).catch(function errorResponse(err) {
            message = `Error in getting user details`;
            return responseHandler(res, 400, message, err)
        })
    },
    sendMail: (req, res) => {
        let userObject = req.body;
        let message;
        let filter = { email: userObject.email };
        db.getUserDetails(User, filter).then(function successResponse(dbData) {
            if (!dbData) {
                message = `error in getting User Details`;
                return responseHandler(res, 404, message, err)
            }
            let passFilter = { "_id": { "$in": dbData[0].nominee } }
            db.getUserDetails(Nominee, passFilter).then(function successResponse(dbData) {

                if (!dbData) {
                    message = `error in getting User password Details`;
                    return responseHandler(res, 404, message, err)
                }
                let arr = [];
                dbData.forEach(function(elem) {
                    if (!elem.email) {
                        throw ("profilePassword not found")
                    }
                    var options = {
                        min: -1000,
                        max: 1000,
                        integer: true
                    }
                    let otp = rn(options);
                    let mailOptions = {
                        from: 'nirupasinha99@gmail.com',
                        to: elem.email,
                        subject: 'Password Reset Link',
                        html: `<h2>Please click on given link to reset your password</h2>
                <p>Reset password OTP (valid only for 24hrs):- ${otp}</p>`
                    };
                    sendEmail(mailOptions)
                    arr.push({ otp, email: elem.email })

                })
                console.log("otp array ", arr); //
                db.updateProfile(User, filter, { OTP: arr })
                message = `Send OTP Successfully To all Nominees!!!!`;
                return responseHandler(res, 200, message, null, dbData)

            }).catch(function errorResponse(err) {
                message = `error in getting user Nominee details`;
                return responseHandler(res, 400, message, err)
            })

        }).catch(function errorResponse(err) {
            message = `Error in getting user details`;
            return responseHandler(res, 400, message, err)
        })
    },
    verifyOTP: (req, res) => {

    }

}