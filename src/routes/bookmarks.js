const express = require('express');
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: 북마크 추가/제거
 *     description: 사용자가 특정 공고를 북마크하거나 기존 북마크를 제거합니다.
 *     tags: [Bookmarks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: 북마크할 공고의 ID
 *                 example: 64d9f2b2a3c9c2340e123456
 *     responses:
 *       200:
 *         description: 북마크 제거 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bookmark removed successfully
 *       201:
 *         description: 북마크 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bookmark added successfully
 *                 bookmark:
 *                   $ref: '#/components/schemas/Bookmark'
 *       500:
 *         description: 서버 오류
 */

// 북마크 추가/제거
router.post('/', authMiddleware, async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user.id;

  try {
    // 기존 북마크 여부 확인
    const existingBookmark = await Bookmark.findOne({ user: userId, job: jobId });

    if (existingBookmark) {
      // 북마크 삭제
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      return res.status(200).json({ message: 'Bookmark removed successfully' });
    }

    // 새 북마크 추가
    const newBookmark = await Bookmark.create({ user: userId, job: jobId });
    res.status(201).json({ message: 'Bookmark added successfully', bookmark: newBookmark });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: 북마크 목록 조회
 *     description: 사용자가 북마크한 공고 목록을 조회합니다.
 *     tags: [Bookmarks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: 현재 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: 한 페이지에 표시할 북마크 수
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         required: false
 *         description: 정렬 기준 필드
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         required: false
 *         description: 정렬 순서
 *     responses:
 *       200:
 *         description: 북마크 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bookmark'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       500:
 *         description: 서버 오류
 */

// 북마크 목록 조회 (페이지네이션 추가)
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
  
    try {
      // 페이지네이션 설정
      const skip = (page - 1) * limit;
  
      // 사용자의 북마크 가져오기
      const bookmarks = await Bookmark.find({ user: userId })
        .sort({ [sort]: order === 'desc' ? -1 : 1 }) // 최신순 정렬
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('job', 'title company location');
  
      // 총 북마크 수 계산
      const total = await Bookmark.countDocuments({ user: userId });
  
      res.status(200).json({
        data: bookmarks,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });


module.exports = router;
