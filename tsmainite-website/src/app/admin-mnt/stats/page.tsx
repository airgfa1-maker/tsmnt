'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalViews: number;
  totalVisitors: number;
  todayViews: number;
  thisMonthViews: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats>({
    totalViews: 0,
    totalVisitors: 0,
    todayViews: 0,
    thisMonthViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || stats);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">统计分析</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-sm">总浏览量</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-sm">总访客数</p>
          <p className="text-3xl font-bold text-green-600">{stats.totalVisitors.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-gray-600 text-sm">今日浏览</p>
          <p className="text-3xl font-bold text-purple-600">{stats.todayViews.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-gray-600 text-sm">本月浏览</p>
          <p className="text-3xl font-bold text-orange-600">{stats.thisMonthViews.toLocaleString()}</p>
        </div>
      </div>

      <div className="text-center text-gray-500">
        <p>详细统计图表开发中...</p>
      </div>
    </div>
  );
}
