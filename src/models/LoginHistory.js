const mongoose = require('mongoose');

const LoginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 사용자 ID
  loginAt: { type: Date, default: Date.now }, // 로그인 시간
  ip: { type: String }, // IP 주소
  device: { type: String }, // 디바이스 정보
});

module.exports = mongoose.model('LoginHistory', LoginHistorySchema);
