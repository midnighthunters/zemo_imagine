import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV, MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import { categories } from '../data/categories';
import { defaultBoards } from '../data/rewards';

type BoardMap = Record<string, string[]>;

type ImagineState = {
  // Original State
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

  // New Redesign State
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  themeMode: 'premium' | 'cosmic' | 'gold' | 'calm';
  dreamPoints: number;
  streakCount: number;
  lastOpenedDate?: string;
  viewedFutureIds: string[];
  claimedDailyRewards: string[];
  customBoards: string[];
  dailyReflections: Record<string, string>;
  futureNotes: Record<string, string>;

  // Actions
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

  // New Actions
  setHapticsEnabled: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setThemeMode: (mode: 'premium' | 'cosmic' | 'gold' | 'calm') => void;
  incrementDreamPoints: (amount: number) => void;
  markFutureViewed: (futureId: string) => void;
  updateStreak: () => void;
  claimDailyReward: (dateKey: string) => void;
  addCustomBoard: (name: string) => void;
  deleteCustomBoard: (name: string) => void;
  setDailyReflection: (dateKey: string, text: string) => void;
  setFutureNote: (futureId: string, note: string) => void;
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

      // New Defaults
      hapticsEnabled: true,
      reducedMotion: false,
      themeMode: 'premium',
      dreamPoints: 0,
      streakCount: 0,
      lastOpenedDate: undefined,
      viewedFutureIds: [],
      claimedDailyRewards: [],
      customBoards: [],
      dailyReflections: {},
      futureNotes: {},

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
        set((state) => {
          const isLiking = !state.likedFutureIds.includes(futureId);
          return {
            likedFutureIds: isLiking
              ? [...state.likedFutureIds, futureId]
              : state.likedFutureIds.filter((id) => id !== futureId),
            dreamPoints: state.dreamPoints + (isLiking ? 5 : 0),
          };
        }),
      toggleSaveFuture: (futureId, boardName = 'Dream Home') =>
        set((state) => {
          const saved = state.savedFutureIds.includes(futureId);
          const nextSaved = saved
            ? state.savedFutureIds.filter((id) => id !== futureId)
            : [...state.savedFutureIds, futureId];
          const currentBoard = state.boards[boardName] ?? [];

          return {
            savedFutureIds: nextSaved,
            dreamPoints: state.dreamPoints + (!saved ? 10 : 0),
            boards: {
              ...state.boards,
              [boardName]: saved
                ? currentBoard.filter((id) => id !== futureId)
                : Array.from(new Set([...currentBoard, futureId])),
            },
          };
        }),
      clearSavedFutures: () => set({ savedFutureIds: [], boards: emptyBoards, futureNotes: {} }),
      addReward: (reward) => {
        const { earnedRewards } = get();
        if (!earnedRewards.includes(reward)) {
          set({ earnedRewards: [...earnedRewards, reward] });
        }
      },

      // New Actions Implementation
      setHapticsEnabled: (value) => set({ hapticsEnabled: value }),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      incrementDreamPoints: (amount) => set((state) => ({ dreamPoints: state.dreamPoints + amount })),
      markFutureViewed: (futureId) =>
        set((state) => ({
          viewedFutureIds: state.viewedFutureIds.includes(futureId)
            ? state.viewedFutureIds
            : [...state.viewedFutureIds, futureId],
          dreamPoints: state.viewedFutureIds.includes(futureId) ? state.dreamPoints : state.dreamPoints + 1,
        })),
      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = get().lastOpenedDate;
        if (lastDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        set((state) => ({
          lastOpenedDate: today,
          streakCount: lastDate === yesterdayStr ? state.streakCount + 1 : 1,
        }));
      },
      claimDailyReward: (dateKey) =>
        set((state) => ({
          claimedDailyRewards: [...state.claimedDailyRewards, dateKey],
          dreamPoints: state.dreamPoints + 50,
        })),
      addCustomBoard: (name) =>
        set((state) => ({
          customBoards: [...state.customBoards, name],
          boards: { ...state.boards, [name]: [] },
        })),
      deleteCustomBoard: (name) =>
        set((state) => {
          const { [name]: _, ...remainingBoards } = state.boards;
          return {
            customBoards: state.customBoards.filter((b) => b !== name),
            boards: remainingBoards,
          };
        }),
      setDailyReflection: (dateKey, text) =>
        set((state) => ({
          dailyReflections: { ...state.dailyReflections, [dateKey]: text },
        })),
      setFutureNote: (futureId, note) =>
        set((state) => ({
          futureNotes: { ...state.futureNotes, [futureId]: note },
        })),
    }),
    {
      name: 'imagine-store-v2',
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
        hapticsEnabled: state.hapticsEnabled,
        reducedMotion: state.reducedMotion,
        themeMode: state.themeMode,
        dreamPoints: state.dreamPoints,
        streakCount: state.streakCount,
        lastOpenedDate: state.lastOpenedDate,
        viewedFutureIds: state.viewedFutureIds,
        claimedDailyRewards: state.claimedDailyRewards,
        customBoards: state.customBoards,
        dailyReflections: state.dailyReflections,
        futureNotes: state.futureNotes,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
