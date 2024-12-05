// JobStatus.js
const mongoose = require('mongoose');

const JobStatusSchema = new mongoose.Schema({
    jobPosting: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true }, // 채용 공고
    status: { 
        type: String, 
        enum: ['Open', 'Closed', 'Cancelled'], 
        default: 'Open' 
    }, // 채용 공고 상태
    updatedAt: { type: Date, default: Date.now } // 상태 업데이트 시간
});

module.exports = mongoose.model('JobStatus', JobStatusSchema);
