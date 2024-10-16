const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PermissionSchema = new Schema({
    permission_id: {
        type: ObjectId,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    }
});

const Permission = mongoose.model('Permission', PermissionSchema);
module.exports = Permission;
