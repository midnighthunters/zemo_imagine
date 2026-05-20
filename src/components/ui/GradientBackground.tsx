import React from 'react';
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

interface GradientBackgroundProps {
  colors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors: gradientColors = [colors.background, colors.backgroundAlt],
  style,
  children,
}) => {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradientColors}
        style={[StyleSheet.absoluteFill, { width, height }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Decorative Orbs */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  orb1: {
    top: -100,
    right: -100,
    backgroundColor: colors.primary,
  },
  orb2: {
    bottom: -50,
    left: -100,
    backgroundColor: colors.secondary,
  },
});
