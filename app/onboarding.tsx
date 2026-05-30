import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { OnboardingCarousel } from '../src/components/OnboardingCarousel';
import { useImagineStore } from '../src/store/useImagineStore';
import { Screen } from '../src/components/ui/Screen';
import { GradientBackground } from '../src/components/ui/GradientBackground';

export default function OnboardingScreen() {
  const completeOnboarding = useImagineStore((state) => state.completeOnboarding);

  const handleComplete = () => {
    completeOnboarding();
    router.replace('/categories');
  };

  return (
    <Screen withSafeArea={false}>
      <GradientBackground>
        <OnboardingCarousel onComplete={handleComplete} />
      </GradientBackground>
    </Screen>
  );
}
