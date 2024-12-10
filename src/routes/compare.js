const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { compareJobs } = require('../controllers/compareController');
const router = express.Router();

/**
 * @swagger
 * /compare:
 *   post:
 *     summary: 채용 공고 비교
 *     description: 사용자가 두 개 이상의 채용 공고를 비교하여 정보를 반환합니다.
 *     tags: [Job Comparison]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobIds:
 *                 type: array
 *                 description: 비교할 채용 공고 ID 목록
 *                 items:
 *                   type: string
 *                 example: ["jobId1", "jobId2"]
 *     responses:
 *       200:
 *         description: 공고 비교 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comparedJobs:
 *                   type: array
 *                   description: 비교된 공고 정보
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: 공고 ID
 *                       title:
 *                         type: string
 *                         description: 공고 제목
 *                       company:
 *                         type: string
 *                         description: 회사 이름
 *                       salary:
 *                         type: string
 *                         description: 급여 정보
 *                       location:
 *                         type: string
 *                         description: 공고 위치
 *                       techStack:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: 기술 스택
 *       400:
 *         description: 잘못된 요청 (e.g., 유효하지 않은 공고 ID)
 *       500:
 *         description: 서버 오류
 */

router.post('/', authMiddleware, compareJobs);

module.exports = router;
