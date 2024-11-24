
const OrderDetail = require('../models/orderDetailModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const validateUtils = require('../utils/validateUtils');

exports.getAllOrderDetails = async (req, res) => {
    try {
        const orderDetails = await OrderDetail.find({})
            .populate('order_id')
            .populate('product_id')
            .limit(50);
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: orderDetails,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error while retrieving order details',
            errors: error
        });
    }
};

exports.getOrderDetailByById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Order detail ID is required'
            });
        }
        const orderDetail = await OrderDetail.findById(id)
            .populate('order_id')
            .populate('product_id');
        if (!orderDetail) {
            return res.status(404).json({
                status: 404,
                message: 'Order detail not found'
            });
        }
        res.status(200).json({
            status: 200,
            message: "Successful",
            data: orderDetail,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error while retrieving order detail',
            errors: error
        });
    }
};

exports.getOrderDetailsByOrderId = async (req, res) => {
    try {
        const { id } = req.params; // Lấy orderId từ params

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Order ID is required.'
            });
        }

        // Tìm tất cả OrderDetail theo orderId
        const orderDetails = await OrderDetail.find({ order_id: id }).lean();

        if (orderDetails.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No order details found for this order ID.'
            });
        }

        res.status(200).json({
            status: 200,
            message: "Order details retrieved successfully.",
            data: orderDetails,
        });
    } catch (error) {
        console.error(error); // Log lỗi để kiểm tra
        res.status(500).json({
            status: 500,
            message: "Error while retrieving order details.",
            errors: error.message,
        });
    }
};

exports.getOrderDetailByUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy user ID từ params

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'User ID is required.'
            });
        }
        
        // Step 1: Find all orders for the specified user
        const userOrders = await Order.find({ user_id: id }).sort( { createdAt: -1 } ).exec();
        console.log(userOrders);

        // Step 2: Extract order IDs to use for querying order details
        const orderIds = userOrders.map(order => order._id);
        console.log(orderIds);

        // Step 3: Find all order details related to the user's orders
        const orderDetails = await OrderDetail.find({ order_id: { $in: orderIds } })
            .populate("product_id", "name description price image size")
            .exec();
        console.log(orderDetails);

        // Step 4: Structure the response to group details by each order
        const orderDetailsByOrder = userOrders.map(order => {
            const details = orderDetails.filter(detail => detail.order_id.equals(order._id));
            return {
                order_id: order._id,
                total_price: order.total_price,
                payment_method: order.payment_method,
                status: order.status,
                order_date: order.createdAt,
                address: order.address,
                products: details.map(detail => ({
                    order_detail_id: detail._id, // Thêm order_detail_id vào sản phẩm
                    product_id: detail.product_id._id,
                    name: detail.product_id.name,
                    description: detail.product_id.description,
                    price: detail.product_id.price,
                    image: detail.product_id.image,
                    size: detail.size,
                    quantity: detail.quantity,
                })),
            };
        });
        
        res.status(200).json({
            status: 200,
            message: "Order details retrieved successfully.",
            data: orderDetailsByOrder,
        });
    } catch (error) {
        console.error("Error fetching order details by user:", error);
        throw new Error("Could not fetch order details");
    }
};

exports.createOrderDetail = async (req, res) => {
    try {
        const { order_id, product_id, quantity, price } = req.body;
        var check = validateUtils.validateString(order_id)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateString(product_id)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateNumber(quantity)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateNumber(price)
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        const existOrder = await Order.findById({ _id: order_id });
        if (!existOrder) {
            return res.status(400).json({ status: 400, message: 'Order don\'t exists' });
        }

        const existProduct = await Product.findById({ _id: product_id });
        if (!existProduct) {
            return res.status(400).json({ status: 400, message: 'Product don\'t exists' });
        }

        const newOrderDetail = new OrderDetail({
            order_id,
            product_id,
            quantity,
            price,
        });
        const savedOrderDetail = await newOrderDetail.save();

        res.status(201).json({
            status: 201,
            message: "Order detail created successfully",
            data: savedOrderDetail,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while creating order detail",
            errors: error,
        });
    }
};

exports.updateOrderDetailById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Order detail ID is required'
            });
        }
        const { order_id, product_id, quantity, price } = req.body;

        var check = validateUtils.validateString(order_id)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateString(product_id)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateNumber(quantity)
        if (check.valid) {
            return res.status(400).json(check.message);
        }
        check = validateUtils.validateNumber(price)
        if (check.valid) {
            return res.status(400).json(check.message);
        }

        const existOrder = await Order.findById({ _id: order_id });
        if (!existOrder) {
            return res.status(400).json({ status: 400, message: 'Order don\'t exists' });
        }

        const existProduct = await Product.findById({ _id: product_id });
        if (!existProduct) {
            return res.status(400).json({ status: 400, message: 'Product don\'t exists' });
        }

        const updateData = {
            order_id,
            product_id,
            quantity,
            price,
        };
        const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedOrderDetail) {
            return res.status(404).json({
                status: 404,
                message: "Order detail not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Order detail updated successfully",
            data: updatedOrderDetail,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while updating order detail",
            errors: error,
        });
    }
};


exports.deleteOrderDetailById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Order detail ID is required'
            });
        }
        const deletedOrderDetail = await OrderDetail.findByIdAndDelete(id);
        if (!deletedOrderDetail) {
            return res.status(404).json({
                status: 404,
                message: "Order detail not found",
            });
        }
        res.status(200).json({
            status: 200,
            message: "Order detail deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error while deleting order detail",
            errors: error,
        });
    }
};

exports.analyticsDataDetail = async (req, res) => {
    try {
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                status: 400,
                message: 'From and to dates are required'
            });
        }

        // Chuyển từ chuỗi `from` và `to` thành đối tượng Date
        const fromDate = new Date(from);
        const toDate = new Date(to);

        // Đảm bảo từ ngày `from` sẽ bắt đầu từ đầu tháng và `to` sẽ kết thúc tại cuối tháng
        fromDate.setDate(1); // Đặt ngày đầu tiên của tháng
        toDate.setMonth(toDate.getMonth() + 1); // Chuyển đến tháng tiếp theo
        toDate.setDate(0); // Đặt ngày cuối cùng của tháng

        // Truy vấn MongoDB với aggregation pipeline
        const analyticsData = await OrderDetail.aggregate([
            {
                $match: {
                    createdAt: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $project: {
                    yearMonth: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    quantity: 1,
                    price: 1
                }
            },
            {
                $group: {
                    _id: "$yearMonth",  // Nhóm theo tháng
                    totalQuantity: { $sum: "$quantity" },
                    totalPrice: { $sum: "$price" }
                }
            },
            {
                $sort: { _id: 1 } // Sắp xếp theo tháng
            }
        ]);

        res.status(200).json({
            status: 200,
            message: 'Successful',
            data: analyticsData
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error while retrieving analytics data',
            errors: error
        });
    }
};


