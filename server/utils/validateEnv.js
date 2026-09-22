const { z } = require('zod');
const logger = require('./logger');

const envSchema = z.object({
  DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required' }).min(1, 'DATABASE_URL cannot be empty'),
  JWT_SECRET: z.string({ required_error: 'JWT_SECRET is required' }).min(1, 'JWT_SECRET cannot be empty'),
  JWT_EXPIRES_IN: z.string({ required_error: 'JWT_EXPIRES_IN is required' }).min(1, 'JWT_EXPIRES_IN cannot be empty').default('1d'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string({ required_error: 'CLIENT_URL is required' }).min(1, 'CLIENT_URL cannot be empty'),
});

const validateEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues.map(
      (issue) => `  - ${issue.path.join('.') || 'env'}: ${issue.message}`
    ).join('\n');

    logger.error(`Environment validation failed at boot:\n${formattedErrors}`);
    process.exit(1);
  }

  return parsed.data;
};

module.exports = validateEnv;
