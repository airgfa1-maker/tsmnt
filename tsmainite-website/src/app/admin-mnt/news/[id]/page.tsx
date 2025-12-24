'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NewsForm from '../_form';

interface NewsData {
  id: string;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
}

export default function EditNewsPage() {
  const params = useParams();
  const newsId = params.id as string;
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${newsId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('加载失败');
        const result = await response.json();
        setNewsData(result.data || result);
      } catch (err) {
        setError('加载数据失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  if (loading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return <NewsForm initialData={newsData || undefined} isEditing={true} />;
}
