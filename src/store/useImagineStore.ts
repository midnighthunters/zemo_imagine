import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV, MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import { categories } from '../data/categories';
import { defaultBoards } from '../data/rewards';

type BoardMap = Record<string, string[]>;

type ImagineState = {
  hasHydrated: boolean;
  onboardingComplete: boolean;
  selectedCategoryIds: string[];
  activeCategoryId: string;
  muted: boolean;
  autoPlayTTS: boolean;
  ttsRate: number;
  ttsPitch: number;
  likedFutureIds: string[];
  savedFutureIds: string[];
  earnedRewards: string[];
  boards: BoardMap;
  setHasHydrated: (value: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  selectCategories: (categoryIds: string[]) => void;
  setActiveCategory: (categoryId: string) => void;
  setMuted: (value: boolean) => void;
  setAutoPlayTTS: (value: boolean) => void;
  setTtsRate: (value: number) => void;
  setTtsPitch: (value: number) => void;
  toggleLike: (futureId: string) => void;
  toggleSaveFuture: (futureId: string, boardName?: string) => void;
  clearSavedFutures: () => void;
  addReward: (reward: string) => void;
};

let mmkv: MMKV | undefined;

try {
  mmkv = createMMKV({ id: 'imagine-preferences' });
} catch {
  mmkv = undefined;
}

const storage: StateStorage = mmkv
  ? {
      getItem: (name) => mmkv?.getString(name) ?? null,
      setItem: (name, value) => mmkv?.set(name, value),
      removeItem: (name) => mmkv?.remove(name),
    }
  : {
      getItem: (name) => AsyncStorage.getItem(name),
      setItem: (name, value) => AsyncStorage.setItem(name, value),
      removeItem: (name) => AsyncStorage.removeItem(name),
    };

const emptyBoards = defaultBoards.reduce<BoardMap>((boards, board) => {
  boards[board] = [];
  return boards;
}, {});

const firstCategoryId = categories[0]?.id ?? 'mixed';

export const useImagineStore = create<ImagineState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      onboardingComplete: false,
      selectedCategoryIds: [],
      activeCategoryId: firstCategoryId,
      muted: false,
      autoPlayTTS: true,
      ttsRate: 0.92,
      ttsPitch: 1,
      likedFutureIds: [],
      savedFutureIds: [],
      earnedRewards: [],
      boards: emptyBoards,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      resetOnboarding: () => set({ onboardingComplete: false, selectedCategoryIds: [] }),
      selectCategories: (categoryIds) =>
        set({
          selectedCategoryIds: categoryIds,
          activeCategoryId: categoryIds[0] ?? firstCategoryId,
        }),
      setActiveCategory: (categoryId) => set({ activeCategoryId: categoryId }),
      setMuted: (value) => set({ muted: value }),
      setAutoPlayTTS: (value) => set({ autoPlayTTS: value }),
      setTtsRate: (value) => set({ ttsRate: value }),
      setTtsPitch: (value) => set({ ttsPitch: value }),
      toggleLike: (futureId) =>
        set((state) => ({
          likedFutureIds: state.likedFutureIds.includes(futureId)
            ? state.likedFutureIds.filter((id) => id !== futureId)
            : [...state.likedFutureIds, futureId],
        })),
      toggleSaveFuture: (futureId, boardName = 'Dream Home') =>
        set((state) => {
          const saved = state.savedFutureIds.includes(futureId);
          const nextSaved = saved
            ? state.savedFutureIds.filter((id) => id !== futureId)
            : [...state.savedFutureIds, futureId];
          const currentBoard = state.boards[boardName] ?? [];

          return {
            savedFutureIds: nextSaved,
            boards: {
              ...state.boards,
              [boardName]: saved
                ? currentBoard.filter((id) => id !== futureId)
                : Array.from(new Set([...currentBoard, futureId])),
            },
          };
        }),
      clearSavedFutures: () => set({ savedFutureIds: [], boards: emptyBoards }),
      addReward: (reward) => {
        const { earnedRewards } = get();
        if (!earnedRewards.includes(reward)) {
          set({ earnedRewards: [...earnedRewards, reward] });
        }
      },
    }),
    {
      name: 'imagine-store-v1',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        onboardingComplete: state.onboardingComplete,
        selectedCategoryIds: state.selectedCategoryIds,
        activeCategoryId: state.activeCategoryId,
        muted: state.muted,
        autoPlayTTS: state.autoPlayTTS,
        ttsRate: state.ttsRate,
        ttsPitch: state.ttsPitch,
        likedFutureIds: state.likedFutureIds,
        savedFutureIds: state.savedFutureIds,
        earnedRewards: state.earnedRewards,
        boards: state.boards,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
