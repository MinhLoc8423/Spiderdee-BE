const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Permission = require('../models/permissionModel');
const RolePermission = require('../models/rolePermissionModel');

const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).populate('role_id');
            const rolePermissions = await RolePermission.find({ role_id: user.role_id._id }).populate('permission_id');
            const hasPermission = rolePermissions.some(rp => rp.permission_id.name === permissionName);

            if (!hasPermission) {
                return res.status(403).json({ status: 403, message: "Access denied. You don't have permission to perform this action." });
            }
            next();
        } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500, message: 'Error while checking permissions', error: error });
        }
    }

};

module.exports = checkPermission;
