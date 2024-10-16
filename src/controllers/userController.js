const Role = require('../models/roleModel');
const User = require('../models/userModel');
const validateUtils = require('../utils/validateUtils');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("first_name last_name email phone_number avatar role_id createdAt updatedAt").populate('role_id');
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: {
                users
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required'
            });
        }
        const user = await User.findById(req.params.id).populate('role_id');
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                avatar: user.avatar,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role_id,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: 500,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Product ID is required'
            });
        }
        const { first_name, last_name, phone_number, avatar } = req.body;
        let check = validateUtils.validateString(first_name);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(last_name);
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateNumber(phone_number);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(avatar);
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        const updateData = {
            first_name,
            last_name,
            phone_number,
            avatar,
        };
        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        res.status(200).json({
            status: 200, 
            message: 'User updated successfully', 
            data: {
                role: user.role_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        res.status(400).json({ status: 400, message: 'Error updating user', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Product ID is required'
            });
        }
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        res.status(200).json({ status: 200, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error deleting user', error: error.message });
    }
};