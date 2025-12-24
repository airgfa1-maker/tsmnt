'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface HeroFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function HeroForm({ initialData, isEditing = false }: HeroFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    image: initialData?.image || '',
    link: initialData?.link || '',
    order: initialData?.order || 1,
    active: initialData?.active ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) : value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      console.log('📤 上传图片:', file.name, file.size, file.type);
      const token = localStorage.getItem('token');
      console.log('🔑 Token 存在:', !!token);
      
      const response = await fetch('/api/uploads/gallery', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📨 上传响应状态:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ 上传成功，返回路径:', data.path);
        setFormData(prev => ({ ...prev, image: data.path }));
      } else {
        const errorText = await response.text();
        console.error('❌ 上传失败，状态:', response.status, '响应:', errorText);
        setError(`图片上传失败 (${response.status}): ${errorText}`);
      }
    } catch (err: any) {
      console.error('❌ 上传异常:', err.message);
      setError(`上传出错: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/home/hero-slides/${initialData?.id}`
        : '/api/home/hero-slides';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin-mnt/home');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.message || '操作失败');
      }
    } catch (err) {
      setError('请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? '编辑轮播' : '创建轮播'}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">标题</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="输入轮播标题"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">副标题</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="输入副标题"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">上传图片</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full"
          />
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="preview" className="h-48 object-cover rounded" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">链接</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="输入链接 (可选)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">排序</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">启用</label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            返回
          </button>
        </div>
      </form>
    </div>
  );
}
