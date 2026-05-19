import { ImagineCategory } from '../types';
import { buildScrollItemsForCategory } from './generated';

export const getWealthScrollItems = (category: ImagineCategory) =>
  buildScrollItemsForCategory(
    category,
    'Notice how money becomes safety, generosity, tasteful choices, and the freedom to move calmly.',
  );
