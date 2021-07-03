//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
let userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,

    },
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
    role: {
        type: String,
        default: "user",
        required: true,
        // enum: ["user", "admin", "superAdmin"]
    },
    password: { type: String, required: true },
    resetLink: {
        data: String,
        default: ''
    },
    vaultData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "VaultDataModel"
    }],
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddressModel"
    }],
    nominee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "NomineeModel"
    }],
    OTP: [{}],
    verifiedOTP: []
})

let UserModel = mongoose.model('UserModel', userSchema);
module.exports = UserModel;