import { getMixedScrollItems, getScrollItemsForCategory } from '../data/scrollItems';

export const loadScrollItems = (categoryId: string, selectedCategoryIds: string[]) => {
  if (categoryId === 'mixed') {
    return getMixedScrollItems(selectedCategoryIds);
  }

  return getScrollItemsForCategory(categoryId);
};
