'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCaseDetail, getCaseList } from '@/lib/api';
import MarkdownContent from '@/components/MarkdownContent';
import { ArrowLeft } from 'lucide-react';

export default function CaseDetail() {
  const params = useParams();
  const id = params.id as string;
  const [caseData, setCaseData] = useState<any>(null);
  const [relatedCases, setRelatedCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCaseData();
  }, [id]);

  const loadCaseData = async () => {
    try {
      setLoading(true);
      const response = await getCaseDetail(id as any);
      
      if (response.code === 200 && response.data) {
        setCaseData(response.data);
        // 加载相关案例
        const casesResponse = await getCaseList('all', 1, 3);
        if (casesResponse.data) {
          setRelatedCases(casesResponse.data.filter((c: any) => c.id !== id));
        }
        setError(null);
      } else {
        setError('案例数据加载失败');
      }
    } catch (err) {
      console.error('加载案例失败:', err);
      setError('案例数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen bg-white">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !caseData) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20 min-h-screen bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">案例未找到</h1>
            <p className="text-gray-600 mb-8">抱歉，该案例不存在或已删除。</p>
            <Link 
              href="/cases" 
              className="inline-block bg-gray-900 hover:bg-black text-white px-6 py-3 font-semibold transition"
            >
              返回案例列表
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20 pb-20 bg-white">
        {/* 面包屑导航 */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <span className="text-gray-400">/</span>
              <Link href="/cases" className="text-gray-600 hover:text-gray-900">成功案例</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold line-clamp-1">{caseData.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold mt-8 mb-8 transition"
          >
            <ArrowLeft size={20} />
            返回案例列表
          </Link>

          {/* Hero区域 - 图片 + 信息卡片 */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* 左侧：大图片 */}
              <div className="lg:col-span-2">
                {caseData.image && (
                  <div className="bg-gray-100 overflow-hidden shadow-lg" style={{aspectRatio: '1.618 / 1'}}>
                    <img
                      src={caseData.image.startsWith('http') ? caseData.image : `/api${caseData.image}`}
                      alt={caseData.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 右侧：信息卡片 */}
              <div className="space-y-6">
                {/* 行业标签 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">行业类别</h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-block bg-gray-900 text-white text-sm font-semibold px-4 py-2">
                      {caseData.industry}
                    </span>
                  </div>
                </div>

                {/* 客户信息卡片 */}
                <div className="bg-gray-50 border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">项目信息</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">客户企业</p>
                      <p className="text-lg font-semibold text-gray-900">{caseData.company || '暂无'}</p>
                    </div>
                    {caseData.location && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">项目地点</p>
                        <p className="text-lg font-semibold text-gray-900">{caseData.location}</p>
                      </div>
                    )}
                    {caseData.description && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">项目简述</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{caseData.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA按钮 */}
                <Link
                  href="/contact"
                  className="block w-full bg-gray-900 hover:bg-black text-white text-center px-6 py-4 font-semibold transition"
                >
                  获取类似方案
                </Link>
              </div>
            </div>
          </div>

          {/* 案例标题 */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {caseData.title}
            </h1>
          </div>

          {/* 内容区域 */}
          <div className="mb-16 max-w-3xl">
            <div className="prose prose-lg max-w-none text-gray-700">
              <MarkdownContent content={caseData.content || ''} />
            </div>
          </div>

          {/* 分隔线 */}
          <hr className="my-16 border-gray-200" />

          {/* 相关案例 */}
          {relatedCases.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">相关案例</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedCases.slice(0, 3).map((relatedCase) => (
                  <Link
                    key={relatedCase.id}
                    href={`/cases/${relatedCase.id}`}
                    className="group bg-white border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-lg transition duration-300"
                  >
                    {/* 案例图片 */}
                    <div className="bg-gray-100 overflow-hidden h-48" style={{aspectRatio: '1.618 / 1'}}>
                      {relatedCase.image ? (
                        <img
                          src={relatedCase.image.startsWith('http') ? relatedCase.image : `/api${relatedCase.image}`}
                          alt={relatedCase.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          暂无图片
                        </div>
                      )}
                    </div>

                    {/* 案例信息 */}
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                          {relatedCase.industry}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition line-clamp-2">
                        {relatedCase.title}
                      </h3>
                      {relatedCase.company && (
                        <p className="text-sm text-gray-600">
                          客户：{relatedCase.company}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 底部CTA */}
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              需要类似的解决方案？
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              联系我们，我们将为您量身定制适合的方案
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gray-900 hover:bg-black text-white px-8 py-3 font-semibold transition"
            >
              立即咨询
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
