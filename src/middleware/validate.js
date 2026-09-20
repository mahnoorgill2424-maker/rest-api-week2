const AppError = require('../errors/AppError');

module.exports = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });
    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return next(new AppError('VALIDATION_ERROR', message, 400));
    }
    req[property] = value;
    next();
  };
};