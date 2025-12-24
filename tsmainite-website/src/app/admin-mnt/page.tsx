'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin/api';

interface DashboardStats {
  newsCount: number;
  caseCount: number;
  productCount: number;
  documentCount: number;
  categoryCount: number;
  heroCount: number;
  galleryCount: number;
  pageViews?: number;
  visitorCount?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    newsCount: 0,
    caseCount: 0,
    productCount: 0,
    documentCount: 0,
    categoryCount: 0,
    heroCount: 0,
    galleryCount: 0,
    pageViews: 0,
    visitorCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const [newsRes, casesRes, productsRes, categoriesRes, messagesRes, documentsRes, heroRes, galleryRes] = await Promise.all([
        adminApi.getList('/news', 1, 1).catch(() => ({ data: [], pagination: { total: 0 } })),
        adminApi.getList('/cases', 1, 1).catch(() => ({ data: [], pagination: { total: 0 } })),
        adminApi.getList('/products', 1, 1).catch(() => ({ data: [], pagination: { total: 0 } })),
        adminApi.getList('/product-categories', 1, 100).catch(() => ({ data: [], pagination: { total: 0 } })),
        adminApi.getList('/messages', 1, 1).catch(() => ({ data: [], pagination: { total: 0 } })),
        adminApi.getList('/documents', 1, 1).catch(() => ({ data: [], pagination: { total: 0 } })),
        fetch('/api/home/hero-slides').then(r => r.json()).catch(() => []),
        fetch('/api/gallery').then(r => r.json()).catch(() => ({ data: [], total: 0 }))
      ]);

      setStats({
        newsCount: (newsRes as any)?.pagination?.total || 0,
        caseCount: (casesRes as any)?.pagination?.total || 0,
        productCount: (productsRes as any)?.pagination?.total || 0,
        categoryCount: (categoriesRes as any)?.pagination?.total || 0,
        documentCount: (documentsRes as any)?.pagination?.total || 0,
        heroCount: Array.isArray(heroRes) ? heroRes.length : 0,
        galleryCount: (galleryRes as any)?.total || 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const StatCard = ({ title, count, icon, link, color }: any) => (
    <Link href={link}>
      <div className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
          </div>
          <div className="text-4xl opacity-50">{icon}</div>
        </div>
      </div>
    </Link>
  );

  const statCards = [
    { title: '新闻文章', count: stats.newsCount, icon: '📰', link: '/admin-mnt/news', color: 'border-blue-500' },
    { title: '案例研究', count: stats.caseCount, icon: '📋', link: '/admin-mnt/cases', color: 'border-green-500' },
    { title: '产品', count: stats.productCount, icon: '🛠', link: '/admin-mnt/products', color: 'border-purple-500' },
    { title: '产品分类', count: stats.categoryCount, icon: '📁', link: '/admin-mnt/categories', color: 'border-orange-500' },
    { title: '文档', count: stats.documentCount, icon: '📄', link: '/admin-mnt/documents', color: 'border-teal-500' },
    { title: '图片库', count: stats.galleryCount, icon: '🖼', link: '/admin-mnt/gallery', color: 'border-pink-500' },
    { title: '首页管理', count: stats.heroCount, icon: '🏠', link: '/admin-mnt/home', color: 'border-indigo-500' },
    { title: '访问统计', count: '📊', icon: '📊', link: '/admin-mnt/stats', color: 'border-cyan-500' },
  ];

  return (
    <div className="space-y-8">
      {/* 页面标题和刷新按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600 mt-2">欢迎回来，管理员</p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition flex items-center gap-2"
        >
          <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
          {refreshing ? '刷新中...' : '刷新数据'}
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <StatCard key={card.link} {...card} />
        ))}
      </div>

      {/* 系统信息 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">系统信息</h2>
        <div className="bg-white rounded-lg shadow p-6 space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">后端API</span>
            <code className="text-sm bg-gray-100 px-3 py-1 rounded">http://localhost:3001/api</code>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">数据总量</span>
            <span className="font-semibold text-gray-900">
              {stats.newsCount + stats.caseCount + stats.productCount + stats.documentCount + stats.categoryCount + stats.heroCount + stats.galleryCount} 项
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">系统状态</span>
            <span className="flex items-center gap-2 text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              运行正常
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

