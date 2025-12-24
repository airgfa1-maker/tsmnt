import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Markdown 内容渲染组件
 * 支持基础markdown语法的HTML转换
 */
export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const parseMarkdown = (md: string): string => {
    // 简易行解析器：按行处理，支持段落、标题、有序/无序列表、代码块、行内代码、粗体/斜体和链接
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    let html = '';
    let inCodeBlock = false;
    let codeLang = '';
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 代码块开始/结束 ```lang
      const codeBlockMatch = line.match(/^```(\w+)?/);
      if (codeBlockMatch) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = codeBlockMatch[1] || '';
          closeLists();
          html += `<pre class="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto mb-4"><code class="language-${codeLang}">`;
        } else {
          inCodeBlock = false;
          html += `</code></pre>`;
        }
        continue;
      }

      if (inCodeBlock) {
        // 转义 HTML 实体
        html += (line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')) + '\n';
        continue;
      }

      // 空行 -> 段落分隔
      if (/^\s*$/.test(line)) {
        closeLists();
        html += '';
        continue;
      }

      // 标题
      if (/^#\s+/.test(line)) { closeLists(); html += `<h1 class="text-5xl font-bold text-gray-900 mt-8 mb-6">${line.replace(/^#\s+/, '')}</h1>`; continue; }
      if (/^##\s+/.test(line)) { closeLists(); html += `<h2 class="text-4xl font-bold text-gray-900 mt-7 mb-5">${line.replace(/^##\s+/, '')}</h2>`; continue; }
      if (/^###\s+/.test(line)) { closeLists(); html += `<h3 class="text-3xl font-bold text-gray-900 mt-6 mb-4">${line.replace(/^###\s+/, '')}</h3>`; continue; }

      // 无序列表
      if (/^[\*\-]\s+/.test(line)) {
        if (!inUl) { closeLists(); inUl = true; html += '<ul class="list-disc list-inside text-gray-700 mb-4">'; }
        const item = line.replace(/^[\*\-]\s+/, '');
        html += `<li class="mb-1">${item}</li>`;
        continue;
      }

      // 有序列表
      if (/^\d+\.\s+/.test(line)) {
        if (!inOl) { closeLists(); inOl = true; html += '<ol class="list-decimal list-inside text-gray-700 mb-4">'; }
        const item = line.replace(/^\d+\.\s+/, '');
        html += `<li class="mb-1">${item}</li>`;
        continue;
      }

      // 行内处理：代码、粗体、斜体、链接、图片
      let processed = line
        // 行内代码
        .replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-gray-900 px-2 py-1 rounded text-sm font-mono">$1</code>')
        // 图片（必须在链接之前处理）
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
        // 链接
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-900 underline" target="_blank">$1</a>')
        // 粗体
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
        .replace(/__([^_]+)__/g, '<strong class="font-bold text-gray-900">$1</strong>')
        // 斜体（避免与粗体冲突）
        .replace(/(?<!\*)\*(?!\*)(.*?)\*(?<!\*)/g, '<em class="italic text-gray-700">$1</em>')
        .replace(/_(.*?)_/g, '<em class="italic text-gray-700">$1</em>');

      // 普通段落
      html += `<p class="text-lg text-gray-700 leading-relaxed mb-6">${processed}</p>`;
    }

    closeLists();
    return html;
  };

  return (
    <div
      className={`markdown-content text-base ${className}`}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
