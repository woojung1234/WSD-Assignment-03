//Bookmark.js
const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 사용자
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosting', required: true }, // 관심 공고
    createdAt: { type: Date, default: Date.now } // 북마크 생성 날짜
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
