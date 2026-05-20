import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Search size={18} color={colors.mutedText} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        selectionColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  icon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    height: '100%',
  },
});
