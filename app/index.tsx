import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Redirect } from 'expo-router';
import { Sparkles } from 'lucide-react-native';

import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { Pill } from '../src/components/ui/Pill';

export default function SplashScreen() {
  const hasHydrated = useImagineStore((state) => state.hasHydrated);
  const onboardingComplete = useImagineStore((state) => state.onboardingComplete);
  const selectedCategoryIds = useImagineStore((state) => state.selectedCategoryIds);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const logoTranslateY = useSharedValue(20);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (hasHydrated) {
      opacity.value = withTiming(1, { duration: 1000 });
      scale.value = withTiming(1, {
        duration: 1200,
        easing: Easing.out(Easing.back(1.5)),
      });
      logoTranslateY.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [hasHydrated]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: logoTranslateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const floatingChips = useMemo(() => [
    { label: 'Paris', top: '20%', left: '10%', delay: 400 },
    { label: 'First Million', top: '25%', right: '15%', delay: 700 },
    { label: 'Dream Job', bottom: '30%', left: '15%', delay: 900 },
    { label: 'Beach Villa', bottom: '25%', right: '10%', delay: 600 },
    { label: 'Founder Era', top: '15%', right: '40%', delay: 800 },
  ], []);

  if (!hasHydrated) return null;

  if (onboardingComplete) {
    if (selectedCategoryIds.length === 0) {
      return <Redirect href="/categories" />;
    }
    return <Redirect href="/feed" />;
  }

  return (
    <GradientBackground style={styles.container}>
      <View style={styles.chipsContainer}>
        {floatingChips.map((chip, index) => (
          <FloatingChip key={index} {...chip} />
        ))}
      </View>

      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logoGlow, glowStyle]} />
          <Sparkles size={64} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>Imagine</Text>
        <Text style={styles.subtitle}>Dreamscroll your future</Text>

        <View style={styles.loadingContainer}>
          <ShimmerBar />
        </View>
      </Animated.View>

      <RedirectHelper to="/onboarding" delay={3500} />
    </GradientBackground>
  );
}

function FloatingChip({ label, top, left, right, bottom, delay }: any) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 1000 }));
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.floatingChip, { top, left, right, bottom }, style]}>
      <Pill label={label} variant="glass" />
    </Animated.View>
  );
}

function ShimmerBar() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    width: (interpolate(progress.value, [0, 1], [0, 100], Extrapolate.CLAMP) + '%') as any,
  }));

  return (
    <View style={styles.shimmerTrack}>
      <Animated.View style={[styles.shimmerBar, style]} />
    </View>
  );
}

function RedirectHelper({ to, delay }: { to: any; delay: number }) {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShouldRedirect(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (shouldRedirect) return <Redirect href={to} />;
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    zIndex: -1,
  } as any,
  title: {
    fontSize: 56,
    fontWeight: typography.weights.black as any,
    color: colors.text,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: typography.subtitle,
    color: colors.mutedText,
    marginTop: spacing.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    marginTop: spacing.xxl,
    width: 200,
  },
  shimmerTrack: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  shimmerBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  chipsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingChip: {
    position: 'absolute',
  },
});
