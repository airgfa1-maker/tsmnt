'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { adminApi } from '@/lib/admin/api';

interface AboutContent {
  id: string;
  title: string;
  content: string;
  image?: string;
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutContent>({
    id: '',
    title: '',
    content: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    try {
      setError('');
      const data = await adminApi.get<AboutContent>('/home/about');
      setAboutData(data);
    } catch (err: any) {
      setError(err.message || '加载失败');
      console.error('加载About内容失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await adminApi.put('/home/about', aboutData);
      setSuccess('保存成功！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || '保存失败');
      console.error('保存失败:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">关于我们</h1>
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          {previewMode ? '编辑模式' : '预览模式'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {previewMode ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{aboutData.title}</h2>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {aboutData.content}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 bg-white rounded-lg shadow p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              页面标题
            </label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
              placeholder="例如：电磁技术赋能全球制造"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              页面内容 (支持 Markdown)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* 编辑区 */}
              <div>
                <label className="text-xs text-gray-600 mb-2 block">编辑</label>
                <textarea
                  value={aboutData.content}
                  onChange={(e) => setAboutData({ ...aboutData, content: e.target.value })}
                  placeholder="支持 Markdown 格式..."
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-semibold mb-1">支持的 Markdown 语法：</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li><code className="bg-gray-100 px-1 rounded"># 标题</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">**粗体**</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">*斜体*</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">- 列表项</code></li>
                    <li><code className="bg-gray-100 px-1 rounded">[链接](url)</code></li>
                  </ul>
                </div>
              </div>

              {/* 实时预览区 */}
              <div>
                <label className="text-xs text-gray-600 mb-2 block">实时预览</label>
                <div className="w-full h-80 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aboutData.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {saving ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={loadAboutContent}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-medium"
            >
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
