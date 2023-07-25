# PlateFull - Children's Nutrition App

A React Native app built with Expo Router for tracking children's nutrition and making healthy eating fun through gamification.

## Features

- **Child-focused nutrition tracking**
- **Food identification and logging**
- **Educational content about nutrition**
- **Gamification with badges and rewards**
- **Parent dashboard and insights**

## Tab Bar Visibility Control

This app includes flexible tab bar visibility control for different screens:

### 1. **Props-based Control**
```tsx
// In any parent component
<TabLayout hideTabBar={true} />
```

### 2. **Route-based Auto-hiding**
The tab bar automatically hides on specific pages defined in `utils/tabBarUtils.ts`:
- Authentication screens (`/auth/*`)
- Setup screens (`/profile/setup`)
- Logging screens (`/meals/logging`)
- Food selection screens (`/food/selection`)

### 3. **Screen-level Control**
For individual screens that need specific tab bar behavior:

```tsx
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const MyScreen = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Hide tab bar when screen is focused
      navigation.setOptions({
        tabBarStyle: { display: 'none' }
      });

      // Restore tab bar when screen loses focus (optional)
      return () => {
        navigation.setOptions({
          tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 }
        });
      };
    }, [navigation])
  );

  // Your component code...
};
```

### 4. **Utility Functions**
```tsx
import { useTabBarVisibility, getTabBarStyle } from './utils/tabBarUtils';

// Check if current route should hide tab bar
const { shouldHideTabBar, pathname } = useTabBarVisibility();

// Get appropriate tab bar style
const tabBarStyle = getTabBarStyle(shouldHideTabBar);
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your device:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app

## Project Structure

```
plateful/
├── app/
│   ├── (tabs)/          # Tab navigation screens
│   ├── auth/            # Authentication screens
│   ├── meals/           # Meal tracking screens
│   ├── profile/         # Profile and setup screens
│   └── gamification/    # Badges, quests, leaderboard
├── components/
│   ├── common/          # Reusable UI components
│   └── ui/              # Platform-specific components
├── constants/           # App constants and configuration
├── utils/               # Helper functions and services
└── assets/              # Images, fonts, and static assets
```

## Development Notes

- All critical TypeScript compilation errors have been resolved
- ESLint configuration is set up for code quality
- Tab bar visibility is automatically managed based on routes
- Custom styling supports both iOS and Android platforms

## License

This project is licensed under the MIT License.
