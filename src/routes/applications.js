const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
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
router.post('/', authMiddleware, async (req, res) => {
  const { jobId, resume } = req.body;

  try {
    // 사용자 정보 가져오기
    const userId = req.user.id;

    // 중복 지원 확인
    const existingApplication = await Application.findOne({ user: userId, job: jobId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    // 지원 데이터 저장
    const newApplication = new Application({
      user: userId,
      job: jobId,
      resume: resume || null,
      status: 'Pending',
    });
    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully.', application: newApplication });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
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
router.get('/', authMiddleware, async (req, res) => {
    const { status, sort = 'appliedAt', order = 'desc' } = req.query;
  
    try {
      // 사용자 정보 가져오기
      const userId = req.user.id;
  
      // 필터링 및 정렬
      const filter = { user: userId };
      if (status) {
        filter.status = status;
      }
  
      const applications = await Application.find(filter)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .populate('job', 'title company location'); // job 정보 추가
  
      res.status(200).json({ applications });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
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
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
  
    try {
      // 사용자 정보 가져오기
      const userId = req.user.id;
  
      // 지원 내역 가져오기
      const application = await Application.findOne({ _id: id, user: userId });
      if (!application) {
        return res.status(404).json({ message: 'Application not found.' });
      }
  
      if (application.status !== 'Pending') {
        return res.status(400).json({ message: 'Cannot cancel this application.' });
      }
  
      // 상태 업데이트
      application.status = 'Cancelled';
      await application.save();
  
      res.status(200).json({ message: 'Application cancelled successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
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
  router.get('/summary',  authMiddleware, async (req, res) => {
    try {
      const summary = await Application.aggregate([
        { $group: { _id: '$job', count: { $sum: 1 } } }, // job 기준으로 지원 수 집계
        { $lookup: { from: 'jobpostings', localField: '_id', foreignField: '_id', as: 'job' } }, // job 정보 합치기
        { $unwind: '$job' }, // 배열 형태로 반환된 job 필드를 개별 객체로 변환
        { $project: { job: { title: 1, company: 1 }, count: 1 } }, // 필요한 데이터만 반환
        { $sort: { count: -1 } }, // 지원 수 기준 내림차순 정렬
      ]);
  
      res.status(200).json({ status: 'success', data: summary });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
  });
  
module.exports = router;
