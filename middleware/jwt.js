const jwt = require('jsonwebtoken');
const handler = require("../utils/responseHandler")
const { JWT_PRIVATE_KEY, RESET_PASSWORD_KEY } = require("../config/constant")
    //create jwt token
function createJWTToken(emailId, userRole) {
    return new Promise(function(resolve, reject) {
        jwt.sign({ email: emailId, role: userRole }, JWT_PRIVATE_KEY, {
            expiresIn: "1d"
        }, function(err, token) {
            if (!err) {
                resolve(token)
            } else {
                reject(err)
            }
        })
    })
}


//verify the jwt token
function verifyJWTToken(req, res, next) {
    const token = req.headers.authorization;
    console.log("token from postman", token)
    return new Promise(function(resolve, reject) {
        jwt.verify(token, JWT_PRIVATE_KEY, function(err, decoded) {
            if (!err) {
                req.userDetails = decoded.email;
                req.userRole = decoded.role;
                resolve(token)
                next();
            } else {
                let message = `token is not found`;
                return handler.responseHandler(res, 500, message, err);
            }
        });
    })
}
//create jwt for forgot password
function createJWTTokenForgot(emailId) {
    return new Promise(function(resolve, reject) {
        jwt.sign({ email: emailId }, RESET_PASSWORD_KEY, {
            expiresIn: "1d"
        }, function(err, token) {
            if (!err) {
                resolve(token)
            } else {
                reject(err)
            }
        })
    })
}
module.exports = { createJWTToken, verifyJWTToken }