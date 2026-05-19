import { ImagineCategory } from '../types';
import { buildScrollItemsForCategory } from './generated';

export const getTravelScrollItems = (category: ImagineCategory) =>
  buildScrollItemsForCategory(
    category,
    'Notice the airport light, the hotel view, the unfamiliar street, and the way your world gets wider.',
  );
