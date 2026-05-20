import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sparkles, Compass, Sun, Bookmark, Settings } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import * as Haptics from 'expo-haptics';
import { useImagineStore } from '../../store/useImagineStore';

interface FloatingDockProps {
  activeTab: 'feed' | 'categories' | 'daily' | 'boards' | 'settings';
  onTabPress: (tab: 'feed' | 'categories' | 'daily' | 'boards' | 'settings') => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();
  const hapticsEnabled = useImagineStore((state) => state.hapticsEnabled);

  const tabs = [
    { id: 'feed', icon: Sparkles, label: 'Feed' },
    { id: 'categories', icon: Compass, label: 'Explore' },
    { id: 'daily', icon: Sun, label: 'Daily' },
    { id: 'boards', icon: Bookmark, label: 'Boards' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  const handlePress = (tabId: typeof activeTab) => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }
    onTabPress(tabId);
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + spacing.md }]}>
      <View style={styles.dock}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <Pressable
              key={tab.id}
              onPress={() => handlePress(tab.id)}
              style={styles.tab}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <Icon
                  size={20}
                  color={isActive ? colors.primary : colors.mutedText}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && <View style={styles.glow} />}
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
  },
  dock: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(248, 199, 126, 0.1)',
  },
  glow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    opacity: 0.2,
    zIndex: -1,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.mutedText,
  },
  activeLabel: {
    color: colors.primary,
  },
});
