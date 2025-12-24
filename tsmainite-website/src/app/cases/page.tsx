'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getCaseList } from '@/lib/api';

const ITEMS_PER_PAGE = 6;

// Fallback 空数据（API失败时使用）
const fallbackCaseData = {
  cases: [],
};

export default function Cases() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [cases, setCases] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // 从后端API获取案例列表
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await getCaseList(selectedIndustry === 'all' ? 'all' : selectedIndustry, currentPage, ITEMS_PER_PAGE);
        
        if (response.code === 200 && response.data) {
          setCases(response.data);
          // 使用API返回的分页信息
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages || 1);
          } else {
            setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
          }
          if (response.categories) {
            setIndustries(response.categories);
          }
          setError(null);
        } else {
          setError('无法加载案例数据');
        }
      } catch (err) {
        console.warn('API获取失败:', err);
        setCases([]);
        setIndustries([]);
        setError('无法加载案例数据');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [selectedIndustry, currentPage]);

  // 过滤选中行业的案例
  const filteredCases = useMemo(() => {
    if (selectedIndustry === 'all') {
      return cases;
    }
    return cases.filter(c => c.industry === selectedIndustry);
  }, [cases, selectedIndustry]);

  // 切换行业时重置页码
  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustry(industryId);
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <main className="pt-16 bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">成功案例</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            成功案例
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            来自全球各行业的真实应用案例，展示我们解决方案的效果和价值
          </p>

          {/* 加载状态 */}
          {loading && <div className="text-center py-8 text-gray-600">加载中...</div>}

          {/* 行业筛选 */}
          {!loading && industries.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-wrap gap-3">
                <button
                  key="all"
                  onClick={() => handleIndustryChange('all')}
                  className={`px-4 py-2 text-sm font-medium transition border ${
                    selectedIndustry === 'all'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-400 hover:border-gray-900'
                  }`}
                >
                  全部行业
                </button>
                {industries.filter(ind => ind.id !== 'all').map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustryChange(industry.id)}
                    className={`px-4 py-2 text-sm font-medium transition border ${
                      selectedIndustry === industry.id
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-400 hover:border-gray-900'
                    }`}
                  >
                    {industry.name}
                    {industry.count && <span className="text-xs ml-2">({industry.count})</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 案例网格 */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.id}`}
                className="bg-white border border-gray-200 overflow-hidden hover:border-gray-400 transition group flex flex-col"
              >
                {/* 图片 - 黄金比例 1.618:1 */}
                <div className="bg-gray-100 overflow-hidden" style={{aspectRatio: '1.618 / 1'}}>
                  {caseItem.image ? (
                    <img
                      src={caseItem.image.startsWith('http') ? caseItem.image : `/api${caseItem.image}`}
                      alt={caseItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>暂无图片</span>
                    </div>
                  )}
                </div>

                {/* 内容 - 使用flex-grow让内容区域占据剩余空间 */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* 标题 */}
                  <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition">
                    {caseItem.title}
                  </h3>

                  {/* 项目简述 */}
                  {caseItem.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
                      {caseItem.description}
                    </p>
                  )}

                  {/* 行业标签 - 底部对齐 */}
                  <div className="pt-3 border-t border-gray-200">
                    <span className="inline-block bg-gray-900 text-white text-xs font-semibold px-3 py-1">
                      {caseItem.industry}
                    </span>
                  </div>
                </div>
              </Link>
              ))}
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium border transition ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-900 border-gray-400 hover:border-gray-900'
                }`}
              >
                ← 上一页
              </button>

              {/* 页码按钮 */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm font-medium transition border ${
                      currentPage === page
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-900 border-gray-400 hover:border-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium border transition ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-900 border-gray-400 hover:border-gray-900'
                }`}
              >
                下一页 →
              </button>
            </div>
          )}

          {/* 结果统计 */}
          <div className="text-center text-sm text-gray-600 py-8">
            共找到 <span className="font-semibold">{filteredCases.length}</span> 个行业案例
            {currentPage > 1 && <span>，当前第 <span className="font-semibold">{currentPage}</span> 页</span>}
          </div>
        </div>

        {/* 底部 CTA */}
        <section className="py-16 bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto px-2 sm:px-3 lg:px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              有类似的需求？
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              联系我们的专家团队，为您的企业量身定制解决方案
            </p>
            <a
              href="/contact"
              className="inline-block bg-gray-900 hover:bg-black text-white px-8 py-3 font-semibold transition"
            >
              咨询专家
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
