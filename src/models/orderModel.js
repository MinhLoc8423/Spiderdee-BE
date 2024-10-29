const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
    order_id: {
        type: ObjectId,
    },
    total_price: {
        type: mongoose.Types.Decimal128,
        required: true,
    },
    payment_method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    user_id: {
        type: ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true }); 

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
