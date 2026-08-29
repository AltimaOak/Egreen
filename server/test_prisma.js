require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 40));
console.log('Full URL length:', process.env.DATABASE_URL?.length);

const p = new PrismaClient({ log: ['error', 'warn', 'info'] });

p.$queryRaw`SELECT 1 as test`
.then(r => {
  console.log('\n✅ DB CONNECTION OK:', r);
  return p.product.count();
})
.then(count => {
  console.log('✅ Product count:', count);
})
.catch(e => {
  console.error('\n❌ ERROR:', e.message);
  console.error('Error code:', e.code);
  console.error('Error meta:', e.meta);
})
.finally(() => p.$disconnect());
