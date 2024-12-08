const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // 회사명
    industry: { type: String, required: true }, // 업종
    website: { type: String, required: false }, // 회사 홈페이지
    location: { type: String, required: true }, // 회사 위치
    createdAt: { type: Date, default: Date.now } // 등록일
});

module.exports = mongoose.model('Company', CompanySchema);
