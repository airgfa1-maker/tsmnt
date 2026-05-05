import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// SHA256 密码哈希
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🗄️  开始初始化数据库...\n');

  try {
    // 1. 创建管理员用户
    console.log('👤 创建管理员账户...');
    const adminPassword = hashPassword('admin123');
    
    await prisma.user.deleteMany({});
    
    await prisma.user.create({
      data: {
        username: 'admin',
        password: adminPassword
      }
    });
    console.log(`   ✅ 管理员创建成功`);
    console.log(`   👤 用户名: admin`);
    console.log(`   🔑 密码: admin123\n`);

    // 2. 创建网站信息
    console.log('🌐 初始化网站信息...');
    
    await prisma.siteInfo.deleteMany({});
    
    await prisma.siteInfo.create({
      data: {
        companyName: '唐山迈尼特电气有限公司',
        companyDescription: '专业磁电解决方案提供商，20年工业电磁技术深耕经验',
        phone: '139-3150-1373',
        email: 'tsmainite@163.com',
        address: '河北省唐山市',
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        tiktok: '',
        linkedin: '',
        icp: '冀ICP证XXXXXX号',
        securityCode: '130202202400000001',
        baiduMapAk: '您的百度地图API密钥',
        theme: 'light',
        language: 'zh-CN'
      }
    });
    console.log('   ✅ 网站信息初始化完成\n');

    // 3. 创建网站元数据
    console.log('📝 初始化网站元数据...');
    
    await prisma.siteMeta.deleteMany({});
    
    await prisma.siteMeta.create({
      data: {
        title: '唐山迈尼特电气有限公司 - 工业电磁设备领先制造商',
        description: '专业从事电磁除铁器、电磁搅拌器、电缆卷筒等工业电磁设备的设计、制造与销售。',
        keywords: '电磁除铁器,电磁搅拌器,工业电磁设备,电缆卷筒,液态金属泵',
        author: '唐山迈尼特',
        favicon: '/images/favicon.png',
        ogImage: '/images/og-image.jpg'
      }
    });
    console.log('   ✅ 网站元数据初始化完成\n');

    // 4. 创建产品分类
    console.log('📦 创建产品分类...');
    
    await prisma.productCategory.deleteMany({});
    
    const categories = await Promise.all([
      prisma.productCategory.create({ data: { name: '电磁除铁器' } }),
      prisma.productCategory.create({ data: { name: '电磁搅拌器' } }),
      prisma.productCategory.create({ data: { name: '电缆卷筒' } }),
      prisma.productCategory.create({ data: { name: '其他产品' } })
    ]);
    console.log(`   ✅ 创建了 ${categories.length} 个产品分类\n`);

    // 5. 创建示例产品
    console.log('🛍️  创建示例产品...');
    
    await prisma.product.deleteMany({});
    
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: '自动吸磁除铁器',
          model: 'SMDE-500',
          description: '高效率工业除铁设备',
          categoryId: categories[0].id,
          content: '# 自动吸磁除铁器\n\n## 产品特性\n- 自动清铁机制\n- 高效率分离\n- 长寿命磁铁\n\n## 技术规格\n- 处理能力：500kg/h\n- 磁力强度：高强磁\n- 应用领域：矿山、化工',
          featured: true,
          displayOrder: 1
        }
      }),
      prisma.product.create({
        data: {
          name: '电磁搅拌器',
          model: 'EMD-300',
          description: '高效率电磁搅拌设备',
          categoryId: categories[1].id,
          content: '# 电磁搅拌器\n\n## 应用领域\n- 冶金工业\n- 化工生产\n- 金属加工\n\n## 主要优势\n- 搅拌均匀\n- 温度控制精准\n- 长期稳定运行',
          featured: true,
          displayOrder: 2
        }
      }),
      prisma.product.create({
        data: {
          name: '电缆卷筒',
          model: 'CT-1000',
          description: '工业级电缆收纳设备',
          categoryId: categories[2].id,
          content: '# 电缆卷筒\n\n## 产品规格\n- 容量：1000m\n- 防护等级：IP55\n- 材质：铸铁+钢材\n\n## 性能指标\n- 承重：500kg\n- 额定速度：20m/min\n- 安全系数：5倍',
          featured: false,
          displayOrder: 3
        }
      })
    ]);
    console.log(`   ✅ 创建了 ${products.length} 个示例产品\n`);

    // 6. 创建示例案例
    console.log('📋 创建示例案例...');
    
    await prisma.case.deleteMany({});
    
    const cases = await Promise.all([
      prisma.case.create({
        data: {
          title: '某大型钢铁企业除铁系统升级',
          description: '成功为国内知名钢铁企业升级除铁系统，提高生产效率30%',
          content: '# 项目详情\n\n通过我们的高效除铁器，客户的生产效率大幅提升...',
          company: '中国宝武钢铁集团',
          location: '河北省唐山市',
          industry: '钢铁冶金',
          featured: true,
          displayOrder: 1
        }
      }),
      prisma.case.create({
        data: {
          title: '化工企业搅拌系统解决方案',
          description: '为化工企业提供完整的电磁搅拌解决方案',
          content: '# 项目成果\n\n实现了产品质量的稳定提升...',
          company: '某化工有限公司',
          location: '山东省',
          industry: '化学工业',
          featured: true,
          displayOrder: 2
        }
      })
    ]);
    console.log(`   ✅ 创建了 ${cases.length} 个示例案例\n`);

    // 7. 创建示例新闻
    console.log('📰 创建示例新闻...');
    
    await prisma.news.deleteMany({});
    
    const news = await Promise.all([
      prisma.news.create({
        data: {
          title: '我公司成功获得ISO9001认证',
          content: '# 重大喜讯\n\n我公司经过严格审核，成功获得ISO9001质量管理体系认证...',
          category: '公司新闻',
          excerpt: '我公司成功获得ISO9001认证',
          author: '宣传部',
          featured: true,
          displayOrder: 1
        }
      }),
      prisma.news.create({
        data: {
          title: '新产品电磁超声搅拌器即将上市',
          content: '# 产品动态\n\n我公司最新研发的电磁超声搅拌器即将推向市场...',
          category: '产品动态',
          excerpt: '新产品电磁超声搅拌器即将上市',
          author: '研发部',
          featured: true,
          displayOrder: 2
        }
      })
    ]);
    console.log(`   ✅ 创建了 ${news.length} 篇示例新闻\n`);

    // 8. 创建首页Hero轮播
    console.log('🎬 创建首页轮播...');
    
    await prisma.homeHeroSlide.deleteMany({});
    
    await Promise.all([
      prisma.homeHeroSlide.create({
        data: {
          title: '电磁创新 驱动工业',
          subtitle: '赋能制造企业，降本增效',
          image: '/images/hero-1.jpg',
          link: '/products',
          order: 1,
          active: true
        }
      })
    ]);
    console.log('   ✅ 首页轮播创建完成\n');

    // 9. 清空其他表
    console.log('🧹 清空其他临时表...');
    await prisma.homeAbout.deleteMany({});
    await prisma.pageAbout.deleteMany({});
    await prisma.homeProductCard.deleteMany({});
    await prisma.homeCase.deleteMany({});
    await prisma.gallery.deleteMany({});
    await prisma.message.deleteMany({});
    console.log('   ✅ 临时表已清空\n');

    console.log('════════════════════════════════════════');
    console.log('✨ 数据库初始化完成！');
    console.log('════════════════════════════════════════');
    console.log('\n📖 登录信息：');
    console.log('   URL:      http://localhost:3000/admin-mnt/login');
    console.log('   用户名:   admin');
    console.log('   密码:     admin123');
    console.log('\n📊 已创建：');
    console.log(`   ✓ ${categories.length} 个产品分类`);
    console.log(`   ✓ ${products.length} 个示例产品`);
    console.log(`   ✓ ${cases.length} 个示例案例`);
    console.log(`   ✓ ${news.length} 篇示例新闻`);
    console.log('\n⚠️  请立即修改默认密码！\n');

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
