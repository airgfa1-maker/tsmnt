'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin/api';

interface GalleryFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function GalleryForm({ initialData, isEditing = false }: GalleryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    image: initialData?.image || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataToSend = new FormData();
    formDataToSend.append('image', file);

    try {
      console.log('📤 上传图片:', file.name, file.size, file.type);
      const data = await adminApi.postFormData<any>('/admin/gallery/upload', formDataToSend);
      console.log('✅ 上传成功，返回数据:', data);
      setFormData(prev => ({ ...prev, image: data.data?.url || '' }));
    } catch (err: any) {
      console.error('❌ 上传异常:', err.message);
      setError(`上传出错: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      setError('请先上传图片');
      return;
    }

    // 图片上传后直接跳转，因为上传已经在handleImageUpload中完成了
    router.push('/admin-mnt/gallery');
    router.refresh();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">上传图片</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">选择图片</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {formData.image && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">预览：</p>
            <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
              <img 
                src={formData.image} 
                alt="preview" 
                className="max-w-full max-h-64 object-contain mx-auto"
              />
            </div>
            <p className="text-xs text-green-600 mt-2">✓ 图片已成功上传</p>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={!formData.image}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formData.image ? '完成' : '请先上传图片'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
