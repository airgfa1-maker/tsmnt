// Admin Hook - 列表数据管理
'use client';

import { useEffect, useState, useCallback } from 'react';
import adminApi from '@/lib/admin/api';

export interface UseListReturn<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  reload: () => Promise<void>;
  delete: (id: string | number) => Promise<boolean>;
}

export function useAdminList<T>(
  endpoint: string,
  pageSize: number = 10,
  adminEndpoint?: string
): UseListReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);
  // 对于列表加载，优先使用 adminEndpoint（如果提供）；否则使用 endpoint
  const listEndpoint = adminEndpoint || endpoint;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // 使用正确的列表端点（应该是 admin 端点如 /admin/news）
      const response = await adminApi.getList<T>(listEndpoint, page, pageSize);
      setItems(response.data || []);
      setTotal(response.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
      console.error('Failed to load list:', err);
    } finally {
      setLoading(false);
    }
  }, [listEndpoint, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string | number): Promise<boolean> => {
    try {
      // 删除操作也应使用 admin 端点
      const delEndpoint = adminEndpoint || endpoint;
      await adminApi.deleteItem(delEndpoint, id);
      await load();
      return true;
    } catch (err) {
      console.error('Failed to delete:', err);
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    page,
    total,
    pageSize,
    totalPages,
    setPage,
    reload: load,
    delete: handleDelete,
  };
}
