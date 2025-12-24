'use client';

import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ProductsContent from './ProductsContent';

export default function Products() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">产品中心</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            产品中心
          </h1>

          <Suspense fallback={<div className="text-center py-8 text-gray-600">加载中...</div>}>
            <ProductsContent />
          </Suspense>
        </div>

        {/* 底部 CTA */}
        <section className="py-20 bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto px-2 sm:px-3 lg:px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              找到合适的解决方案？
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              无论您需要什么技术支持，我们的专家团队随时准备为您提供量身定制的服务。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-gray-900 hover:bg-black text-white px-8 py-3 font-semibold transition"
              >
                联系我们
              </a>
              <a
                href="/cases"
                className="inline-block border border-gray-900 text-gray-900 hover:bg-gray-50 px-8 py-3 font-semibold transition"
              >
                查看成功案例
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

