import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🔐 创建管理员账户...');

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashPassword('admin123'), // 默认密码：admin123
    },
  });

  console.log('✅ 管理员账户创建成功！');
  console.log('📝 登录信息:');
  console.log('   用户名: admin');
  console.log('   密码: admin123');
}

main()
  .catch((e) => {
    console.error('❌ 创建失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
