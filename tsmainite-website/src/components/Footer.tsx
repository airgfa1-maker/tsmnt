'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [siteInfo, setSiteInfo] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载网站信息和产品分类
  useEffect(() => {
    const loadData = async () => {
      try {
        // 获取网站信息
        const infoRes = await fetch('/api/settings/info');
        if (infoRes.ok) {
          const data = await infoRes.json();
          setSiteInfo(data.data || {});
        }

        // 获取产品分类
        const catRes = await fetch('/api/product-categories');
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Failed to load footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const phone = siteInfo?.phone || '139-3150-1373';
  const whatsapp = siteInfo?.whatsapp || '1393150137';
  const email = siteInfo?.email || 'tsmainite@163.com';
  const address = siteInfo?.address || '河北省唐山市';
  const icp = siteInfo?.icp || 'ICP备案';
  const securityCode = siteInfo?.securityCode || '公安备案号';
  const companyName = siteInfo?.companyName || '唐山迈尼特电气有限公司';
  const companyDescription = siteInfo?.companyDescription || '专业磁电解决方案提供商，20年深耕工业电磁技术领域。';
  
  // 社交媒体
  const facebook = siteInfo?.facebook || '';
  const instagram = siteInfo?.instagram || '';
  const twitter = siteInfo?.twitter || '';
  const youtube = siteInfo?.youtube || '';
  const tiktok = siteInfo?.tiktok || '';
  const linkedin = siteInfo?.linkedin || '';

  return (
    <footer className="bg-gray-50 text-gray-700 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* 关于我们 */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">关于我们</h3>
            <Image
              src="/images/logo.png"
              alt={companyName}
              width={180}
              height={45}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {companyDescription}
            </p>
            <div className="flex gap-3 flex-wrap">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-pink-600 transition-colors"
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="#1a1a1a" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="#1a1a1a" />
                  </svg>
                </a>
              )}
              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-red-600 transition-colors"
                  title="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" fill="#1a1a1a" />
                  </svg>
                </a>
              )}
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  title="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.85 6.85 0 0 0 5.6 19.54a6.84 6.84 0 0 0 10.77-5.33v-3.2a8.97 8.97 0 0 0 3.22 1.27v-3.59z" />
                  </svg>
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-700 transition-colors"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* 产品分类 */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">产品分类</h3>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.map((cat: any) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.id}`}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      • {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">加载中...</li>
              )}
              <li className="pt-3 border-t border-gray-300">
                <Link href="/products" className="text-gray-900 hover:text-gray-700 font-medium text-sm">
                  查看全部产品 →
                </Link>
              </li>
            </ul>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">快速链接</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  • 首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  • 关于我们
                </Link>
              </li>
              <li>
                <Link href="/cases" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  • 成功案例
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  • 企业动态
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  • 下载支持
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  • 联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">联系我们</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-gray-600 text-sm">电话</span>
                  <a href={`tel:${phone}`} className="text-gray-900 hover:text-gray-700 transition-colors text-sm font-medium">
                    {phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-gray-600 text-sm">消息</span>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-gray-700 transition-colors text-sm font-medium"
                  >
                    WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-gray-600 text-sm">邮箱</span>
                  <a href={`mailto:${email}`} className="text-gray-900 hover:text-gray-700 transition-colors text-sm break-all">
                    {email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-gray-600 text-sm">地址</span>
                  <p className="text-gray-900 text-sm font-medium">{address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部分割线 */}
        <div className="border-t border-gray-300 pt-8">
          {/* 版权和备案 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            <p>© 2024 {companyName} 版权所有</p>
            <div className="flex gap-4 flex-wrap justify-center">
              <a
                href="https://beian.mps.gov.cn/#/query/webSearch"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors"
              >
                {securityCode}
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                {icp}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
