const mongoose = require('mongoose');

function mongoConnection() {
    mongoose.connect('mongodb://localhost:27017/PasswordManagementSystem', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }, (err, data) => {
        console.log(`mongo error, ${err}`)
        console.log(`mongo data, ${data}`)
    });
}
mongoConnection()

module.exports = {
    checkEmail: (Model, userObject) => {
        return new Promise(function(resolve, reject) {
            Model.findOne({ email: userObject.email }, function(err, dbData) {
                if (!err) {
                    resolve(dbData)
                        //  console.log("check mail", dbData);
                } else {
                    reject(err)
                }
            })
        })

    },
    insertDocument: (Model, userObject) => {
        const dataModel = new Model(userObject)
        return new Promise(function(resolve, reject) {
            dataModel.save((err, dbData) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(dbData)
                    console.log("insert data", dbData);
                }
            })
        })
    },
    getUserLoginDetails: (Model, userObject) => {
        return new Promise(function(resolve, reject) {
            Model.findOne({ email: userObject.email },
                (err, dbData) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(dbData)
                    }
                })
        })
    },
    getUserDetails: (Model, filter) => {
        return new Promise(function(resolve, reject) {
            Model.find(filter, (err, dbData) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(dbData) //.populate('vaultDataModel', 'nomineeModel')
                }
            }).populate('vaultData').populate('nominee')
        })
    },
    updateProfile: (Model, filter, update) => {
        console.log("filter email in dbHelper", filter);
        console.log("update details in dbHelper", update);
        return new Promise(function(resolve, reject) {
            Model.findOneAndUpdate(filter, update, { new: true }, (err, dbData) => {
                console.log("data after find method", dbData);
                console.log("error after find method", err);
                if (!err && dbData) {
                    return resolve(dbData)
                        //  console.log("update profile details", dbData);
                } else {
                    return reject(err)
                        // console.log("error in update profile", err);
                }
            })
        })

    },



}