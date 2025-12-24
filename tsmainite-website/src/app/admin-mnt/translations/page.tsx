'use client';

import { useState } from 'react';

interface Translation {
  id: string;
  key: string;
  zh: string;
  en: string;
  es?: string;
}

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Translation>>({});

  const handleSave = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/translations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        setEditingId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">多语言管理</h1>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-500 mb-4">
          <p>支持的语言: 中文 (zh) | 英文 (en) | 西班牙文 (es)</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">在线编辑翻译</h3>
          <p className="text-gray-600 text-sm">多语言编辑功能开发中...</p>
          <p className="text-gray-500 text-xs mt-2">请在前端各组件中直接维护多语言文本，或通过数据库字段存储不同语言版本。</p>
        </div>
      </div>
    </div>
  );
}
