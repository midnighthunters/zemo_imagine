import { router } from 'expo-router';

import { OnboardingCarousel } from '../src/components/OnboardingCarousel';

export default function OnboardingScreen() {
  return <OnboardingCarousel onDone={() => router.replace('/categories')} onSkip={() => router.replace('/categories')} />;
}
