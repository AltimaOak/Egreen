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
    return res.status(500).json({
      error: 'Vercel Serverless Function Init Failed',
      message: initError.message,
      stack: initError.stack,
    });
  }
  return app(req, res);
};
