
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Product = require('../models/productModel');
const validateUtils = require('../utils/validateUtils');

exports.getAllReviews = async (req, res) => {
    try {
        const reviewData = await Review.find({})
            .populate({ path: 'user_id', select: 'name email' })
            .populate({ path: 'product_id', select: 'name price' })
            .populate({ path: 'order_detail_id'})
            .limit(50);
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: reviewData,
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error while retrieving review', errors: error });
    }
};

exports.getReviewByById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Review ID is required'
            });
        }
        const reviewData = await Review.findById(id)
            .populate({ path: 'user_id', select: 'name email' })
            .populate({ path: 'product_id', select: 'name price' })
            .populate({ path: 'order_detail_id'});
        if (!reviewData) {
            return res.status(404).json({
                status: 404,
                message: 'Review not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: reviewData,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error while retrieving review',
            errors: error
        });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { comment, rating, product_id, user_id, order_detail_id } = req.body;

        // Validate input
        let check = validateUtils.validateString(comment);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateNumber(rating);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(product_id);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(user_id);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(order_detail_id);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        // Check if product and user exist
        const existProduct = await Product.findById(product_id).lean();
        if (!existProduct) {
            return res.status(400).json({ status: 400, message: 'Product doesn\'t exist' });
        }

        const existUser = await User.findById(user_id).lean();
        if (!existUser) {
            return res.status(400).json({ status: 400, message: 'User doesn\'t exist' });
        }

        // Check if order detail exists
        const existOrderDetail = await OrderDetail.findById(order_detail_id).lean();
        if (!existOrderDetail) {
            return res.status(400).json({ status: 400, message: 'Order detail doesn\'t exist' });
        }

        // Check if the review already exists
        const existingReview = await Review.findOne({ 
            product_id, 
            user_id, 
            order_detail_id 
        }).lean();

        if (existingReview) {
            return res.status(403).json({
                status: 403,
                message: 'You have already reviewed this product for this order.',
            });
        }

        // Check if the order is delivered
        const order = await Order.findById(existOrderDetail.order_id).lean();
        if (!order || order.status !== "Delivered") {
            return res.status(403).json({
                status: 403,
                message: 'You can only review products from delivered orders.',
            });
        }

        // Check purchase date
        const orderDate = existOrderDetail.createdAt; // creation date of order detail
        const currentDate = new Date();
        const dayDifference = Math.ceil((currentDate - orderDate) / (1000 * 3600 * 24)); // convert to days

        if (dayDifference > 7) {
            return res.status(403).json({
                status: 403,
                message: 'You can only review a product within 7 days of purchase.',
            });
        }

        // Create new review
        const newReview = new Review({
            comment,
            rating,
            product_id,
            user_id,
            order_detail_id, // Save order detail ID
        });
        const savedReview = await newReview.save();

        res.status(201).json({
            status: 201,
            message: "Review created successfully",
            data: savedReview,
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({
            status: 500,
            message: "Error while creating review",
            errors: error.message,
        });
    }
};

exports.updateReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Review ID is required'
            });
        }

        const { comment, rating, product_id, user_id, order_detail_id } = req.body;

        // Validate input
        let check = validateUtils.validateString(comment);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateNumber(rating);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(product_id);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(user_id);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        check = validateUtils.validateString(order_detail_id);
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        // Check if product and user exist
        const existProduct = await Product.findById(product_id).lean();
        if (!existProduct) {
            return res.status(400).json({ status: 400, message: 'Product doesn\'t exist' });
        }

        const existUser = await User.findById(user_id).lean();
        if (!existUser) {
            return res.status(400).json({ status: 400, message: 'User doesn\'t exist' });
        }

        // Check if order detail exists
        const existOrderDetail = await OrderDetail.findById(order_detail_id).lean();
        if (!existOrderDetail) {
            return res.status(400).json({ status: 400, message: 'Order detail doesn\'t exist' });
        }

        // Check if the review exists
        const existingReview = await Review.findById(id).lean();
        if (!existingReview) {
            return res.status(404).json({ status: 404, message: 'Review not found' });
        }

        // Check if the review belongs to the user
        if (existingReview.user_id.toString() !== user_id) {
            return res.status(403).json({
                status: 403,
                message: 'You can only update your own reviews.',
            });
        }

        // Check if the order is delivered
        const order = await Order.findById(existOrderDetail.order_id).lean();
        if (!order || order.status !== "Delivered") {
            return res.status(403).json({
                status: 403,
                message: 'You can only update reviews for products from delivered orders.',
            });
        }

        // Check purchase date
        const orderDate = existOrderDetail.createdAt; // creation date of order detail
        const currentDate = new Date();
        const dayDifference = Math.ceil((currentDate - orderDate) / (1000 * 3600 * 24)); // convert to days

        if (dayDifference > 7) {
            return res.status(403).json({
                status: 403,
                message: 'You can only update a review within 7 days of purchase.',
            });
        }

        const updateData = {
            comment,
            rating,
            product_id,
            user_id,
            order_detail_id // Update order detail ID
        };

        const updatedReview = await Review.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ status: 404, message: 'Review not found' });
        }

        res.status(200).json({
            status: 200,
            message: "Review updated successfully",
            data: updatedReview,
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({
            status: 500,
            message: "Error while updating review",
            errors: error.message,
        });
    }
};

exports.deleteReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Review ID is required'
            });
        }
        const deletedReview = await Review.findByIdAndDelete({ _id: id });
        if (!deletedReview) {
            return res.status(404).json({ status: 404, message: 'Review not found' });
        }
        res.status(200).json({
            status: 200,
            message: "Review deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while deleting review",
            errors: error,
        });
    }
};

exports.filterReview = async (req, res) => {
    try {
        const { sort } = req.body;
        let sortOption = 1;

        const check = validateUtils.validateNumber(sort);
        if (!check.valid) {
            return res.status(400).json({ message: check.message });
        }

        if (sort == "1") {
            sortOption = 1; // Sắp xếp tăng dần theo thời gian đăng
        } 
        if (sort == "2") {
            sortOption = -1; // Sắp xếp giảm dần theo thời gian đăng
        }

        const reviews = await Review.find({}).sort({ createdAt: sortOption });
        console.log(reviews);

        res.status(200).json({
            status: 200,
            message: "Successful",
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while searching reviews",
            errors: error,
        });
    }
};
