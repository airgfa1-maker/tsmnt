'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Link from 'next/link';

export default function About() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try { 
        setLoading(true);
        const response = await fetch('/api/home/about');
        if (!response.ok) throw new Error('Failed to fetch about page');
        const result = await response.json();
        setContent(result.content || '');
      } catch (err: any) {
        setError(err.message);
        console.error('Failed to load about page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

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
              <span className="text-gray-900 font-semibold">关于我们</span>
            </nav>
          </div>
        </div>

        {/* 内容区域 */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-600 mb-4">加载失败：{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              重试
            </button>
          </div>
        ) : (
          <article className="py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="markdown-render">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
