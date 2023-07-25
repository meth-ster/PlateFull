import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';

import ErrorBoundary from '@/components/ErrorBoundary';
import { colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontTimeout, setFontTimeout] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Set a timeout for font loading to prevent hanging
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('Font loading timeout reached');
      setFontTimeout(true);
    }, 2000); // Reduced to 2 seconds for faster recovery

    return () => clearTimeout(timeout);
  }, []);

  // Handle app readiness with better error recovery
  useEffect(() => {
    try {
      if (loaded || error || fontTimeout) {
        console.log('App ready - loaded:', loaded, 'error:', error, 'timeout:', fontTimeout);
        setAppReady(true);
        setInitError(null);
      }
    } catch (err: any) {
      console.error('RootLayout initialization error:', err);
      setInitError(err?.message || 'Unknown initialization error');
      setAppReady(true); // Still set ready to prevent infinite loading
    }
  }, [loaded, error, fontTimeout]);

  // Show loading screen while fonts are loading
  if (!appReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ 
          marginTop: 16, 
          color: colors.text.secondary,
          fontSize: 14,
          textAlign: 'center'
        }}>
          {error ? 'Loading with system fonts...' : 'Loading fonts...'}
        </Text>
      </View>
    );
  }

  // Show error state if initialization failed
  if (initError) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20
      }}>
        <Text style={{ 
          color: colors.error,
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 8,
          textAlign: 'center'
        }}>
          Initialization Error
        </Text>
        <Text style={{ 
          color: colors.text.secondary,
          fontSize: 14,
          textAlign: 'center'
        }}>
          {initError}
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            presentation: 'card',
            animationTypeForReplace: 'push',
            // Add better navigation recovery
            gestureEnabled: false // Prevent gesture conflicts
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="food" options={{ headerShown: false }} />
          <Stack.Screen name="meals" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="gamification" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="debug" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
