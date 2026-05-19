import { ImagineCategory } from '../types';
import { buildScrollItemsForCategory } from './generated';

export const getCareerScrollItems = (category: ImagineCategory) =>
  buildScrollItemsForCategory(
    category,
    'Notice the room, the launch, the respect, and the quiet competence your future self carries.',
  );
