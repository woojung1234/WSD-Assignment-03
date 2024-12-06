/**
 * @swagger
 * /admin/jobs/{id}/approve:
 *   post:
 *     summary: 공고 승인/비승인
 *     description: 관리자 권한으로 특정 공고를 승인 또는 비승인 처리합니다.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 승인/비승인할 공고의 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approve
 *             properties:
 *               approve:
 *                 type: boolean
 *                 description: true (승인) 또는 false (비승인)
 *                 example: true
 *     responses:
 *       200:
 *         description: 공고 승인/비승인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Job posting approved successfully"
 *                 job:
 *                   $ref: '#/components/schemas/JobPosting'
 *       404:
 *         description: 해당 공고를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job posting not found
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 error:
 *                   type: string
 */

const express = require('express');
const { approveJobPosting } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware'); // 관리자 인증 미들웨어 추가 필요

const router = express.Router();

// 공고 승인/비승인
router.post('/jobs/:id/approve', authMiddleware, approveJobPosting);

module.exports = router;
