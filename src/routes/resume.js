const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createResume, getResumes, deleteResume } = require('../controllers/resumeController');
const router = express.Router();

/**
 * @swagger
 * /resumes:
 *   post:
 *     summary: 지원서 작성
 *     description: 사용자가 지원서를 작성합니다.
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 지원서 제목
 *                 example: "Backend Developer Application"
 *               content:
 *                 type: string
 *                 description: 지원서 내용
 *                 example: "I have 5 years of experience in backend development..."
 *     responses:
 *       201:
 *         description: 지원서 작성 성공
 *       500:
 *         description: 서버 오류
 */
router.post('/', authMiddleware, createResume);

/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: 지원서 조회
 *     description: 사용자의 지원서를 조회합니다.
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 지원서 조회 성공
 *       500:
 *         description: 서버 오류
 */
router.get('/', authMiddleware, getResumes);

/**
 * @swagger
 * /resumes/{id}:
 *   delete:
 *     summary: 지원서 삭제
 *     description: 특정 지원서를 삭제합니다.
 *     tags: [Resumes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 지원서 ID
 *     responses:
 *       200:
 *         description: 지원서 삭제 성공
 *       404:
 *         description: 지원서를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:id', authMiddleware, deleteResume);

module.exports = router;
