import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { X } from 'lucide-react-native';

import { categories, categoryById } from '../data/categories';
import { ImagineCategory } from '../data/types';
import { colors } from '../theme/colors';
import { filterCategories, quickFilters } from '../utils/categoryFilters';
import { CategoryCard } from './CategoryCard';

type Props = {
  visible: boolean;
  selectedCategoryIds: string[];
  onClose: () => void;
  onSelect: (categoryId: string) => void;
};

export function CategoryBottomSheet({ visible, selectedCategoryIds, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string | undefined>();

  const data = useMemo(() => {
    const selected = selectedCategoryIds
      .map((id) => categoryById.get(id))
      .filter(Boolean) as ImagineCategory[];
    const selectedIds = new Set(selected.map((category) => category.id));
    const rest = filterCategories(query, filter, categories).filter((category) => !selectedIds.has(category.id));
    return [...selected, ...rest];
  }, [filter, query, selectedCategoryIds]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Change Future</Text>
              <Text style={styles.subtitle}>Pick a category and the feed resets instantly.</Text>
            </View>
            <Pressable onPress={onClose} style={styles.close}>
              <X color={colors.text} size={22} />
            </Pressable>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search categories"
            placeholderTextColor={colors.mutedText}
            style={styles.search}
          />

          <FlashList
            data={quickFilters}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable onPress={() => setFilter(filter === item ? undefined : item)} style={[styles.filter, filter === item && styles.filterActive]}>
                <Text style={styles.filterText}>{item}</Text>
              </Pressable>
            )}
          />

          <FlashList
            data={data}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                selected={selectedCategoryIds.includes(item.id)}
                onPress={(categoryId) => {
                  onSelect(categoryId);
                  onClose();
                }}
              />
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  sheet: {
    height: '86%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    backgroundColor: '#0B1222',
    borderWidth: 1,
    borderColor: colors.line,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 4,
    color: colors.mutedText,
    fontSize: 13,
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
  },
  search: {
    minHeight: 50,
    borderRadius: 18,
    paddingHorizontal: 16,
    color: colors.text,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  filter: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.line,
    marginRight: 8,
    marginBottom: 12,
  },
  filterActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(248,199,126,0.18)',
  },
  filterText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 12,
  },
});
