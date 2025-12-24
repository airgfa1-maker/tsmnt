'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { getProductCategories } from '@/lib/api';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // 加载产品分类
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await getProductCategories();
        if (res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <nav className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center h-11 min-w-fit pr-3">
            <Image
              src="/images/logo.png"
              alt="TS Mainite Logo"
              width={240}
              height={60}
              className="h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center text-lg">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition font-medium duration-200 relative group">
              首页
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* 产品中心下拉菜单 */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-gray-900 transition font-medium duration-200 flex items-center gap-1 py-2">
                产品中心
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
              </button>
              
              {/* 下拉菜单 */}
              <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                <Link 
                  href="/products"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100 font-medium text-sm"
                >
                  全部产品
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 text-sm transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/cases" className="text-gray-700 hover:text-gray-900 transition font-medium duration-200 relative group">
              成功案例
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-gray-900 transition font-medium duration-200 relative group">
              下载支持
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-gray-900 transition font-medium duration-200 relative group">
              企业动态
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition font-medium duration-200 relative group">
              关于我们
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition font-medium duration-200 relative group">
              联系我们
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-1 pb-3 border-t border-gray-200 pt-3">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium transition duration-200">
              首页
            </Link>
            <Link href="/products" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium transition duration-200">
              产品中心
            </Link>
            <Link href="/cases" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium transition duration-200">
              成功案例
            </Link>
            <Link href="/support" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium transition duration-200">
              下载支持
            </Link>
            <Link href="/news" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium transition duration-200">
              企业动态
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium transition duration-200">
              关于我们
            </Link>
            <Link href="/contact" className="block px-3 py-2 bg-gray-900/70 text-white hover:bg-gray-900 text-base font-medium transition duration-200">
              联系我们
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
