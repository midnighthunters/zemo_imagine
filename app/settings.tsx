import { StyleSheet, Text, View, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import {
  Settings,
  Volume2,
  Bell,
  Smartphone,
  Eye,
  Trash2,
  RefreshCw,
  Info,
  ChevronRight,
  Mic2,
  Activity,
  Palette,
  Check,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { Screen } from '../src/components/ui/Screen';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { SectionHeader } from '../src/components/ui/SectionHeader';
import { GlassCard } from '../src/components/ui/GlassCard';
import { FloatingDock } from '../src/components/ui/FloatingDock';
import { useImagineStore } from '../src/store/useImagineStore';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';
import { radius } from '../src/theme/radius';

export default function SettingsScreen() {
  const {
    muted,
    autoPlayTTS,
    ttsRate,
    ttsPitch,
    hapticsEnabled,
    reducedMotion,
    themeMode,
    dreamPoints,
    savedFutureIds,
    likedFutureIds,
    earnedRewards,
    setMuted,
    setAutoPlayTTS,
    setTtsRate,
    setTtsPitch,
    setHapticsEnabled,
    setReducedMotion,
    setThemeMode,
    clearSavedFutures,
    resetOnboarding,
  } = useImagineStore();

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will take you back to the start and clear your selected categories. Your saved futures will remain.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetOnboarding();
            router.replace('/');
          }
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your saved futures and rewards. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearSavedFutures();
            if (hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      ]
    );
  };

  return (
    <Screen withSafeArea={true}>
      <GradientBackground>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <SectionHeader
            title="Control Center"
            subtitle="Customise your Imagine experience"
            style={styles.header}
          />

          <GlassCard style={styles.profileCard}>
            <View style={styles.profileHeader}>
                <View style={styles.logoCircle}>
                    <Settings size={32} color={colors.primary} />
                </View>
                <View>
                    <Text style={styles.profileName}>Imagine Explorer</Text>
                    <Text style={styles.profileLevel}>Visualise your future</Text>
                </View>
            </View>
            <View style={styles.profileStats}>
                <StatItem label="Points" value={dreamPoints.toLocaleString()} />
                <StatItem label="Saved" value={savedFutureIds.length} />
                <StatItem label="Rewards" value={earnedRewards.length} />
            </View>
          </GlassCard>

          <SettingSection title="Voice Settings" icon={Mic2}>
            <SettingRow
                label="Auto-play Voice"
                description="Narrate futures automatically"
                value={autoPlayTTS}
                onValueChange={setAutoPlayTTS}
            />
            <SettingRow
                label="Mute Voice"
                value={muted}
                onValueChange={setMuted}
            />
            <View style={styles.stepperRow}>
                <Text style={styles.stepperLabel}>Voice Speed</Text>
                <View style={styles.stepper}>
                    <StepperButton icon="-" onPress={() => setTtsRate(Math.max(0.5, ttsRate - 0.1))} />
                    <Text style={styles.stepperValue}>{ttsRate.toFixed(1)}x</Text>
                    <StepperButton icon="+" onPress={() => setTtsRate(Math.min(2.0, ttsRate + 0.1))} />
                </View>
            </View>
          </SettingSection>

          <SettingSection title="Experience" icon={Palette}>
            <SettingRow
                label="Haptic Feedback"
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
            />
            <SettingRow
                label="Reduced Motion"
                value={reducedMotion}
                onValueChange={setReducedMotion}
            />
            <View style={styles.themeRow}>
                <Text style={styles.stepperLabel}>Theme Mode</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeOptions}>
                    <ThemeOption mode="premium" active={themeMode === 'premium'} onSelect={setThemeMode} />
                    <ThemeOption mode="cosmic" active={themeMode === 'cosmic'} onSelect={setThemeMode} />
                    <ThemeOption mode="gold" active={themeMode === 'gold'} onSelect={setThemeMode} />
                    <ThemeOption mode="calm" active={themeMode === 'calm'} onSelect={setThemeMode} />
                </ScrollView>
            </View>
          </SettingSection>

          <SettingSection title="Data & Privacy" icon={Trash2}>
             <ActionRow
                label="Manage Categories"
                onPress={() => router.push('/categories')}
                icon={Palette}
             />
             <ActionRow
                label="Reset Onboarding"
                onPress={handleResetOnboarding}
                icon={RefreshCw}
                color={colors.rose}
             />
             <ActionRow
                label="Clear All Saved Futures"
                onPress={handleClearData}
                icon={Trash2}
                color={colors.rose}
             />
          </SettingSection>

          <SettingSection title="About" icon={Info}>
              <View style={styles.aboutRow}>
                  <Text style={styles.aboutLabel}>Version</Text>
                  <Text style={styles.aboutValue}>1.0.0 (Luxury Redesign)</Text>
              </View>
              <Text style={styles.missionText}>
                  Imagine is dedicated to helping you visualize a more positive, ambitious, and fulfilling future. Dreamscroll with intention.
              </Text>
          </SettingSection>

        </ScrollView>

        <FloatingDock
          activeTab="settings"
          onTabPress={(tab) => {
            if (tab === 'settings') return;
            router.push(`/${tab}` as any);
          }}
        />
      </GradientBackground>
    </Screen>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function SettingSection({ title, icon: Icon, children }: any) {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Icon size={16} color={colors.primary} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <GlassCard style={styles.sectionCard}>
                {children}
            </GlassCard>
        </View>
    );
}

function SettingRow({ label, description, value, onValueChange }: any) {
    return (
        <View style={styles.row}>
            <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{label}</Text>
                {description && <Text style={styles.rowDescription}>{description}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#334155', true: colors.primary }}
                thumbColor={value ? '#fff' : '#94a3b8'}
            />
        </View>
    );
}

function ActionRow({ label, onPress, icon: Icon, color = colors.text }: any) {
    return (
        <Pressable onPress={onPress} style={styles.row}>
            <View style={styles.rowContent}>
                <Icon size={18} color={color} />
                <Text style={[styles.rowLabel, { color }]}>{label}</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
        </Pressable>
    );
}

function StepperButton({ icon, onPress }: any) {
    return (
        <Pressable onPress={onPress} style={styles.stepperBtn}>
            <Text style={styles.stepperBtnText}>{icon}</Text>
        </Pressable>
    );
}

function ThemeOption({ mode, active, onSelect }: any) {
    const bgColor = mode === 'premium' ? '#030712' : mode === 'cosmic' ? '#1e1b4b' : mode === 'gold' ? '#451a03' : '#064e3b';
    return (
        <Pressable onPress={() => onSelect(mode)} style={[styles.themeOption, { backgroundColor: bgColor }, active && styles.activeTheme]}>
            <Text style={[styles.themeText, { color: active ? colors.primary : '#fff' }]}>{mode}</Text>
            {active && <Check size={12} color={colors.primary} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    paddingTop: spacing.md,
  },
  profileCard: {
      marginHorizontal: spacing.md,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      backgroundColor: 'rgba(255,255,255,0.03)',
  },
  profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.xl,
  },
  logoCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(248, 199, 126, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(248, 199, 126, 0.2)',
  },
  profileName: {
      fontSize: 20,
      fontWeight: typography.weights.bold as any,
      color: colors.text,
  },
  profileLevel: {
      fontSize: 13,
      color: colors.mutedText,
  },
  profileStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.05)',
      paddingTop: spacing.lg,
  },
  statItem: {
      alignItems: 'center',
  },
  statValue: {
      fontSize: 18,
      fontWeight: typography.weights.bold as any,
      color: colors.text,
  },
  statLabel: {
      fontSize: 10,
      color: colors.mutedText,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: 2,
  },
  section: {
      marginBottom: spacing.lg,
  },
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
  },
  sectionTitle: {
      fontSize: 12,
      fontWeight: typography.weights.bold as any,
      color: colors.mutedText,
      textTransform: 'uppercase',
      letterSpacing: 1,
  },
  sectionCard: {
      marginHorizontal: spacing.md,
      overflow: 'hidden',
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rowContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  rowText: {
      flex: 1,
  },
  rowLabel: {
      fontSize: 15,
      fontWeight: typography.weights.medium as any,
      color: colors.text,
  },
  rowDescription: {
      fontSize: 12,
      color: colors.mutedText,
      marginTop: 2,
  },
  stepperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
  },
  stepperLabel: {
      fontSize: 15,
      color: colors.text,
  },
  stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: radius.md,
      padding: 4,
      gap: 12,
  },
  stepperBtn: {
      width: 32,
      height: 32,
      borderRadius: radius.sm,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  stepperBtnText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: typography.weights.bold as any,
  },
  stepperValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: typography.weights.bold as any,
      minWidth: 30,
      textAlign: 'center',
  },
  themeRow: {
      padding: spacing.md,
  },
  themeOptions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: spacing.md,
  },
  themeOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  activeTheme: {
      borderColor: colors.primary,
  },
  themeText: {
      fontSize: 12,
      fontWeight: typography.weights.bold as any,
      textTransform: 'capitalize',
  },
  aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.md,
  },
  aboutLabel: {
      color: colors.mutedText,
      fontSize: 14,
  },
  aboutValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: typography.weights.semibold as any,
  },
  missionText: {
      padding: spacing.md,
      color: colors.mutedText,
      fontSize: 12,
      lineHeight: 18,
      fontStyle: 'italic',
  }
});
