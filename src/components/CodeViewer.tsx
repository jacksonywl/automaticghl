'use client';

import { useState } from 'react';

interface CodeViewerProps {
  html: string | null;
  css: string | null;
  js: string | null;
}

type TabType = 'css' | 'html' | 'js';

export default function CodeViewer({ html, css, js }: CodeViewerProps) {
  const availableTabs: TabType[] = [];
  if (css) availableTabs.push('css');
  if (html) availableTabs.push('html');
  if (js) availableTabs.push('js');

  const [activeTab, setActiveTab] = useState<TabType>(availableTabs[0] || 'css');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (activeTab) {
      case 'css': return css || '';
      case 'html': return html || '';
      case 'js': return js || '';
      default: return '';
    }
  };

  const handleCopy = async () => {
    const code = getCode();
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (availableTabs.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        No code available for this component yet.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200">
        <div className="flex">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-orange-600 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            copied
              ? 'text-green-600'
              : 'text-gray-600 hover:text-orange-600'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="max-h-96 overflow-auto">
        <pre className="p-4 text-sm bg-gray-900 text-gray-100 overflow-x-auto">
          <code>{getCode()}</code>
        </pre>
      </div>
    </div>
  );
}
