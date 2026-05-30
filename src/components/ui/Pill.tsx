import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface PillProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'glass';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({
  label,
  variant = 'glass',
  style,
  textStyle,
  icon,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'glass':
      default:
        return colors.glassStrong;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#000';
      case 'secondary':
      case 'glass':
      default:
        return colors.text;
    }
  };

  return (
    <View style={[styles.pill, { backgroundColor: getBackgroundColor() }, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    fontSize: typography.tiny,
    fontWeight: typography.weights.bold as any,
    textTransform: 'uppercase',
  },
});
