import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryBottomSheet } from '../src/components/CategoryBottomSheet';
import { FutureFeedCard } from '../src/components/FutureFeedCard';
import { RewardToast } from '../src/components/RewardToast';
import { categoryById } from '../src/data/categories';
import { ImagineScrollItem } from '../src/data/types';
import { useTTS } from '../src/hooks/useTTS';
import { useImagineStore } from '../src/store/useImagineStore';
import { loadScrollItems } from '../src/utils/scrollDataLoader';

export default function FeedScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlashListRef<ImagineScrollItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reward, setReward] = useState<string | undefined>();

  const activeCategoryId = useImagineStore((state) => state.activeCategoryId);
  const selectedCategoryIds = useImagineStore((state) => state.selectedCategoryIds);
  const setActiveCategory = useImagineStore((state) => state.setActiveCategory);
  const muted = useImagineStore((state) => state.muted);
  const setMuted = useImagineStore((state) => state.setMuted);
  const likedFutureIds = useImagineStore((state) => state.likedFutureIds);
  const savedFutureIds = useImagineStore((state) => state.savedFutureIds);
  const toggleLike = useImagineStore((state) => state.toggleLike);
  const toggleSaveFuture = useImagineStore((state) => state.toggleSaveFuture);
  const addReward = useImagineStore((state) => state.addReward);
  const { speak, stop, replay } = useTTS();

  const items = useMemo(() => loadScrollItems(activeCategoryId, selectedCategoryIds), [activeCategoryId, selectedCategoryIds]);
  const category = categoryById.get(activeCategoryId);

  useEffect(() => {
    setActiveIndex(0);
    stop();
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    speak(items[0]);
  }, [activeCategoryId, items, speak, stop]);

  const settleAtOffset = useCallback(
    (offsetY: number) => {
      const nextIndex = Math.max(0, Math.min(items.length - 1, Math.round(offsetY / height)));
      setActiveIndex(nextIndex);
      speak(items[nextIndex]);
    },
    [height, items, speak],
  );

  const save = useCallback(
    (item: ImagineScrollItem) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleSaveFuture(item.id, category?.group === 'Travel' ? 'Travel Future' : category?.group === 'Career' ? 'Career Future' : 'Dream Home');
      if (item.rewardHint) {
        addReward(item.rewardHint);
        setReward(item.rewardHint);
        setTimeout(() => setReward(undefined), 1600);
      }
    },
    [addReward, category?.group, toggleSaveFuture],
  );

  const like = useCallback(
    (item: ImagineScrollItem) => {
      Haptics.selectionAsync();
      toggleLike(item.id);
    },
    [toggleLike],
  );

  const changeCategory = (categoryId: string) => {
    stop();
    setActiveCategory(categoryId);
  };

  return (
    <View style={styles.screen}>
      <FlashList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={stop}
        onMomentumScrollEnd={(event) => settleAtOffset(event.nativeEvent.contentOffset.y)}
        renderItem={({ item, index }) => (
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
            onShare={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
            onChangeCategory={() => setSheetOpen(true)}
            onToggleMute={() => setMuted(!muted)}
          />
        )}
      />

      <RewardToast reward={reward} />
      <CategoryBottomSheet
        visible={sheetOpen}
        selectedCategoryIds={selectedCategoryIds}
        onClose={() => setSheetOpen(false)}
        onSelect={changeCategory}
      />
      <FeedNav
        top={Math.max(58, insets.top + 20)}
        onBoards={() => router.push('/boards')}
        onDaily={() => router.push('/daily')}
        onSettings={() => router.push('/settings')}
      />
    </View>
  );
}

function FeedNav({ top, onBoards, onDaily, onSettings }: { top: number; onBoards: () => void; onDaily: () => void; onSettings: () => void }) {
  return (
    <View pointerEvents="box-none" style={[styles.nav, { top }]}>
      <NavButton label="Boards" onPress={onBoards} />
      <NavButton label="Daily" onPress={onDaily} />
      <NavButton label="Settings" onPress={onSettings} />
    </View>
  );
}

function NavButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.navDot} />
      <Text style={styles.navText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#030712',
  },
  nav: {
    position: 'absolute',
    right: 18,
    flexDirection: 'row',
    gap: 10,
  },
  navItem: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
    overflow: 'hidden',
  },
  navDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F8C77E',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
});
