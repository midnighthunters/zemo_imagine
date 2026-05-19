import { categoryById } from '../categories';
import { ImagineScrollItem } from '../types';
import { getCareerScrollItems } from './career';
import { getFantasyScrollItems } from './fantasy';
import { buildScrollItemsForCategory } from './generated';
import { getTravelScrollItems } from './travel';
import { getWealthScrollItems } from './wealth';

const cache = new Map<string, ImagineScrollItem[]>();

export const getScrollItemsForCategory = (categoryId: string): ImagineScrollItem[] => {
  if (cache.has(categoryId)) {
    return cache.get(categoryId)!;
  }

  const category = categoryById.get(categoryId);
  if (!category) {
    return [];
  }

  const items =
    category.group === 'Travel' || category.group === 'Adventure'
      ? getTravelScrollItems(category)
      : category.group === 'Wealth' || category.group === 'Luxury'
        ? getWealthScrollItems(category)
        : category.group === 'Fantasy'
          ? getFantasyScrollItems(category)
          : category.group === 'Career' || category.group === 'Skills'
            ? getCareerScrollItems(category)
            : buildScrollItemsForCategory(category);

  cache.set(categoryId, items);
  return items;
};

export const getMixedScrollItems = (categoryIds: string[]) => {
  const selected = categoryIds.length > 0 ? categoryIds : [categoryById.keys().next().value as string];
  const perCategory = selected.flatMap((id) => getScrollItemsForCategory(id).slice(0, 20));
  return perCategory.slice(0, 100);
};
