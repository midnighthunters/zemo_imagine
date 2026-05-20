import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, Share } from 'react-native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { CategoryBottomSheet } from '../src/components/CategoryBottomSheet';
import { FutureFeedCard } from '../src/components/FutureFeedCard';
import { RewardToast } from '../src/components/RewardToast';
import { FloatingDock } from '../src/components/ui/FloatingDock';
import { Screen } from '../src/components/ui/Screen';
import { categoryById } from '../src/data/categories';
import { ImagineScrollItem } from '../src/data/types';
import { useTTS } from '../src/hooks/useTTS';
import { useImagineStore } from '../src/store/useImagineStore';
import { loadScrollItems } from '../src/utils/scrollDataLoader';

export default function FeedScreen() {
  const { height } = useWindowDimensions();
  const listRef = useRef<FlashListRef<ImagineScrollItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reward, setReward] = useState<string | undefined>();

  const activeCategoryId = useImagineStore((state) => state.activeCategoryId);
  const selectedCategoryIds = useImagineStore((state) => state.selectedCategoryIds);
  const setActiveCategory = useImagineStore((state) => state.setActiveCategory);
  const muted = useImagineStore((state) => state.muted);
  const setMuted = useImagineStore((state) => state.setMuted);
  const hapticsEnabled = useImagineStore((state) => state.hapticsEnabled);
  const likedFutureIds = useImagineStore((state) => state.likedFutureIds);
  const savedFutureIds = useImagineStore((state) => state.savedFutureIds);
  const toggleLike = useImagineStore((state) => state.toggleLike);
  const toggleSaveFuture = useImagineStore((state) => state.toggleSaveFuture);
  const addReward = useImagineStore((state) => state.addReward);
  const markFutureViewed = useImagineStore((state) => state.markFutureViewed);
  const updateStreak = useImagineStore((state) => state.updateStreak);

  const { speak, stop, replay } = useTTS();

  const items = useMemo(() => loadScrollItems(activeCategoryId, selectedCategoryIds), [activeCategoryId, selectedCategoryIds]);
  const category = categoryById.get(activeCategoryId);

  useEffect(() => {
    updateStreak();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    stop();
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (items[0]) {
        speak(items[0]);
        markFutureViewed(items[0].id);
    }
  }, [activeCategoryId, items, speak, stop]);

  const settleAtOffset = useCallback(
    (offsetY: number) => {
      const nextIndex = Math.max(0, Math.min(items.length - 1, Math.round(offsetY / height)));
      if (nextIndex !== activeIndex) {
          setActiveIndex(nextIndex);
          speak(items[nextIndex]);
          markFutureViewed(items[nextIndex].id);
          if (hapticsEnabled) {
              Haptics.selectionAsync();
          }
      }
    },
    [height, items, speak, activeIndex, hapticsEnabled],
  );

  const save = useCallback(
    (item: ImagineScrollItem) => {
      if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      toggleSaveFuture(item.id, category?.group === 'Travel' ? 'Travel Future' : category?.group === 'Career' ? 'Career Future' : 'Dream Home');
      if (item.rewardHint && !savedFutureIds.includes(item.id)) {
        addReward(item.rewardHint);
        setReward(item.rewardHint);
        setTimeout(() => setReward(undefined), 2000);
      }
    },
    [addReward, category?.group, toggleSaveFuture, hapticsEnabled, savedFutureIds],
  );

  const like = useCallback(
    (item: ImagineScrollItem) => {
      if (hapticsEnabled) {
        Haptics.selectionAsync();
      }
      toggleLike(item.id);
    },
    [toggleLike, hapticsEnabled],
  );

  const handleShare = async (item: ImagineScrollItem) => {
    try {
        await Share.share({
            title: item.title,
            message: `${item.title}\n\n${item.text}\n\nI found this future on Imagine — Visualise your future.`,
        });
        if (hapticsEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    } catch (error) {
        console.log('Share error:', error);
    }
  };

  const changeCategory = (categoryId: string) => {
    stop();
    setActiveCategory(categoryId);
  };

  const flashListProps = {
    data: items,
    keyExtractor: (item: ImagineScrollItem) => item.id,
    pagingEnabled: true,
    snapToInterval: height,
    decelerationRate: "fast" as const,
    showsVerticalScrollIndicator: false,
    onScrollBeginDrag: stop,
    onMomentumScrollEnd: (event: any) => settleAtOffset(event.nativeEvent.contentOffset.y),
    estimatedItemSize: 800,
    renderItem: ({ item, index }: any) => (
      <FutureFeedCard
        item={item}
        category={categoryById.get(item.categoryId) ?? category}
        index={index}
        total={items.length}
        muted={muted}
        saved={savedFutureIds.includes(item.id)}
        liked={likedFutureIds.includes(item.id)}
        onLike={() => like(item)}
        onSave={() => save(item)}
        onReplay={() => replay(item)}
        onShare={() => handleShare(item)}
        onChangeCategory={() => setSheetOpen(true)}
        onToggleMute={() => setMuted(!muted)}
      />
    ),
  };

  return (
    <Screen withSafeArea={false} style={styles.screen}>
      <FlashList
        ref={listRef}
        {...flashListProps}
      />

      <RewardToast reward={reward} />

      <CategoryBottomSheet
        visible={sheetOpen}
        selectedCategoryIds={selectedCategoryIds}
        onClose={() => setSheetOpen(false)}
        onSelect={changeCategory}
      />

      <FloatingDock
        activeTab="feed"
        onTabPress={(tab) => {
            if (tab === 'feed') return;
            stop();
            router.push(`/${tab}` as any);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#030712',
  },
});
