const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: { // Refresh Token 필드 추가
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('User', UserSchema);