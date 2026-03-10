import componentsData from '@/data/components.json';
import categoriesData from '@/data/categories.json';
import type { Component, Category } from '@/types';

export function getComponents(): Component[] {
  return componentsData as Component[];
}

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getComponentBySlug(slug: string): Component | undefined {
  return getComponents().find(c => c.slug === slug);
}

export function getComponentsByCategory(categorySlug: string): Component[] {
  const category = getCategories().find(c => c.slug === categorySlug);
  if (!category) return [];
  return getComponents().filter(c => c.category === category.name);
}

export function getComponentsByPlatform(platform: string): Component[] {
  return getComponents().filter(c => c.platforms.includes(platform));
}

export function filterComponents(options: {
  category?: string;
  platform?: string;
  search?: string;
  status?: string;
}): Component[] {
  let results = getComponents();

  if (options.category) {
    const category = getCategories().find(c => c.slug === options.category);
    if (category) {
      results = results.filter(c => c.category === category.name);
    }
  }

  if (options.platform) {
    const platform = options.platform;
    results = results.filter(c => c.platforms.includes(platform));
  }

  if (options.status) {
    const status = options.status;
    results = results.filter(c => c.status === status);
  }

  if (options.search) {
    const searchLower = options.search.toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(searchLower) ||
      c.category.toLowerCase().includes(searchLower) ||
      c.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  return results;
}

export function getAllPlatforms(): string[] {
  const platforms = new Set<string>();
  getComponents().forEach(c => c.platforms.forEach(p => platforms.add(p)));
  return Array.from(platforms).sort();
}

export function getAllStatuses(): string[] {
  const statuses = new Set<string>();
  getComponents().forEach(c => statuses.add(c.status));
  return Array.from(statuses);
}
