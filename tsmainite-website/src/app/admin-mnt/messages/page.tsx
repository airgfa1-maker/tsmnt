'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/admin/api';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const pageSize = 10;

  useEffect(() => {
    loadMessages();
  }, [page, filter]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const url = `/messages?page=${page}&pageSize=${pageSize}${filter !== 'all' ? `&status=${filter}` : ''}`;
      const data = await adminApi.get<any>(url);
      setMessages(data.data || []);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此留言吗？')) return;

    try {
      await adminApi.delete(`/admin/messages/${id}`);
      loadMessages();
    } catch (err: any) {
      setError(err.message || '删除出错');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminApi.put(`/messages/${id}`, { status: newStatus });
      loadMessages();
    } catch (err: any) {
      setError(err.message || '更新失败');
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">留言管理</h1>
        <div className="space-x-2">
          {(['all', 'unread', 'read', 'replied'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1 rounded ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {f === 'all' ? '全部' : f === 'unread' ? '未读' : f === 'read' ? '已读' : '已回复'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <p className="text-gray-600">暂无留言</p>
      ) : (
        <>
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{msg.name}</h3>
                    <p className="text-sm text-gray-500">{msg.email} | {msg.phone}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    msg.status === 'unread' ? 'bg-red-100 text-red-700' :
                    msg.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {msg.status === 'unread' ? '未读' : msg.status === 'read' ? '已读' : '已回复'}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{msg.message}</p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleString('zh-CN')}
                  </p>
                  <div className="space-x-2">
                    {msg.status !== 'replied' && (
                      <button
                        onClick={() => handleStatusChange(msg.id, msg.status === 'unread' ? 'read' : 'replied')}
                        className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        {msg.status === 'unread' ? '标记已读' : '标记已回复'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
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
            <span className="px-4 py-2">第 {page} 页</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={messages.length < pageSize}
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
