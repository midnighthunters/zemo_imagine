import React from 'react';
import { StyleSheet, Pressable, PressableProps, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { useImagineStore } from '../../store/useImagineStore';

interface IconButtonProps extends PressableProps {
  children: React.ReactNode;
  size?: number;
  variant?: 'glass' | 'primary' | 'ghost' | 'secondary';
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  size = 44,
  variant = 'glass',
  style,
  onPress,
  ...props
}) => {
  const hapticsEnabled = useImagineStore((state) => state.hapticsEnabled);

  const handlePress = (event: any) => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(event);
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'ghost':
        return 'transparent';
      case 'glass':
      default:
        return colors.glassStrong;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBackgroundColor(),
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      {...props}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
