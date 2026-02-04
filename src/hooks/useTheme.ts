import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../store';
import { lightColors, darkColors, commonTheme, Theme } from '../theme/theme';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppSelector((state) => state.settings.themeMode);

  const isDark =
    themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const activeTheme: Theme = useMemo(() => ({
    ...commonTheme,
    colors: isDark ? darkColors : lightColors,
  }), [isDark]); // Dependencies must be correct

  return { theme: activeTheme, isDark };
};
