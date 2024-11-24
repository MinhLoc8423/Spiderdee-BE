const Role = require("../models/roleModel");

exports.getRoles = async (req, res) => {
    try {
        const reviewData = await Role.find({});
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: reviewData,
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error while retrieving role', errors: error });
    }
};