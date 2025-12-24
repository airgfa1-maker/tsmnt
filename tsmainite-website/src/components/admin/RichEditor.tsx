'use client';

import React, { useState, useRef } from 'react';
import MarkdownContent from '@/components/MarkdownContent';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showCodeButton?: boolean;
  showPreview?: boolean;
}

export default function RichEditor({ value, onChange, placeholder = '编辑内容...', showCodeButton = true, showPreview = true }: RichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTab, setSelectedTab] = useState<'edit' | 'preview'>('edit');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeContent, setCodeContent] = useState('');

  const insertCodeBlock = () => {
    const codeBlock = `\`\`\`${codeLanguage}\n${codeContent}\n\`\`\``;
    const start = textareaRef.current?.selectionStart || value.length;
    const newText = value.substring(0, start) + '\n' + codeBlock + '\n' + value.substring(start);
    onChange(newText);
    setShowCodeModal(false);
    setCodeContent('');
    setCodeLanguage('javascript');
  };

  const insertExecutableJs = () => {
    const jsBlock = `<script type="module">\n${codeContent}\n</script>`;
    const start = textareaRef.current?.selectionStart || value.length;
    const newText = value.substring(0, start) + '\n' + jsBlock + '\n' + value.substring(start);
    onChange(newText);
    setShowCodeModal(false);
    setCodeContent('');
  };

  return (
    <div className="w-full">
      {/* 工具栏 */}
      <div className="bg-gray-100 border border-gray-300 rounded-t p-3">
        {showCodeButton && (
          <button
            onClick={() => {
              setCodeLanguage('javascript');
              setShowCodeModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            插入代码
          </button>
        )}
      </div>

      {/* 标签页 */}
      {showPreview && (
        <div className="flex border-b border-gray-300 bg-gray-50">
          <button
            onClick={() => setSelectedTab('edit')}
            className={`px-4 py-2 ${selectedTab === 'edit' ? 'bg-white border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}
          >
            编辑
          </button>
          <button
            onClick={() => setSelectedTab('preview')}
            className={`px-4 py-2 ${selectedTab === 'preview' ? 'bg-white border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}
          >
            预览
          </button>
        </div>
      )}

      {/* 编辑区域 */}
      {(!showPreview || selectedTab === 'edit') && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-4 border border-gray-300 font-mono text-sm resize-vertical min-h-96 ${!showPreview ? 'rounded-b' : ''}`}
          style={{ fontFamily: 'monospace' }}
        />
      )}

      {/* 预览区域 */}
      {selectedTab === 'preview' && (
        <div className="p-6 border border-gray-300 rounded-b bg-white min-h-96">
          <MarkdownContent content={value} />
        </div>
      )}

      {/* 代码插入模态框 */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">插入代码</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">代码类型</label>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">代码内容</label>
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="输入代码..."
                className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm min-h-40"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCodeModal(false);
                  setCodeContent('');
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                取消
              </button>
              {codeLanguage === 'javascript' && (
                <button
                  onClick={insertExecutableJs}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  插入可执行 JS
                </button>
              )}
              <button
                onClick={insertCodeBlock}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                插入代码块
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
