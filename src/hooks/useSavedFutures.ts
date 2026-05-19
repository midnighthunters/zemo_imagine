import { useImagineStore } from '../store/useImagineStore';

export const useSavedFutures = () => {
  const savedFutureIds = useImagineStore((state) => state.savedFutureIds);
  const boards = useImagineStore((state) => state.boards);
  const toggleSaveFuture = useImagineStore((state) => state.toggleSaveFuture);
  const clearSavedFutures = useImagineStore((state) => state.clearSavedFutures);

  return { savedFutureIds, boards, toggleSaveFuture, clearSavedFutures };
};
