const { PrismaClient } = require('@prisma/client');

// Single shared Prisma client for the whole app. Using one instance prevents
// connection-pool exhaustion (multiple `new PrismaClient()` create separate
// pools per file, which can exceed Neon's connection limits).
const prisma = new PrismaClient();

module.exports = prisma;