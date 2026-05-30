import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import {
  Heart,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  RotateCcw,
  MoreVertical,
  ChevronUp,
} from 'lucide-react-native';
import { colors, groupGradients } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { ImagineScrollItem, ImagineCategory } from '../data/types';
import { GlassCard } from './ui/GlassCard';
import { IconButton } from './ui/IconButton';
import { Pill } from './ui/Pill';

interface FutureFeedCardProps {
  item: ImagineScrollItem;
  category?: ImagineCategory;
  index: number;
  total: number;
  muted: boolean;
  saved: boolean;
  liked: boolean;
  onLike: () => void;
  onSave: () => void;
  onReplay: () => void;
  onShare: () => void;
  onChangeCategory: () => void;
  onToggleMute: () => void;
}

export const FutureFeedCard: React.FC<FutureFeedCardProps> = ({
  item,
  category,
  index,
  total,
  muted,
  saved,
  liked,
  onLike,
  onSave,
  onReplay,
  onShare,
  onChangeCategory,
  onToggleMute,
}) => {
  const { width, height } = useWindowDimensions();
  const gradients = category ? (groupGradients[category.group] || groupGradients['Luxury']) : groupGradients['Luxury'];

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const heartScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withSpring(0, { damping: 15 });
  }, []);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleLike = () => {
    heartScale.value = withSequence(
      withTiming(1.5, { duration: 150 }),
      withSpring(1)
    );
    onLike();
  };

  const handleSave = () => {
    bookmarkScale.value = withSequence(
      withTiming(1.5, { duration: 150 }),
      withSpring(1)
    );
    onSave();
  };

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const animatedBookmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  return (
    <View style={[styles.container, { width, height }]}>
      <LinearGradient
        colors={[gradients[0], gradients[1]]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative Elements */}
      <View style={[styles.decoration, styles.decoration1, { backgroundColor: gradients[2] }] as any} />
      <View style={[styles.decoration, styles.decoration2, { backgroundColor: colors.primary }] as any} />

      <View style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.appLogo}>Imagine</Text>
            <View style={styles.divider} />
            {category && (
              <Pressable onPress={onChangeCategory}>
                <Pill
                  label={category.title}
                  variant="glass"
                  icon={<Text style={styles.categoryEmoji}>{category.emoji}</Text>}
                />
              </Pressable>
            )}
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${((index + 1) / total) * 100}%` } as any]} />
            </View>
            <Text style={styles.progressText}>{index + 1}/{total}</Text>
          </View>
        </View>

        {/* Main Content */}
        <Animated.View style={[styles.content, animatedContentStyle]}>
          <GlassCard style={styles.textCard} intensity="medium">
            <View style={styles.topRow}>
              {item.rewardHint && (
                <View style={styles.rewardHint}>
                    <Text style={styles.rewardHintText}>✨ {item.rewardHint} collectible</Text>
                </View>
              )}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.futureText}>{item.text}</Text>

            <View style={styles.bottomMeta}>
                {!muted && (
                    <View style={styles.narratingChip}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.narratingText}>Narrating Future...</Text>
                    </View>
                )}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Action Rail */}
        <View style={styles.actionRail}>
          <ActionButton
            onPress={handleLike}
            active={liked}
            activeColor={colors.accent}
            icon={Heart}
            label="Like"
            animatedStyle={animatedHeartStyle}
          />
          <ActionButton
            onPress={handleSave}
            active={saved}
            activeColor={colors.primary}
            icon={Bookmark}
            label="Save"
            animatedStyle={animatedBookmarkStyle}
          />
          <ActionButton
            onPress={onReplay}
            icon={RotateCcw}
            label="Replay"
          />
          <ActionButton
            onPress={onToggleMute}
            active={muted}
            icon={muted ? VolumeX : Volume2}
            label={muted ? "Unmute" : "Mute"}
          />
          <ActionButton
            onPress={onShare}
            icon={Share2}
            label="Share"
          />
          <ActionButton
            onPress={() => {}}
            icon={MoreVertical}
            label="More"
          />
        </View>

        {/* Bottom Navigation Hints */}
        <View style={styles.footer}>
           <Pressable style={styles.changeFutureBtn} onPress={onChangeCategory}>
               <Text style={styles.changeFutureText}>Change Future Vision</Text>
           </Pressable>
           <View style={styles.swipeHint}>
               <ChevronUp size={16} color="rgba(255,255,255,0.4)" />
               <Text style={styles.swipeText}>Swipe up for next future</Text>
           </View>
        </View>
      </View>
    </View>
  );
};

function ActionButton({ icon: Icon, label, onPress, active, activeColor, animatedStyle }: any) {
  return (
    <View style={styles.actionContainer}>
      <Animated.View style={animatedStyle}>
        <IconButton
          variant="glass"
          size={48}
          onPress={onPress}
          style={[styles.actionBtn, active && { borderColor: activeColor || colors.primary, backgroundColor: 'rgba(255,255,255,0.15)' }] as any}
        >
          <Icon
            size={24}
            color={active ? (activeColor || colors.primary) : colors.text}
            fill={active ? (activeColor || colors.primary) : 'none'}
            strokeWidth={2}
          />
        </IconButton>
      </Animated.View>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 110, // Avoid overlapping with FloatingDock
  },
  decoration: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.1,
  },
  decoration1: {
    top: -100,
    right: -100,
  },
  decoration2: {
    bottom: 100,
    left: -200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 60,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appLogo: {
    fontSize: 20,
    fontWeight: typography.weights.black as any,
    color: colors.text,
    letterSpacing: -1,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  categoryEmoji: {
    fontSize: 12,
  },
  progressContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  progressTrack: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 10,
    color: colors.mutedText,
    fontWeight: typography.weights.bold as any,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingRight: 80, // Space for action rail
  },
  textCard: {
    padding: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  topRow: {
      marginBottom: spacing.md,
  },
  rewardHint: {
      backgroundColor: 'rgba(248, 199, 126, 0.15)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.full,
      alignSelf: 'flex-start',
  },
  rewardHintText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: typography.weights.bold as any,
  },
  title: {
    fontSize: 36,
    fontWeight: typography.weights.black as any,
    color: colors.text,
    lineHeight: 42,
    marginBottom: spacing.md,
    letterSpacing: -1,
  },
  futureText: {
    fontSize: typography.subtitle,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 30,
    fontWeight: typography.weights.medium as any,
  },
  bottomMeta: {
      marginTop: spacing.xl,
  },
  narratingChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radius.full,
      alignSelf: 'flex-start',
  },
  pulseDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
  },
  narratingText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: typography.weights.semibold as any,
  },
  actionRail: {
    position: 'absolute',
    right: spacing.md,
    top: '30%',
    bottom: '20%',
    justifyContent: 'center',
    gap: spacing.lg,
    zIndex: 10,
  },
  actionContainer: {
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionLabel: {
    fontSize: 10,
    color: colors.text,
    fontWeight: typography.weights.bold as any,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      gap: spacing.md,
  },
  changeFutureBtn: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.15)',
  },
  changeFutureText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: typography.weights.bold as any,
  },
  swipeHint: {
      alignItems: 'center',
      gap: 4,
  },
  swipeText: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: 10,
      fontWeight: typography.weights.bold as any,
      textTransform: 'uppercase',
      letterSpacing: 1,
  },
});
