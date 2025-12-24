'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin/api';

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    loadCategories();
    if (initialData?.image) {
      setPreviewUrl(initialData.image);
    }
  }, [initialData]);

  const loadCategories = async () => {
    try {
      const data = await adminApi.get<any>('/product-categories');
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    model: initialData?.model || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    image: initialData?.image || '',
    featured: initialData?.featured || false,
    displayOrder: initialData?.displayOrder || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 验证文件大小 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('图片大小不能超过50MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // 生成预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = isEditing
        ? `/admin/products/${initialData?.id}`
        : '/admin/products';

      // 如果有新选择的文件，则上传到后端作为 FormData
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        uploadFormData.append('name', formData.name);
        uploadFormData.append('model', formData.model || '');
        uploadFormData.append('description', formData.description);
        uploadFormData.append('content', formData.content);
        uploadFormData.append('categoryId', formData.categoryId);
        uploadFormData.append('featured', String(formData.featured));
        uploadFormData.append('displayOrder', String(formData.displayOrder));
        if (isEditing && initialData?.image) {
          uploadFormData.append('oldImage', initialData.image);
        }

        console.log('📤 使用FormData上传文件...');
        
        try {
          if (isEditing) {
            await adminApi.putFormData(url, uploadFormData);
          } else {
            await adminApi.postFormData(url, uploadFormData);
          }
          
          setSuccess('保存成功！');
          setTimeout(() => {
            router.push('/admin-mnt/products');
            router.refresh();
          }, 1000);
        } catch (err: any) {
          const errorMsg = err.message || '操作失败';
          console.error('❌ 操作失败:', errorMsg, err);
          setError(errorMsg);
        }
      } else {
        // 没有新文件，用 JSON 方式提交
        console.log('📝 使用JSON提交表单数据...');
        
        try {
          if (isEditing) {
            await adminApi.put(url, {
              ...formData,
              image: formData.image || '',
            });
          } else {
            await adminApi.post(url, {
              ...formData,
              image: formData.image || '',
            });
          }
          
          setSuccess('保存成功！');
          setTimeout(() => {
            router.push('/admin-mnt/products');
            router.refresh();
          }, 1000);
        } catch (err: any) {
          const errorMsg = err.message || '操作失败';
          console.error('❌ 操作失败:', errorMsg, err);
          setError(errorMsg);
        }
      }
    } catch (err) {
      console.error('❌ 提交失败:', err);
      setError('请求失败: ' + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? '编辑产品' : '创建产品'}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            产品名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入产品名称"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              型号
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如：HV-2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品分类 <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- 请选择分类 --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            产品描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入产品简短描述"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            产品图片
          </label>
          <div className="space-y-2">
            {previewUrl && (
              <div className="relative w-32 h-32">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  title="删除图片"
                >
                  ✕
                </button>
              </div>
            )}
            {!previewUrl && (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">无图片</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
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
            详细说明 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入详细内容（支持Markdown格式）"
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
              在首页展示此产品
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
