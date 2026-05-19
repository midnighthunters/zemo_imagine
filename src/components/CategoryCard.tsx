import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ImagineCategory } from '../data/types';
import { colors } from '../theme/colors';

type Props = {
  category: ImagineCategory;
  selected: boolean;
  onPress: (categoryId: string) => void;
};

function CategoryCardComponent({ category, selected, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <Pressable
        onPress={() => onPress(category.id)}
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[styles.shadowContainer, selected && styles.selectedShadow]}
      >
        <View style={[styles.card, selected && styles.selectedBorder]}>
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} />
          <View style={styles.topRow}>
            <Text style={styles.emoji}>{category.emoji}</Text>
            <Text style={styles.count}>100 futures</Text>
          </View>
          <Text numberOfLines={2} style={styles.title}>
            {category.title}
          </Text>
          <Text numberOfLines={3} style={styles.description}>
            {category.description}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export const CategoryCard = memo(CategoryCardComponent);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 6,
  },
  shadowContainer: {
    flex: 1,
    borderRadius: 18,
  },
  selectedShadow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  card: {
    flex: 1,
    minHeight: 164,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  selectedBorder: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(248,199,126,0.16)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 30,
  },
  count: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 16,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  description: {
    marginTop: 8,
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },
});
