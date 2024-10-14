const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
    product_id: {
        type: ObjectId,
    },
    name: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        default: "", 
    },
    price: {
        type: Number,
        required: true, 
        min: 0, 
    },
    image: {
        type: String,
        default: "", 
    },
    category_id: {
        type: ObjectId,
        required: true, 
    }
}, { timestamps: true }); 

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
