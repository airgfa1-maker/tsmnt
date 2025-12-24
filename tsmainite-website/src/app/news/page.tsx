'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { getNewsList } from '@/lib/api';

export default function News() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // 从后端API获取新闻列表
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getNewsList(currentPage, itemsPerPage);
        
        if (response.code === 200 && response.data) {
          setNewsItems(response.data);
          // 使用API返回的分页信息
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages || 1);
          } else {
            // fallback：根据数据长度计算总页数
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
          }
          setError(null);
        } else {
          setError('无法加载新闻数据');
        }
      } catch (err) {
        console.warn('API获取失败:', err);
        // API失败时使用空数组
        setNewsItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  // 计算分页
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = newsItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 bg-white">
        <div className="max-w-5xl mx-auto px-2 sm:px-3 lg:px-4">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">企业动态</h1>
            <p className="text-gray-600 text-base md:text-lg">
              了解行业动态，掌握产品进展
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-6 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {/* News List */}
          {!loading && (
            <>
              <div className="space-y-4">
                {currentNews.map((news) => (
                  <article
                    key={news.id}
                    onClick={() => router.push(`/news/${news.id}`)}
                    className="bg-white border border-gray-200 overflow-hidden hover:border-gray-400 transition cursor-pointer"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Image - 黄金比例 1.618:1 */}
                      <div className="md:col-span-1 relative bg-gray-100 overflow-hidden border-b md:border-b-0 md:border-r border-gray-200 flex" style={{aspectRatio: '1.618 / 1'}}>
                        {news.image ? (
                          <img
                            src={news.image.startsWith('http') ? news.image : `/api${news.image}`}
                            alt={news.title}
                            className="w-full object-cover"
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
                      
                      {/* Content */}
                      <div className="md:col-span-3 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <span className="inline-block bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded text-xs font-semibold w-fit">
                              {news.category}
                            </span>
                            <time className="text-gray-400 text-xs">{news.date}</time>
                          </div>

                          <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-gray-700 transition line-clamp-2">
                            {news.title}
                          </h2>
                          
                          {news.excerpt && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {news.excerpt}
                            </p>
                          )}
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/news/${news.id}`);
                          }}
                          className="text-gray-700 hover:text-gray-900 font-semibold text-sm inline-flex items-center gap-1"
                        >
                          阅读全文
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 font-semibold transition ${
                        currentPage === page
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
