import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { StickerCard } from './StickerCard';
import { rewardCatalog } from '../data/rewards';
import { useImagineStore } from '../store/useImagineStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const RewardCabinet: React.FC = () => {
  const earnedRewards = useImagineStore((state) => state.earnedRewards);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy size={20} color={colors.primary} />
        <Text style={styles.title}>Your Collection</Text>
        <Text style={styles.count}>
          {earnedRewards.length}/{rewardCatalog.length}
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {rewardCatalog.map((reward) => (
          <StickerCard
            key={reward.id}
            name={reward.title}
            emoji={reward.emoji}
            unlocked={earnedRewards.includes(reward.id)}
            category={reward.group}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: 8,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: typography.weights.bold as any,
    color: colors.text,
    flex: 1,
  },
  count: {
    fontSize: typography.bodySmall,
    color: colors.mutedText,
    fontWeight: typography.weights.semibold as any,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
});
