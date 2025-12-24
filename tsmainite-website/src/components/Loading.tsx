'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* 主容器 */}
      <div className="flex flex-col items-center gap-8">
        {/* 动画加载器 */}
        <div className="relative w-20 h-20">
          {/* 外圈 - 青色 */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-teal-700 border-r-teal-700 animate-spin" />
          
          {/* 内部脉冲圆 */}
          <div className="absolute inset-3 rounded-full border-2 border-gray-100 animate-pulse" />
          
          {/* 中心点 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-teal-700 rounded-full" />
        </div>

        {/* 文字信息 */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">加载中</h2>
          <p className="text-sm text-gray-600 tracking-widest">准备精彩内容</p>
        </div>

        {/* 进度条 */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-600 to-teal-700 rounded-full animate-pulse"
            style={{
              animation: 'slideProgress 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideProgress {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
