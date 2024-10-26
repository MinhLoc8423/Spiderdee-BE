const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const WishlistSchema = new Schema({
    wishlist_id: {
        type: ObjectId,
    },
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    product_id: {
        type: ObjectId,
        ref: "Product",
        required: true
    }
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
module.exports = Wishlist;
