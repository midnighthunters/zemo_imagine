import { useImagineStore } from '../store/useImagineStore';

export const useCategorySelection = () => {
  const selectedCategoryIds = useImagineStore((state) => state.selectedCategoryIds);
  const activeCategoryId = useImagineStore((state) => state.activeCategoryId);
  const selectCategories = useImagineStore((state) => state.selectCategories);
  const setActiveCategory = useImagineStore((state) => state.setActiveCategory);

  return { selectedCategoryIds, activeCategoryId, selectCategories, setActiveCategory };
};
