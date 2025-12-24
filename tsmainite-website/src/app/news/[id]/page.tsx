'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar } from 'lucide-react';
import { getNewsDetail } from '@/lib/api';
import MarkdownContent from '@/components/MarkdownContent';

export default function NewsDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNewsData();
  }, [id]);

  const loadNewsData = async () => {
    try {
      setLoading(true);
      const response = await getNewsDetail(id as any);

      if (response.code === 200 && response.data) {
        setNews(response.data);
        setError(null);
      } else {
        setError('新闻数据加载失败');
      }
    } catch (err) {
      console.error('加载新闻失败:', err);
      setError('新闻数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600">加载中...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">新闻未找到</h1>
            <p className="text-gray-600 mb-8">抱歉，该新闻不存在或已删除。</p>
            <button 
              onClick={() => router.push('/news')}
              className="bg-gray-900 hover:bg-black text-white px-6 py-3 font-semibold"
            >
              返回新闻列表
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 font-semibold transition"
          >
            <ArrowLeft size={20} />
            返回新闻列表
          </button>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {news.title}
          </h1>

          {/* 发布时间 */}
          <div className="flex items-center gap-2 text-gray-600 mb-12 text-lg">
            <Calendar size={20} className="text-gray-700" />
            <span>{news.date ? new Date(news.date).toLocaleDateString('zh-CN') : new Date(news.createdAt).toLocaleDateString('zh-CN')}</span>
          </div>

          {/* 文章内容 */}
          <article className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 leading-relaxed text-lg">
              <MarkdownContent content={news.content || ''} />
            </div>
          </article>

          {/* 分隔线 */}
          <hr className="my-12 border-gray-200" />

          {/* CTA */}
          <section className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">了解更多</h2>
            <p className="text-gray-600 mb-6">
              如需了解更多信息，欢迎与我们联系
            </p>
            <button 
              onClick={() => router.push('/contact')}
              className="bg-gray-900 hover:bg-black text-white px-8 py-3 font-semibold transition"
            >
              立即咨询
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
