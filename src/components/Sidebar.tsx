'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { getCategories, getAllPlatforms } from '@/lib/data';

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categories = getCategories();
  const platforms = getAllPlatforms();

  const currentCategory = pathname.startsWith('/category/')
    ? pathname.split('/')[2]
    : null;
  const currentPlatform = searchParams.get('platform');

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-73px)] overflow-y-auto sticky top-[73px]">
      <div className="p-4">
        {/* Platform Filter */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Platform
          </h3>
          <select
            value={currentPlatform || ''}
            onChange={(e) => {
              const url = new URL(window.location.href);
              if (e.target.value) {
                url.searchParams.set('platform', e.target.value);
              } else {
                url.searchParams.delete('platform');
              }
              window.location.href = url.toString();
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Categories
          </h3>
          <nav className="space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                pathname === '/' && !currentCategory
                  ? 'bg-orange-100 text-orange-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>📋</span>
              <span>All Components</span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentCategory === category.slug
                    ? 'bg-orange-100 text-orange-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
