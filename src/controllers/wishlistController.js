
const WishList = require('../models/wishListModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const validateUtils = require('../utils/validateUtils');
const Wishlist = require('../models/wishListModel');

exports.getAllWishlists = async (req, res) => {
    try {
        const datas = await WishList.find({});
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: datas,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while retrieving wishlists',
            errors: error,
        });
    }
};

exports.getWishlistById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Wishlist ID is required'
            });
        }
        const data = await WishList.findById(id);
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: 'Wishlist not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while retrieving wishlist',
            errors: error,
        })
    };
}

exports.createWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        if (!user_id) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required'
            });
        }
        if (!product_id) {
            return res.status(400).json({
                status: 400,
                message: 'Product ID is required'
            });
        }
        const existUser = await User.findById({ _id: user_id });
        if (!existUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }
        const existProduct = await Product.findById({ _id: product_id });
        if (!existProduct) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }
        const existWishlist = await WishList.findOne({ user_id, product_id });
        if (existWishlist) {
            return res.status(409).json({
                status: 409,
                message: 'Wishlist already exists'
            });
        }
        const wishlistData = (await WishList.create({ user_id, product_id }));
        const populatedWishlistData = await wishlistData.populate('product_id');
        console.log(populatedWishlistData);
        res.status(201).json({
            status: 201,
            message: "Successful",
            data: populatedWishlistData,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while creating wishlist',
            errors: error.message,
        });
    }
};

exports.updateWishlistById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Wishlist ID is required'
            });
        }
        const { userId, product_id } = req.body;
        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required'
            });
        }
        if (!product_id) {
            return res.status(400).json({
                status: 400,
                message: 'Product ID is required'
            });
        }
        const existUser = await WishList.findOne({ userId });
        if (!existUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }
        const existProduct = await WishList.findOne({ product_id });
        if (!existProduct) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }
        const wishlistData = await WishList.findByIdAndUpdate(id, { userId, product_id }, { new: true });
        if (!wishlistData) {
            return res.status(404).json({
                status: 404,
                message: 'Wishlist not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Successful',
            data: wishlistData,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while updating wishlist',
            errors: error.message,
        });
    }
};


exports.deleteWishlistById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Wishlist ID is required'
            });
        }
        const wishlistData = await WishList.findByIdAndDelete(id).populate('product_id');
        if (!wishlistData) {
            return res.status(404).json({
                status: 404,
                message: 'Wishlist not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Deleted Successful',
            data: wishlistData,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while deleting wishlist',
            errors: error,
        });
    }
};


exports.getWishlistsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required'
            });
        }
        const wishlists = await Wishlist.find({ user_id: id }).populate('product_id');
        if (!wishlists) {
            return res.status(404).json({
                status: 404,
                message: 'Wishlists not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Successful',
            data: wishlists,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: 500,
            message: 'Error while retrieving wishlists',
            errors: error,
        });
    }   
};