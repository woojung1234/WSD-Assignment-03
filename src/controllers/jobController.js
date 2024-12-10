const JobPosting = require('../models/JobPosting');
const { getPagination } = require('../utils/pagination');
const Company = require('../models/Company');
/**
 * 공고 목록 조회 (필터링, 정렬, 페이지네이션 포함)
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getJobListings = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    region,
    experience,
    salary,
    techStack,
    keyword,
    companyName, // 회사명 필터
    position,
  } = req.query;

  try {
    const filter = {};

    if (region) filter.location = region;
    if (experience) {
      if (experience === '신입') {
        filter.experience = '신입'; // 정확히 '신입'인 경우
      } else {
        const experienceLevels = ['1년 이상', '3년 이상', '5년 이상', '10년 이상'];
        const index = experienceLevels.indexOf(experience);
        if (index !== -1) {
          filter.experience = { $in: experienceLevels.slice(index) }; // 선택된 조건 이상
        }
      }
    }
    
    if (salary) filter.salary = { $gte: parseInt(salary, 10) };
    if (techStack) filter.techStack = { $in: techStack.split(',') };

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // 회사명 필터 추가
    if (companyName) {
      const matchingCompanies = await Company.find({ name: { $regex: companyName, $options: 'i' } }).select('_id');
      const companyIds = matchingCompanies.map((company) => company._id);

      if (companyIds.length > 0) {
        filter.company = { $in: companyIds };
      } else {
        // 검색 결과가 없으면 빈 결과 반환
        return res.status(200).json({
          data: [],
          pagination: {
            currentPage: parseInt(page, 10),
            totalPages: 0,
            totalItems: 0,
          },
        });
      }
    }

    if (position) filter.title = { $regex: position, $options: 'i' };

    const { skip, limit: parsedLimit } = getPagination(page, limit);

    const jobs = await JobPosting.find(filter)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(parsedLimit)
      .populate('company', 'name'); // 회사명을 포함한 결과 반환

    const total = await JobPosting.countDocuments(filter);

    res.status(200).json({
      data: jobs,
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
 * 공고 상세 조회 (관련 공고 포함)
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getJobDetails = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

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
      _id: { $ne: id },
    }).select('title company location techStack').limit(5);

    res.status(200).json({ job, relatedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * 지역별 공고 수 조회
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getJobSummaryByLocation = async (req, res) => {
  try {
    const summary = await JobPosting.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ status: 'success', data: summary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};

/**
 * 인기 공고 조회 (페이지네이션 포함)
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.getPopularJobs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const { skip, limit: parsedLimit } = getPagination(page, limit); // 페이지네이션 계산

    const popularJobs = await JobPosting.find({ approved: true })
      .sort({ views: -1 })
      .skip(skip)
      .limit(parsedLimit);

    const total = await JobPosting.countDocuments({ approved: true });

    res.status(200).json({
      status: 'success',
      data: popularJobs,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / parsedLimit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
};
