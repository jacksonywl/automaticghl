import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getComponentBySlug, getComponents, getCategories } from '@/lib/data';
import LivePreview from '@/components/LivePreview';
import CodeViewer from '@/components/CodeViewer';
import Instructions from '@/components/Instructions';
import { STATUS_COLORS } from '@/types';

interface ComponentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  const category = getCategories().find((c) => c.name === component.category);
  const statusColor = STATUS_COLORS[component.status] || STATUS_COLORS['Planning'];
  const hasCode = component.css || component.html || component.js;

  return (
    <div className="p-6 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-orange-600">
          Home
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-orange-600">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">{component.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{component.name}</h1>
          {component.previewUrl && (
            <a
              href={component.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Live
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className={`px-2 py-0.5 text-xs rounded-full ${statusColor}`}>
            {component.status}
          </span>
          {component.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
          <span className="text-gray-400">•</span>
          {component.platforms.map((platform) => (
            <span
              key={platform}
              className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Preview</h2>
          <div className="h-64 border border-gray-200 rounded-lg overflow-hidden">
            {hasCode ? (
              <LivePreview
                html={component.html}
                css={component.css}
                js={component.js}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
                No preview available
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h2>
          <Instructions instructions={component.instructions} />
        </div>
      </div>

      {/* Code */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Code</h2>
        <CodeViewer
          html={component.html}
          css={component.css}
          js={component.js}
        />
      </div>

      {/* Back link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link
          href={category ? `/category/${category.slug}` : '/'}
          className="text-orange-600 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {category?.name || 'all components'}
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const components = getComponents();
  return components.map((component) => ({
    slug: component.slug,
  }));
}
