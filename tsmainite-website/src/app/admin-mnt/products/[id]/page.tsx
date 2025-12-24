'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductForm from '../_form';
import { adminApi } from '@/lib/admin/api';

interface ProductData {
  id: string;
  name: string;
  model: string;
  description: string;
  content: string;
  categoryId: string;
  image: string;
  price: number;
}

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await adminApi.get<any>(`/admin/products/${productId}`);
        setProductData(result.data || result);
      } catch (err) {
        setError('加载数据失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return <ProductForm initialData={productData || undefined} isEditing={true} />;
}
