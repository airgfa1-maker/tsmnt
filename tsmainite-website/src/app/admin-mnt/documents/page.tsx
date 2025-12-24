'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin/api';

interface Document {
  id: string;
  title: string;
  file: string;
  createdAt: string;
}

export default function DocumentsListPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadDocuments();
  }, [page]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getList('/documents', page, pageSize);
      console.log('📄 Loaded documents:', data);
      setDocuments((data as any).data || []);
      setTotal((data as any).pagination?.total || 0);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('下载失败');
    }
  };

  const getFileName = (filePath: string | null) => {
    if (!filePath) return '文档';
    return filePath.split('/').pop() || '文档';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除此文档吗？')) return;
    try {
      console.log('🗑️ 删除文档:', id);
      const response = await adminApi.delete(`/admin/documents/${id}`);
      console.log('✓ 删除成功:', response);
      alert('文档已成功删除');
      loadDocuments();
    } catch (error) {
      console.error('❌ Delete failed:', error);
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">文档管理</h1>
        <Link href="/admin-mnt/documents/create" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + 添加文档
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">文档标题</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">文件</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">创建时间</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{doc.title}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                      {doc.file ? (
                        <button
                          onClick={() => handleDownload(doc.file, getFileName(doc.file))}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          下载
                        </button>
                      ) : (
                        <span className="text-gray-400">无文件</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(doc.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link href={`/admin-mnt/documents/${doc.id}`} className="text-blue-600 hover:text-blue-800">
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id)}
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
