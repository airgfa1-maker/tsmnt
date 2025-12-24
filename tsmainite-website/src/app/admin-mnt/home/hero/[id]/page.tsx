'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import HeroForm from '../_form';

export default function EditHeroPage() {
  const params = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      loadHeroSlide();
    }
  }, [id]);

  const loadHeroSlide = async () => {
    try {
      const response = await fetch(`/api/home/hero-slides/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInitialData(data.data);
      } else {
        router.push('/admin-mnt/home');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return <HeroForm initialData={initialData} isEditing={true} />;
}
