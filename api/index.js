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
    console.error('Serverless init failed:', initError);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  return app(req, res);
};