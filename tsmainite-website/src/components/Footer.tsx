'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, MessageCircle, Facebook, Instagram, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [siteInfo, setSiteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 加载网站信息
  useEffect(() => {
    const loadSiteInfo = async () => {
      try {
        const response = await fetch('/api/settings/info');
        if (response.ok) {
          const data = await response.json();
          setSiteInfo(data.data || {});
        }
      } catch (error) {
        console.error('Failed to load site info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSiteInfo();
  }, []);

  const phone = siteInfo?.phone || '139-3150-1373';
  const whatsapp = siteInfo?.whatsapp || '1393150137';
  const email = siteInfo?.email || 'tsmainite@163.com';
  const address = siteInfo?.address || '河北省唐山市';
  const icp = siteInfo?.icp || 'ICP备案';
  const securityCode = siteInfo?.securityCode || '公安备案号';
  const companyDescription = siteInfo?.companyDescription || '专业磁电解决方案提供商，20年深耕工业电磁技术领域。';
  
  // 社交媒体
  const facebook = siteInfo?.facebook || '';
  const instagram = siteInfo?.instagram || '';
  const twitter = siteInfo?.twitter || '';
  const youtube = siteInfo?.youtube || '';
  const tiktok = siteInfo?.tiktok || '';

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Main Section */}
        <div className="flex flex-col md:flex-row items-start gap-8 justify-between mb-12">
          {/* 左侧：Logo 和简介 */}
          <div className="md:w-1/4">
            <Image
              src="/images/logo.png"
              alt="TS Mainite Logo"
              width={240}
              height={60}
              className="h-10 w-auto mb-4"
            />
            <p className="text-xs text-gray-600 leading-relaxed">
              {companyDescription}
            </p>
          </div>

          {/* 中间：联系方式 两行两列 + 社交媒体 */}
          <div className="md:flex-1 flex items-start gap-2">
            <div className="grid grid-cols-2 gap-6">
              {/* 手机 */}
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phone}`} className="text-sm text-gray-900 hover:text-gray-600 transition font-medium">
                  {phone}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-2">
                <MessageCircle size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-900 hover:text-gray-600 transition font-medium">
                  WhatsApp
                </a>
              </div>

              {/* 邮箱 */}
              <div className="flex items-start gap-2">
                <Mail size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${email}`} className="text-sm text-gray-900 hover:text-gray-600 transition break-all">
                  {email}
                </a>
              </div>

              {/* 地址 */}
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-900">{address}</p>
              </div>
            </div>
          </div>

          {/* 右侧：社交媒体图标 与中间内容垂直对齐 */}
          <div className="md:w-1/5 flex gap-2 items-start justify-start pt-6">
            {/* Facebook */}
            <a 
              href={facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-all duration-300 ease-out transform hover:scale-110"
              title="Facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>

            {/* Instagram */}
            <a 
              href={instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-all duration-300 ease-out transform hover:scale-110"
              title="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>

            {/* X (Twitter) - 新设计 */}
            <a 
              href={twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-all duration-300 ease-out transform hover:scale-110"
              title="X"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.656l-5.207-6.807-5.966 6.807H2.882l7.773-8.835L1.519 2.25H8.25l4.713 6.231 5.481-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href={youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-all duration-300 ease-out transform hover:scale-110"
              title="YouTube"
            >
              <Youtube className="w-5 h-5 text-white" />
            </a>

            {/* TikTok */}
            <a 
              href={tiktok} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition-all duration-300 ease-out transform hover:scale-110"
              title="TikTok"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.85 6.85 0 0 0 5.6 19.54a6.84 6.84 0 0 0 10.77-5.33v-3.2a8.97 8.97 0 0 0 3.22 1.27v-3.59z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-200 pt-6 text-center md:text-left text-xs text-gray-500 space-x-3 flex flex-wrap justify-center md:justify-start gap-2">
          <span>© 2024 唐山迈尼特电气有限公司</span>
          <span>|</span>
          <a href="#" className="hover:text-gray-700 transition">{securityCode}</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-700 transition">{icp}</a>
          <span>|</span>
          <span>Powered by Kusx</span>
        </div>
      </div>
    </footer>
  );
}
