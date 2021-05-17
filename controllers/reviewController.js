const review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(review);

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = factory.getOne(review);
exports.createReview = factory.createOne(review);
exports.deleteReview = factory.deleteOne(review);
exports.updateReview = factory.updateOne(review);
