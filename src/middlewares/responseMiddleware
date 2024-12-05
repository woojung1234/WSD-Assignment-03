const responseMiddleware = (req, res, next) => {
  res.success = (data, pagination) => {
    res.status(200).json({
      status: 'success',
      data,
      pagination,
    });
  };

  res.error = (message, code = 'UNKNOWN_ERROR', statusCode = 500) => {
    res.status(statusCode).json({
      status: 'error',
      message,
      code,
    });
  };

  next();
};

module.exports = responseMiddleware;
