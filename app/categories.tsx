import { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Sparkles, X, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { CategoryCard } from '../src/components/CategoryCard';
import { Screen } from '../src/components/ui/Screen';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { SearchBar } from '../src/components/ui/SearchBar';
import { categories, categoryGroups } from '../src/data/categories';
import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { radius } from '../src/theme/radius';

export default function CategoriesScreen() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const selectedCategoryIds = useImagineStore((state) => state.selectedCategoryIds);
  const selectCategories = useImagineStore((state) => state.selectCategories);
  const hapticsEnabled = useImagineStore((state) => state.hapticsEnabled);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.group.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !activeGroup || c.group === activeGroup;
      return matchesSearch && matchesGroup;
    });
  }, [search, activeGroup]);

  const recommendedCategories = useMemo(() => {
    return categories.filter((c) => ['Travel', 'Wealth', 'Career', 'Fitness'].includes(c.group)).slice(0, 6);
  }, []);

  const toggleCategory = (id: string) => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((cid) => cid !== id)
      : [...selectedCategoryIds, id];
    selectCategories(next);
  };

  const selectAllInGroup = () => {
    if (!activeGroup) return;
    const groupIds = categories.filter((c) => c.group === activeGroup).map((c) => c.id);
    const otherIds = selectedCategoryIds.filter((id) => {
        const cat = categories.find(c => c.id === id);
        return cat && cat.group !== activeGroup;
    });

    const allSelected = groupIds.every(id => selectedCategoryIds.includes(id));

    if (allSelected) {
        selectCategories(otherIds);
    } else {
        selectCategories([...new Set([...otherIds, ...groupIds])]);
    }

    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const surpriseMe = () => {
    const random = [...categories].sort(() => 0.5 - Math.random()).slice(0, 5).map(c => c.id);
    selectCategories(random);
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <Screen withSafeArea={true}>
      <GradientBackground>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Discovery</Text>
            <Text style={styles.subtitle}>What does your future look like?</Text>
          </View>
          <Pressable onPress={surpriseMe} style={styles.surpriseButton}>
            <Sparkles size={16} color={colors.primary} />
            <Text style={styles.surpriseText}>Surprise me</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search travel, career, wealth..."
          />
        </View>

        <View style={styles.groupsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupsContent}>
            <GroupChip
              label="All"
              active={activeGroup === null}
              onPress={() => setActiveGroup(null)}
            />
            {categoryGroups.map((group) => (
              <GroupChip
                key={group}
                label={group}
                active={activeGroup === group}
                onPress={() => setActiveGroup(group)}
              />
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            !search && !activeGroup ? (
              <View style={styles.recommendedSection}>
                <Text style={styles.sectionTitle}>Recommended for you</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedContent}>
                  {recommendedCategories.map(c => (
                    <Pressable key={c.id} onPress={() => toggleCategory(c.id)} style={styles.miniCard}>
                         <Text style={styles.miniEmoji}>{c.emoji}</Text>
                         <Text style={styles.miniTitle} numberOfLines={1}>{c.title}</Text>
                         {selectedCategoryIds.includes(c.id) && <View style={styles.miniCheck} />}
                    </Pressable>
                  ))}
                </ScrollView>
                <View style={styles.listHeadingRow}>
                    <Text style={styles.sectionTitle}>All Categories</Text>
                </View>
              </View>
            ) : activeGroup ? (
                <View style={styles.groupHeader}>
                    <Text style={styles.sectionTitle}>{activeGroup} Futures</Text>
                    <Pressable onPress={selectAllInGroup}>
                        <Text style={styles.selectAllText}>
                            {categories.filter(c => c.group === activeGroup).every(id => selectedCategoryIds.includes(id.id)) ? 'Deselect All' : 'Select All'}
                        </Text>
                    </Pressable>
                </View>
            ) : null
          }
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              selected={selectedCategoryIds.includes(item.id)}
              onPress={() => toggleCategory(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <X size={48} color={colors.mutedText} strokeWidth={1} />
              <Text style={styles.emptyText}>No categories found for "{search}"</Text>
            </View>
          }
        />

        {selectedCategoryIds.length > 0 && (
          <View style={styles.ctaContainer}>
            <View style={styles.ctaContent}>
                <View>
                    <Text style={styles.ctaCount}>{selectedCategoryIds.length} selected</Text>
                    <Text style={styles.ctaHint}>You can change this anytime</Text>
                </View>
                <Pressable
                onPress={() => router.replace('/feed')}
                style={styles.ctaButton}
                >
                <Text style={styles.ctaButtonText}>Start Dreamscrolling</Text>
                <ChevronRight size={20} color="#000" />
                </Pressable>
            </View>
          </View>
        )}
      </GradientBackground>
    </Screen>
  );
}

function GroupChip({ label, active, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.groupChip, active && styles.activeGroupChip]}
    >
      <Text style={[styles.groupChipText, active && styles.activeGroupChipText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.weights.black as any,
    color: colors.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: typography.bodySmall,
    color: colors.mutedText,
  },
  surpriseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: 'rgba(248, 199, 126, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248, 199, 126, 0.2)',
  },
  surpriseText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: typography.weights.bold as any,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  groupsContainer: {
    marginBottom: spacing.md,
  },
  groupsContent: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  groupChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeGroupChip: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  groupChipText: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: typography.weights.semibold as any,
  },
  activeGroupChipText: {
    color: '#000',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 120,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  recommendedSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  recommendedContent: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  miniCard: {
    width: 100,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  miniEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  miniTitle: {
    fontSize: 10,
    color: colors.text,
    fontWeight: typography.weights.bold as any,
    textAlign: 'center',
  },
  miniCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  listHeadingRow: {
      marginTop: spacing.lg,
  },
  groupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
  },
  selectAllText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: typography.weights.bold as any,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: colors.mutedText,
    marginTop: 16,
    fontSize: typography.body,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: 'rgba(3, 7, 18, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  ctaContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  ctaCount: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: typography.weights.bold as any,
  },
  ctaHint: {
    color: colors.mutedText,
    fontSize: 12,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.full,
    gap: 8,
  },
  ctaButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: typography.weights.bold as any,
  },
});
