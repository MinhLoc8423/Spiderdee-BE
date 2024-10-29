
const Shipment = require('../models/shipmentModel');
const User = require('../models/userModel');
const validateUtils = require('../utils/validateUtils');

exports.getAllShippings = async (req, res) => {
    try {
        const shippings = await Shipment.find({});
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: shippings,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while retrieving shippings',
            errors: error,
        });
    }
};

exports.getShippingByById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Shipping ID is required'
            });
        }
        const shipping = await Shipment.findById(id);
        if (!shipping) {
            return res.status(404).json({
                status: 404,
                message: 'Shipping not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: shipping,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while retrieving shipping',
            errors: error,
        });
    }
};

exports.createShipping = async (req, res) => {
    try {
        const { name, address, user_id } = req.body;
        let check = validateUtils.validateString(name);
        if (check.valid) {
            return res.status(400).json({
                status: 400,
                message: check.message
            }); 
        }
        check = validateUtils.validateString(address);
        if (check.valid) {
            return res.status(400).json({
                status: 400,
                message: check.message
            });
        }
        const exsitUser = await User.findById(user_id);
        if (!exsitUser) {
            return res.status(400).json({
                status: 400,
                message: 'User does not exist'
            });
        }
        const shippingData = {
            name,
            address,
            user_id
        }
        const shipping = new Shipment(shippingData);
        await shipping.save();
        res.status(201).json({
            status: 201,
            message: "Shipping created successfully",
            data: shipping,
        });
    } catch (error) {
    }
};


exports.updateShippingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Shipping ID is required'
            });
        }
        const { name, address, user_id } = req.body;
        let check = validateUtils.validateString(name);
        if (check.valid) {
            return res.status(400).json({
                status: 400,
                message: check.message
            }); 
        }
        check = validateUtils.validateString(address);
        if (check.valid) {
            return res.status(400).json({
                status: 400,
                message: check.message
            });
        }
        const exsitUser = await User.findById(user_id);
        if (!exsitUser) {
            return res.status(400).json({
                status: 400,
                message: 'User does not exist'
            });
        }
        const updateData = {
            name,
            address,
            user_id
        };
        const updatedShipping = await Shipment.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedShipping) {
            return res.status(404).json({
                status: 404,
                message: "Shipping not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Shipping updated successfully",
            data: updatedShipping,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while updating shipping",
            errors: error,
        });
    }
};


exports.deleteShippingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Shipping ID is required'
            });
        }
        const deletedShipping = await Shipment.findByIdAndDelete(id);
        if (!deletedShipping) {
            return res.status(404).json({
                status: 404,
                message: "Shipping not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Shipping deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while deleting shipping",
            errors: error,
        });
    }
};


exports.getShippingsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required'
            });
        }
        const shippings = await Shipment.find({ user_id: id });
        if (!shippings) {
            return res.status(404).json({
                status: 404,
                message: "Shippings not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: shippings,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while retrieving shippings',
            errors: error,
        });
    }
};