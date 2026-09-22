require('dotenv').config();

let app;
let initError = null;

try {
  app = require('../server/index');
} catch (err) {
  console.error('Failed to load server/index:', err);
  initError = err;
}

module.exports = (req, res) => {
  if (initError) {
    console.error('Serverless function init error:', initError.stack || initError);
    return res.status(500).json({
      error: {
        message: 'Serverless initialization failed',
        code: 'INITIALIZATION_FAILED',
      },
    });
  }
  return app(req, res);
};
