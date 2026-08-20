require('dotenv').config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://neondb_owner:npg_t7Cm6JRiSobr@ep-frosty-night-az3rhr5l.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    '5df98f7e33176fa69a142e624da31a5473bb5402e10da967e3e534c99da33ecb';
}
if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '1d';
}

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
