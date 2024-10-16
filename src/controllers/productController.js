const Product = require('../models/productModel');
const validateUtils = require('../utils/validateUtils');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: products,
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error while retrieving product', errors: error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Product ID is required'
            });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error while retrieving product',
            errors: error
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category_id } = req.body;
        var check = validateUtils.validateString(name)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateString(description)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateNumber(price)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateString(image)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateString(category_id)
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        const newProduct = new Product({
            name,
            description,
            price,
            image,
            category_id,
        });
        const savedProduct = await newProduct.save();

        res.status(201).json({
            status: 201,
            message: "Product created successfully",
            data: savedProduct,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while creating product",
            errors: error,
        });
    }
};


exports.updateProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, description, price, image, category_id } = req.body;

        let check = validateUtils.validateString(name);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(description);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateNumber(price);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(image);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(category_id);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Product ID is required'
            });
        }

        const updateData = {
            name,
            description,
            price,
            image,
            category_id,
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while updating product",
            errors: error,
        });
    }
};


exports.deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while deleting product",
            errors: error,
        });
    }
};
