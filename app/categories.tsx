import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { CategoryCard } from '../src/components/CategoryCard';
import { ImagineButton } from '../src/components/ImagineButton';
import { categories } from '../src/data/categories';
import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';
import { filterCategories, quickFilters } from '../src/utils/categoryFilters';

export default function CategoriesScreen() {
  const storedSelected = useImagineStore((state) => state.selectedCategoryIds);
  const selectCategories = useImagineStore((state) => state.selectCategories);
  const completeOnboarding = useImagineStore((state) => state.completeOnboarding);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(storedSelected);
  const [activeGroup, setActiveGroup] = useState<string | undefined>();

  const data = useMemo(() => filterCategories(query, activeGroup), [query, activeGroup]);

  const toggle = (categoryId: string) => {
    Haptics.selectionAsync();
    setSelected((current) =>
      current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId],
    );
  };

  const continueToFeed = (ids: string[]) => {
    selectCategories(ids);
    completeOnboarding();
    router.replace('/feed');
  };

  const surprise = () => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    continueToFeed([category.id]);
  };

  return (
    <LinearGradient colors={['#050816', '#0B1222', '#1E1B4B']} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Imagine</Text>
        <Text style={styles.title}>What future excites you the most?</Text>
        <Text style={styles.subtitle}>Pick one or more categories. You can change anytime.</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search 240+ future categories"
          placeholderTextColor={colors.mutedText}
          style={styles.search}
        />
      </View>

      <View style={styles.filterContainer}>
        <FlashList
          data={['All', ...quickFilters]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = item === 'All' ? !activeGroup : activeGroup === item;
            return (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveGroup(item === 'All' ? undefined : item);
                }}
                style={[styles.filterItem, isActive && styles.filterItemActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{item}</Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlashList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CategoryCard category={item} selected={selected.includes(item.id)} onPress={toggle} />}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Pressable onPress={surprise} style={styles.surprise}>
          <Text style={styles.surpriseText}>Surprise me</Text>
        </Pressable>
        <ImagineButton
          label={selected.length === 0 ? 'Choose a future' : `Start dreamscrolling (${selected.length})`}
          disabled={selected.length === 0}
          onPress={() => continueToFeed(selected)}
          style={styles.cta}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: 62,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  kicker: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 10,
    color: colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 10,
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  search: {
    marginTop: 20,
    minHeight: 56,
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 16,
    color: colors.text,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterItem: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
  },
  filterItemActive: {
    backgroundColor: 'rgba(248, 199, 126, 0.15)',
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: '700',
  },
  filterTextActive: {
    color: colors.primary,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 130,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(8,13,28,0.92)',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  surprise: {
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.glass,
  },
  surpriseText: {
    color: colors.text,
    fontWeight: '900',
  },
  cta: {
    flex: 1,
  },
});
