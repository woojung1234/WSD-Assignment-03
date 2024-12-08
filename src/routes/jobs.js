const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // 인증 미들웨어 가져오기
const {
  getJobListings,
  getJobDetails,
  getJobSummaryByLocation,
  getPopularJobs,
} = require('../controllers/jobController');
const router = express.Router();
/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 공고 목록 조회
 *     description: 필터링, 정렬, 페이지네이션을 지원하는 공고 목록을 조회합니다.
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: 정렬 기준 필드
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: 지역 필터링(ex. 서울  강남구, 서울  강북구)
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: 경력 필터링(신입, 1, 3, 5, 10년 이상)
 *       - in: query
 *         name: salary
 *         schema:
 *           type: integer
 *         description: 급여 정보 없음
 *       - in: query
 *         name: techStack
 *         schema:
 *           type: string
 *         description: 기술 스택 필터링 (쉼표로 구분)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목 또는 설명 키워드 검색 ('(주)' 제외하고 검색)
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *         description: 회사 이름 검색
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: 포지션 검색 (정규직, 계약직)
 *     responses:
 *       200:
 *         description: 공고 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPosting'
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
// 공고 목록 조회
router.get('/', authMiddleware, getJobListings);
/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: 공고 상세 조회
 *     description: 특정 공고의 상세 정보를 조회합니다.
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 공고 ID
 *     responses:
 *       200:
 *         description: 공고 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/JobPosting'
 *                 relatedJobs:
 *                   type: array
 *                   description: '관련 공고 목록'
 *                   items:
 *                     $ref: '#/components/schemas/JobPosting'
 *       404:
 *         description: 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 공고 상세 조회
router.get('/:id', authMiddleware, getJobDetails);
/**
 * @swagger
 * /jobs/summary/location:
 *   get:
 *     summary: 지역별 공고 수 조회
 *     description: 지역별로 공고 수를 집계합니다.
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 지역별 공고 수 조회 성공
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
 *                       _id:
 *                         type: string
 *                         description: 지역명
 *                       count:
 *                         type: integer
 *                         description: 공고 수
 *       500:
 *         description: 서버 오류
 */
// 지역별 공고 수 조회
router.get('/summary/location', authMiddleware, getJobSummaryByLocation);
/**
 * @swagger
 * /jobs/popular:
 *   get:
 *     summary: 인기 공고 조회
 *     description: 조회수가 높은 공고를 페이지네이션 방식으로 조회합니다.
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 인기 공고 조회 성공
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
 *                     $ref: '#/components/schemas/JobPosting'
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
// 인기 공고 조회
router.get('/popular', authMiddleware, getPopularJobs);
module.exports = router;
