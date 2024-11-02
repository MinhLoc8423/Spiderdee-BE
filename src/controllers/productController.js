const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const validateUtils = require('../utils/validateUtils');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category_id').limit(50);
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
        const product = await Product.findById(id).populate('category_id');
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
        const { name, description, price, size,image, category_id } = req.body;
        var check = validateUtils.validateString(name)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateString(size)
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
            size,
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
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Product ID is required'
            });
        }
        const { name, description, size,price, image, category_id } = req.body;

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

        if (!size) {
            return res.status(400).json({
                status: 400,
                message: "Size is required",
            });
        }

        const updateData = {
            name,
            description,
            price,
            image,
            size,
            category_id,
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate('category_id');

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
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Product ID is required'
            });
        }
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

exports.searchProducts = async (req, res) => {
    try {
        let query = {};

        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        if (req.query.category) {
            query.category_id = req.query.category;
        }

        if (req.query.min_price && req.query.max_price) {
            query.price = { $gte: req.query.min_price, $lte: req.query.max_price };
        } else if (req.query.min_price) {
            query.price = { $gte: req.query.min_price };
        } else if (req.query.max_price) {
            query.price = { $lte: req.query.max_price };
        }
        console.log(query);

        const products = await Product.find(query).populate('category_id').limit(50);
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: products,
        });
    } catch (error) {
        res.status(500).json({ status: 200, message: 'Error searching products', error: error.message });
    }
};
