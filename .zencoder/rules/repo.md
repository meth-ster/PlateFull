---
description: Repository Information Overview
alwaysApply: true
---

# Plateful Information

## Summary
Plateful is a mobile application built with Expo and React Native. It's a food-related app with features for meal tracking, food selection, user profiles, and gamification elements. The app uses a file-based routing system provided by Expo Router.

## Structure
- **app/**: Main application code with file-based routing
  - **(tabs)/**: Tab-based navigation components
  - **auth/**: Authentication-related screens
  - **food/**: Food selection and reporting screens
  - **meals/**: Meal tracking and logging screens
  - **profile/**: User profile management screens
  - **gamification/**: Badges, leaderboards, and quests
- **assets/**: Static assets including images and fonts
- **components/**: Reusable UI components
- **constants/**: Application constants and configuration
- **hooks/**: Custom React hooks
- **utils/**: Utility functions and services
- **scripts/**: Helper scripts for development

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.8.3
**Framework**: React Native 0.79.5 with Expo 53.0.20
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- expo-router: 5.1.4 (File-based routing)
- react: 19.0.0
- react-native: 0.79.5
- expo-camera: 16.1.11
- react-native-reanimated: 3.17.4
- @react-native-async-storage/async-storage: 2.1.2
- expo-image-picker: 16.1.4

**Development Dependencies**:
- typescript: 5.8.3
- eslint: 9.25.0
- @babel/core: 7.25.2

## Build & Installation
```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Platform-specific commands
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
npm run web      # Run on web browser

# Development utilities
npm run lint     # Run ESLint
npm run type-check  # Check TypeScript types
npm run clean    # Clean and reinstall dependencies
```

## Main Entry Points
**Main Entry**: expo-router/entry (specified in package.json)
**App Entry**: app/index.tsx and app/_layout.tsx
**Tab Navigation**: app/(tabs)/_layout.tsx

## Application Features
- **Authentication**: Sign-in, sign-up, and verification flows
- **Food Management**: Food selection and reporting
- **Meal Tracking**: Logging and history of meals
- **User Profiles**: Profile setup and management
- **Gamification**: Badges, leaderboards, and quests
- **Camera Integration**: Using expo-camera for food photography

## Configuration
**Expo Config**: app.json defines app metadata, plugins, and platform-specific settings
**TypeScript Config**: tsconfig.json extends Expo's base configuration with strict type checking
**Navigation**: File-based routing with expo-router and tab-based navigation