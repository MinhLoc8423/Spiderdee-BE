const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const validateUtils = require('../utils/validateUtils');
const { OrderStatus, PaymentMethod } = require('../../constants/constants');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user_id').limit(50);
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while retrieving orders',
            errors: error
        });
    }
};

exports.getOrderByById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Order ID is required'
            });
        }
        const order = await Order.findById(id).populate('user_id');
        const orderDetails = await OrderDetail.find({ order_id: id });
        const result = {
            order,
            orderDetails
        };
        if (!order) {
            return res.status(404).json({
                status: 404,
                message: 'Order not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error while retrieving order',
            errors: error
        });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { user_id, address, payment_method, orderDetails } = req.body;

        if (!user_id || !address || !payment_method || !Array.isArray(orderDetails) || orderDetails.length === 0) {
            return res.status(400).json({
                status: 400,
                message: 'User ID, address, payment method, and order details are required and order details cannot be empty'
            });
        }
        if (payment_method !== PaymentMethod.CASH && payment_method !== PaymentMethod.ZALOPAY) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid payment method'
            });
        }

        const existUser = await User.findById(user_id);
        if (!existUser) {
            return res.status(400).json({
                status: 400,
                message: 'User does not exist',
            });
        }

        // Validate products and add the name field
        const productIds = orderDetails.map(detail => detail.product_id);
        const existProducts = await Product.find({ _id: { $in: productIds } });
        const productMap = new Map(existProducts.map(product => [product._id.toString(), product]));

        const invalidDetails = orderDetails.filter(detail => {
            const product = productMap.get(detail.product_id);
            return !product || detail.quantity <= 0 || detail.price < 0 || detail.price !== product.price;
        });

        if (invalidDetails.length > 0) {
            return res.status(400).json({
                status: 400,
                message: 'Some order details are invalid',
                errors: invalidDetails.map(detail => ({
                    product_id: detail.product_id,
                    error: !productMap.has(detail.product_id)
                        ? 'Product does not exist'
                        : detail.price !== productMap.get(detail.product_id).price
                            ? 'Price mismatch'
                            : 'Invalid quantity or price'
                }))
            });
        }

        const total_price = orderDetails.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0);
        const status = OrderStatus.PENDING;

        const newOrder = new Order({
            total_price,
            payment_method,
            status,
            address,
            user_id,
        });
        const savedOrder = await newOrder.save();

        const orderDetailPromises = orderDetails.map(orderDetail => {
            const product = productMap.get(orderDetail.product_id);
            const orderDetailDoc = new OrderDetail({
                order_id: savedOrder._id,
                product_id: orderDetail.product_id,
                quantity: orderDetail.quantity,
                price: orderDetail.price,
                name: product.name  // Add the product name here
            });
            return orderDetailDoc.save();
        });

        await Promise.all(orderDetailPromises);

        res.status(201).json({
            status: 201,
            message: "Order created successfully",
            data: savedOrder,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error while creating order',
            errors: error.message
        });
    }
};

exports.updateOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Order ID is required'  // "ID đơn hàng là bắt buộc"
            });
        }
        const { address, payment_method, orderDetails } = req.body;
        if (!address || !payment_method || !orderDetails || orderDetails.length === 0) {
            return res.status(400).json({
                status: 400,
                message: 'Address, payment method and order details are required'  // "Địa chỉ, phương thức thanh toán và chi tiết đơn hàng là bắt buộc"
            });
        }

        if (payment_method !== PaymentMethod.CASH && payment_method !== PaymentMethod.ZALOPAY) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid payment method'  // "Phương thức thanh toán không hợp lệ"
            });
        }

        const productIds = orderDetails.map(detail => detail.product_id);
        const existProducts = await Product.find({ _id: { $in: productIds } });
        const productMap = new Map(existProducts.map(product => [product._id.toString(), product]));

        const invalidDetails = orderDetails.filter(detail => {
            const product = productMap.get(detail.product_id);
            return !product || detail.quantity <= 0 || detail.price < 0 || detail.price !== product.price;
        });

        if (invalidDetails.length > 0) {
            return res.status(400).json({
                status: 400,
                message: 'Some order details are invalid',  // "Một số chi tiết đơn hàng không hợp lệ"
                errors: invalidDetails.map(detail => ({
                    product_id: detail.product_id,
                    error: !productMap.has(detail.product_id)
                        ? 'Product does not exist'  // "Sản phẩm không tồn tại"
                        : detail.price !== productMap.get(detail.product_id).price
                            ? 'Price mismatch'  // "Giá không khớp"
                            : 'Invalid quantity or price'  // "Số lượng hoặc giá không hợp lệ"
                }))
            });
        }

        const total_price = orderDetails.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0);

        const updatedOrder = await Order.findByIdAndUpdate(id, {
            address,
            payment_method,
            total_price,
        }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({
                status: 404,
                message: "Order not found",  // "Không tìm thấy đơn hàng"
            });
        }

        // Xóa chi tiết đơn hàng cũ
        await OrderDetail.deleteMany({ order_id: id });

        // Lưu chi tiết đơn hàng mới
        const orderDetailPromises = orderDetails.map(orderDetail => {
            const product = productMap.get(orderDetail.product_id);
            const orderDetailDoc = new OrderDetail({
                order_id: updatedOrder._id,  // Sử dụng updatedOrder._id ở đây
                product_id: orderDetail.product_id,
                quantity: orderDetail.quantity,
                price: orderDetail.price,
                name: product.name  // Thêm tên sản phẩm ở đây
            });
            return orderDetailDoc.save();
        });
        
        await Promise.all(orderDetailPromises);

        res.status(200).json({
            status: 200,
            message: "Order updated successfully",  // "Cập nhật đơn hàng thành công"
            data: updatedOrder,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error while updating order',  // "Lỗi khi cập nhật đơn hàng"
            errors: error.message
        });
    }
};

exports.deleteOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Order ID is required'
            });
        }
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({
                status: 404,
                message: "Order not found",
            });
        }
        await OrderDetail.deleteMany({ order_id: id });
        res.status(200).json({
            status: 200,
            message: "Order deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while deleting order",
            errors: error,
        });
    }
};

exports.filterOrders = async (req, res) => {
    const { payment_method, status, min_price, max_price, user_id } = req.query;
    let query = {};
    if (payment_method) {
        query.payment_method = payment_method;
    }
    if (status) {
        query.status = status;
    }
    if (min_price && max_price) {
        query.total_price = { $gte: min_price, $lte: max_price };
    } else if (min_price) {
        query.total_price = { $gte: min_price };
    } else if (max_price) {
        query.total_price = { $lte: max_price };
    }
    if (user_id) {
        query.user_id = user_id;
    }
    try {
        const orders = await Order.find(query).populate('user_id').limit(50);
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while searching orders",
            errors: error,
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, payment_method } = req.body;

        // Validate required fields
        if (!id || !status) {
            return res.status(400).json({
                status: 400,
                message: 'Order ID and status are required',
            });
        }

        // Fetch the current order
        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return res.status(404).json({
                status: 404,
                message: 'Order not found',
            });
        }

        if (payment_method === PaymentMethod.CASH) {
            // Skip 'Awaiting Payment' for COD
            if (existingOrder.status === OrderStatus.PENDING && status === OrderStatus.CONFIRMED) {
                existingOrder.status = OrderStatus.CONFIRMED;
            } else if (existingOrder.status === OrderStatus.CONFIRMED && status === OrderStatus.PROCESSING) {
                existingOrder.status = OrderStatus.PROCESSING;
            } else if (existingOrder.status === OrderStatus.PROCESSING && status === OrderStatus.SHIPPED) {
                existingOrder.status = OrderStatus.SHIPPED;
            } else if (existingOrder.status === OrderStatus.SHIPPED && status === OrderStatus.DELIVERED) {
                existingOrder.status = OrderStatus.DELIVERED;
            } else if (existingOrder.status === OrderStatus.DELIVERED && status === 'Completed') {
                existingOrder.status = 'Completed';
            } else if (status === OrderStatus.CANCELLED) {
                // Hủy đơn hàng
                existingOrder.status = OrderStatus.CANCELLED;
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid status transition for COD',
                });
            }
        } else if (payment_method === PaymentMethod.ZALOPAY) {
            // ZaloPay order needs to go through 'Awaiting Payment'
            if (existingOrder.status === OrderStatus.CONFIRMED && status === OrderStatus.PROCESSING) {
                existingOrder.status = OrderStatus.PROCESSING;
            } else if (existingOrder.status === OrderStatus.PROCESSING && status === OrderStatus.SHIPPED) {
                existingOrder.status = OrderStatus.SHIPPED;
            } else if (existingOrder.status === OrderStatus.DELIVERED && status === 'Completed') {
                existingOrder.status = 'Completed';
            } else if (status === OrderStatus.CANCELLED) {
                // Hủy đơn hàng
                existingOrder.status = OrderStatus.CANCELLED;
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'Invalid status transition for ZaloPay',
                });
            }
        }

        // Save the updated status
        await existingOrder.save();

        res.status(200).json({
            status: 200,
            message: 'Order status updated successfully',
            data: existingOrder,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while updating order status',
            errors: error.message,
        });
    }
};
