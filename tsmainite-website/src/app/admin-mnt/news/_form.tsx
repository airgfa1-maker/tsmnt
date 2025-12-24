'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface NewsFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function NewsForm({ initialData, isEditing = false }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
    displayOrder: initialData?.displayOrder || 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('图片文件过大，请选择10MB以内的图片');
      return;
    }

    // 保存文件和预览URL
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: previewUrl }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('featured', String(formData.featured));
      formDataToSend.append('displayOrder', String(formData.displayOrder));
      
      // 添加文件（如果有新选择）
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }
      
      // 编辑时传递旧图片用于删除
      if (isEditing && initialData?.image) {
        formDataToSend.append('oldImage', initialData.image);
      }

      const url = isEditing
        ? `/api/admin/news/${initialData?.id}`
        : '/api/admin/news';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        router.push('/admin-mnt/news');
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
      <h1 className="text-2xl font-bold mb-6">{isEditing ? '编辑新闻' : '创建新闻'}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新闻标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入新闻标题"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如：公司动态"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新闻摘要
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入新闻摘要（显示在列表）"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新闻配图
          </label>
          <div className="space-y-2">
            {formData.image && (
              <div className="relative w-32 h-32">
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              选择图片
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新闻内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入新闻内容（支持Markdown格式）"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              在首页展示此新闻
            </span>
          </label>

          {formData.featured && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                展示顺序 <span className="text-red-500">*</span>
              </label>
              <select
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1 (最靠前)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? '保存中...' : isEditing ? '更新' : '创建'}
          </button>
        </div>
      </form>
    </div>
  );
}
