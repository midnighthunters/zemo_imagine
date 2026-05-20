import React from 'react';
import { StyleSheet, View, ViewProps, SafeAreaView, StatusBar, Platform } from 'react-native';
import { colors } from '../../theme/colors';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  withSafeArea?: boolean;
  backgroundColor?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  withSafeArea = true,
  backgroundColor = colors.background,
  ...props
}) => {
  const content = (
    <View style={[styles.container, { backgroundColor }, style]} {...props}>
      <StatusBar barStyle="light-content" />
      {children}
    </View>
  );

  if (withSafeArea) {
    return <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>{content}</SafeAreaView>;
  }

  return content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
