import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
}) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
      bounciness: 2,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 2,
    }).start();
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.surface;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textSecondary;
    switch (variant) {
      case 'primary': return theme.colors.surface;
      case 'secondary': return theme.colors.text;
      case 'outline': return theme.colors.primary;
      case 'ghost': return theme.colors.textSecondary;
      default: return theme.colors.surface;
    }
  };

  const getBorder = () => {
    if (variant === 'secondary') return { borderWidth: 1, borderColor: theme.colors.border };
    if (variant === 'outline') return { borderWidth: 1, borderColor: theme.colors.border };
    return {};
  };

  const getSizeStyles = () => {
      switch(size) {
        case 'small': return { paddingVertical: 8, paddingHorizontal: 12 };
        case 'large': return { paddingVertical: 16, paddingHorizontal: 32 };
        default: return { paddingVertical: 12, paddingHorizontal: 20 };
      }
  };

  const getFontSize = () => {
      switch(size) {
          case 'small': return 13;
          case 'large': return 16;
          default: return 14; 
      }
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
            styles.container,
            getSizeStyles(),
            { backgroundColor: getBackgroundColor() },
            getBorder(),
            style,
        ]}
        >
        {loading ? (
            <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
            <>
                {leftIcon && leftIcon}
                <Text style={[
                    theme.typography.body, 
                    { 
                        color: getTextColor(), 
                        fontSize: getFontSize(),
                        marginLeft: leftIcon ? 8 : 0
                    }, 
                    textStyle
                ]}>
                {title}
                </Text>
            </>
        )}
        </Pressable>
    </Animated.View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
