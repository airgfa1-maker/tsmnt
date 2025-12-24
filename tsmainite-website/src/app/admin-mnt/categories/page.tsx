'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin/api';

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApi.get<any>('/product-categories');
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此分类吗？')) return;

    try {
      await adminApi.delete(`/admin/product-categories/${id}`);
      loadCategories();
    } catch (err: any) {
      setError(err.message || '删除出错');
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">产品分类管理</h1>
        <Link
          href="/admin-mnt/categories/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          新增分类
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <p className="text-gray-600">暂无分类</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">ID</th>
                <th className="border border-gray-300 p-3 text-left">分类名称</th>
                <th className="border border-gray-300 p-3 text-left">创建时间</th>
                <th className="border border-gray-300 p-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 font-mono text-sm">{category.id}</td>
                  <td className="border border-gray-300 p-3">{category.name}</td>
                  <td className="border border-gray-300 p-3 text-sm">
                    {new Date(category.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="border border-gray-300 p-3 space-x-2">
                    <Link
                      href={`/admin-mnt/categories/${category.id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
