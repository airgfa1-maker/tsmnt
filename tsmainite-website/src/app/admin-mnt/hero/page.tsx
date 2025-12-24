'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin/api';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  order: number;
  active: boolean;
}

export default function HeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get<HeroSlide[]>('/home/hero-slides');
      setSlides(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setError(err.message || '加载失败');
      console.error('Hero slides load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此幻灯片吗？')) return;

    try {
      await adminApi.delete(`/home/hero-slides?id=${id}`);
      alert('幻灯片已删除');
      loadSlides();
    } catch (error) {
      console.error('❌ Delete failed:', error);
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const formData = new FormData();
      formData.append('title', slide.title);
      formData.append('subtitle', slide.subtitle);
      formData.append('link', slide.link);
      formData.append('order', slide.order.toString());
      formData.append('active', (!slide.active).toString());
      formData.append('oldImage', slide.image);

      await adminApi.putFormData<HeroSlide>(
        `/home/hero-slides?id=${slide.id}`,
        formData
      );
      
      // 更新本地状态
      setSlides(slides.map(s => 
        s.id === slide.id ? { ...s, active: !s.active } : s
      ));
    } catch (error) {
      console.error('Toggle active failed:', error);
      alert(`更新失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">首页Hero轮播</h1>
        <Link
          href="/admin-mnt/hero/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          创建幻灯片
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {slides.length === 0 ? (
        <p className="text-gray-600">暂无幻灯片</p>
      ) : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* 图片预览 */}
                {slide.image && (
                  <div className="w-48 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{slide.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      slide.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {slide.active ? '已发布' : '草稿'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{slide.subtitle}</p>
                  <p className="text-blue-600 text-sm mb-2 break-all">{slide.link}</p>
                  <p className="text-gray-500 text-xs">排序: {slide.order}</p>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`px-3 py-2 text-sm rounded ${
                      slide.active
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {slide.active ? '取消发布' : '发布'}
                  </button>
                  <Link
                    href={`/admin-mnt/hero/${slide.id}`}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
