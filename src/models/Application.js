//Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 사용자
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true }, // 지원 공고
    resume: { type: String, required: false }, // 이력서 파일 경로
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }, // 지원 상태
    appliedAt: { type: Date, default: Date.now } // 지원 날짜
});

module.exports = mongoose.model('Application', ApplicationSchema);
