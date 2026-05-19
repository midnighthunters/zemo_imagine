import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  icon?: ReactNode;
  style?: ViewStyle;
};

export function ImagineButton({ label, onPress, disabled, loading, variant = 'primary', icon, style }: Props) {
  const content = (
    <>
      {loading ? <ActivityIndicator color={colors.text} /> : icon}
      <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel]}>{label}</Text>
    </>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.inner}>
        {variant === 'primary' ? (
          <LinearGradient colors={['#F8C77E', '#F97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
            {content}
          </LinearGradient>
        ) : (
          <View style={styles.ghostInner}>
             {content}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: 28,
    elevation: 5,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  inner: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    minHeight: 54,
    alignSelf: 'stretch',
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  ghost: {
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ghostInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.glass,
    paddingHorizontal: 18,
    borderRadius: 28,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  ghostLabel: {
    color: colors.text,
  },
});
