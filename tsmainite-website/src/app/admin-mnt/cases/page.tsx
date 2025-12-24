'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin/api';

interface Case {
  id: string;
  title: string;
  company: string;
  industry: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

export default function CasesListPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadCases();
  }, [page]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getList('/cases', page, pageSize);
      setCases((data as any).data || []);
      setTotal((data as any).pagination?.total || 0);
    } catch (error) {
      console.error('Failed to load cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除此案例吗？')) return;
    try {
      await adminApi.delete(`/admin/cases/${id}`);
      loadCases();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">案例管理</h1>
        <Link href="/admin-mnt/cases/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + 创建案例
        </Link>
      </div>

      {loading ? (
        <div className="text-center p-8">加载中...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">标题</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">客户名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">行业</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">创建时间</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{caseItem.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{caseItem.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{caseItem.industry}</td>
                    <td className="px-6 py-4 text-sm">
                      {caseItem.featured && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          首页展示 ✓
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(caseItem.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link href={`/admin-mnt/cases/${caseItem.id}`} className="text-blue-600 hover:text-blue-800">
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(caseItem.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              共 {total} 条，第 {page} 页
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                上一页
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * pageSize >= total}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
