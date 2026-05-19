import { categories } from '../data/categories';
import { ImagineCategory } from '../data/types';

export const quickFilters = [
  'Travel',
  'Wealth',
  'Career',
  'Fitness',
  'Fantasy',
  'Luxury',
  'Relationships',
  'Skills',
  'Entertainment',
  'Peaceful Life',
];

export const filterCategories = (
  query: string,
  group?: string,
  source: ImagineCategory[] = categories,
) => {
  const normalized = query.trim().toLowerCase();

  return source.filter((category) => {
    const matchesGroup = !group || category.group === group;
    const matchesQuery =
      !normalized ||
      category.title.toLowerCase().includes(normalized) ||
      category.description.toLowerCase().includes(normalized) ||
      category.group.toLowerCase().includes(normalized);

    return matchesGroup && matchesQuery;
  });
};
