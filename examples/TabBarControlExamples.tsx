// This file contains examples of different ways to control tab bar visibility in your PlateFull app

import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { useTabBarVisibility } from '../utils/tabBarUtils';

// EXAMPLE 1: Screen that always hides the tab bar using useFocusEffect
export const AlwaysHideTabBarScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Hide tab bar when screen is focused
      navigation.setOptions({
        tabBarStyle: { display: 'none' }
      });

      // Optionally restore tab bar when screen loses focus
      return () => {
        navigation.setOptions({
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          }
        });
      };
    }, [navigation])
  );

  return (
    // Your screen content here
    <div>This screen hides the tab bar</div>
  );
};

// EXAMPLE 2: Screen that conditionally hides tab bar based on state
export const ConditionalHideTabBarScreen = () => {
  const navigation = useNavigation();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        tabBarStyle: isFullscreen ? { display: 'none' } : {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        }
      });
    }, [navigation, isFullscreen])
  );

  return (
    <div>
      <button onClick={() => setIsFullscreen(!isFullscreen)}>
        {isFullscreen ? 'Show' : 'Hide'} Tab Bar
      </button>
    </div>
  );
};

// EXAMPLE 3: Using the utility hook for automatic tab bar control
export const AutoHideBasedOnRouteScreen = () => {
  const { shouldHideTabBar, pathname } = useTabBarVisibility();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        tabBarStyle: shouldHideTabBar ? { display: 'none' } : {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        }
      });
    }, [navigation, shouldHideTabBar])
  );

  return (
    <div>
      <p>Current path: {pathname}</p>
      <p>Tab bar should be hidden: {shouldHideTabBar ? 'Yes' : 'No'}</p>
    </div>
  );
};

// EXAMPLE 4: Screen-specific options (set once, not dynamic)
export const StaticHideTabBarScreen = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' }
    });
  }, [navigation]);

  return (
    <div>This screen permanently hides the tab bar</div>
  );
};

// USAGE GUIDE:
/*
1. **For authentication screens, onboarding, etc.**
   - Use EXAMPLE 1 (AlwaysHideTabBarScreen)
   - These screens should never show the tab bar

2. **For screens with toggle functionality** 
   - Use EXAMPLE 2 (ConditionalHideTabBarScreen)
   - Like fullscreen image viewers, video players

3. **For automatic route-based hiding**
   - Use EXAMPLE 3 (AutoHideBasedOnRouteScreen)
   - Configure routes in utils/tabBarUtils.ts

4. **For simple permanent hiding**
   - Use EXAMPLE 4 (StaticHideTabBarScreen)
   - For screens that never need the tab bar

RECOMMENDED PAGES TO HIDE TAB BAR:
- /auth/* (sign-in, sign-up, otp, etc.)
- /splash
- /meals/logging
- /food/selection
- /food/report
- /profile/setup
- Any fullscreen modal screens
*/ 