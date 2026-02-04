import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { ProfileMenuItemProps } from '../types';
import { Theme } from '../theme/theme';

export const ProfileMenuItem = ({ icon, label, onPress, isSwitch, switchValue, onSwitchChange, color, value, showChevron = true }: ProfileMenuItemProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <TouchableOpacity style={styles.menuItem} onPress={isSwitch ? undefined : onPress} disabled={isSwitch} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name={icon as any} size={22} color={color || theme.colors.primary} />
      </View>
      <Text style={[styles.menuText, { color: color || theme.colors.text }]}>{label}</Text>
      {value && <Text style={[styles.valueText, { color: theme.colors.textSecondary }]}>{value}</Text>}
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.surface}
          ios_backgroundColor={theme.colors.border}
        />
      ) : (
        showChevron && <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuText: {
    flex: 1,
    ...theme.typography.body,
    fontWeight: '500',
  },
  valueText: {
    ...theme.typography.caption,
    marginRight: theme.spacing.sm,
  },
});
