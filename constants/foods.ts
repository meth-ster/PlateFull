// Food categories and data
export const FOOD_CATEGORIES = {
  FRUITS: 'fruits',
  VEGETABLES: 'vegetables',
  GRAINS: 'grains',
  PROTEINS: 'proteins',
  DAIRY: 'dairy',
  SNACKS: 'snacks',
  BEVERAGES: 'beverages',
};

// FIXED: Added Food type interface
export interface Food {
  id: string | number;
  name: string;
  calories: number;
  color: string;
  category?: string;
}

export const FOODS_DATA = {
  [FOOD_CATEGORIES.FRUITS]: [
    { id: 1, name: 'Apple', calories: 52, color: '#FF6B6B' },
    { id: 2, name: 'Banana', calories: 89, color: '#FFE66D' },
    { id: 3, name: 'Orange', calories: 47, color: '#FF8E53' },
    { id: 4, name: 'Grapes', calories: 62, color: '#A8E6CF' },
    { id: 5, name: 'Strawberry', calories: 32, color: '#FF8A80' },
  ],
  [FOOD_CATEGORIES.VEGETABLES]: [
    { id: 6, name: 'Broccoli', calories: 34, color: '#4ECDC4' },
    { id: 7, name: 'Carrot', calories: 41, color: '#FF8E53' },
    { id: 8, name: 'Spinach', calories: 23, color: '#A8E6CF' },
    { id: 9, name: 'Tomato', calories: 18, color: '#FF6B6B' },
    { id: 10, name: 'Bell Pepper', calories: 31, color: '#FFE66D' },
  ],
  [FOOD_CATEGORIES.GRAINS]: [
    { id: 11, name: 'Rice', calories: 130, color: '#D4B5A0' },
    { id: 12, name: 'Bread', calories: 265, color: '#DEB887' },
    { id: 13, name: 'Pasta', calories: 131, color: '#F5DEB3' },
    { id: 14, name: 'Oats', calories: 389, color: '#E6D3A3' },
    { id: 15, name: 'Quinoa', calories: 120, color: '#C7B377' },
  ],
  [FOOD_CATEGORIES.PROTEINS]: [
    { id: 16, name: 'Chicken', calories: 165, color: '#FFA07A' },
    { id: 17, name: 'Fish', calories: 206, color: '#87CEEB' },
    { id: 18, name: 'Eggs', calories: 155, color: '#F0E68C' },
    { id: 19, name: 'Beans', calories: 127, color: '#8B4513' },
    { id: 20, name: 'Nuts', calories: 607, color: '#D2B48C' },
  ],
  [FOOD_CATEGORIES.DAIRY]: [
    { id: 21, name: 'Milk', calories: 42, color: '#F5F5F5' },
    { id: 22, name: 'Cheese', calories: 113, color: '#FFE4B5' },
    { id: 23, name: 'Yogurt', calories: 59, color: '#FFF8DC' },
    { id: 24, name: 'Butter', calories: 717, color: '#FFFFE0' },
  ],
};

// FIXED: Added foods export as expected by meals/logging.tsx
export const foods = FOODS_DATA;

export const getAllFoods = () => {
  return Object.values(FOODS_DATA).flat();
};

export const getFoodsByCategory = (category: string) => {
  return FOODS_DATA[category] || [];
};

export const getFoodById = (id: number) => {
  return getAllFoods().find(food => food.id === id);
};

// Re-export from db/foods for compatibility
export {
    FOODS_DB, getAllFoods as getAllFoodsFromDB, getFoodById as getFoodByIdFromDB,
    getFoodsByCategory as getFoodsByCategoryFromDB, type FoodItem
} from '../db/foods';
