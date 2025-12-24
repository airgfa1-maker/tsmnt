'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GalleryForm from '../_form';

export default function EditGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      loadGalleryItem();
    }
  }, [id]);

  const loadGalleryItem = async () => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInitialData(data.data);
      } else {
        router.push('/admin-mnt/gallery');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return <GalleryForm initialData={initialData} isEditing={true} />;
}
