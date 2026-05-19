import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImagineButton } from '../src/components/ImagineButton';
import { categoryById } from '../src/data/categories';
import { getScrollItemsForCategory } from '../src/data/scrollItems';
import { ImagineScrollItem } from '../src/data/types';
import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';

const findFuture = (futureId: string): ImagineScrollItem | undefined => {
  const categoryId = futureId.replace(/-\d{3}$/, '');
  return getScrollItemsForCategory(categoryId).find((item) => item.id === futureId);
};

export default function BoardsScreen() {
  const insets = useSafeAreaInsets();
  const boards = useImagineStore((state) => state.boards);
  const savedFutureIds = useImagineStore((state) => state.savedFutureIds);
  const [query, setQuery] = useState('');

  const savedItems = useMemo(
    () =>
      savedFutureIds
        .map(findFuture)
        .filter(Boolean)
        .filter((item) => {
          const normalized = query.trim().toLowerCase();
          return !normalized || item!.title.toLowerCase().includes(normalized) || item!.text.toLowerCase().includes(normalized);
        }) as ImagineScrollItem[],
    [query, savedFutureIds],
  );

  return (
    <LinearGradient colors={['#080D1C', '#111827', '#0F766E']} style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(62, insets.top + 20), paddingBottom: Math.max(42, insets.bottom + 20) }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>Future Boards</Text>
            <Text style={styles.title}>Your dream life map</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.close}>
            <Text style={styles.closeText}>Feed</Text>
          </Pressable>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search saved futures"
          placeholderTextColor={colors.mutedText}
          style={styles.search}
        />

        <View style={styles.grid}>
          {Object.entries(boards).map(([board, ids]) => (
            <View key={board} style={styles.board}>
              <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFillObject} />
              <Text style={styles.boardTitle}>{board}</Text>
              <Text style={styles.boardCount}>{ids.length} saved futures</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Saved futures</Text>
        {savedItems.length === 0 ? (
          <View style={styles.empty}>
            <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFillObject} />
            <Text style={styles.emptyTitle}>No saved futures yet</Text>
            <Text style={styles.emptyText}>Save a card from the feed and it will appear here.</Text>
            <ImagineButton label="Open feed" onPress={() => router.replace('/feed')} />
          </View>
        ) : (
          savedItems.map((item) => {
            const category = categoryById.get(item.categoryId);
            return (
              <View key={item.id} style={styles.saved}>
                <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFillObject} />
                <Text style={styles.savedCategory}>{category?.emoji} {category?.title}</Text>
                <Text style={styles.savedTitle}>{item.title}</Text>
                <Text numberOfLines={3} style={styles.savedText}>{item.text}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 34, lineHeight: 39, fontWeight: '900', marginTop: 8 },
  close: { borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.line },
  closeText: { color: colors.text, fontWeight: '900' },
  search: { marginTop: 22, minHeight: 52, borderRadius: 18, paddingHorizontal: 16, color: colors.text, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.line },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  board: { width: '48%', minHeight: 112, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  boardTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  boardCount: { color: colors.primary, marginTop: 12, fontWeight: '800' },
  sectionTitle: { color: colors.text, marginTop: 28, marginBottom: 12, fontSize: 22, fontWeight: '900' },
  empty: { borderRadius: 22, padding: 22, borderWidth: 1, borderColor: colors.line, gap: 10, overflow: 'hidden' },
  emptyTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  emptyText: { color: colors.mutedText, fontSize: 15, lineHeight: 22, marginBottom: 8 },
  saved: { borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.line, marginBottom: 12, overflow: 'hidden' },
  savedCategory: { color: colors.primary, fontSize: 12, fontWeight: '900' },
  savedTitle: { color: colors.text, marginTop: 8, fontSize: 18, fontWeight: '900' },
  savedText: { color: colors.mutedText, marginTop: 8, fontSize: 14, lineHeight: 21 },
});
