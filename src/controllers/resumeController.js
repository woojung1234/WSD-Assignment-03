const Resume = require('../models/Resume');

// 지원서 작성
exports.createResume = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    // 지원서 생성
    const resume = await Resume.create({ userId, title, content });
    res.status(201).json({ message: 'Resume created successfully', resume });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 지원서 조회
exports.getResumes = async (req, res) => {
  const userId = req.user.id;

  try {
    const resumes = await Resume.find({ userId });
    res.status(200).json({ resumes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 지원서 삭제
exports.deleteResume = async (req, res) => {
  const { id } = req.params;

  try {
    const resume = await Resume.findByIdAndDelete(id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
