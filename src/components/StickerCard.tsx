import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Lock } from 'lucide-react-native';
import { GlassCard } from './ui/GlassCard';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Pill } from './ui/Pill';

interface StickerCardProps {
  name: string;
  emoji: string;
  unlocked: boolean;
  category?: string;
  style?: ViewStyle;
}

export const StickerCard: React.FC<StickerCardProps> = ({
  name,
  emoji,
  unlocked,
  category,
  style,
}) => {
  return (
    <GlassCard
      style={[
        styles.card,
        unlocked && styles.unlockedCard,
        style,
      ]}
      intensity={unlocked ? 'high' : 'low'}
    >
      <View style={[styles.emojiContainer, !unlocked && styles.lockedEmoji]}>
        <Text style={styles.emoji}>{unlocked ? emoji : ''}</Text>
        {!unlocked && <Lock size={24} color={colors.mutedText} />}
      </View>
      <View style={styles.content}>
        {category && (
          <Pill
            label={category}
            style={styles.pill}
            textStyle={styles.pillText}
          />
        )}
        <Text
          style={[styles.name, !unlocked && styles.lockedText]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
      {unlocked && <View style={styles.glow} />}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 160,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  unlockedCard: {
    borderColor: colors.borderGold,
    backgroundColor: 'rgba(248, 199, 126, 0.05)',
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: spacing.sm,
  },
  lockedEmoji: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    alignItems: 'center',
  },
  pill: {
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pillText: {
    fontSize: 8,
  },
  name: {
    fontSize: typography.bodySmall,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
    textAlign: 'center',
  },
  lockedText: {
    color: colors.mutedText,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    opacity: 0.1,
  },
});
