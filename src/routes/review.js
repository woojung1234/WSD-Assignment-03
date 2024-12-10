const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createReview, getReviews, deleteReview } = require('../controllers/reviewController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: 리뷰 및 평점 관리
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: 리뷰 작성
 *     description: 특정 공고에 리뷰 및 평점을 작성합니다.
 *     tags: [Reviews]
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
 *                 description: 공고 ID
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: 평점 (1~5)
 *               comment:
 *                 type: string
 *                 description: 리뷰 내용
 *     responses:
 *       201:
 *         description: 리뷰 작성 성공
 *       500:
 *         description: 서버 오류
 */
router.post('/', authMiddleware, createReview);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: 리뷰 조회
 *     description: 특정 공고에 대한 리뷰를 조회합니다.
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         required: true
 *         description: 공고 ID
 *     responses:
 *       200:
 *         description: 리뷰 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   jobId:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *       500:
 *         description: 서버 오류
 */
router.get('/', getReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: 리뷰 삭제
 *     description: 작성한 리뷰를 삭제합니다.
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 리뷰 ID
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
 *       404:
 *         description: 리뷰를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
