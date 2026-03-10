'use client';

import { useRef, useEffect } from 'react';

interface LivePreviewProps {
  html: string | null;
  css: string | null;
  js: string | null;
  category?: string;
}

// Sample GHL HTML structures for CSS-only components
function getSampleHtml(category?: string, css?: string | null): string {
  // Check CSS content for hints about what to render
  const cssLower = css?.toLowerCase() || '';

  // Button components
  if (cssLower.includes('.c-button') || cssLower.includes('button') || category === 'Buttons') {
    return `
      <div class="c-button">
        <button type="button">Click Me</button>
      </div>
      <div class="c-button" style="margin-top: 16px;">
        <button type="button">Another Button</button>
      </div>
    `;
  }

  // Order bumps
  if (cssLower.includes('order-bump') || cssLower.includes('orderbump') || category === 'Order Bumps') {
    return `
      <div class="order-bump">
        <label class="order-bump-checkbox">
          <input type="checkbox" />
          <span class="order-bump-content">
            <strong>Yes! Add this special offer</strong>
            <p>One-time offer: Get 50% off our premium course!</p>
          </span>
        </label>
      </div>
    `;
  }

  // Form inputs
  if (cssLower.includes('input') || cssLower.includes('form') || category === 'Forms') {
    return `
      <form class="ghl-form" style="max-width: 400px; width: 100%;">
        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">Name</label>
          <input type="text" placeholder="Enter your name" style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px;" />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px; font-weight: 500;">Email</label>
          <input type="email" placeholder="Enter your email" style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px;" />
        </div>
        <div class="c-button">
          <button type="submit">Submit</button>
        </div>
      </form>
    `;
  }

  // FAQ/Accordion
  if (cssLower.includes('accordion') || cssLower.includes('faq') || category === 'FAQ') {
    return `
      <div class="faq-container" style="max-width: 500px; width: 100%;">
        <div class="faq-item" style="border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
          <div class="faq-question" style="padding: 16px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            How does this work?
            <span>+</span>
          </div>
          <div class="faq-answer" style="padding: 0 16px 16px; color: #6b7280;">
            This is the answer to your question. Click to expand or collapse.
          </div>
        </div>
        <div class="faq-item" style="border: 1px solid #e5e7eb; border-radius: 8px;">
          <div class="faq-question" style="padding: 16px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            What are the benefits?
            <span>+</span>
          </div>
        </div>
      </div>
    `;
  }

  // Navigation/Header
  if (cssLower.includes('nav') || cssLower.includes('header') || cssLower.includes('menu') || category === 'Navigation') {
    return `
      <nav class="ghl-nav" style="width: 100%; padding: 16px 24px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="logo" style="font-weight: 700; font-size: 20px;">Logo</div>
          <div class="nav-links" style="display: flex; gap: 24px;">
            <a href="#" style="color: #374151; text-decoration: none;">Home</a>
            <a href="#" style="color: #374151; text-decoration: none;">About</a>
            <a href="#" style="color: #374151; text-decoration: none;">Contact</a>
          </div>
        </div>
      </nav>
    `;
  }

  // Text/Labels
  if (cssLower.includes('badge') || cssLower.includes('label') || cssLower.includes('text') || category === 'Text & Labels') {
    return `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <span class="badge" style="padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 999px; font-size: 14px;">New</span>
        <span class="badge" style="padding: 4px 12px; background: #dcfce7; color: #166534; border-radius: 999px; font-size: 14px;">Popular</span>
        <span class="badge" style="padding: 4px 12px; background: #fef3c7; color: #92400e; border-radius: 999px; font-size: 14px;">Limited</span>
      </div>
    `;
  }

  // Grid/Bento
  if (cssLower.includes('grid') || cssLower.includes('bento') || category === 'Grids') {
    return `
      <div class="bento-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 500px;">
        <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; grid-column: span 2;">Large Item</div>
        <div style="background: #f3f4f6; padding: 24px; border-radius: 12px;">Small</div>
        <div style="background: #f3f4f6; padding: 24px; border-radius: 12px;">Small</div>
        <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; grid-column: span 2;">Wide Item</div>
      </div>
    `;
  }

  // Timer/Countdown
  if (cssLower.includes('timer') || cssLower.includes('countdown') || category === 'Timers') {
    return `
      <div class="countdown" style="display: flex; gap: 16px; text-align: center;">
        <div class="countdown-item">
          <div style="font-size: 36px; font-weight: 700; background: #1f2937; color: white; padding: 16px 24px; border-radius: 8px;">05</div>
          <div style="margin-top: 8px; font-size: 14px; color: #6b7280;">Days</div>
        </div>
        <div class="countdown-item">
          <div style="font-size: 36px; font-weight: 700; background: #1f2937; color: white; padding: 16px 24px; border-radius: 8px;">12</div>
          <div style="margin-top: 8px; font-size: 14px; color: #6b7280;">Hours</div>
        </div>
        <div class="countdown-item">
          <div style="font-size: 36px; font-weight: 700; background: #1f2937; color: white; padding: 16px 24px; border-radius: 8px;">30</div>
          <div style="margin-top: 8px; font-size: 14px; color: #6b7280;">Mins</div>
        </div>
      </div>
    `;
  }

  // Hover effects - show a box to hover over
  if (cssLower.includes('hover') || category === 'Hover Effects') {
    return `
      <div class="hover-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
        <div class="hover-box" style="background: #f3f4f6; padding: 32px; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.3s;">
          Hover over me
        </div>
        <div class="hover-box" style="background: #f3f4f6; padding: 32px; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.3s;">
          Hover over me
        </div>
      </div>
    `;
  }

  // Default - show generic GHL button structure
  return `
    <div class="c-button">
      <button type="button">Sample Button</button>
    </div>
    <div style="margin-top: 24px; padding: 24px; background: #f3f4f6; border-radius: 12px; text-align: center;">
      <p style="margin: 0; color: #6b7280;">CSS will be applied to matching GHL elements</p>
    </div>
  `;
}

export default function LivePreview({ html, css, js, category }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Handle external script includes in JS
    let externalScripts = '';
    let inlineJs = js || '';

    // Extract external script comments and convert to actual script tags
    const externalScriptMatch = inlineJs.match(/\/\/ External scripts[\s\S]*?(?=\n\n|$)/);
    if (externalScriptMatch) {
      const scriptLines = externalScriptMatch[0].split('\n').slice(1);
      scriptLines.forEach(line => {
        const match = line.match(/\/\/ (<script[^>]*src=["'][^"']+["'][^>]*><\/script>)/);
        if (match) {
          externalScripts += match[1] + '\n';
        }
      });
      // Remove the external scripts comment section from inline JS
      inlineJs = inlineJs.replace(/\/\/ External scripts[\s\S]*?\n\n/, '').trim();
    }

    // Escape script tags in inline JS
    const safeJs = inlineJs?.replace(/<\/script>/gi, '<\\/script>') || '';

    // Determine what HTML to show
    const displayHtml = html || getSampleHtml(category, css);

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          ${externalScripts}
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
          ${displayHtml}
          ${safeJs ? `<script>${safeJs}</script>` : ''}
        </body>
      </html>
    `;

    doc.open();
    doc.write(content);
    doc.close();
  }, [html, css, js, category]);

  return (
    <iframe
      ref={iframeRef}
      title="Live Preview"
      className="w-full h-full border-0 bg-gray-50 rounded-lg"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
