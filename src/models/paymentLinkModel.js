const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const paymentLinkSchema = new Schema({
    order_id: { type: ObjectId, ref: 'Order', required: true },
    app_trans_id: { type: String, required: true },
    payment_url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }, 
}); 

module.exports = mongoose.model('PaymentLink', paymentLinkSchema);
