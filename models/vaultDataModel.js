//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
let vaultDataSchema = new mongoose.Schema({
    passwordCategory: {
        type: String,

    },
    profileID: {
        type: String,

    },
    profilePassword: {
        type: String,
        required: true,

    },
})

let VaultDataModel = mongoose.model('VaultDataModel', vaultDataSchema);
module.exports = VaultDataModel;