import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  FlatList,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  Sparkles,
  Compass,
  Mic2,
  Bookmark,
  Trophy,
  ArrowRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { motion } from '../theme/motion';
import { GlassCard } from './ui/GlassCard';
import { useImagineStore } from '../store/useImagineStore';

const SLIDES = [
  {
    title: 'Dreamscroll, don’t doomscroll',
    subtitle: 'Replace mindless scrolling with beautiful future-life scenarios designed to inspire.',
    icon: Sparkles,
    color: colors.primary,
  },
  {
    title: 'Choose the future that excites you',
    subtitle: 'From luxury travel to career peaks, select the categories that matter to your vision.',
    icon: Compass,
    color: colors.cyan,
  },
  {
    title: 'Listen like a guided movie',
    subtitle: 'Each future is narrated with high-quality voiceover for an immersive emotional experience.',
    icon: Mic2,
    color: colors.secondary,
  },
  {
    title: 'Save futures to your dream board',
    subtitle: 'Build a visual map of your future life by collecting scenarios that resonate.',
    icon: Bookmark,
    color: colors.rose,
  },
  {
    title: 'Earn stickers and daily drops',
    subtitle: 'Stay consistent and unlock unique rewards as you build your visualization habit.',
    icon: Trophy,
    color: colors.green,
  },
  {
    title: 'Start your future feed',
    subtitle: 'Your aspirational life is waiting. Ready to see what is possible?',
    icon: Sparkles,
    color: colors.primary,
    isFinal: true,
  },
];

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete }) => {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const hapticsEnabled = useImagineStore((state) => state.hapticsEnabled);

  const handleScroll = (event: any) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
      if (hapticsEnabled) {
        Haptics.selectionAsync();
      }
    }
  };

  const nextSlide = () => {
    if (activeIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      onComplete();
    }
  };

  const skip = () => {
    onComplete();
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} width={width} />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <Dot key={index} index={index} scrollX={scrollX} width={width} />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {activeIndex < SLIDES.length - 1 ? (
            <>
              <Pressable onPress={skip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
              <Pressable
                onPress={nextSlide}
                style={[styles.nextButton, { backgroundColor: SLIDES[activeIndex].color }]}
              >
                <ArrowRight color="#000" size={24} />
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={onComplete}
              style={[styles.finalButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.finalButtonText}>Choose my futures</Text>
              <ArrowRight color="#000" size={20} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

function Slide({ item, index, scrollX, width }: any) {
  const Icon = item.icon;

  const animatedIconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.6, 1, 0.6],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <GlassCard style={styles.iconGlass} intensity="high">
          <Icon size={80} color={item.color} strokeWidth={1.5} />
        </GlassCard>
        <View style={[styles.iconGlow, { backgroundColor: item.color }]} />
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
}

function Dot({ index, scrollX, width }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    const dotWidth = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [8, 24, 8],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    return {
      width: dotWidth,
      opacity,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  iconGlass: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.2,
    filter: 'blur(40px)',
  } as any,
  textContainer: {
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: typography.h1,
    fontWeight: typography.weights.black as any,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 40,
  },
  slideSubtitle: {
    fontSize: typography.subtitle,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  pagination: {
    flexDirection: 'row',
    height: 8,
    marginBottom: spacing.xl,
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  skipButton: {
    paddingHorizontal: spacing.md,
  },
  skipText: {
    color: colors.mutedText,
    fontSize: typography.body,
    fontWeight: typography.weights.semibold as any,
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalButton: {
    flex: 1,
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  finalButtonText: {
    color: '#000',
    fontSize: typography.h3,
    fontWeight: typography.weights.bold as any,
  },
});
