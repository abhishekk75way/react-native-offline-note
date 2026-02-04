import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { MainNavigator } from './MainNavigator';
import { useAppSelector } from '../store';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);
  const isOnboarded = useAppSelector((state) => state.user.isOnboarded);

  const handleSplashFinish = (profileExists: boolean) => {
    setHasProfile(profileExists);
    setIsLoading(false);
  };

  const handleProfileSetupComplete = () => {
    setHasProfile(true);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasProfile && !isOnboarded ? (
          <Stack.Screen name="ProfileSetup">
            {(props) => (
              <ProfileSetupScreen
                {...props}
                onComplete={handleProfileSetupComplete}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
