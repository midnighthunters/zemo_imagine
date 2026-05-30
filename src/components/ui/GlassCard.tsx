import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 'medium',
  ...props
}) => {
  const backgroundColor =
    intensity === 'low'
      ? 'rgba(255, 255, 255, 0.03)'
      : intensity === 'medium'
      ? colors.glass
      : colors.glassStrong;

  return (
    <View style={[styles.card, { backgroundColor }, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
});
