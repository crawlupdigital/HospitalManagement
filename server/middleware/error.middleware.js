const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: err.errors.map(e => e.message).join(', '),
      data: null
    });
  }

  // Joi Validation error (if we add Joi)
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: err.details[0].message,
      data: null
    });
  }

  // JWT errors
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing token',
      data: null
    });
  }

  // Fallback
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null
  });
};

module.exports = { errorHandler };
