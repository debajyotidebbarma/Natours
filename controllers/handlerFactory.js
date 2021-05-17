const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with that id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newdoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newdoc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    //populate fills the reference data without saving it
    //Tour.findOne({_id:req.params.id})
    if (!doc) {
      return next(new AppError('No tour found with that id', 404));
    }

    res.status(200).json({
      status: 'success',

      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //to allow  fro nested GET reviews on tour

    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    //EXECUTE QUEURY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    const doc = await features.query;
    //query.sort().select().skip().limit()..

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
