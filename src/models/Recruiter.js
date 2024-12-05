//Recruiter.js
const mongoose = require('mongoose');

// Recruiter 스키마 정의
const RecruiterSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 담당자 이름
    email: { 
        type: String, 
        required: true, 
        default: function() {
            return `${this.name.toLowerCase().replace(/\s+/g, '')}@example.com`; // 기본 이메일 형식 설정
        }
    }, // 담당자 이메일
    phone: { type: String, required: false }, // 연락처
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true 
    }, // 소속 회사
    createdAt: { type: Date, default: Date.now } // 등록일
});

module.exports = mongoose.model('Recruiter', RecruiterSchema);
