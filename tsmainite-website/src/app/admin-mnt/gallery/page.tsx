'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin/api';

interface GalleryItem {
  filename: string;
  url: string;
  uploadedAt: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [copiedFilename, setCopiedFilename] = useState<string>('');
  const pageSize = 12;

  useEffect(() => {
    loadGallery();
  }, [page]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get<any>(`/admin/gallery?offset=${(page - 1) * pageSize}&limit=${pageSize}`);
      console.log('📸 Loaded gallery:', response);
      setGallery(response.data || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      setError(err.message || '加载失败');
      console.error('Gallery load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('确定要删除此图片吗？')) return;

    try {
      await adminApi.delete(`/admin/gallery/${filename}`);
      console.log('✓ 删除成功:', filename);
      alert('图片已成功删除');
      loadGallery();
    } catch (error) {
      console.error('❌ Delete failed:', error);
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">相册管理</h1>
        <Link
          href="/admin-mnt/gallery/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          上传图片
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {gallery.length === 0 ? (
        <p className="text-gray-600">暂无相册内容</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            {gallery.map(item => (
              <div key={item.filename} className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600 truncate mb-2">{item.filename}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(item.uploadedAt).toLocaleDateString('zh-CN')}
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const markdownPath = `![${item.filename}](${item.url})`;
                        navigator.clipboard.writeText(markdownPath);
                        setCopiedFilename(item.filename);
                        setTimeout(() => setCopiedFilename(''), 2000);
                      }}
                      className={`w-full px-2 py-1 rounded text-xs transition-colors ${
                        copiedFilename === item.filename
                          ? 'bg-green-600 text-white'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {copiedFilename === item.filename ? '✓ 已复制' : '复制Markdown'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.filename)}
                      className="w-full px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-4 py-2">
              第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / pageSize)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </>
      )}
    </div>
  );
}
