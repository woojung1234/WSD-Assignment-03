const mongoose = require('mongoose');

const JobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },  // 변경: 회사 필드를 `Company` 모델에 연결
  location: { type: String },
  salary: { type: String },
  techStack: { type: [String] },
  postedDate: { type: Date },
  url: { type: String, required: true, unique: true },
  employmentType: { type: String },
  experience: { type: String },
  deadline: { type: Date },
  requirements: { type: String },
  approved: { type: Boolean, default: true }, // 기본값: 승인되지 않음

});

module.exports = mongoose.model('JobPosting', JobPostingSchema);

