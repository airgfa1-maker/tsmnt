import type { Metadata } from 'next';
import { newsMetadataGenerator } from '@/app/metadata';

// 新闻数据
const newsItems = [
  { id: 1, title: '电磁除铁器在冶金行业的应用创新', excerpt: '我们最新推出的EIR-200系列电磁除铁器在冶金行业取得突破性应用，除铁效率达到99.5%以上。', date: '2024-11-28' },
  { id: 2, title: 'AI智能控制系统全面升级', excerpt: '集成AI算法的新一代电磁搅拌系统正式发布，采用机器学习技术可实现精准控制。', date: '2024-11-25' },
  { id: 3, title: '唐山迈尼特荣获行业创新奖', excerpt: '在第十五届工业电磁技术大会上，我公司荣获"年度创新企业奖"。', date: '2024-11-20' },
  { id: 4, title: '铝熔炉搅拌器能效标准再次刷新', excerpt: '经过不断优化，铝熔炉电磁搅拌器能效已提升至业界领先水平。', date: '2024-11-15' },
  { id: 5, title: '与国家级研究机构达成战略合作', excerpt: '公司与中科院等国家级研究机构签署战略合作协议。', date: '2024-11-10' },
  { id: 6, title: '新型电缆卷筒产品线扩展', excerpt: '我们推出了三款全新规格的电缆卷筒产品。', date: '2024-11-05' },
  { id: 7, title: '客户满意度调查结果达99.5%', excerpt: '最新客户满意度调查显示，超过99.5%的客户对我们的产品和服务表示高度满意。', date: '2024-10-30' },
  { id: 8, title: '液态金属泵在新能源领域应用拓展', excerpt: '我们的液态金属电磁泵成功应用于新能源电池制造领域。', date: '2024-10-25' },
  { id: 9, title: '举办全国技术培训大会', excerpt: '为期三天的全国技术培训大会圆满结束，吸引了500+行业专业人士参与。', date: '2024-10-20' },
  { id: 10, title: '环保认证再添新证书', excerpt: '所有产品线均通过最新环保标准认证，完全符合国家绿色生产标准。', date: '2024-10-15' },
  { id: 11, title: '出口订单突破新高', excerpt: '今年出口订单量同比增长45%，产品已销售到30多个国家和地区。', date: '2024-10-10' },
  { id: 12, title: '研发投入创历史新高', excerpt: '年度研发投入突破1000万元，拥有25+项专利，80+名研发人员投身创新。', date: '2024-10-05' },
];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const news = newsItems.find(n => n.id === parseInt(params.id));
  
  if (!news) {
    return {
      title: '新闻未找到',
      description: '抱歉，该新闻不存在或已删除。',
    };
  }

  return newsMetadataGenerator(news.title, news.excerpt, news.id, news.date);
}
