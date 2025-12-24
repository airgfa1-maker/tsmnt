'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CategoryForm from '../_form';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      const response = await fetch(`/api/product-categories/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInitialData(data.data);
      } else {
        router.push('/admin-mnt/categories');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return <CategoryForm initialData={initialData} isEditing={true} />;
}
