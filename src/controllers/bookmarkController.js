const Bookmark = require('../models/Bookmark');
const { getPagination } = require('../utils/pagination');

/**
 * 북마크 추가
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.addBookmark = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user.id;

  try {
    const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });
    if (existingBookmark) {
      return res.status(400).json({ message: 'Bookmark already exists' });
    }

    const newBookmark = await Bookmark.create({ user: userId, job: jobId });
    res.status(201).json({ message: 'Bookmark added successfully', bookmark: newBookmark });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * 북마크 제거
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.removeBookmark = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user.id;

  try {
    const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });
    if (!existingBookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await Bookmark.deleteOne({ _id: existingBookmark._id });
    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * 북마크 목록 조회
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getBookmarks = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

  try {
    const { skip, limit: parsedLimit } = getPagination(page, limit);

    const bookmarks = await Bookmark.find({ user: userId })
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parsedLimit)
      .populate('job', 'title company location');

    const total = await Bookmark.countDocuments({ user: userId });

    res.status(200).json({
      data: bookmarks,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
