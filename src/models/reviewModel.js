const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ReviewSchema = new Schema({
    review_id: {
        type: ObjectId,
    },
    comment: {
        type: String,
        maxlength: 100
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    order_detail_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderDetail',
        required: true,
    },
    product_id: {
        type: ObjectId,
        ref: "Product",
        required: true
    },
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
