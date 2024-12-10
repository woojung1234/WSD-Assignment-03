const JobPosting = require('../models/JobPosting');

exports.compareJobs = async (req, res) => {
  const { jobIds } = req.body; // jobIds: [id1, id2, ...]

  try {
    const jobs = await JobPosting.find({ _id: { $in: jobIds } }).select('title company salary techStack location');
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
