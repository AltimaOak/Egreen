const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_t7Cm6JRiSobr@ep-frosty-night-az3rhr5l.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const dbUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
