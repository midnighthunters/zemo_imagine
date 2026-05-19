import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ImagineCategory } from '../data/types';
import { colors, groupGradients } from '../theme/colors';

type Props = {
  category: ImagineCategory;
  selected: boolean;
  onPress: (categoryId: string) => void;
};

function CategoryCardComponent({ category, selected, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const gradientColors = (selected && groupGradients[category.group]) || null;

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
        style={[styles.card, selected && styles.selected]}
      >
        {gradientColors && (
          <LinearGradient
            colors={
              [...gradientColors].reverse().map((c) => `${c}66`) as unknown as [string, string, ...string[]]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={styles.content}>
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
  card: {
    minHeight: 164,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  selected: {
    borderColor: 'rgba(248, 199, 126, 0.5)',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
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
