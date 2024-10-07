const mongoose = require('mongoose');
const uri = "mongodb+srv://mongodb:mongodb@furniture-database.skpnp.mongodb.net/?retryWrites=true&w=majority&appName=furniture-database"

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}

module.exports = connectDB;
