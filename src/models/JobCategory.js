//JobCategory.js
const mongoose = require('mongoose');

const JobCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // 직무 카테고리 이름
    description: { type: String, required: false }, // 카테고리 설명
    createdAt: { type: Date, default: Date.now } // 등록일
});

module.exports = mongoose.model('JobCategory', JobCategorySchema);
