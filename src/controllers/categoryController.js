
const Category = require('../models/categoryModel');
const validateUtils = require('../utils/validateUtils');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error while retrieving category', errors: error });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Category ID is required'
            });
        }
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                status: 404,
                message: 'Category not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: category,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error while retrieving category',
            errors: error
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        var check = validateUtils.validateString(name)
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        const createData = new Category({
            name
        });
        const savedCategory = await createData.save();

        res.status(201).json({
            status: 201,
            message: "Category created successfully",
            data: savedCategory,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while creating category",
            errors: error,
        });
    }
};


exports.updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Category ID is required'
            });
        }
        const { name } = req.body;

        let check = validateUtils.validateString(name);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        const updateData = {
            name,
        };

        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedCategory) {
            return res.status(404).json({
                status: 404,
                message: "Category not found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while updating category",
            errors: error,
        });
    }
};


exports.deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Category ID is required'
            });
        }
        const deletedProduct = await Category.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                status: 404,
                message: "Category not found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while deleting category",
            errors: error,
        });
    }
};

exports.searchCategories = async (req, res) => {
    try {
        let query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        const categories = await Category.find(query);
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: categories,
        });
    } catch (error) {
        res.status(500).json({ status: 200, message: 'Error searching categories', error: error.message });
    }
};
