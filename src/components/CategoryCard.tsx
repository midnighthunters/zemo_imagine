import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, groupGradients } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ImagineCategory } from '../data/types';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from './ui/GlassCard';

interface CategoryCardProps {
  category: ImagineCategory;
  selected: boolean;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  selected,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const gradients = groupGradients[category.group] || groupGradients['Luxury'];

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <LinearGradient
          colors={[gradients[0], gradients[1]]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <GlassCard style={styles.glass} intensity={selected ? 'high' : 'medium'}>
          <View style={styles.header}>
            <Text style={styles.emoji}>{category.emoji}</Text>
            {selected && (
              <View style={styles.checkBadge}>
                <Check size={12} color="#000" strokeWidth={3} />
              </View>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.group}>{category.group}</Text>
            <Text style={styles.title} numberOfLines={2}>{category.title}</Text>
            <Text style={styles.count}>100+ futures</Text>
          </View>
        </GlassCard>

        {selected && <View style={[styles.selectionBorder, { borderColor: gradients[2] }]} />}
        {selected && <View style={[styles.glow, { backgroundColor: gradients[2] }]} />}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 0.85,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  glass: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 32,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 2,
  },
  group: {
    fontSize: 9,
    fontWeight: typography.weights.bold as any,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: typography.body,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
    lineHeight: 20,
  },
  count: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
  },
  selectionBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
    borderWidth: 2,
    pointerEvents: 'none',
  } as any,
  glow: {
    position: 'absolute',
    bottom: -20,
    left: '10%',
    right: '10%',
    height: 40,
    opacity: 0.3,
    filter: 'blur(20px)',
    pointerEvents: 'none',
  } as any,
});
