import React, { useState, useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Search, X, ChevronRight, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

import { categories, categoryById, categoryGroups } from '../data/categories';
import { useImagineStore } from '../store/useImagineStore';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { GlassCard } from './ui/GlassCard';

interface CategoryBottomSheetProps {
  visible: boolean;
  selectedCategoryIds: string[];
  onClose: () => void;
  onSelect: (categoryId: string) => void;
}

export const CategoryBottomSheet: React.FC<CategoryBottomSheetProps> = ({
  visible,
  selectedCategoryIds,
  onClose,
  onSelect,
}) => {
  const { height } = useWindowDimensions();
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const activeCategoryId = useImagineStore((state) => state.activeCategoryId);
  const hapticsEnabled = useImagineStore((state) => state.hapticsEnabled);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const isSelected = selectedCategoryIds.includes(c.id);
      if (!isSelected) return false;

      const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
      const matchesGroup = !activeGroup || c.group === activeGroup;
      return matchesSearch && matchesGroup;
    });
  }, [search, activeGroup, selectedCategoryIds]);

  const handleSelect = (id: string) => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelect(id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.dismiss} onPress={onClose} />

        <View style={[styles.sheet, { height: height * 0.7 }]}>
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>Switch Future</Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <X size={20} color={colors.mutedText} />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={18} color={colors.mutedText} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search your categories..."
                  placeholderTextColor={colors.mutedText}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>

            <View style={styles.groupsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupsContent}>
                <GroupChip
                  label="All"
                  active={activeGroup === null}
                  onPress={() => setActiveGroup(null)}
                />
                {categoryGroups.map((group) => {
                    const hasSelectedInGroup = categories.some(c => c.group === group && selectedCategoryIds.includes(c.id));
                    if (!hasSelectedInGroup) return null;
                    return (
                        <GroupChip
                        key={group}
                        label={group}
                        active={activeGroup === group}
                        onPress={() => setActiveGroup(group)}
                        />
                    );
                })}
              </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item) => (
                  <Pressable
                    key={item.id}
                    style={[
                        styles.item,
                        activeCategoryId === item.id && styles.activeItem
                    ]}
                    onPress={() => handleSelect(item.id)}
                  >
                    <View style={styles.itemEmojiContainer}>
                        <Text style={styles.itemEmoji}>{item.emoji}</Text>
                    </View>
                    <View style={styles.itemContent}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemGroup}>{item.group}</Text>
                    </View>
                    {activeCategoryId === item.id ? (
                        <View style={styles.activeBadge}>
                            <Check size={14} color="#000" strokeWidth={3} />
                        </View>
                    ) : (
                        <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                    )}
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No matching categories in your selection.</Text>
                    <Pressable onPress={onClose} style={styles.manageButton}>
                        <Text style={styles.manageButtonText}>Manage Categories</Text>
                    </Pressable>
                </View>
              )}
            </ScrollView>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
};

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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dismiss: {
    flex: 1,
  },
  sheet: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  groupsContainer: {
    marginBottom: spacing.md,
  },
  groupsContent: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  groupChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeGroupChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  groupChipText: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: typography.weights.semibold as any,
  },
  activeGroupChipText: {
    color: '#000',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeItem: {
    backgroundColor: 'rgba(248, 199, 126, 0.05)',
    borderColor: 'rgba(248, 199, 126, 0.2)',
  },
  itemEmojiContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
  },
  itemGroup: {
    fontSize: 11,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
  },
  emptyContainer: {
      alignItems: 'center',
      paddingVertical: 40,
  },
  emptyText: {
      color: colors.mutedText,
      textAlign: 'center',
      marginBottom: spacing.lg,
  },
  manageButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.1)',
  },
  manageButtonText: {
      color: colors.text,
      fontWeight: typography.weights.bold as any,
  }
});
