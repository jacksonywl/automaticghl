import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ComponentCard from '@/components/ComponentCard';
import { getCategories, getComponentsByCategory, filterComponents } from '@/lib/data';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ platform?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { platform } = await searchParams;

  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  let components = getComponentsByCategory(slug);

  // Apply platform filter if present
  if (platform) {
    components = components.filter((c) => c.platforms.includes(platform));
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>{category.icon}</span>
          {category.name}
        </h1>
        <p className="text-gray-600 mt-1">
          {components.length} component{components.length !== 1 ? 's' : ''}
          {platform && ` for ${platform}`}
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
          <p className="text-gray-500">No components in this category yet.</p>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}
