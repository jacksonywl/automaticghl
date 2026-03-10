import Link from 'next/link';
import type { Component } from '@/types';
import { STATUS_COLORS } from '@/types';

interface ComponentCardProps {
  component: Component;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const hasCode = component.css || component.html || component.js;
  const statusColor = STATUS_COLORS[component.status] || STATUS_COLORS['Planning'];

  return (
    <Link
      href={`/${component.slug}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all duration-200"
    >
      {/* Preview Area */}
      <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100">
        {hasCode ? (
          <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity">
            {component.category === 'Buttons' && '🔘'}
            {component.category === 'Sliders' && '🎚️'}
            {component.category === 'Hover Effects' && '✨'}
            {component.category === 'Navigation' && '🧭'}
            {component.category === 'Forms' && '📝'}
            {component.category === 'FAQ' && '❓'}
            {component.category === 'Animations' && '🎬'}
            {component.category === 'Timers' && '⏱️'}
            {component.category === 'Grids' && '📊'}
            {component.category === 'Video' && '🎥'}
            {component.category === 'Order Bumps' && '☑️'}
            {component.category === 'Text & Labels' && '🏷️'}
            {component.category === 'Other' && '📦'}
          </div>
        ) : (
          <span className="text-sm text-gray-400">No preview</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {component.name}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className={`px-2 py-0.5 text-xs rounded-full ${statusColor}`}>
            {component.status}
          </span>
          {component.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          {component.platforms.slice(0, 3).map((platform) => (
            <span key={platform} className="bg-gray-50 px-1.5 py-0.5 rounded">
              {platform}
            </span>
          ))}
          {component.platforms.length > 3 && (
            <span>+{component.platforms.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
