const express = require('express');
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
} = require('../controllers/bookmarkController');

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: 북마크 추가
 *     description: 사용자가 특정 공고를 북마크합니다.
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

// 북마크 추가
router.post('/', authMiddleware, addBookmark);

/**
 * @swagger
 * /bookmarks:
 *   delete:
 *     summary: 북마크 제거
 *     description: 사용자가 특정 공고의 북마크를 제거합니다.
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
 *                 description: 제거할 북마크의 공고 ID
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
 *       404:
 *         description: 북마크를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

// 북마크 제거
router.delete('/', authMiddleware, removeBookmark);

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

router.get('/', authMiddleware, getBookmarks);

module.exports = router;
