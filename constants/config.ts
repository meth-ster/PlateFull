// App configuration constants
export const APP_CONFIG = {
  API_URL: 'https://api.plateful.com',
  APP_NAME: 'PlateFull',
  VERSION: '1.0.0',
  
  // User preferences
  DEFAULT_SERVING_SIZE: 1,
  MAX_DAILY_CALORIES: 2000,
  MIN_DAILY_CALORIES: 1200,
  
  // UI Constants
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  
  // Storage keys
  STORAGE_KEYS: {
    USER_DATA: '@plateful_user_data',
    PREFERENCES: '@plateful_preferences',
    MEAL_HISTORY: '@plateful_meal_history',
    AUTH_TOKEN: '@plateful_auth_token',
  },
  
  // Age ranges for setup
  AGE_RANGES: [
    { label: '13-17', value: '13-17' },
    { label: '18-24', value: '18-24' },
    { label: '25-34', value: '25-34' },
    { label: '35-44', value: '35-44' },
    { label: '45-54', value: '45-54' },
    { label: '55-64', value: '55-64' },
    { label: '65+', value: '65+' },
  ],
  
  // Activity levels
  ACTIVITY_LEVELS: [
    { label: 'Sedentary', value: 'sedentary', multiplier: 1.2 },
    { label: 'Lightly Active', value: 'light', multiplier: 1.375 },
    { label: 'Moderately Active', value: 'moderate', multiplier: 1.55 },
    { label: 'Very Active', value: 'active', multiplier: 1.725 },
    { label: 'Extra Active', value: 'extra', multiplier: 1.9 },
  ],
  
  // Goals
  GOALS: [
    { label: 'Lose Weight', value: 'lose', calorieAdjustment: -500 },
    { label: 'Maintain Weight', value: 'maintain', calorieAdjustment: 0 },
    { label: 'Gain Weight', value: 'gain', calorieAdjustment: 500 },
  ],
};

// 🔧 DEVELOPMENT CONFIGURATION
export const DEV_CONFIG = {
  // Set to override the default app flow
  FORCE_START_PAGE: null as string | null,
  
  // Quick page shortcuts for development
  PAGES: {
    HOME: '/(tabs)',
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up', 
    ONBOARDING: '/auth/onboarding',
    SPLASH: '/splash',
    DEBUG: '/debug/reset',
    PROFILE: '/(tabs)/profile',
    FOOD: '/(tabs)/food',
    GAMIFICATION: '/gamification',
    MEALS: '/(tabs)/meals',
  },
  
  // Skip AsyncStorage checks (for testing)
  SKIP_AUTH_CHECK: false,
  
  // Mock user authentication state
  MOCK_AUTH_STATE: {
    userToken: null,        // Set to 'mock-token' to simulate logged in user
    onboardingComplete: null, // Set to 'true' to simulate completed onboarding
  },
  
  // Enable development shortcuts
  ENABLE_DEV_SHORTCUTS: __DEV__,
}; 