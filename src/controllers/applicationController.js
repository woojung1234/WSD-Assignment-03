const Application = require('../models/Application');
const { getPagination } = require('../utils/pagination');

/**
 * 지원하기
 */
exports.submitApplication = async (req, res) => {
  const { jobId, resume } = req.body;

  try {
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
};

/**
 * 지원 내역 조회
 */
exports.getApplications = async (req, res) => {
  const { status, sort = 'appliedAt', order = 'desc', page = 1, limit = 10 } = req.query;

  try {
    const userId = req.user.id;

    // 필터링 조건 설정
    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    // 페이지네이션 설정
    const { skip, limit: parsedLimit } = getPagination(page, limit);

    // 데이터 조회
    const applications = await Application.find(filter)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parsedLimit)
      .populate('job', 'title company location');

    // 총 항목 수 계산
    const total = await Application.countDocuments(filter);

    res.status(200).json({
      data: applications,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * 지원 취소
 */
exports.cancelApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = req.user.id;

    // 지원 내역 확인
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
};

/**
 * 지원 현황 집계
 */
exports.getApplicationSummary = async (req, res) => {
  try {
    const summary = await Application.aggregate([
      { $group: { _id: '$job', count: { $sum: 1 } } },
      { $lookup: { from: 'jobpostings', localField: '_id', foreignField: '_id', as: 'job' } },
      { $unwind: '$job' },
      { $project: { job: { title: 1, company: 1 }, count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ status: 'success', data: summary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};