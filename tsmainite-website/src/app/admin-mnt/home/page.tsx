'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HomeHero {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  active: boolean;
}

export default function HomePage() {
  const [heroes, setHeroes] = useState<HomeHero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHeroSlides();
  }, []);

  const loadHeroSlides = async () => {
    try {
      const response = await fetch('/api/home/hero-slides', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHeroes(data.data || []);
      }
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/home/hero-slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ active: !active }),
      });
      if (response.ok) {
        loadHeroSlides();
      }
    } catch (err: any) {
      setError(err.message || '更新失败');
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">首页轮播管理</h1>
        <Link
          href="/admin-mnt/home/hero/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          新增轮播
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {heroes.map(hero => (
          <div key={hero.id} className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{hero.title}</h3>
              <p className="text-sm text-gray-500">{hero.subtitle}</p>
              <p className="text-xs text-gray-400 mt-1">顺序: {hero.order}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(hero.id, hero.active)}
                className={`px-3 py-1 rounded text-sm ${
                  hero.active
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {hero.active ? '已启用' : '已禁用'}
              </button>
              <Link
                href={`/admin-mnt/home/hero/${hero.id}`}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                编辑
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
