const express = require('express');
const JobPosting = require('../models/JobPosting'); // JobPosting 모델 가져오기
const router = express.Router();

// 공고 목록 조회
router.get('/', async (req, res) => {
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

// 공고 상세 조회
// 공고 상세 조회
router.get('/:id', async (req, res) => {
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

module.exports = router;
