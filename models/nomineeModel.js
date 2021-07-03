//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
let nomineeSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    phone: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    relation: {
        type: String,
        required: true,
    },
    age: {
        type: Number
    },
    address: [{
        type: String
    }]
})

let NomineeModel = mongoose.model('NomineeModel', nomineeSchema);
module.exports = NomineeModel;