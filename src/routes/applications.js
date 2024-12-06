const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: 지원하기
 *     description: 사용자가 특정 공고에 지원합니다.
 *     tags: [Applications]
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
 *                 description: 지원할 공고의 ID
 *                 example: 64d9f2b2a3c9c2340e123456
 *               resume:
 *                 type: string
 *                 description: 선택적으로 제출할 이력서 파일 경로
 *                 example: /uploads/resume.pdf
 *     responses:
 *       201:
 *         description: 지원 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application submitted successfully.
 *                 application:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: 중복 지원
 *       500:
 *         description: 서버 오류
 */

// 지원하기
router.post('/', authMiddleware, applicationController.submitApplication);
/**
 * @swagger
 * /applications:
 *   get:
 *     summary: 지원 내역 조회
 *     description: 사용자가 지원한 공고 목록을 조회합니다.
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: 지원 상태별 필터링 (Pending, Accepted, Rejected)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: appliedAt
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
 *         description: 지원 내역 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       500:
 *         description: 서버 오류
 */

// 지원 내역 조회
router.get('/', authMiddleware, applicationController.getApplications);

 /**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: 지원 취소
 *     description: 사용자가 지원한 공고를 취소합니다.
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 취소할 지원 내역의 ID
 *     responses:
 *       200:
 *         description: 지원 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application cancelled successfully.
 *       400:
 *         description: 취소 불가능한 상태
 *       404:
 *         description: 지원 내역을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

  // 지원 취소
  router.delete('/:id', authMiddleware, applicationController.cancelApplication);
  /**
 * @swagger
 * /applications/summary:
 *   get:
 *     summary: 지원 현황 집계
 *     description: 각 공고별 지원 수를 집계하여 반환합니다.
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 지원 현황 집계 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       job:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           company:
 *                             type: string
 *                       count:
 *                         type: number
 *                         description: 지원 수
 *                         example: 15
 *       500:
 *         description: 서버 오류
 */

  //지원 현황 집계
  router.get('/summary', authMiddleware, applicationController.getApplicationSummary);
  
module.exports = router;
