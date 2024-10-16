const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CategorySchema = new Schema({
    category_id: {
        type: ObjectId,
    },
    name: {
        type: String,
        required: true, 
    }
}, { timestamps: true }); 

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
