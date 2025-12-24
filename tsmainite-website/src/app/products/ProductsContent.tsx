'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getProductList, getProductCategories } from '@/lib/api';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const pageParam = parseInt(searchParams.get('page') || '1');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4;

  // 加载分类
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getProductCategories();
        if (res.data) {
          setCategories(res.data);
          setCategoriesLoaded(true);
          
          // 如果 URL 有分类参数，使用它；否则使用"所有产品"（空字符串）
          const category = categoryParam !== null ? categoryParam : '';
          setSelectedCategory(category);
        }
      } catch (error) {
        console.error('加载产品分类失败:', error);
        setCategoriesLoaded(true);
      }
    };

    loadCategories();
  }, [categoryParam]);

  // 加载产品
  useEffect(() => {
    if (!categoriesLoaded) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductList(selectedCategory, currentPage, pageSize);
        
        if (response.data) {
          setProducts(response.data);
          if (response.pagination) {
            setTotalPages(response.pagination.totalPages || 1);
          }
        }
      } catch (error) {
        console.error('加载产品失败:', error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, currentPage, categoriesLoaded]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    
    // 更新 URL
    const url = new URL(window.location.href);
    if (categoryId) {
      url.searchParams.set('category', categoryId);
    } else {
      url.searchParams.delete('category');
    }
    url.searchParams.set('page', '1');
    window.history.replaceState({}, '', url);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // 更新 URL
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.replaceState({}, '', url);
    
    // 不滚动到顶部，保持原地
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* 左侧分类导航 */}
      {categories.length > 0 && (
        <div className="lg:col-span-1">
          <div className="border border-gray-200">
            <div className="bg-gray-900 text-white px-4 py-3 font-semibold text-sm">
              产品分类
            </div>
            <div className="divide-y divide-gray-200">
              {/* 所有产品 */}
              <button
                onClick={() => handleCategoryChange('')}
                className={`w-full text-left px-4 py-3 text-sm transition ${
                  selectedCategory === ''
                    ? 'bg-gray-50 text-gray-900 font-semibold border-l-2 border-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                所有产品
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full text-left px-4 py-3 text-sm transition ${
                    selectedCategory === cat.id
                      ? 'bg-gray-50 text-gray-900 font-semibold border-l-2 border-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.count && <span className="text-gray-500 ml-2">({cat.count})</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 右侧产品列表 */}
      <div className={categories.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">加载中...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无产品数据
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white border border-gray-200 overflow-hidden hover:border-gray-400 transition group"
                >
                  {/* 产品图片 - 黄金比例 1.618:1 */}
                  <div className="relative bg-gray-100 overflow-hidden" style={{aspectRatio: '1.618 / 1'}}>
                    {product.image ? (
                      <img
                        src={product.image.startsWith('http') ? product.image : `/api${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">暂无图片</span>
                      </div>
                    )}
                  </div>

                  {/* 产品信息 */}
                  <div className="p-6 border-t border-gray-200">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-gray-700 transition line-clamp-2">
                      {product.name}
                    </h3>

                    {product.model && (
                      <p className="text-sm text-gray-600 mb-3">
                        型号: {product.model}
                      </p>
                    )}

                    {/* 应用领域 */}
                    {product.applications && product.applications.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.applications.slice(0, 2).map((app: any, i: number) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1"
                          >
                            {app}
                          </span>
                        ))}
                        {product.applications.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{product.applications.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  ← 上一页
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition ${
                      currentPage === page
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  下一页 →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
