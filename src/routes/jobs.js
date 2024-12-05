const express = require('express');
const JobPosting = require('../models/JobPosting'); // JobPosting 모델 가져오기
const authMiddleware = require('../middlewares/authMiddleware'); // 인증 미들웨어 가져오기
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
 *         description: 지역 필터링
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: 경력 필터링
 *       - in: query
 *         name: salary
 *         schema:
 *           type: integer
 *         description: 최소 급여 필터링
 *       - in: query
 *         name: techStack
 *         schema:
 *           type: string
 *         description: 기술 스택 필터링 (쉼표로 구분)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목 또는 설명 키워드 검색
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *         description: 회사 이름 검색
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: 포지션 검색
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
// 공고 목록 조회 (인증 필요)
router.get('/', authMiddleware, async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    region,
    experience,
    salary,
    techStack,
    keyword,
    companyName,
    position,
  } = req.query;

  try {
    const filter = {};
    if (region) filter.location = region;
    if (experience) filter.experience = experience;
    if (salary) filter.salary = { $gte: parseInt(salary, 10) };
    if (techStack) filter.techStack = { $in: techStack.split(',') };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (companyName) filter.company = { $regex: companyName, $options: 'i' };
    if (position) filter.title = { $regex: position, $options: 'i' };

    const jobs = await JobPosting.find(filter)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    const total = await JobPosting.countDocuments(filter);

    res.status(200).json({
      data: jobs,
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
 *                   items:
 *                     $ref: '#/components/schemas/JobPosting'
 *       404:
 *         description: 공고를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
// 공고 상세 조회 (인증 필요)
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const job = await JobPosting.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    // 조회수 증가
    job.views += 1;
    await job.save();

    // 관련 공고 추천 (같은 기술 스택 기준)
    const relatedJobs = await JobPosting.find({
      techStack: { $in: job.techStack },
      _id: { $ne: id }, // 현재 공고 제외
    }).limit(5);

    res.status(200).json({ job, relatedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
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
// 지역별 공고 수 조회 (인증 필요)
router.get('/summary/location', authMiddleware, async (req, res) => {
  try {
    const summary = await JobPosting.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } }, // 지역별 공고 수 집계
      { $sort: { count: -1 } }, // 공고 수 기준 내림차순 정렬
    ]);

    res.status(200).json({ status: 'success', data: summary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
});
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
// 인기 공고 조회 (인증 필요)
router.get('/popular', authMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;

    const popularJobs = await JobPosting.find({ approved: true }) // 승인된 공고만 조회
      .sort({ views: -1 }) // 조회수 기준 내림차순 정렬
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await JobPosting.countDocuments({ approved: true });

    res.status(200).json({
      status: 'success',
      data: popularJobs,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
});

module.exports = router;
