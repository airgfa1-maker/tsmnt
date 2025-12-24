'use client';

import { useState } from 'react';

interface ImageUploadProps {
  onImageChange: (file: File | null, preview: string) => void;
  preview?: string;
  label?: string;
}

export default function ImageUpload({
  onImageChange,
  preview = '',
  label = '上传图片'
}: ImageUploadProps) {
  // 处理预览URL：
  // - 如果是base64或http开头，直接使用
  // - 如果是上传文件路径（来自数据库如 /uploads/cases/xxx.png），直接使用
  // - 图片会通过Next.js的rewrite代理到后端的/uploads路由
  const getPreviewUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('data:')) {
      return url; // base64直接使用
    }
    if (url.startsWith('http')) {
      return url; // 完整URL直接使用
    }
    // /uploads/* 路径直接返回，Next.js会代理到后端
    return url;
  };

  const [currentPreview, setCurrentPreview] = useState<string>(getPreviewUrl(preview));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentPreview(result);
        onImageChange(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">点击上传</span> 或拖拽图片
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF (最大 50MB)</p>
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        {/* 图片预览 */}
        {currentPreview && (
          <div className="relative">
            <p className="text-sm text-gray-600 mb-2">预览：</p>
            <img
              src={currentPreview}
              alt="预览"
              className="max-w-xs h-auto rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}
