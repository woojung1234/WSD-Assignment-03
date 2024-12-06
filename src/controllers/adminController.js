const JobPosting = require('../models/JobPosting');

/**
 * 공고 승인/비승인 처리
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.approveJobPosting = async (req, res) => {
  const { id } = req.params;
  const { approve } = req.body; // true: 승인, false: 비승인

  try {
    const job = await JobPosting.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    job.approved = approve; // 승인 상태 업데이트
    await job.save();

    res.status(200).json({
      status: 'success',
      message: `Job posting ${approve ? 'approved' : 'disapproved'} successfully`,
      job,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};
