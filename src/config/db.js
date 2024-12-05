const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // 환경 변수 로드

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI); // DB_URI 사용
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
