const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { jobId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const review = await Review.create({ jobId, userId, rating, comment });
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  const { jobId } = req.query;

  try {
    const reviews = await Review.find({ jobId }).populate('userId', 'email');
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
