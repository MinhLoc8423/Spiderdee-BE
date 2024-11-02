const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderDetailSchema = new Schema({
    order_detail_id: {
        type: ObjectId,
    },
    quantity: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    order_id: {
        type: ObjectId,
        ref: "Order",
        required: true
    },
    product_id: {
        type: ObjectId,
        ref: "Product",
        required: true
    }
}, { timestamps: true });

const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);
module.exports = OrderDetail;
