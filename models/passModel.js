//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
let passSchema = mongoose.Schema;
let SomeModelSchema = new passSchema({
    id: {
        type: Number,
        unique: true,

    },
    passwordCategory: {
        type: String,

    },
    profileID: {
        type: String,

    },

    profilePassword: {
        type: String,
        required: true,
        unique: true,
    },

})

let PassModel = mongoose.model('PassModel', SomeModelSchema);
module.exports = PassModel;