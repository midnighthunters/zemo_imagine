import { ImagineCategory } from '../types';
import { buildScrollItemsForCategory } from './generated';

export const getFantasyScrollItems = (category: ImagineCategory) =>
  buildScrollItemsForCategory(
    category,
    'Let the impossible details feel real for a moment: the gates, the sky, the symbol, the quest.',
  );
