const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    const details = error.issues?.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })) || [{ message: error.message }];

    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      details,
    });
  }
};

module.exports = validate;
