'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CaseForm from '../_form';

interface CaseData {
  id: string;
  title: string;
  description: string;
  industry: string;
  company: string;
  content: string;
  image: string;
}

export default function EditCasePage() {
  const params = useParams();
  const caseId = params.id as string;
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await fetch(`/api/cases/${caseId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('加载失败');
        const result = await response.json();
        // 后端返回 { code, message, data: caseItem }
        setCaseData(result.data || result);
      } catch (err) {
        setError('加载数据失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  if (loading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return <CaseForm initialData={caseData || undefined} isEditing={true} />;
}
