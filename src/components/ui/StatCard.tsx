import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, style }) => {
  return (
    <GlassCard style={[styles.card, style]} intensity="low">
      <View style={styles.header}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    flex: 1,
    minWidth: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: 6,
  },
  label: {
    fontSize: typography.tiny,
    fontWeight: typography.weights.bold as any,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: typography.h2,
    fontWeight: typography.weights.black as any,
    color: colors.text,
  },
});
