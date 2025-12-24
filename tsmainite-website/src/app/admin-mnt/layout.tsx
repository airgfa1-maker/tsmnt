'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // 只在非登录页且无 token 时重定向
    if (!token && !pathname.includes('/admin-mnt/login')) {
      router.push('/admin-mnt/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/admin-mnt/login');
  };

  // 登录页直接返回
  if (pathname.includes('/admin-mnt/login')) {
    return <>{children}</>;
  }

  // 服务端渲染未完成时，显示加载状态
  if (!mounted || isLoggedIn === null) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>;
  }

  // 未登录则显示重定向提示
  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-gray-600 mb-4">正在跳转到登录页...</p>
      </div>
    </div>;
  }

  const menuItems = [
    { href: '/admin-mnt', label: '仪表板', icon: '📊' },
    { href: '/admin-mnt/hero', label: 'Hero轮播', icon: '🎠' },
    { href: '/admin-mnt/about', label: '关于', icon: '📖' },
    { href: '/admin-mnt/products', label: '产品', icon: '🛠' },
    { href: '/admin-mnt/cases', label: '案例', icon: '📋' },
    { href: '/admin-mnt/news', label: '新闻', icon: '📰' },
    { href: '/admin-mnt/documents', label: '文档', icon: '📄' },
    { href: '/admin-mnt/categories', label: '分类', icon: '📁' },
    { href: '/admin-mnt/gallery', label: '相册', icon: '🖼' },
    { href: '/admin-mnt/messages', label: '留言', icon: '💬' },
    { href: '/admin-mnt/settings', label: '设置', icon: '⚙️' },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/admin-mnt' && pathname.startsWith(href));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className="w-64 bg-gray-900 text-white p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8">迈尼特管理</h1>
        
        <nav className="space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            <span className="text-xl">🚪</span>
            <span>登出</span>
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
