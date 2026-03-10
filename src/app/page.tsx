import { Suspense } from 'react';
import ComponentCard from '@/components/ComponentCard';
import { filterComponents, getComponents } from '@/lib/data';

interface HomePageProps {
  searchParams: Promise<{ search?: string; platform?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const components = filterComponents({
    search: params.search,
    platform: params.platform,
  });

  const totalCount = getComponents().length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {params.search
            ? `Search: "${params.search}"`
            : params.platform
              ? `${params.platform} Components`
              : 'All Components'}
        </h1>
        <p className="text-gray-600 mt-1">
          {components.length} of {totalCount} components
          {params.platform && ` for ${params.platform}`}
        </p>
      </div>

      {/* Grid */}
      {components.length > 0 ? (
        <Suspense fallback={<div>Loading...</div>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {components.map((component) => (
              <ComponentCard key={component.id} component={component} />
            ))}
          </div>
        </Suspense>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No components found.</p>
          {params.search && (
            <a href="/" className="text-orange-600 hover:underline mt-2 inline-block">
              Clear search
            </a>
          )}
        </div>
      )}
    </div>
  );
}
