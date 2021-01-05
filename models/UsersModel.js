//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
let userSchema = mongoose.Schema;
let SomeModelSchema = new userSchema({
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
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "addressModel"
    }]
})

let UserModel = mongoose.model('UserModel', SomeModelSchema);
module.exports = UserModel;