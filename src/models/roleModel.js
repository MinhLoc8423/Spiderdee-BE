const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RoleSchema = new Schema({
    role_id: {
        type: ObjectId,
    },
    role_name: {
        type: String,
        required: true,
        unique: true
    }
}, { versionKey: false }); 

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;