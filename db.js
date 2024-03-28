const mongoose = require('mongoose');
require('dotenv').config();

// const mongoURL='mongodb://localhost:27017/hotels'
const mongoURL=process.env.MONGO_URL_LOCAL;
// const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDB Server...");
});

db.on('disconnected', () => {
    console.log("Disconnected from MongoDB Server");
});

db.on('error', (error) => {
    console.log("MongoDB Connection Error:", error);
});

module.exports = db;
