import { useImagineStore } from '../store/useImagineStore';

export const useOnboarding = () => {
  const hasHydrated = useImagineStore((state) => state.hasHydrated);
  const onboardingComplete = useImagineStore((state) => state.onboardingComplete);
  const completeOnboarding = useImagineStore((state) => state.completeOnboarding);
  const resetOnboarding = useImagineStore((state) => state.resetOnboarding);

  return { hasHydrated, onboardingComplete, completeOnboarding, resetOnboarding };
};
