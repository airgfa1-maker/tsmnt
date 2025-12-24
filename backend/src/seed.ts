import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始填充数据库...');

  // 创建网站信息
  const siteInfo = await prisma.siteInfo.create({
    data: {
      companyName: '唐山迈尼特电气有限公司',
      companyDescription: '专业磁电解决方案提供商，拥有20年工业电磁技术深耕经验，为全球客户提供高效、可靠、创新的电气解决方案。',
      phone: '139-3150-1373',
      whatsapp: '1393150137',
      email: 'tsmainite@163.com',
      address: '河北省唐山市',
      facebook: 'https://facebook.com/tsmainite',
      instagram: 'https://instagram.com/tsmainite',
      twitter: 'https://twitter.com/tsmainite',
      youtube: 'https://youtube.com/@tsmainite',
      tiktok: 'https://tiktok.com/@tsmainite',
      linkedin: 'https://linkedin.com/company/tsmainite',
      icp: '冀ICP证XXXXXX号',
      securityCode: '130202202400000001',
      theme: 'light',
      language: 'zh-CN'
    }
  });
  console.log('✅ 已创建网站信息');

  // 创建网站元数据
  const siteMeta = await prisma.siteMeta.create({
    data: {
      title: '唐山迈尼特电气有限公司-工业电气解决方案专家',
      description: '专业提供工业电气、磁电设备及解决方案。拥有20年行业经验，为全球企业提供高效可靠的技术支持与服务。',
      keywords: '工业电气,磁电,电气解决方案,工业设备,电磁设备,唐山',
      author: '唐山迈尼特电气有限公司',
      favicon: '/favicon.ico',
      ogImage: '/images/og-image.png'
    }
  });
  console.log('✅ 已创建网站元数据');

  // 创建产品分类
  const categories = await Promise.all([
    prisma.productCategory.create({ data: { name: '机械设备' } }),
    prisma.productCategory.create({ data: { name: '电子产品' } }),
    prisma.productCategory.create({ data: { name: '化工用品' } }),
    prisma.productCategory.create({ data: { name: '建筑材料' } })
  ]);

  console.log('✅ 已创建 4 个产品分类');

  // 创建产品
  await Promise.all([
    prisma.product.create({
      data: {
        name: '工业齿轮箱',
        model: 'GBX-500',
        description: '高效率工业齿轮箱',
        categoryId: categories[0].id,
        content: '# 工业齿轮箱\n\n## 产品特性\n- 高效率传动\n- 低噪音设计\n- 长寿命设计\n\n## 技术规格\n- 功率：50kW\n- 传动比：3:1\n- 效率：98%',
        price: 5000,
        featured: true,
        displayOrder: 1
      }
    }),
    prisma.product.create({
      data: {
        name: '太阳能板',
        model: 'SPL-400W',
        description: '高效率太阳能电池板',
        categoryId: categories[1].id,
        content: '# 太阳能板\n\n## 产品描述\n高效率单晶硅太阳能电池板，适用于各种应用场景。\n\n## 主要优势\n- 转换效率：22%\n- 宽工作温度范围\n- 防水防尘设计',
        price: 2000,
        featured: true,
        displayOrder: 2
      }
    }),
    prisma.product.create({
      data: {
        name: '工业涂料',
        model: 'COAT-500',
        description: '防腐工业涂料',
        categoryId: categories[2].id,
        content: '# 工业防腐涂料\n\n## 应用领域\n- 钢结构防护\n- 化工设备保护\n- 海洋环境防腐\n\n## 性能指标\n- 粘度：80-120\n- 固含量：60%\n- 干燥时间：4小时',
        price: 150,
        featured: true,
        displayOrder: 3
      }
    }),
    prisma.product.create({
      data: {
        name: '水泥砖',
        model: 'BRICK-MU10',
        description: '高强度水泥砖',
        categoryId: categories[3].id,
        content: '# 高强度水泥砖\n\n## 产品信息\n采用优质水泥和骨料制造，具有高强度和耐久性。\n\n## 规格参数\n- 尺寸：240×115×53mm\n- 强度等级：MU10\n- 密度：1800kg/m³',
        price: 5,
        featured: false,
        displayOrder: 0
      }
    })
  ]);

  console.log('✅ 已创建 4 个产品');

  // 创建案例
  await Promise.all([
    prisma.case.create({
      data: {
        title: '工业设备集成项目',
        description: '为客户集成完整的生产线解决方案',
        industry: '机械制造',
        company: 'A某机械制造有限公司',
        location: '浙江杭州',
        content: '# 工业设备集成项目\n\n## 项目概述\n该项目成功为客户设计并实施了完整的工业生产线。\n\n## 主要成就\n- 设备选型和配置\n- 完整的系统集成\n- 技术培训和支持\n\n## 项目成果\n- 生产效率提升40%\n- 成本降低30%\n- 客户满意度99.9%',
        featured: true,
        displayOrder: 1
      }
    }),
    prisma.case.create({
      data: {
        title: '能源转换系统改造',
        description: '大型工业企业的能源系统优化项目',
        industry: '能源化工',
        company: 'B某能源集团',
        location: '山东青岛',
        content: '# 能源转换系统改造\n\n## 背景\n客户的能源转换效率需要提升。\n\n## 解决方案\n- 更新核心设备\n- 优化系统架构\n- 降低运营成本\n\n## 实现效果\n- 转换效率从85%提升至94%\n- 年度能耗节省200万元\n- ROI周期12个月',
        featured: true,
        displayOrder: 2
      }
    }),
    prisma.case.create({
      data: {
        title: '环保涂料应用案例',
        description: '化工行业采用环保涂料的成功案例',
        industry: '化工',
        company: 'C某化工有限公司',
        location: '江苏无锡',
        content: '# 环保涂料应用\n\n## 客户需求\n需要既环保又高效的涂料解决方案。\n\n## 实现效果\n- 环保认证通过\n- 生产效率提高40%\n- 工人安全有保障\n- VOC排放降低70%',
        featured: false,
        displayOrder: 0
      }
    }),
    prisma.case.create({
      data: {
        title: '建筑材料质量升级',
        description: '建筑企业的材料质量认证项目',
        industry: '建筑材料',
        company: 'D某建筑材料公司',
        location: '安徽合肥',
        content: '# 建筑材料质量升级\n\n## 项目任务\n获得国际质量认证。\n\n## 完成情况\n- 通过ISO 9001认证\n- 产品质量提升\n- 市场竞争力增强\n- 获得国家专利3项',
        featured: false,
        displayOrder: 0
      }
    })
  ]);

  console.log('✅ 已创建 4 个案例');

  // 创建新闻
  await Promise.all([
    prisma.news.create({
      data: {
        title: '公司荣获行业最佳服务奖',
        category: '公司新闻',
        excerpt: '我们公司因在工业领域的杰出贡献，荣获本年度行业最佳服务奖。',
        author: '编辑部',
        date: new Date().toISOString().split('T')[0],
        content: '# 行业奖项\n\n我们公司因在工业领域的杰出贡献，荣获本年度行业最佳服务奖。\n\n## 获奖意义\n这是对我们团队的认可和鼓励，我们将继续为客户提供优质的服务。',
        featured: true,
        displayOrder: 1
      }
    }),
    prisma.news.create({
      data: {
        title: '新产品线发布会召开',
        category: '产品发布',
        excerpt: '我们成功推出了三款革新性产品，代表行业最新技术水平。',
        author: '产品部',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
        content: '# 新产品发布\n\n我们成功推出了三款革新性产品，代表行业最新技术水平。\n\n## 产品亮点\n- 高能效\n- 环保友好\n- 智能化控制',
        featured: true,
        displayOrder: 2
      }
    }),
    prisma.news.create({
      data: {
        title: '国际技术认证获批',
        category: '认证资讯',
        excerpt: '公司通过ISO 9001和ISO 14001国际认证，标志着我们的质量管理和环保承诺。',
        author: '质量部',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split('T')[0],
        content: '# 国际认证通过\n\n公司通过ISO 9001和ISO 14001国际认证，标志着我们的质量管理和环保承诺。\n\n## 认证范围\n- 产品设计\n- 生产制造\n- 客户服务',
        featured: false,
        displayOrder: 0
      }
    }),
    prisma.news.create({
      data: {
        title: '可持续发展战略启动',
        category: '策略动态',
        excerpt: '启动了新的可持续发展战略，致力于降低碳排放和能源消耗。',
        author: '战略部',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
        content: '# 绿色发展\n\n启动了新的可持续发展战略，致力于降低碳排放和能源消耗。\n\n## 目标计划\n- 2025年减排30%\n- 100%可再生能源\n- 零废弃生产',
        featured: false,
        displayOrder: 0
      }
    })
  ]);

  console.log('✅ 已创建 4 条新闻');

  // 创建文档
  await Promise.all([
    prisma.document.create({
      data: {
        title: '产品使用手册',
        content: '# 产品使用手册\n\n## 安装步骤\n1. 检查配件完整性\n2. 按照安装指南安装\n3. 进行初始化测试\n\n## 故障排除\n- 问题：无法启动\n- 解决方案：检查电源连接'
      }
    }),
    prisma.document.create({
      data: {
        title: '技术规格书',
        content: '# 技术规格\n\n## 电气指标\n- 工作电压：220V/380V\n- 功率因数：0.95\n- 保护等级：IP65\n\n## 环境条件\n- 工作温度：-20°C ~ +50°C\n- 湿度：5% ~ 95%'
      }
    }),
    prisma.document.create({
      data: {
        title: '维护保养指南',
        content: '# 维护保养\n\n## 日常维护\n- 检查设备运行状态\n- 清洁散热器\n- 检查螺栓紧固\n\n## 定期保养\n- 每月：油液检查\n- 每季：全面检修\n- 每年：主要部件更换'
      }
    }),
    prisma.document.create({
      data: {
        title: '安全操作规程',
        content: '# 安全操作\n\n## 操作前检查\n- 确认电源正常\n- 检查安全装置\n- 穿戴防护装备\n\n## 紧急停止\n- 按下红色按钮立即停止\n- 切断电源\n- 进行故障排查'
      }
    })
  ]);

  console.log('✅ 已创建 4 个文档');

  console.log('✅ 数据库填充完成！');
}

main()
  .catch((e) => {
    console.error('❌ 填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
