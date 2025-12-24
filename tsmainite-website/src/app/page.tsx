'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLoading } from '@/components/LoadingContext';
import { getProductList, getCaseList, getNewsList, getHeroSlides, getProductCategories, getFeaturedProducts, getFeaturedCases, getFeaturedNews } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [cases, setCases] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [productIndex, setProductIndex] = useState(0);
  const [caseIndex, setCaseIndex] = useState(0);
  const [newsIndex, setNewsIndex] = useState(0);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      showLoading();
      try {
        const [heroRes, categoriesRes, featuredRes, featuredCasesRes, featuredNewsRes] = await Promise.all([
          getHeroSlides(),
          getProductCategories(),
          getFeaturedProducts(),
          getFeaturedCases(),
          getFeaturedNews()
        ]);
        
        // 过滤启用的 Hero 幻灯片
        const activeHeroSlides = (Array.isArray(heroRes) ? heroRes : []).filter(slide => slide.active !== false);
        setHeroSlides(activeHeroSlides);
        
        // 设置分类数据
        const categoryList = categoriesRes.data || [];
        setCategories(categoryList);
        
        setProducts(featuredRes.data || []);
        setCases(featuredCasesRes.data || []);
        setNews(featuredNewsRes.data || []);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        hideLoading();
      }
    };

    loadData();
  }, [showLoading, hideLoading]);

  // 注意：首页不再根据分类过滤产品，始终显示精选产品（featured=true）

  // Hero轮播
  const nextHero = () => setCurrentHeroIndex((prev) => (prev + 1) % Math.max(heroSlides.length, 1));
  const prevHero = () => setCurrentHeroIndex((prev) => (prev - 1 + Math.max(heroSlides.length, 1)) % Math.max(heroSlides.length, 1));

  // 处理链接导航（支持站内/站外链接）
  const handleLinkNavigation = (link: string) => {
    if (!link) return;
    
    // 如果以 / 开头，作为站内路由处理
    if (link.startsWith('/')) {
      router.push(link);
    } 
    // 如果是完整 URL（http 或 https），作为站外链接打开
    else if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank');
    }
    // 其他情况按站内路由处理
    else {
      router.push('/' + link);
    }
  };

  // 产品轮播
  const nextProduct = () => setProductIndex((prev) => Math.min(prev + 1, Math.max(0, products.length - 3)));
  const prevProduct = () => setProductIndex((prev) => Math.max(prev - 1, 0));

  // 案例轮播
  const nextCase = () => setCaseIndex((prev) => Math.min(prev + 1, Math.max(0, cases.length - 3)));
  const prevCase = () => setCaseIndex((prev) => Math.max(prev - 1, 0));

  // 新闻轮播
  const nextNews = () => setNewsIndex((prev) => Math.min(prev + 1, Math.max(0, news.length - 3)));
  const prevNews = () => setNewsIndex((prev) => Math.max(prev - 1, 0));

  const currentHero = heroSlides.length > 0 ? heroSlides[currentHeroIndex] : null;
  const visibleProducts = products.slice(productIndex, productIndex + 3);
  const visibleCases = cases.slice(caseIndex, caseIndex + 3);
  const visibleNews = news.slice(newsIndex, newsIndex + 3);

  return (
    <>
      <Header />
      <main className="pt-16 bg-white">

        {/* ========== 1. Hero轮播区 - 传统形式 ========== */}
        <section className="w-full relative overflow-hidden bg-white" style={{minHeight: '1000px'}}>
          {currentHero?.image && (
            <img
              src={currentHero.image.startsWith('http') ? currentHero.image : `/api${currentHero.image}`}
              alt={currentHero.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                console.log('图片加载失败:', currentHero.image);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          {!currentHero?.image && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
          )}
          
          {/* 黑色半透明遮罩 */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* 文字内容 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                {currentHero?.title || '电磁创新 驱动工业'}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-100 mb-10 leading-relaxed drop-shadow">
                {currentHero?.subtitle || '赋能制造企业，降本增效'}
              </p>
              <div className="flex gap-4 justify-center flex-col sm:flex-row">
                <button
                  onClick={() => handleLinkNavigation(currentHero?.link || '/about')}
                  className="bg-gray-900/70 hover:bg-gray-900 text-white px-10 py-3 font-semibold hover:shadow-lg transition duration-300 text-lg"
                >
                  了解更多
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="border-2 border-white/70 text-white hover:bg-white/10 px-10 py-3 font-semibold hover:shadow-lg transition duration-300 text-lg"
                >
                  探索产品
                </button>
              </div>
            </div>
          </div>

          {/* 轮播箭头 - 仅在有多个幻灯片时显示 */}
          {heroSlides.length > 1 && (
            <>
              <button
                onClick={prevHero}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 transition z-10"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextHero}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 transition z-10"
              >
                <ChevronRight size={32} />
              </button>

              {/* 指示点 */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentHeroIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ========== 2. 产品系列区 ========== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4 text-center">
                产品展示
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto"></div>
            </div>

            {/* 分类标签 - 仅作展示，点击跳转到全产品列表页面 */}
            {categories.length > 0 && (
              <div className="mb-12 flex flex-wrap gap-3 justify-center items-center">
                <Link
                  href="/products"
                  className="px-6 py-2 font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                >
                  查看所有分类产品 →
                </Link>
              </div>
            )}

            {products.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {visibleProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group flex flex-col h-full bg-white border border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative w-full overflow-hidden" style={{aspectRatio: '3 / 2'}}>
                        {product.image ? (
                          <img
                            src={product.image.startsWith('http') ? product.image : `/api${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                            暂无图片
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                      </div>
                      <div className="flex-grow p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition line-clamp-2">
                          {product.name}
                        </h3>
                        {product.model && (
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-widest mb-3">
                            {product.model}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 flex-grow line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      <div className="px-6 py-3 border-t border-gray-100 group-hover:border-gray-300 bg-gray-50 group-hover:bg-gray-100 transition">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">查看详情 →</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* 轮播控制 */}
                {products.length > 3 && (
                  <>
                    <button
                      onClick={prevProduct}
                      className="absolute -left-4 top-1/3 -translate-y-1/2 bg-white text-gray-900 p-2 hover:bg-gray-100 transition border border-gray-200 disabled:opacity-30 z-10"
                      disabled={productIndex === 0}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextProduct}
                      className="absolute -right-4 top-1/3 -translate-y-1/2 bg-white text-gray-900 p-2 hover:bg-gray-100 transition border border-gray-200 disabled:opacity-30 z-10"
                      disabled={productIndex >= products.length - 3}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">加载中...</div>
            )}

            <div className="text-center mt-16">
              <Link
                href="/products"
                className="inline-block px-8 py-3 bg-gray-900/70 text-white font-semibold hover:bg-gray-900 hover:shadow-md transition"
              >
                查看所有产品
              </Link>
            </div>
          </div>
        </section>

        {/* ========== 3. 成功案例区 ========== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4 text-center">
                成功案例
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto"></div>
            </div>

            {cases.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {visibleCases.map((caseItem) => (
                    <Link
                      key={caseItem.id}
                      href={`/cases/${caseItem.id}`}
                      className="group flex flex-col h-full bg-white border border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative w-full overflow-hidden" style={{aspectRatio: '3 / 2'}}>
                        {caseItem.image ? (
                          <img
                            src={caseItem.image.startsWith('http') ? caseItem.image : `/api${caseItem.image}`}
                            alt={caseItem.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                            暂无图片
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                      </div>
                      <div className="flex-grow p-6 flex flex-col">
                        {caseItem.industry && (
                          <span className="inline-block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2 w-fit">
                            {caseItem.industry}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition line-clamp-2">
                          {caseItem.title}
                        </h3>
                        {caseItem.description && (
                          <p className="text-sm text-gray-600 flex-grow line-clamp-2 leading-relaxed">
                            {caseItem.description}
                          </p>
                        )}
                      </div>
                      <div className="px-6 py-3 border-t border-gray-100 group-hover:border-gray-300 bg-gray-50 group-hover:bg-gray-100 transition">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">查看详情 →</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* 轮播控制 */}
                {cases.length > 3 && (
                  <>
                    <button
                      onClick={prevCase}
                      className="absolute -left-4 top-1/3 -translate-y-1/2 bg-white text-gray-900 p-2 hover:bg-gray-100 transition border border-gray-200 disabled:opacity-30 z-10"
                      disabled={caseIndex === 0}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextCase}
                      className="absolute -right-4 top-1/3 -translate-y-1/2 bg-white text-gray-900 p-2 hover:bg-gray-100 transition border border-gray-200 disabled:opacity-30 z-10"
                      disabled={caseIndex >= cases.length - 3}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">加载中...</div>
            )}

            <div className="text-center mt-16">
              <Link
                href="/cases"
                className="inline-block px-8 py-3 bg-gray-900/70 text-white font-semibold hover:bg-gray-900 hover:shadow-md transition"
              >
                查看所有案例
              </Link>
            </div>
          </div>
        </section>

        {/* ========== 4. 企业动态区 ========== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-4 text-center">
                企业动态
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-gray-900 to-gray-700 mx-auto"></div>
            </div>

            {news.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {visibleNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="group flex flex-col h-full bg-white border border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative w-full overflow-hidden" style={{aspectRatio: '3 / 2'}}>
                        {item.image ? (
                          <img
                            src={item.image.startsWith('http') ? item.image : `/api${item.image}`}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                            暂无图片
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                      </div>
                      
                      <div className="flex-grow p-6 flex flex-col">
                        <div className="flex items-center gap-3 mb-3 text-xs">
                          <span className="font-semibold text-gray-700 uppercase tracking-widest">
                            {item.category || '新闻'}
                          </span>
                          <span className="text-gray-400 px-2 py-1 bg-gray-50 rounded">
                            {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition line-clamp-2">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-sm text-gray-600 flex-grow leading-relaxed">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="px-6 py-3 border-t border-gray-100 group-hover:border-gray-300 bg-gray-50 group-hover:bg-gray-100 transition">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">阅读更多 →</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* 轮播控制 */}
                {news.length > 3 && (
                  <>
                    <button
                      onClick={prevNews}
                      className="absolute -left-4 top-1/3 -translate-y-1/2 bg-white text-gray-900 p-2 hover:bg-gray-100 transition border border-gray-200 disabled:opacity-30 z-10"
                      disabled={newsIndex === 0}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextNews}
                      className="absolute -right-4 top-1/3 -translate-y-1/2 bg-white text-gray-900 p-2 hover:bg-gray-100 transition border border-gray-200 disabled:opacity-30 z-10"
                      disabled={newsIndex >= news.length - 3}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">加载中...</div>
            )}

            <div className="text-center mt-16">
              <Link
                href="/news"
                className="inline-block px-8 py-3 bg-gray-900/70 text-white font-semibold hover:bg-gray-900 hover:shadow-md transition"
              >
                查看所有动态
              </Link>
            </div>
          </div>
        </section>

        {/* ========== 5. CTA区 - 简洁设计 ========== */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-2 sm:px-3 lg:px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              准备开启合作？
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              无论您面临什么挑战，我们的专家团队随时准备提供量身定制的解决方案。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-gray-900 hover:bg-black text-white px-8 py-3 font-semibold transition"
              >
                联系我们
              </a>
              <a
                href="/products"
                className="inline-block border border-gray-900 text-gray-900 hover:bg-gray-50 px-8 py-3 font-semibold transition"
              >
                探索产品
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
