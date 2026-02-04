export const theme = {
  colors: {
    primary: '#6C5CE7',
    primaryDark: '#5B4BC4',
    primaryLight: '#A29BFE',
    secondary: '#00B894',
    secondaryDark: '#00A383',
    
    background: '#0F0F1E',
    surface: '#1A1A2E',
    surfaceLight: '#252541',
    
    text: '#FFFFFF',
    textSecondary: '#B8B8D1',
    textMuted: '#6E6E8F',
    
    error: '#FF6B6B',
    success: '#51CF66',
    warning: '#FFD93D',
    
    border: '#2D2D44',
    borderLight: '#3A3A54',
    
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    gradient: {
      primary: ['#6C5CE7', '#A29BFE'] as const,
      secondary: ['#00B894', '#55EFC4'] as const,
      dark: ['#0F0F1E', '#1A1A2E'] as const,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
