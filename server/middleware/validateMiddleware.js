const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    next(error);
  }
};

const validateParams = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.params);
    req.params = parsed;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
module.exports.validateParams = validateParams;
