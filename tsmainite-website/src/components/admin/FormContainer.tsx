'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/admin/api';
import { FormField } from '@/lib/admin/types';

interface FormContainerProps {
  title: string;
  fields: FormField[];
  endpoint: string;
  itemId?: string | number;
  onSuccess?: () => void;
  submitLabel?: string;
}

export function FormContainer({
  title,
  fields,
  endpoint,
  itemId,
  onSuccess,
  submitLabel = '保存',
}: FormContainerProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(!!itemId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({});
  const [originalImage, setOriginalImage] = useState<string>(''); // 记录原始图片路径用于删除

  // 初始化表单字段
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.name] = false;
      } else if (field.type === 'date') {
        initialData[field.name] = new Date().toISOString().split('T')[0];
      } else {
        initialData[field.name] = '';
      }
    });
    setFormData(initialData);
  }, [fields]);

  // 加载编辑数据
  const loadItem = useCallback(async () => {
    try {
      // adminApi.getItem() 会自动通过 normalizeEndpoint() 添加 /admin 前缀
      const data = await adminApi.getItem(endpoint, itemId!);
      setFormData(data as Record<string, any>);
      // 记录原始图片路径用于后续删除
      if ((data as any).image) {
        setOriginalImage((data as any).image);
        // 使用相对路径访问图片，通过Next.js API代理
        const imageUrl = (data as any).image.startsWith('http') 
          ? (data as any).image 
          : (data as any).image; // 保持相对路径，会通过api/uploads自动处理
        setImagePreview({ image: imageUrl });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [endpoint, itemId]);

  useEffect(() => {
    if (itemId) {
      loadItem();
    }
  }, [itemId, loadItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
      }));

      // 显示预览
      if (fieldName === 'image' || fieldName === 'file') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(prev => ({
            ...prev,
            [fieldName]: event.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // 构建提交数据
      const submitData = new FormData();
      const dataToSend: Record<string, any> = {};

      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submitData.append(key, value);
        } else if (value !== null && value !== undefined) {
          dataToSend[key] = value;
        }
      });

      // 如果有文件，使用 FormData 方式
      if (submitData.has('image') || submitData.has('file')) {
        Object.entries(dataToSend).forEach(([key, value]) => {
          submitData.append(key, String(value));
        });

        // 编辑时，如果上传新图片且有原始图片，发送oldImage让后端删除
        if (itemId && submitData.has('image') && originalImage) {
          console.log('编辑模式且上传新图片，发送oldImage:', originalImage);
          submitData.append('oldImage', originalImage);
        }

        if (itemId) {
          // adminApi 会自动添加 /admin 前缀
          await adminApi.putFormData(`${endpoint}/${itemId}`, submitData);
        } else {
          // adminApi 会自动添加 /admin 前缀
          await adminApi.postFormData(endpoint, submitData);
        }
      } else {
        // 纯 JSON 提交
        if (itemId) {
          // adminApi 会自动添加 /admin 前缀
          await adminApi.updateItem(endpoint, itemId, dataToSend);
        } else {
          // adminApi 会自动添加 /admin 前缀
          await adminApi.createItem(endpoint, dataToSend);
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            required={field.required}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            value={value}
            onChange={handleChange}
            required={field.required}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={field.name}
            checked={value}
            onChange={handleChange}
            className="w-4 h-4 rounded"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            name={field.name}
            value={value}
            onChange={handleChange}
            required={field.required}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              name={field.name}
              onChange={(e) => handleFileChange(field.name, e)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="file"
              name={field.name}
              accept="image/*"
              onChange={(e) => handleFileChange(field.name, e)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview[field.name] && (
              <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imagePreview[field.name]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            name={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">加载中...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              {submitting ? '提交中...' : submitLabel}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
