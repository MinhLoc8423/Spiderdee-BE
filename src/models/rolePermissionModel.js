const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RolePermissionSchema = new Schema({
    role_id: {
        type: ObjectId,
        ref: 'Role',
        required: true
    },
    permission_id: {
        type: ObjectId,
        ref: 'Permission',
        required: true
    }
}, { versionKey: false });

const RolePermission = mongoose.model('Roleandpermission', RolePermissionSchema);
module.exports = RolePermission;
