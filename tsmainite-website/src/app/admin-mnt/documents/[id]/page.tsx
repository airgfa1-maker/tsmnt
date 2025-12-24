'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DocumentForm from '../_form';

interface DocumentData {
  id: string;
  title: string;
  content: string;
  file: string;
}

export default function EditDocumentPage() {
  const params = useParams();
  const documentId = params.id as string;
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('加载失败');
        const result = await response.json();
        setDocumentData(result.data || result);
      } catch (err) {
        setError('加载数据失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (loading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return <DocumentForm initialData={documentData || undefined} isEditing={true} />;
}
