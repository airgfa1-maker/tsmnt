'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminList } from '@/lib/admin/hooks';
import { TableColumn } from '@/lib/admin/types';

interface ListTableProps<T> {
  endpoint: string;
  adminEndpoint?: string; // 管理员操作端点（删除、编辑等）
  columns: TableColumn[];
  createPath: string;
  editPath: (id: string | number) => string;
  title: string;
  icon: string;
  total?: number;
}

export function ListTable<T extends { id: string | number }>(props: ListTableProps<T>) {
  const {
    endpoint,
    adminEndpoint,
    columns,
    createPath,
    editPath,
    title,
    icon,
  } = props;

  // 使用管理员端点用于操作，否则使用普通端点
  const operationEndpoint = adminEndpoint || endpoint;

  const { items, loading, error, page, total, totalPages, setPage, delete: deleteItem } = useAdminList<T>(endpoint, 10, operationEndpoint);

  const handleDelete = async (id: string | number) => {
    if (!confirm('确定要删除吗？')) return;
    const success = await deleteItem(id);
    if (!success) {
      alert('删除失败');
    }
  };

  const renderCell = (item: T, column: TableColumn) => {
    const value = (item as any)[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString('zh-CN') : '-';
      case 'badge':
        const isBool = typeof value === 'boolean';
        return (
          <span className={`px-3 py-1 text-xs rounded-full ${
            isBool
              ? value
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isBool ? (value ? '是' : '否') : value}
          </span>
        );
      default:
        return String(value || '-');
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </h1>
          <p className="text-gray-600 mt-1">共 {total || items.length} 条数据</p>
        </div>
        <Link href={createPath}>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
            ➕ 新建
          </button>
        </Link>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
            <p className="font-semibold">加载失败</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-gray-500">加载中...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无数据</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700"
                        style={{ width: col.width }}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      {columns.map((col) => (
                        <td
                          key={`${item.id}-${col.key}`}
                          className="px-6 py-4 text-sm text-gray-900"
                        >
                          {renderCell(item, col)}
                        </td>
                      ))}
                      <td className="px-6 py-4 space-x-3">
                        <Link href={editPath(item.id)}>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            编辑
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
                <p className="text-sm text-gray-600">
                  第 {page} 页，共 {totalPages} 页
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
