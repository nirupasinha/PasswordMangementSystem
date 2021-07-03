const { VaultData, User } = require("../models");
const db = require("../utils/dbHelper")
const { responseHandler } = require("../utils/responseHandler")
const Cryptr = require('cryptr');
const cryptr = new Cryptr('PMS_Password_SECRET_KEY');
module.exports = {
    insert: (req, res) => {
        userObject = req.body;
        let password = userObject.profilePassword;
        let encryptedPassword = cryptr.encrypt(password);
        userObject.profilePassword = encryptedPassword;

        let emailId = req.userMail; //this come from jwt.js file after verify jwt token 
        db.insertDocument(VaultData, userObject).then(function successResponse(dbData) {
            if (dbData !== null) {
                let filter = { email: emailId }
                let update = {
                        $push: {
                            vaultData: dbData._id
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
                let message = `Password added !`;
                return responseHandler(res, 200, message, null, dbData);
            }

        }).catch(function errorResponse(err) {
            let message = `error....... `;
            return responseHandler(res, 500, message, err);
        });
    },
    update: (req, res) => {
        const userObject = req.body;
        let password = userObject.profilePassword;
        let encryptedPassword = cryptr.encrypt(password);
        userObject.profilePassword = encryptedPassword;
        console.log("user details from postman", userObject);
        let newUserObject = new Object();
        if (userObject.passwordCategory && userObject.passwordCategory !== "") {
            newUserObject.passwordCategory = userObject.passwordCategory;
        }
        if (userObject.profileID && userObject.profileID !== "") {
            newUserObject.profileID = userObject.profileID;
        }
        if (userObject.profilePassword && userObject.profilePassword !== "") {
            newUserObject.profilePassword = userObject.profilePassword;
        }
        console.log("user email ", req.userMail);
        let filter = { _id: userObject._id };
        console.log("filter email in controller", filter);
        console.log("update details in controller", newUserObject);
        db.updateProfile(VaultData, filter, newUserObject).then(function successResponse(dbData) {
            console.log("****************", dbData);
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
        let message;
        let emailId = req.userMail;
        let filter = { email: emailId };
        db.getUserDetails(User, filter).then(function successResponse(dbData) {
            console.log("user details ", dbData[0].vaultData);
            if (!dbData) {
                message = `error in getting User Details`;
                return responseHandler(res, 404, message, err)
            }
            let passFilter = { "_id": { "$in": dbData[0].vaultData } }
            db.getUserDetails(VaultData, passFilter).then(function successResponse(dbData) {
                console.log(dbData);
                if (!dbData) {
                    message = `error in getting User password Details`;
                    return responseHandler(res, 404, message, err)
                }
                dbData.forEach(function(elem, i) {
                    if (!elem.profilePassword) {
                        throw ("profilePassword not found")
                    }
                    let decryptedPassword = cryptr.decrypt(elem.profilePassword);
                    dbData[i].profilePassword = decryptedPassword;
                })
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
    }
}