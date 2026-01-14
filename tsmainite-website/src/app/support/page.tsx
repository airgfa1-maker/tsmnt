'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;

export default function Downloads() {
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // 加载所有文档 - 使用公开API端点而不是admin端点
        const response = await fetch('/api/documents?page=1&pageSize=100');
        const result = await response.json();
        console.log('📄 Loaded documents from API:', result);
        const docs = result.data || [];
        console.log('📋 Documents:', docs.map((d: any) => ({
          id: d.id,
          title: d.title,
          file: d.file,
          hasFile: !!d.file
        })));
        setAllDocuments(docs);
      } catch (error) {
        console.error('Failed to load documents:', error);
        setAllDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, []);

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      if (!filePath) {
        console.warn('⚠️  文件路径为空');
        alert('文件路径不存在');
        return;
      }
      
      console.log('📥 开始下载:', { filePath, fileName });
      
      // 确保使用正确的路径
      const downloadUrl = filePath.startsWith('/') ? filePath : '/' + filePath;
      console.log('📍 下载URL:', downloadUrl);
      
      const response = await fetch(downloadUrl);
      console.log('📨 响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log('📦 Content-Type:', contentType);
      
      const blob = await response.blob();
      console.log('📦 Blob大小:', blob.size, '字节');
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ 下载完成');
    } catch (error) {
      console.error('❌ 下载失败:', error);
      alert(`下载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 计算分页数据
  const totalPages = Math.ceil(allDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDocuments = allDocuments.slice(startIndex, endIndex);

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">资料下载</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            资料下载
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-12 max-w-3xl">
            获取技术文档、产品手册和安装指南，帮助您快速了解和使用我们的产品
          </p>

          {/* 加载状态 */}
          {loading && <div className="text-center py-12 text-gray-600">加载中...</div>}

          {!loading && (
            <div className="max-w-6xl mx-auto">
              {allDocuments.length > 0 ? (
                <>
                  <div className="space-y-3 mb-8">
                    <div className="bg-gray-100 rounded-lg p-4 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 hidden md:grid">
                      <div className="col-span-7">文档名称</div>
                      <div className="col-span-2 text-center">上传日期</div>
                      <div className="col-span-3 text-right">操作</div>
                    </div>
                    {paginatedDocuments.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 md:items-center"
                      >
                        {/* 文档名称 */}
                        <div className="md:col-span-7">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z" />
                                <text x="7" y="15" fontSize="6" fontWeight="bold" fill="white">PDF</text>
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 font-medium truncate">{doc.title}</p>
                              <p className="text-sm text-gray-500 md:hidden">上传于 {new Date(doc.createdAt).toLocaleDateString('zh-CN')}</p>
                            </div>
                          </div>
                        </div>

                        {/* 上传日期 */}
                        <div className="md:col-span-2 text-center hidden md:block">
                          <p className="text-sm text-gray-600">{new Date(doc.createdAt).toLocaleDateString('zh-CN')}</p>
                        </div>

                        {/* 下载按钮 */}
                        <div className="md:col-span-3 text-right">
                          <button
                            onClick={() => handleDownload(doc.file, doc.title)}
                            disabled={!doc.file}
                            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 font-semibold transition text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {doc.file ? '下载' : '暂无文件'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 分页控件 */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-8">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        上一页
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage === page
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        下一页
                      </button>
                    </div>
                  )}

                  {/* 结果统计 */}
                  <div className="text-center text-sm text-gray-600 py-8 border-t border-gray-200 mt-8">
                    第 <span className="font-semibold">{currentPage}</span> 页，
                    共 <span className="font-semibold">{totalPages}</span> 页，
                    总计 <span className="font-semibold">{allDocuments.length}</span> 个文档
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-500 text-lg">暂无可下载的文档</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部信息区 */}
        <section className="py-16 bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              需要帮助？
            </h2>
            <p className="text-gray-600 text-base mb-8">
              如果您没有找到所需文档，或对我们的产品有任何疑问，欢迎联系我们的技术支持团队
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/contact"
                className="bg-gray-900 hover:bg-black text-white px-8 py-3 font-semibold transition"
              >
                联系我们
              </a>
              <a
                href="/"
                className="border border-gray-400 text-gray-900 hover:bg-gray-100 px-8 py-3 font-semibold transition"
              >
                返回首页
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

