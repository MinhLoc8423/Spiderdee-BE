const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ShipmentSchema = new Schema({
    shipment_id: {
        type: ObjectId,
    },
    name: {
        type: String,
        maxlength: 100,
        required: true
    },
    address: {
        type: String,
        maxlength: 100,
        required: true
    },
    user_id: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Shipment = mongoose.model("Shipment", ShipmentSchema);
module.exports = Shipment;
