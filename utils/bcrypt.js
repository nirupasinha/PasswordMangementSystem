const bcrypt = require('bcrypt');
const saltRounds = 10;
const { User } = require("../models");


function hashPassword(password, callback) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            console.log(`error in genSalt method, ${err}`)
            callback(err, null)
        } else {
            console.log("salt generate", salt) //salt generate $2b$10$72BKYDbpa5L2dID2c2NZIe
            console.log("salt generate", password) //salt generate nirupa@123
            console.log(bcrypt.compareSync(password, "$2b$10$YSC4oyhMQ1TiYNtvB0h6Ae"))
            console.log(bcrypt.compareSync(password, "$2b$10$6nheXeWNfMr3DVmJYGn.Du"))
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    console.log(`error in hash method, ${err}`)
                } else {
                    console.log(`hash`)
                }
                callback(err, hash)
            });
        }
    });



}

function comparePassword(password, hashedPassword, callback) {
    bcrypt.compare(password, hashedPassword, function(err, result) {
        callback(err, result)
    });
}
//test purpose code
/* hashPassword("red4675", function(err, hash) {
    if (err) {
        console.log(`error in hash method, ${err}`)
    } else {
        console.log("hash", hash)
    }
}) */
module.exports = { hashPassword, comparePassword };