export interface Component {
  id: string;
  name: string;
  slug: string;
  category: string;
  tags: string[];
  platforms: string[];
  status: string;
  previewUrl: string | null;
  description: string | null;
  html: string | null;
  css: string | null;
  js: string | null;
  instructions: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export type StatusType = 'Done' | 'Review' | 'In progress' | 'Planning' | 'Ready To Start';

export const STATUS_COLORS: Record<string, string> = {
  'Done': 'bg-green-100 text-green-800',
  'Review': 'bg-yellow-100 text-yellow-800',
  'In progress': 'bg-blue-100 text-blue-800',
  'Planning': 'bg-gray-100 text-gray-600',
  'Ready To Start': 'bg-purple-100 text-purple-800',
};
