const express = require('express');
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const paymentConfig = require('../config/paymentConfig');
const OrderDetail = require('../models/orderDetailModel');
const Payment = require('../models/paymentLinkModel');
const { OrderStatus, PaymentMethod } = require('../../constants/constants');
const Order = require('../models/orderModel');

const router = express.Router();
const config = paymentConfig.config;

/**
 * Method: POST
 * Tạo đơn hàng, thanh toán
 */
router.post('/payment', async (req, res) => {
    try {
        const id = req.body.order_id;

        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Order ID is required.',
            });
        }
        const existOrder = await Order.findOne({ _id: id });
        if (!existOrder) {
            return res.status(400).json({
                status: 400,
                message: 'Order not found.',
            });
        };
        if (existOrder.payment_method !== PaymentMethod.ZALOPAY) {
            return res.status(400).json({
                status: 400,
                message: 'Order not found or not ZaloPay.',
            });
        };
        if (existOrder.status === OrderStatus.PENDING && existOrder.status === OrderStatus.AWAITING_PAYMENT) {
            return res.status(400).json({
                status: 400,
                message: 'Order is not awaiting payment.',
            });
        }

        // Kiểm tra link hiện tại trong PaymentLink
        const existingLink = await Payment.findOne({ order_id: id, status: 3 });
        if (existingLink && (!existingLink.expiresAt || existingLink.expiresAt > new Date())) {
            return res.status(200).json({ order_url: existingLink.payment_url });
        }

        // Tạo mảng items để lưu thông tin sản phẩm đặt hàng
        const orderDetails = await OrderDetail.find({ order_id: id }).select('name price quantity')
        console.log(orderDetails);

        const embed_data = {
            redirecturl: 'https://modern-cockatoo-musical.ngrok-free.app',
        };
        const items = orderDetails;
        const transID = id;
        console.log(id);

        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: 'user123',
            app_time: Date.now(),
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: existOrder.total_price,
            callback_url: 'https://modern-cockatoo-musical.ngrok-free.app/api/callback',
            description: `Spiderdee - Payment for the order #${transID}`,
            bank_code: '',
        };

        const data = config.app_id +
            '|' + order.app_trans_id +
            '|' + order.app_user +
            '|' + order.amount +
            '|' + order.app_time +
            '|' + order.embed_data +
            '|' + order.item;

        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const result = await axios.post(config.endpoint, null, { params: order });
        console.log(result.data);

        if (result.data.return_code == 1) {
            const paymentLink = new Payment({
                order_id: id,
                payment_url: result.data.order_url,
                expiresAt: moment().add(15, 'minutes').toDate(), 
            });
            await paymentLink.save();
        }
        await Order.updateOne({ _id: id }, { $set: { status: OrderStatus.AWAITING_PAYMENT } });

        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Payment failed.' });
    }
});

/**
* Method: POST
 * Callback từ ZaloPay Server
*/
router.post('/callback', async (req, res) => {
    let result = {};
    console.log(req.body);
    try {
        let dataStr = req.body.data;
        console.log(dataStr);
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log('mac =', mac);

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            let dataJson = JSON.parse(dataStr, config.key2);
            let str = dataJson['app_trans_id'];
            let index = str.indexOf("_");
            let order_id = str.slice(index + 1);
            await Order.updateOne({ _id: order_id }, { $set: { status: OrderStatus.PAYMENT_CONFIRMED } });
            await Payment.deleteOne({ order_id: order_id });
            console.log(
                "update order's status = success where app_trans_id =",
                dataJson['app_trans_id'],
                dataJson,
            );
            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.log('Error:::' + ex.message);
        result.return_code = 0;
        result.return_message = ex.message;
    }

    res.json(result);
});

/**
 * Method: POST
 * Kiểm tra trạng thái đơn hàng
 */
router.post('/check-status-order', async (req, res) => {
    try {
        const { app_trans_id } = req.body;

        let postData = {
            app_id: config.app_id,
            app_trans_id,
        };

        let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        let postConfig = {
            method: 'post',
            url: 'https://sb-openapi.zalopay.vn/v2/query',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify(postData),
        };
        const result = await axios(postConfig);

        console.log(app_trans_id);
        let str = app_trans_id;
        let index = str.indexOf("_");
        let order_id = str.slice(index + 1);
        if (result.data.return_code == 1) {
            await Order.updateOne({ _id: order_id }, { $set: { status: OrderStatus.PAYMENT_CONFIRMED } });
            await Payment.deleteOne({ order_id: order_id });
        }
        if (result.data.return_code == 2) {
            await Order.updateOne({ _id: order_id }, { $set: { status: OrderStatus.CANCELLED } });
            await Payment.deleteOne({ order_id: order_id });
        }
        if (result.data.return_code == 3) {
            await Order.updateOne({ _id: order_id }, { $set: { status: OrderStatus.AWAITING_PAYMENT } });
        }
        console.log(result.data);
        return res.status(200).json(result.data);
    } catch (error) {
        console.log('lỗi', error);
        return res.status(500).json({ error: 'Error checking status.' });
    }
});

module.exports = router;
