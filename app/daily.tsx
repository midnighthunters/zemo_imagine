import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import {
  Sun,
  Flame,
  Calendar,
  Sparkles,
  ChevronRight,
  Bookmark,
  Play,
  CheckCircle2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Screen } from '../src/components/ui/Screen';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { SectionHeader } from '../src/components/ui/SectionHeader';
import { GlassCard } from '../src/components/ui/GlassCard';
import { FloatingDock } from '../src/components/ui/FloatingDock';
import { RewardCabinet } from '../src/components/RewardCabinet';
import { useImagineStore } from '../src/store/useImagineStore';
import { categoryById, categories } from '../src/data/categories';
import { getScrollItemsForCategory } from '../src/data/scrollItems/index';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { radius } from '../src/theme/radius';
import { useTTS } from '../src/hooks/useTTS';

export default function DailyScreen() {
  const [reflection, setReflection] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const activeCategoryId = useImagineStore((state) => state.activeCategoryId);
  const streakCount = useImagineStore((state) => state.streakCount);
  const dreamPoints = useImagineStore((state) => state.dreamPoints);
  const claimedDailyRewards = useImagineStore((state) => state.claimedDailyRewards);
  const claimDailyReward = useImagineStore((state) => state.claimDailyReward);
  const dailyReflections = useImagineStore((state) => state.dailyReflections);
  const setDailyReflection = useImagineStore((state) => state.setDailyReflection);
  const hapticsEnabled = useImagineStore((state) => state.hapticsEnabled);
  const savedFutureIds = useImagineStore((state) => state.savedFutureIds);
  const toggleSaveFuture = useImagineStore((state) => state.toggleSaveFuture);

  const { speak } = useTTS();
  const category = categoryById.get(activeCategoryId);
  const isClaimed = claimedDailyRewards.includes(today);

  const dailyFutures = useMemo(() => {
    return getScrollItemsForCategory(activeCategoryId).slice(0, 5);
  }, [activeCategoryId]);

  const handleClaim = () => {
    if (isClaimed) return;
    if (hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    claimDailyReward(today);
  };

  const handleSaveReflection = () => {
      if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDailyReflection(today, reflection);
  };

  const toggleSave = (id: string) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSaveFuture(id);
  };

  return (
    <Screen withSafeArea={true}>
      <GradientBackground>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <SectionHeader
            title="Daily Imagine"
            subtitle="Consistency builds the future"
            style={styles.header}
          />

          <GlassCard style={styles.heroCard} intensity="high">
            <View style={styles.heroHeader}>
                <View style={styles.dateTag}>
                    <Calendar size={12} color={colors.primary} />
                    <Text style={styles.dateText}>{dateStr}</Text>
                </View>
                <View style={styles.streakTag}>
                    <Flame size={14} color={colors.accent} />
                    <Text style={styles.streakText}>{streakCount} Day Streak</Text>
                </View>
            </View>
            <Text style={styles.heroTitle}>Today's Focus: {category?.title}</Text>
            <Text style={styles.heroQuote}>"The best way to predict the future is to create it."</Text>

            <Pressable
                onPress={handleClaim}
                style={[styles.claimButton, isClaimed && styles.claimedButton]}
            >
                {isClaimed ? <CheckCircle2 size={18} color="#000" /> : <Sparkles size={18} color="#000" />}
                <Text style={styles.claimButtonText}>
                    {isClaimed ? "Daily Reward Claimed" : "Claim Daily 50 Points"}
                </Text>
            </Pressable>
          </GlassCard>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Drops</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                {dailyFutures.map(item => (
                    <GlassCard key={item.id} style={styles.miniFutureCard}>
                        <Text style={styles.miniTitle} numberOfLines={2}>{item.title}</Text>
                        <View style={styles.miniActions}>
                            <Pressable onPress={() => speak(item)} style={styles.miniActionBtn}>
                                <Play size={14} color={colors.primary} fill={colors.primary} />
                            </Pressable>
                            <Pressable onPress={() => toggleSave(item.id)} style={styles.miniActionBtn}>
                                <Bookmark
                                    size={14}
                                    color={savedFutureIds.includes(item.id) ? colors.primary : colors.text}
                                    fill={savedFutureIds.includes(item.id) ? colors.primary : 'none'}
                                />
                            </Pressable>
                        </View>
                    </GlassCard>
                ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Reflection</Text>
            <GlassCard style={styles.reflectionCard}>
                <TextInput
                    style={styles.reflectionInput}
                    placeholder="The future I want today feels like..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    multiline
                    value={reflection || dailyReflections[today] || ''}
                    onChangeText={setReflection}
                    onBlur={handleSaveReflection}
                />
            </GlassCard>
          </View>

          <RewardCabinet />

          <View style={styles.pointsCard}>
             <Text style={styles.pointsLabel}>Dream Points Balance</Text>
             <Text style={styles.pointsValue}>{dreamPoints.toLocaleString()}</Text>
          </View>

          <Pressable style={styles.feedCta} onPress={() => router.push('/feed')}>
              <Text style={styles.feedCtaText}>Open Today's Feed</Text>
              <ChevronRight size={20} color="#000" />
          </Pressable>

        </ScrollView>

        <FloatingDock
          activeTab="daily"
          onTabPress={(tab) => {
            if (tab === 'daily') return;
            router.push(`/${tab}` as any);
          }}
        />
      </GradientBackground>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingTop: spacing.md,
  },
  heroCard: {
      marginHorizontal: spacing.md,
      padding: spacing.xl,
      borderColor: 'rgba(248, 199, 126, 0.3)',
      backgroundColor: 'rgba(248, 199, 126, 0.05)',
      marginBottom: spacing.xl,
  },
  heroHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
  },
  dateTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.full,
  },
  dateText: {
      fontSize: 10,
      color: colors.text,
      fontWeight: typography.weights.bold as any,
  },
  streakTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(251, 113, 133, 0.1)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.full,
  },
  streakText: {
      fontSize: 10,
      color: colors.rose,
      fontWeight: typography.weights.bold as any,
  },
  heroTitle: {
      fontSize: 24,
      fontWeight: typography.weights.black as any,
      color: colors.text,
      marginBottom: spacing.sm,
  },
  heroQuote: {
      fontSize: 15,
      color: colors.mutedText,
      fontStyle: 'italic',
      lineHeight: 22,
      marginBottom: spacing.xl,
  },
  claimButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: radius.lg,
      gap: 10,
  },
  claimedButton: {
      backgroundColor: colors.success,
      opacity: 0.8,
  },
  claimButtonText: {
      color: '#000',
      fontWeight: typography.weights.bold as any,
      fontSize: 15,
  },
  section: {
      marginBottom: spacing.xl,
  },
  sectionTitle: {
      fontSize: typography.h3,
      fontWeight: typography.weights.bold as any,
      color: colors.text,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
  },
  horizontalScroll: {
      paddingHorizontal: spacing.md,
      gap: spacing.md,
  },
  miniFutureCard: {
      width: 160,
      height: 120,
      padding: spacing.md,
      justifyContent: 'space-between',
  },
  miniTitle: {
      fontSize: 14,
      fontWeight: typography.weights.bold as any,
      color: colors.text,
  },
  miniActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
  },
  miniActionBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  reflectionCard: {
      marginHorizontal: spacing.md,
      padding: spacing.md,
      minHeight: 100,
  },
  reflectionInput: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
  },
  pointsCard: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
  },
  pointsLabel: {
      fontSize: 12,
      color: colors.mutedText,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
  },
  pointsValue: {
      fontSize: 40,
      fontWeight: typography.weights.black as any,
      color: colors.text,
  },
  feedCta: {
      marginHorizontal: spacing.md,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: radius.full,
      gap: 10,
      marginBottom: spacing.xl,
  },
  feedCtaText: {
      color: '#000',
      fontSize: 16,
      fontWeight: typography.weights.bold as any,
  }
});
