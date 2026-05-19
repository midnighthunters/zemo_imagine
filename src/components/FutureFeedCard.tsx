import { memo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Heart, Play, Share2, Shuffle, Volume2 } from 'lucide-react-native';

import { ImagineCategory, ImagineScrollItem } from '../data/types';
import { colors, groupGradients } from '../theme/colors';

type Props = {
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
};

function FutureFeedCardComponent({
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
}: Props) {
  const { height } = useWindowDimensions();
  const gradient = groupGradients[category?.group ?? 'Travel'] ?? ['#0A0F1F', '#1F2937', '#334155'];

  return (
    <LinearGradient colors={gradient} style={[styles.card, { height }]}>
      <View style={styles.glow} />
      <View style={styles.topBar}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {category?.emoji ?? '✨'} {category?.title ?? 'Mixed Future'}
          </Text>
        </View>
        <Text style={styles.progress}>{index + 1} / {total}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
        {!!item.rewardHint && <Text style={styles.reward}>Unlock hint: {item.rewardHint}</Text>}
      </View>

      <View style={styles.rail}>
        <Action active={liked} label="Like" onPress={onLike}>
          <Heart color={liked ? colors.rose : colors.text} fill={liked ? colors.rose : 'transparent'} size={24} />
        </Action>
        <Action active={saved} label="Save" onPress={onSave}>
          <Bookmark color={saved ? colors.primary : colors.text} fill={saved ? colors.primary : 'transparent'} size={24} />
        </Action>
        <Action label="Replay" onPress={onReplay}>
          <Play color={colors.text} size={24} />
        </Action>
        <Action active={muted} label="Voice" onPress={onToggleMute}>
          <Volume2 color={muted ? colors.mutedText : colors.text} size={24} />
        </Action>
        <Action label="Share" onPress={onShare}>
          <Share2 color={colors.text} size={24} />
        </Action>
      </View>

      <Pressable onPress={onChangeCategory} style={({ pressed }) => [styles.change, pressed && styles.pressed]}>
        <Shuffle color={colors.text} size={18} />
        <Text style={styles.changeText}>Change Future</Text>
      </Pressable>
    </LinearGradient>
  );
}

function Action({ children, label, active, onPress }: { children: React.ReactNode; label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.action, active && styles.actionActive, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

export const FutureFeedCard = memo(FutureFeedCardComponent);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingHorizontal: 22,
    paddingTop: 62,
    paddingBottom: 34,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.10)',
    right: -80,
    top: 80,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    maxWidth: '72%',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  pillText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  progress: {
    color: colors.text,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 70,
  },
  title: {
    color: colors.text,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
  },
  text: {
    marginTop: 22,
    color: 'rgba(255,255,255,0.90)',
    fontSize: 18,
    lineHeight: 29,
    fontWeight: '500',
  },
  reward: {
    marginTop: 24,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  rail: {
    position: 'absolute',
    right: 18,
    bottom: 116,
    gap: 14,
  },
  action: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5,10,20,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  actionActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  change: {
    position: 'absolute',
    left: 22,
    bottom: 34,
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 18,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  changeText: {
    color: colors.text,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
