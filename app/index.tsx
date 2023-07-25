import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { safeGetItem } from '../utils/storage';

// Singleton to prevent multiple initializations
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasNavigated = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    // Cleanup function to track if component is still mounted
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializing && initializationPromise) {
        try {
          await initializationPromise;
        } catch (err) {
          console.error('Index: Waiting for initialization failed:', err);
        }
        return;
      }

      if (hasNavigated.current || !mounted.current) {
        return;
      }

      isInitializing = true;
      
      initializationPromise = (async () => {
        try {
          console.log('Index: Starting app initialization for platform:', Platform.OS);
          
          // Add a small delay to ensure everything is stable
          await new Promise(resolve => setTimeout(resolve, Platform.OS === 'web' ? 300 : 150));
          
          if (!mounted.current || hasNavigated.current) {
            return;
          }

          // Check authentication state with web-compatible storage and timeout
          const checkAuthWithTimeout = async (): Promise<[string | null, string | null]> => {
            const timeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Storage timeout')), Platform.OS === 'web' ? 5000 : 3000)
            );
            
            const authPromise = Promise.all([
              safeGetItem('userToken'),
              safeGetItem('onboardingComplete')
            ]);
            
            return Promise.race([authPromise, timeoutPromise]) as Promise<[string | null, string | null]>;
          };

          const [userToken, onboardingComplete] = await checkAuthWithTimeout();
          
          console.log('Index: Auth state check - userToken:', !!userToken, 'onboardingComplete:', onboardingComplete);
          
          if (!mounted.current || hasNavigated.current) {
            return;
          }

          // Mark as navigated before actual navigation
          hasNavigated.current = true;
          
          // Navigate based on state with error handling
          if (userToken) {
            console.log('Index: User authenticated, navigating to tabs');
            router.replace('/(tabs)');
          } else if (onboardingComplete === 'true') {
            console.log('Index: Onboarding complete, navigating to sign-in');
            router.replace('/auth/sign-in');
          } else {
            console.log('Index: First time user, showing splash');
            router.replace('/splash');
          }
        } catch (error: any) {
          console.error('Index: Initialization error:', error);
          
          if (!mounted.current || hasNavigated.current) {
            return;
          }

          // Set error state but still try to navigate as fallback
          if (mounted.current) {
            setError(error?.message || 'Initialization failed');
          }
          
          // Web-specific fallback handling
          if (Platform.OS === 'web') {
            // On web, go directly to onboarding if there's an error
            setTimeout(() => {
              if (mounted.current && !hasNavigated.current) {
                hasNavigated.current = true;
                console.log('Index: Web error fallback - navigating to onboarding');
                router.replace('/auth/onboarding');
              }
            }, 1000);
          } else {
            // On mobile, go to splash
            setTimeout(() => {
              if (mounted.current && !hasNavigated.current) {
                hasNavigated.current = true;
                console.log('Index: Mobile error fallback - navigating to splash');
                router.replace('/splash');
              }
            }, 1000);
          }
        } finally {
          if (mounted.current) {
            setIsLoading(false);
          }
          isInitializing = false;
          initializationPromise = null;
        }
      })();

      await initializationPromise;
    };

    // Add timeout to prevent infinite loading - longer for web
    const timeoutDuration = Platform.OS === 'web' ? 10000 : 8000;
    const timeoutId = setTimeout(() => {
      if (mounted.current && !hasNavigated.current && isLoading) {
        console.log('Index: Timeout reached, forcing navigation');
        hasNavigated.current = true;
        setError('Loading timeout - redirecting...');
        
        // Platform-specific fallback
        if (Platform.OS === 'web') {
          router.replace('/auth/onboarding');
        } else {
          router.replace('/splash');
        }
      }
    }, timeoutDuration);

    initializeApp();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Show loading indicator while initializing
  if (isLoading && !hasNavigated.current) {
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
          {error ? 'Recovering...' : `Initializing ${Platform.OS}...`}
        </Text>
        {error && (
          <Text style={{ 
            marginTop: 8, 
            color: colors.error, 
            fontSize: 12,
            textAlign: 'center',
            maxWidth: 250
          }}>
            {error}
          </Text>
        )}
        {Platform.OS === 'web' && (
          <Text style={{ 
            marginTop: 8, 
            color: colors.text.secondary, 
            fontSize: 11,
            textAlign: 'center',
            maxWidth: 300
          }}>
            Web version may take a moment to load...
          </Text>
        )}
      </View>
    );
  }

  // Return null once navigation has occurred
  return null;
} 