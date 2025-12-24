'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MarkdownContent from '@/components/MarkdownContent';


export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${baseUrl}/products/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.code === 200 && data.data) {
          setProduct(data.data);
        } else {
          setError('产品不存在或已删除');
        }
      } else {
        setError('产品不存在或已删除');
      }
    } catch (err) {
      console.error('加载产品详情失败:', err);
      setError('加载产品详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen bg-white flex items-center justify-center">
          <div className="text-gray-600">加载中...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">抱歉，产品不存在或已删除</h1>
              <Link href="/products" className="text-blue-600 hover:text-blue-900">
                ← 返回产品列表
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">首页</Link>
              <span className="text-gray-400">/</span>
              <Link href="/products" className="text-gray-600 hover:text-gray-900">产品中心</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 产品图片 - 中间大气布局，黄金比例 1.618:1 */}
          <div className="mb-16 flex justify-center">
            {product.image ? (
              <div className="w-full max-w-4xl bg-gray-100 overflow-hidden" style={{aspectRatio: '1.618 / 1'}}>
                <img
                  src={product.image.startsWith('http') ? product.image : `/api${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-full max-w-4xl bg-gray-100 flex items-center justify-center text-gray-400" style={{aspectRatio: '1.618 / 1'}}>
                暂无图片
              </div>
            )}
          </div>

          {/* 产品信息 */}
          <div className="max-w-3xl mx-auto">
            {/* 产品名称 */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              {product.name}
            </h1>

            {/* 产品型号 */}
            {product.model && (
              <p className="text-center text-gray-600 mb-8">
                型号：<span className="font-mono font-semibold text-lg">{product.model}</span>
              </p>
            )}

            {/* 产品描述 - Markdown 支持 */}
            {product.description && (
              <div className="mb-12">
                <MarkdownContent content={product.description} />
              </div>
            )}

            {/* 产品内容 - Markdown 支持 */}
            {product.content && (
              <div className="mb-12">
                <MarkdownContent content={product.content} />
              </div>
            )}

            {/* 联系按钮 */}
            <div className="flex justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded transition"
              >
                联系我们
              </Link>
              <Link
                href="/products"
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded transition"
              >
                返回产品列表
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
