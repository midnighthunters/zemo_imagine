import { useCallback, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

import { colors } from '../theme/colors';
import { ImagineButton } from './ImagineButton';

const slides = [
  ['Dreamscroll, don’t doomscroll', 'Scroll through futures that excite you.'],
  ['Travel the world in your mind', 'Explore cities, beaches, fantasy worlds, stadiums, and dream destinations.'],
  ['Visualise wealth and success', 'See luxury, business, career, and rich lifestyle futures.'],
  ['Build your personal future board', 'Save the futures you love and build your dream life map.'],
  ['Listen while you scroll', 'Every card can speak using TTS.'],
  ['Unlock stickers and rewards', 'Earn badges, stamps, dream keys, and collectibles.'],
] as const;

type Props = {
  onDone: () => void;
  onSkip: () => void;
};

export function OnboardingCarousel({ onDone, onSkip }: Props) {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const [index, setIndex] = useState(0);

  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width));
  }, []);

  const continueFlow = () => {
    if (index === slides.length - 1) {
      onDone();
      return;
    }

    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <LinearGradient colors={['#0A0F1F', '#172554', '#7C2D12']} style={styles.screen}>
      <Pressable onPress={onSkip} style={styles.skip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(slide) => slide[0]}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item, index: slideIndex }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.orbit}>
              <Text style={styles.orbitText}>{slideIndex + 1}</Text>
            </View>
            <Text style={styles.title}>{item[0]}</Text>
            <Text style={styles.body}>{item[1]}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((slide, dotIndex) => (
            <View key={slide[0]} style={[styles.dot, dotIndex === index && styles.dotActive]} />
          ))}
        </View>
        <ImagineButton
          label={index === slides.length - 1 ? 'Choose categories' : 'Continue'}
          onPress={continueFlow}
          icon={<ArrowRight color="#111827" size={19} />}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  skip: {
    position: 'absolute',
    top: 58,
    right: 22,
    zIndex: 5,
    padding: 10,
  },
  skipText: {
    color: colors.text,
    fontWeight: '800',
  },
  slide: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'center',
  },
  orbit: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    marginBottom: 34,
  },
  orbitText: {
    color: colors.primary,
    fontSize: 48,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900',
  },
  body: {
    marginTop: 18,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 42,
    gap: 22,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.primary,
  },
});
