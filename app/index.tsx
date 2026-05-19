import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';

export default function SplashScreen() {
  const hasHydrated = useImagineStore((state) => state.hasHydrated);
  const onboardingComplete = useImagineStore((state) => state.onboardingComplete);
  const selectedCategoryIds = useImagineStore((state) => state.selectedCategoryIds);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);
  const loadOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    translateY.value = withTiming(0, { duration: 800 });
    loadOpacity.value = withTiming(0.85, { duration: 1200 });
  }, [loadOpacity, opacity, translateY]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const timer = setTimeout(() => {
      if (!onboardingComplete) {
        router.replace('/onboarding');
      } else if (selectedCategoryIds.length === 0) {
        router.replace('/categories');
      } else {
        router.replace('/feed');
      }
    }, 1300);

    return () => clearTimeout(timer);
  }, [hasHydrated, onboardingComplete, selectedCategoryIds.length]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const particleStyle = useAnimatedStyle(() => ({
    opacity: loadOpacity.value,
  }));

  return (
    <LinearGradient colors={['#050816', '#111C3D', '#7C2D12']} style={styles.screen}>
      <View style={styles.particleOne} />
      <View style={styles.particleTwo} />
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.logo}>Imagine</Text>
        <Text style={styles.tagline}>Visualise your future</Text>
      </Animated.View>
      <Animated.View style={[styles.load, particleStyle]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    color: colors.text,
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 0,
  },
  tagline: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.76)',
    fontSize: 18,
    fontWeight: '700',
  },
  particleOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(248,199,126,0.16)',
    top: 110,
    right: -64,
  },
  particleTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(103,232,249,0.12)',
    bottom: 120,
    left: -48,
  },
  load: {
    position: 'absolute',
    bottom: 72,
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
