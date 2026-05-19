import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImagineButton } from '../src/components/ImagineButton';
import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const muted = useImagineStore((state) => state.muted);
  const autoPlayTTS = useImagineStore((state) => state.autoPlayTTS);
  const ttsRate = useImagineStore((state) => state.ttsRate);
  const ttsPitch = useImagineStore((state) => state.ttsPitch);
  const setMuted = useImagineStore((state) => state.setMuted);
  const setAutoPlayTTS = useImagineStore((state) => state.setAutoPlayTTS);
  const setTtsRate = useImagineStore((state) => state.setTtsRate);
  const setTtsPitch = useImagineStore((state) => state.setTtsPitch);
  const resetOnboarding = useImagineStore((state) => state.resetOnboarding);
  const clearSavedFutures = useImagineStore((state) => state.clearSavedFutures);

  return (
    <LinearGradient colors={['#080D1C', '#111827', '#312E81']} style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(62, insets.top + 20), paddingBottom: Math.max(42, insets.bottom + 20) }]}>
        <Text style={styles.kicker}>Settings</Text>
        <Text style={styles.title}>Voice, saved futures, and flow</Text>

        <SettingRow title="Auto-play TTS" subtitle="Speak each card after scrolling settles.">
          <Switch value={autoPlayTTS} onValueChange={setAutoPlayTTS} />
        </SettingRow>
        <SettingRow title="Mute voice" subtitle="Keep cards silent until you replay them.">
          <Switch value={muted} onValueChange={setMuted} />
        </SettingRow>

        <Stepper
          title="Voice speed"
          value={ttsRate}
          onMinus={() => setTtsRate(Math.max(0.55, Number((ttsRate - 0.05).toFixed(2))))}
          onPlus={() => setTtsRate(Math.min(1.4, Number((ttsRate + 0.05).toFixed(2))))}
        />
        <Stepper
          title="Voice pitch"
          value={ttsPitch}
          onMinus={() => setTtsPitch(Math.max(0.7, Number((ttsPitch - 0.05).toFixed(2))))}
          onPlus={() => setTtsPitch(Math.min(1.4, Number((ttsPitch + 0.05).toFixed(2))))}
        />

        <ImagineButton label="Change selected categories" onPress={() => router.push('/categories')} variant="ghost" />
        <ImagineButton
          label="Reset onboarding"
          onPress={() => {
            resetOnboarding();
            router.replace('/onboarding');
          }}
          variant="ghost"
        />
        <ImagineButton label="Clear saved futures" onPress={clearSavedFutures} variant="ghost" />
        <ImagineButton label="Back to feed" onPress={() => router.replace('/feed')} />
      </ScrollView>
    </LinearGradient>
  );
}

function SettingRow({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

function Stepper({ title, value, onMinus, onPlus }: { title: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <View style={styles.row}>
      <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFillObject} />
      <View>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{value.toFixed(2)}</Text>
      </View>
      <View style={styles.stepper}>
        <Pressable onPress={onMinus} style={styles.stepButton}>
          <Text style={styles.stepText}>-</Text>
        </Pressable>
        <Pressable onPress={onPlus} style={styles.stepButton}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 14 },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.text, marginBottom: 8, fontSize: 34, lineHeight: 39, fontWeight: '900' },
  row: { minHeight: 82, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  rowText: { flex: 1, paddingRight: 16 },
  rowTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  rowSubtitle: { color: colors.mutedText, marginTop: 5, fontSize: 13, lineHeight: 18 },
  stepper: { flexDirection: 'row', gap: 8 },
  stepButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.13)' },
  stepText: { color: colors.text, fontSize: 24, fontWeight: '900' },
});
