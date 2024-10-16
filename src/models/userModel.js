const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    user_id: {
        type: ObjectId,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true, 
        unique: true,
    },
    phone_number: {
        type: String,
        default: null,
    },
    avatar: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    otp: {
        type: String,
        default: null,
    },
    expiresAt: {
        type: String,
        default: null,
    },
    google_id: {
        type: String,
        default: null,
    },
    role_id: {
        type: ObjectId,
        ref: 'Role', 
        required: true
    },
}, { timestamps: true }); 

const User = mongoose.model("User", UserSchema)
module.exports = User;