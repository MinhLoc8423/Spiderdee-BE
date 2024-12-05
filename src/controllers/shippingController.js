// controllers/shipmentController.js
const Shipment = require('../models/shipmentModel');
const User = require('../models/userModel');
const validateUtils = require('../utils/validateUtils');

// Retrieve all shipments
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

// Retrieve shipment by ID
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

// Create a new shipping
exports.createShipping = async (req, res) => {
    try {
        const { name, address, user_id, isDefault } = req.body;
        console.log("Received data:", name, address, user_id, isDefault);

        // Validate input fields
        var check = validateUtils.validateString(name)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateString(address)
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        // Kiểm tra user tồn tại
        const exsitUser = await User.findById(user_id);
        if (!exsitUser) {
            return res.status(400).json({
                status: 400,
                message: 'User does not exist'
            });
        }

        // Đặt các địa chỉ khác về isDefault: false nếu địa chỉ mới là mặc định
        if (isDefault) {
            const updatedShippings = await Shipment.updateMany(
                { user_id },
                { isDefault: false }
            );
            console.log("Updated shipments:", updatedShippings);
        }

        // Tạo dữ liệu với isDefault
        const shippingData = {
            name,
            address,
            user_id,
            isDefault: isDefault
        };
        console.log("Data to save:", shippingData);

        // Lưu địa chỉ mới
        const shipping = new Shipment(shippingData);
        await shipping.save();

        // Kiểm tra kết quả đã lưu
        const savedShipping = await Shipment.findById(shipping._id);
        console.log("Saved shipping:", savedShipping);

        res.status(201).json({
            status: 201,
            message: "Shipping created successfully",
            data: savedShipping,
        });
    } catch (error) {
        console.error("Error while creating shipping:", error);  // Log chi tiết lỗi
        res.status(500).json({
            status: 500,
            message: 'Error while creating shipping',
            errors: error,
        });
    }
};


// Update a shipment by ID
exports.updateShippingById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, user_id, isDefault } = req.body;

        // Validate input fields
        var check = validateUtils.validateString(name)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateString(address)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        console.log("Updating shipping:", id, name, address, user_id, isDefault);
        // Kiểm tra user tồn tại
        console.log("Updating", user_id)
        const exsitUser = await User.findById(user_id);
        console.log("User exists:", exsitUser);
        if (!exsitUser) {
            return res.status(400).json({
                status: 400,
                message: 'User does not exist'
            });
        }

        // Đặt các địa chỉ khác về isDefault: false nếu địa chỉ mới là mặc định
        if (isDefault) {
            const updatedShippings = await Shipment.updateMany(
                { user_id },
                { isDefault: false }
            );
            console.log("Updated shipments:", updatedShippings);
        }
        const updateData = {
            name,
            address,
            user_id,
            isDefault: isDefault || false
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

// Delete a shipment by ID
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
            data: deletedShipping,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while deleting shipping",
            errors: error,
        });
    }
};

// Retrieve shipments by user ID
exports.getShippingsByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log("Getting shippings for user:", user_id);
        if (!user_id) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required'
            });
        }
        const shippings = await Shipment.find({ user_id });
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
