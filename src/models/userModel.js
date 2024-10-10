const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    user_id: {
        type: ObjectId,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
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
    },
    facebook_id: {
        type: String,
    },
    role_id: {
        type: ObjectId,
    },
});

const User = mongoose.model("User", UserSchema)
module.exports = User;