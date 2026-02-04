import React, { useEffect } from 'react';
import { View, ActivityIndicator, I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { MainNavigator } from './MainNavigator';
import { useAppSelector, useAppDispatch } from '../store';
import { loadTheme, loadLanguage } from '../store/slices/settingsSlice';
import { getToken } from '../utils/storage';
import { useTheme } from '../hooks/useTheme';
import i18n from '../i18n';
import { StorageKeys } from '../constants/StorageKeys';

export const AppNavigator = () => {
    const dispatch = useAppDispatch();
    const [isRestoring, setIsRestoring] = React.useState(true);
    const { theme, isDark } = useTheme();

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken(StorageKeys.AUTH_TOKEN);
            if (token) {
                // Token logic removed to skip login
            }
            setIsRestoring(false);
        };

        // Load preferences
        console.log('Current RTL Status:', I18nManager.isRTL);
        dispatch(loadTheme()); 
        dispatch(loadLanguage()).then((action) => {
            if (loadLanguage.fulfilled.match(action) && action.payload) {
                i18n.changeLanguage(action.payload);
            }
        });

        checkToken();
    }, [dispatch]);

    if (isRestoring) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        )
    }

    const navigationTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
            primary: theme.colors.primary,
        }
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
            <MainNavigator />
        </NavigationContainer>
    );
};
