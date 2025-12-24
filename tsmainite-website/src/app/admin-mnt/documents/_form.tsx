'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function DocumentForm({ initialData, isEditing = false }: DocumentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState(initialData?.file ? '当前文件: ' + initialData.file.split('/').pop() : '');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(isEditing ? `新文件: ${file.name}` : file.name);
    } else {
      // 如果没有选择文件，恢复到初始状态
      setSelectedFileName(isEditing && initialData?.file ? '当前文件: ' + initialData.file.split('/').pop() : '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 验证标题
    if (!formData.title.trim()) {
      setError('请输入文档标题');
      setLoading(false);
      return;
    }

    // 验证文件（创建时必须有，编辑时如果选择了新文件则必须有）
    const fileInput = fileInputRef.current;
    const hasNewFile = fileInput && fileInput.files && fileInput.files.length > 0;

    if (!isEditing && !hasNewFile) {
      setError('创建文档时必须上传文件');
      setLoading(false);
      return;
    }

    try {
      const url = isEditing
        ? `/api/admin/documents/${initialData?.id}`
        : '/api/admin/documents';

      // 构建 FormData
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);

      if (hasNewFile) {
        submitFormData.append('file', fileInput!.files![0]);
      }

      console.log('📤 提交文档:', {
        url,
        method: isEditing ? 'PUT' : 'POST',
        title: formData.title,
        hasNewFile,
        fileName: hasNewFile ? fileInput!.files![0].name : '(保持原文件)',
        fileSize: hasNewFile ? fileInput!.files![0].size : 0
      });

      const headers: Record<string, string> = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: submitFormData,
        headers,
      });

      console.log('📨 响应状态:', response.status);
      console.log('📨 响应头:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 成功:', data);
        console.log('📁 新文件路径:', data.data?.file);
        alert(isEditing ? '文档已更新' : '文档已创建');
        router.push('/admin-mnt/documents');
        router.refresh();
      } else {
        console.log('❌ 响应失败，尝试解析错误信息...');
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.log('❌ 无法解析错误响应为JSON:', parseError);
          const textResponse = await response.text();
          console.log('❌ 原始错误响应:', textResponse);
          errorData = { message: `HTTP ${response.status}: ${textResponse || '未知错误'}` };
        }
        console.error('❌ 错误:', errorData);
        setError(errorData.message || `操作失败 (${response.status})`);
      }
    } catch (err: any) {
      console.error('❌ 网络请求异常:', err);
      console.error('❌ 异常详情:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError(`请求失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? '编辑文档' : '创建文档'}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            文档标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入文档标题"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            上传文件 {isEditing ? '' : <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-2">
            {selectedFileName && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <div className="text-blue-700 font-medium">✓ {isEditing ? '当前' : '已选择'}文件:</div>
                <div className="text-blue-600 text-xs mt-1">
                  {selectedFileName}
                </div>
              </div>
            )}
            {!selectedFileName && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                ⚠️ 未选择文件 {!isEditing && '- 创建时必须上传文件'}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {isEditing ? '更换文件（可选）' : '选择文件（PDF、Word、Excel等）'}
            </button>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? '保存中...' : isEditing ? '更新' : '创建'}
          </button>
        </div>
      </form>
    </div>
  );
}
