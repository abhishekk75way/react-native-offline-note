import React, { useMemo, forwardRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../theme/theme';

type LanguageSheetProps = {
  languages: { code: string; label: string }[];
  currentLanguage: string;
  onLanguageChange: (code: string) => void;
};

export const LanguageSheet = forwardRef<any, LanguageSheetProps>(({ languages, currentLanguage, onLanguageChange }, ref) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => getStyles(theme), [theme]);

  // Render Item moved inside to access styles and theme
  const renderItem = ({ item }: { item: { code: string; label: string } }) => (
    <TouchableOpacity 
        style={styles.languageItem} 
        onPress={() => onLanguageChange(item.code)}
    >
        <Text style={[
            styles.languageText, 
            { fontWeight: currentLanguage === item.code ? 'bold' : 'normal', color: currentLanguage === item.code ? theme.colors.primary : theme.colors.text }
        ]}>
            {item.label}
        </Text>
        {currentLanguage === item.code && (
            <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
        )}
    </TouchableOpacity>
  );

  return (
    <RBSheet
        ref={ref}
        height={400}
        openDuration={250}
        customStyles={{
            container: {
                ...styles.sheetContainer,
                backgroundColor: theme.colors.surface
            }
        }}
    >
        <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{t('selectLanguage')}</Text>
        </View>
        <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
    </RBSheet>
  );
});

const getStyles = (theme: Theme) => StyleSheet.create({
  sheetContainer: {
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
  },
  sheetHeader: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      alignItems: 'center',
  },
  sheetTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
  },
  languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
  },
  languageText: {
      ...theme.typography.body,
  },
  divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginLeft: 24,
  },
});
