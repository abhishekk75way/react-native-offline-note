import React, { useMemo, useRef } from 'react';
import { View, StyleSheet, ScrollView, I18nManager, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../theme/theme';

import { useTheme } from '../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../store';
import { setThemeMode, updateTheme, updateLanguage } from '../store/slices/settingsSlice';
import { ProfileMenuItem } from '../components/ProfileMenuItem';
import { LanguageSheet } from '../components/LanguageSheet';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
    const { theme, isDark } = useTheme();
    const styles = useMemo(() => getStyles(theme), [theme]);
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();
    const languageSheetRef = useRef<any>(null);

    const safeAlert = (title: string, message: string, buttons?: any[]) => {
        setTimeout(() => {
            Alert.alert(title, message, buttons);
        }, 300);
    };

    const LANGUAGES = [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'العربية' },
        { code: 'es', label: 'Español' },
    ];

    const currentLanguageLabel = LANGUAGES.find(l => l.code === i18n.language)?.label || 'English';

    const handleThemeChange = (value: boolean) => {
        dispatch(updateTheme(value ? 'dark' : 'light'));
    };

    const changeLanguage = async (langCode: string) => {
        i18n.changeLanguage(langCode);
        dispatch(updateLanguage(langCode));
        languageSheetRef.current?.close();

        const isRTL = langCode === 'ar';
        if (isRTL !== I18nManager.isRTL) {
            I18nManager.allowRTL(isRTL);
            I18nManager.forceRTL(isRTL);
            safeAlert(
                t('restartRequired'),
                "This change requires an app restart.",
                [
                    {
                        text: "Restart Now",
                        onPress: async () => {
                            try {
                                await Updates.reloadAsync();
                            } catch {
                                safeAlert("Please restart the app manually.", "");
                            }
                        }
                    },
                    { text: "Later", style: "cancel" }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.menuContainer}>
                    <ProfileMenuItem
                        icon="moon-outline"
                        label={t('darkMode')}
                        isSwitch
                        switchValue={isDark}
                        onSwitchChange={handleThemeChange}
                    />
                    <View style={styles.divider} />
                    <ProfileMenuItem
                        icon="language-outline"
                        label={t('language')}
                        value={currentLanguageLabel}
                        onPress={() => languageSheetRef.current?.open()}
                    />
                </View>

                <LanguageSheet
                    ref={languageSheetRef}
                    languages={LANGUAGES}
                    currentLanguage={i18n.language}
                    onLanguageChange={changeLanguage}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing.md,
    },
    menuContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.small,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginLeft: 68,
    },
});
