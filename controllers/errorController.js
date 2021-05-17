const AppError = require('../utils/appError');

const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  const value = err.keyValue.name;
  const message = `Duplicate field value '${value}': please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token! Please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired,please log in again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Rendered website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = function (err, req, res) {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //programming or other unknown errors
    }
    // 1)Log the error
    //2) send generate message

    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
  //opertional trusted error
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    // console.log(error);
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationError(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrorProd(err, req, res);
  }
};
