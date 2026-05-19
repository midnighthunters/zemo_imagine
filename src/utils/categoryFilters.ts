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
  'Home',
  'Creativity',
  'Sports',
  'Food',
  'Nature',
  'Spirituality',
  'Technology',
  'Style',
  'Family',
  'Adventure',
  'Nomad Life',
  'Transformation',
  'Education',
  'Social Life',
  'Content Creator',
  'Wellness',
  'Professional Arts',
  'Science & Innovation',
  'Impact & Legacy',
  'Romance',
  'Alternative Living',
  'Pets & Animals',
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
