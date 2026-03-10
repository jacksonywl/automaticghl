'use client';

import { useRef, useEffect } from 'react';

interface LivePreviewProps {
  html: string | null;
  css: string | null;
  js: string | null;
}

export default function LivePreview({ html, css, js }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Escape script tags in JS
    const safeJs = js?.replace(/<\/script>/gi, '<\\/script>') || '';

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 20px;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: calc(100vh - 40px);
              background: #f9fafb;
            }
            /* GHL default button styles */
            .c-button button,
            button {
              padding: 12px 24px;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 500;
              cursor: pointer;
              background: #3b82f6;
              color: white;
              transition: all 0.2s;
            }
            .c-button button:hover,
            button:hover {
              opacity: 0.9;
            }
            /* Component CSS */
            ${css || ''}
          </style>
        </head>
        <body>
          ${html || '<div style="text-align: center; color: #9ca3af;">CSS-only component - styles will be applied to existing GHL elements</div>'}
          ${safeJs ? `<script>${safeJs}</script>` : ''}
        </body>
      </html>
    `;

    doc.open();
    doc.write(content);
    doc.close();
  }, [html, css, js]);

  return (
    <iframe
      ref={iframeRef}
      title="Live Preview"
      className="w-full h-full border-0 bg-gray-50 rounded-lg"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
