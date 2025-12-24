'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image?: string;
}

interface HeroCarouselProps {
  slides?: HeroSlide[];
}

export default function HeroCarousel({ slides = [] }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const heroSlides = slides || [];
  
  // 如果没有幻灯片数据，返回空
  if (!heroSlides || heroSlides.length === 0) {
    return null;
  }

  const currentSlide = heroSlides[current];

  return (
    <div className="w-full bg-white">
      {/* JPMorgan风格 Hero Section - 完全按照官网设计 */}
      <div className="relative w-full" style={{ minHeight: '560px', aspectRatio: '16 / 9' }}>
        {/* 背景 - 左侧白色，右侧有图片 */}
        <div className="absolute inset-0 bg-white"></div>

        {/* 右侧图片区域 - 占60% */}
        <div className="absolute right-0 top-0 h-full w-3/5">
          {currentSlide.image ? (
            <img 
              src={currentSlide.image.startsWith('http') 
                ? currentSlide.image 
                : currentSlide.image
              }
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
          )}
        </div>

        {/* 左侧文字内容 - 占40%，白色背景 */}
        <div className="absolute left-0 top-0 h-full w-2/5 flex flex-col justify-center px-16 py-20">
          <div className="max-w-md">
            {/* 标题 - 深灰色，大号字体 */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {currentSlide.title}
            </h1>
            
            {/* 描述 - 浅灰色，正常字体 */}
            <p className="text-base lg:text-lg text-gray-600 mb-10 leading-relaxed font-light">
              {currentSlide.subtitle}
            </p>

            {/* 按钮 */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <button 
                onClick={() => router.push('/products')}
                className="bg-teal-700 hover:bg-teal-800 text-white px-10 py-3 font-semibold transition text-base tracking-wide uppercase"
              >
                了解更多
              </button>
              <button 
                onClick={() => router.push('/contact')}
                className="border-2 border-gray-400 text-gray-700 hover:border-gray-600 hover:text-gray-900 px-10 py-3 font-semibold transition text-base tracking-wide uppercase"
              >
                联系我们
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航区 - JPMorgan风格 */}
      <div className="w-full bg-gray-50 border-t border-gray-300">
        <div className="max-w-full px-16 py-8">
          <div className="flex flex-nowrap gap-12 overflow-x-auto pb-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(index)}
                className={`py-3 font-semibold whitespace-nowrap text-base transition duration-300 relative ${
                  index === current
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {slide.title}
                {/* 下划线 */}
                <span className={`absolute bottom-0 left-0 h-1 bg-teal-700 transition-all duration-300 ${
                  index === current ? 'w-full' : 'w-0'
                }`}></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
