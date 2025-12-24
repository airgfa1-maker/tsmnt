'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function HeroFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEditing = !!id && id !== 'create';

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    order: 0,
    active: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadSlide();
    }
  }, [id]);

  const loadSlide = async () => {
    try {
      const response = await adminApi.get<HeroSlide | HeroSlide[]>(
        `/home/hero-slides?id=${id}`
      );
      const slide = Array.isArray(response) ? response[0] : response;
      
      if (slide) {
        setFormData({
          title: slide.title,
          subtitle: slide.subtitle,
          image: slide.image,
          link: slide.link,
          order: slide.order,
          active: slide.active,
        });
        setImagePreview(slide.image);
      }
    } catch (err: any) {
      setError(err.message || '加载失败');
      console.error('Load slide error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseInt(value) 
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.subtitle || !formData.link) {
      setError('请填写所有必填项');
      return;
    }

    if (!isEditing && !imageFile) {
      setError('请上传图片');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('link', formData.link);
      data.append('order', formData.order.toString());
      data.append('active', formData.active.toString());
      
      if (imageFile) {
        data.append('image', imageFile);
      }
      if (isEditing) {
        data.append('oldImage', formData.image);
      }

      if (isEditing) {
        await adminApi.putFormData<HeroSlide>(
          `/home/hero-slides?id=${id}`,
          data
        );
        alert('幻灯片已更新');
      } else {
        await adminApi.postFormData<HeroSlide>(
          '/home/hero-slides',
          data
        );
        alert('幻灯片已创建');
      }

      router.push('/admin-mnt/hero');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '操作失败');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? '编辑幻灯片' : '创建幻灯片'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium mb-2">标题 *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="请输入标题"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 副标题 */}
        <div>
          <label className="block text-sm font-medium mb-2">副标题 *</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            placeholder="请输入副标题"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 链接 */}
        <div>
          <label className="block text-sm font-medium mb-2">链接 *</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            placeholder="例如: /products 或 https://example.com"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            支持站内相对路径（如 /products）或站外域名（如 https://example.com）
          </p>
        </div>

        {/* 图片 */}
        <div>
          <label className="block text-sm font-medium mb-2">图片 {!isEditing && '*'}</label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {imagePreview && (
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="预览"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* 排序 */}
        <div>
          <label className="block text-sm font-medium mb-2">排序</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">数字越小越靠前</p>
        </div>

        {/* 是否发布 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleInputChange}
            className="w-4 h-4"
          />
          <label htmlFor="active" className="text-sm font-medium">
            发布此幻灯片
          </label>
        </div>

        {/* 按钮 */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? '提交中...' : isEditing ? '更新' : '创建'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
