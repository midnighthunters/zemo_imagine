import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Share,
} from 'react-native';
import { router } from 'expo-router';
import {
  Bookmark,
  Heart,
  Trophy,
  Share2,
  Trash2,
  MessageSquare,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Screen } from '../src/components/ui/Screen';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { SectionHeader } from '../src/components/ui/SectionHeader';
import { StatCard } from '../src/components/ui/StatCard';
import { GlassCard } from '../src/components/ui/GlassCard';
import { SearchBar } from '../src/components/ui/SearchBar';
import { EmptyState } from '../src/components/EmptyState';
import { FloatingDock } from '../src/components/ui/FloatingDock';
import { categoryById, categories } from '../src/data/categories';
import { getScrollItemsForCategory } from '../src/data/scrollItems/index';
import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { radius } from '../src/theme/radius';
import { ImagineScrollItem } from '../src/data/types';

export default function BoardsScreen() {
  const [activeBoard, setActiveBoard] = useState('All');
  const [search, setSearch] = useState('');

  const savedFutureIds = useImagineStore((state) => state.savedFutureIds);
  const likedFutureIds = useImagineStore((state) => state.likedFutureIds);
  const earnedRewards = useImagineStore((state) => state.earnedRewards);
  const boards = useImagineStore((state) => state.boards);
  const futureNotes = useImagineStore((state) => state.futureNotes);
  const setFutureNote = useImagineStore((state) => state.setFutureNote);
  const toggleSaveFuture = useImagineStore((state) => state.toggleSaveFuture);
  const hapticsEnabled = useImagineStore((state) => state.hapticsEnabled);

  const boardNames = useMemo(() => ['All', ...Object.keys(boards)], [boards]);

  const allPossibleItems = useMemo(() => {
    // This is inefficient but necessary since we don't have a flat list of all items
    // We only take items from selected categories to be faster
    return categories.flatMap(c => getScrollItemsForCategory(c.id));
  }, []);

  const savedFutures = useMemo(() => {
    const allSaved = allPossibleItems.filter((item) => savedFutureIds.includes(item.id));
    let filtered = activeBoard === 'All'
        ? allSaved
        : allSaved.filter(item => boards[activeBoard]?.includes(item.id));

    if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(s) ||
            item.text.toLowerCase().includes(s) ||
            futureNotes[item.id]?.toLowerCase().includes(s)
        );
    }
    return filtered;
  }, [allPossibleItems, savedFutureIds, activeBoard, boards, search, futureNotes]);

  const handleShare = async (item: ImagineScrollItem) => {
    try {
        await Share.share({
            title: item.title,
            message: `${item.title}\n\n${item.text}\n\nMy Note: ${futureNotes[item.id] || ''}\n\nVisualised on Imagine.`,
        });
    } catch (error) {}
  };

  const removeFuture = (id: string) => {
      if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleSaveFuture(id, activeBoard !== 'All' ? activeBoard : undefined);
  };

  return (
    <Screen withSafeArea={true}>
      <GradientBackground>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <SectionHeader
            title="Future Boards"
            subtitle="Your saved dream life map"
            style={styles.header}
          />

          <View style={styles.statsContainer}>
            <StatCard
              label="Saved"
              value={savedFutureIds.length}
              icon={<Bookmark size={14} color={colors.primary} />}
            />
            <StatCard
              label="Liked"
              value={likedFutureIds.length}
              icon={<Heart size={14} color={colors.accent} />}
            />
            <StatCard
              label="Rewards"
              value={earnedRewards.length}
              icon={<Trophy size={14} color={colors.green} />}
            />
          </View>

          <View style={styles.searchContainer}>
            <SearchBar value={search} onChangeText={setSearch} placeholder="Search saved futures..." />
          </View>

          <View style={styles.boardsTabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
                {boardNames.map(name => (
                    <Pressable
                        key={name}
                        onPress={() => setActiveBoard(name)}
                        style={[styles.tab, activeBoard === name && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeBoard === name && styles.activeTabText]}>{name}</Text>
                    </Pressable>
                ))}
            </ScrollView>
          </View>

          <View style={styles.listContainer}>
            {savedFutures.length > 0 ? (
                savedFutures.map((item) => (
                    <SavedFutureCard
                        key={item.id}
                        item={item}
                        note={futureNotes[item.id]}
                        onNoteChange={(text: string) => setFutureNote(item.id, text)}
                        onRemove={() => removeFuture(item.id)}
                        onShare={() => handleShare(item)}
                    />
                ))
            ) : (
                <EmptyState
                    title="No futures found"
                    subtitle={search ? "Try a different search term" : "Start saving futures from your feed to see them here."}
                    icon={Bookmark}
                    actionLabel="Go to Feed"
                    onAction={() => router.push('/feed')}
                />
            )}
          </View>
        </ScrollView>

        <FloatingDock
          activeTab="boards"
          onTabPress={(tab) => {
            if (tab === 'boards') return;
            router.push(`/${tab}` as any);
          }}
        />
      </GradientBackground>
    </Screen>
  );
}

interface SavedFutureCardProps {
    item: ImagineScrollItem;
    note?: string;
    onNoteChange: (text: string) => void;
    onRemove: () => void;
    onShare: () => void;
}

function SavedFutureCard({ item, note, onNoteChange, onRemove, onShare }: SavedFutureCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const category = categoryById.get(item.categoryId);

    return (
        <GlassCard style={styles.savedCard}>
            <View style={styles.savedCardHeader}>
                <View style={styles.categoryInfo}>
                    <Text style={styles.savedEmoji}>{category?.emoji}</Text>
                    <View>
                        <Text style={styles.savedGroup}>{category?.group}</Text>
                        <Text style={styles.savedCategoryTitle}>{category?.title}</Text>
                    </View>
                </View>
                <View style={styles.cardActions}>
                    <Pressable onPress={onShare} style={styles.cardActionBtn}>
                        <Share2 size={18} color={colors.mutedText} />
                    </Pressable>
                    <Pressable onPress={onRemove} style={styles.cardActionBtn}>
                        <Trash2 size={18} color={colors.rose} />
                    </Pressable>
                </View>
            </View>

            <Text style={styles.savedTitle}>{item.title}</Text>
            <Text style={styles.savedText} numberOfLines={3}>{item.text}</Text>

            <View style={styles.noteSection}>
                {isEditing ? (
                    <TextInput
                        style={styles.noteInput}
                        value={note}
                        onChangeText={onNoteChange}
                        placeholder="Add a reflection or note..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        autoFocus
                        onBlur={() => setIsEditing(false)}
                        multiline
                    />
                ) : (
                    <Pressable onPress={() => setIsEditing(true)} style={styles.noteDisplay}>
                        <MessageSquare size={14} color={colors.primary} />
                        <Text style={[styles.noteText, !note && styles.notePlaceholder]}>
                            {note || "Add reflection..."}
                        </Text>
                    </Pressable>
                )}
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  boardsTabsContainer: {
    marginBottom: spacing.md,
  },
  tabsContent: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: typography.weights.semibold as any,
  },
  activeTabText: {
    color: '#000',
  },
  listContainer: {
    paddingHorizontal: spacing.md,
  },
  savedCard: {
      padding: spacing.md,
      marginBottom: spacing.md,
      borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  savedCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
  },
  categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  savedEmoji: {
      fontSize: 24,
  },
  savedGroup: {
      fontSize: 8,
      fontWeight: typography.weights.bold as any,
      color: colors.mutedText,
      textTransform: 'uppercase',
      letterSpacing: 1,
  },
  savedCategoryTitle: {
      fontSize: 12,
      color: colors.text,
      fontWeight: typography.weights.semibold as any,
  },
  cardActions: {
      flexDirection: 'row',
      gap: 8,
  },
  cardActionBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  savedTitle: {
      fontSize: 18,
      fontWeight: typography.weights.bold as any,
      color: colors.text,
      marginBottom: 4,
  },
  savedText: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
      lineHeight: 20,
      marginBottom: spacing.md,
  },
  noteSection: {
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.05)',
      paddingTop: spacing.sm,
  },
  noteDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  noteText: {
      fontSize: 13,
      color: colors.primary,
      fontStyle: 'italic',
  },
  notePlaceholder: {
      color: 'rgba(248, 199, 126, 0.4)',
  },
  noteInput: {
      color: colors.primary,
      fontSize: 13,
      padding: 0,
  }
});
