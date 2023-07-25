// Food database with nutritional information
export interface FoodItem {
  id: number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  servingWeight: number; // in grams
  color: string;
}

export const FOODS_DB: FoodItem[] = [
  // Fruits
  {
    id: 1,
    name: 'Apple',
    category: 'fruits',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10,
    sodium: 1,
    servingSize: '1 medium',
    servingWeight: 182,
    color: '#FF6B6B',
  },
  {
    id: 2,
    name: 'Banana',
    category: 'fruits',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    sodium: 1,
    servingSize: '1 medium',
    servingWeight: 118,
    color: '#FFE66D',
  },
  {
    id: 3,
    name: 'Orange',
    category: 'fruits',
    calories: 47,
    protein: 0.9,
    carbs: 12,
    fat: 0.1,
    fiber: 2.4,
    sugar: 9,
    sodium: 0,
    servingSize: '1 medium',
    servingWeight: 154,
    color: '#FF8E53',
  },
  // Vegetables
  {
    id: 4,
    name: 'Broccoli',
    category: 'vegetables',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    sugar: 1.5,
    sodium: 33,
    servingSize: '1 cup chopped',
    servingWeight: 91,
    color: '#4ECDC4',
  },
  {
    id: 5,
    name: 'Carrot',
    category: 'vegetables',
    calories: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    fiber: 2.8,
    sugar: 4.7,
    sodium: 69,
    servingSize: '1 medium',
    servingWeight: 61,
    color: '#FF8E53',
  },
  // Grains
  {
    id: 6,
    name: 'Brown Rice',
    category: 'grains',
    calories: 112,
    protein: 2.3,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    servingSize: '1/2 cup cooked',
    servingWeight: 98,
    color: '#D4B5A0',
  },
  {
    id: 7,
    name: 'Quinoa',
    category: 'grains',
    calories: 111,
    protein: 4.1,
    carbs: 20,
    fat: 1.8,
    fiber: 2.5,
    sugar: 0.9,
    sodium: 7,
    servingSize: '1/2 cup cooked',
    servingWeight: 92,
    color: '#C7B377',
  },
  // Proteins
  {
    id: 8,
    name: 'Chicken Breast',
    category: 'proteins',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: '3.5 oz',
    servingWeight: 100,
    color: '#FFA07A',
  },
  {
    id: 9,
    name: 'Salmon',
    category: 'proteins',
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    servingSize: '3.5 oz',
    servingWeight: 100,
    color: '#87CEEB',
  },
  // Dairy
  {
    id: 10,
    name: 'Greek Yogurt',
    category: 'dairy',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    sugar: 3.6,
    sodium: 36,
    servingSize: '1/2 cup',
    servingWeight: 100,
    color: '#FFF8DC',
  },
];

// Database operations
export const getFoodById = (id: number): FoodItem | undefined => {
  return FOODS_DB.find(food => food.id === id);
};

export const getFoodsByCategory = (category: string): FoodItem[] => {
  return FOODS_DB.filter(food => food.category === category);
};

export const searchFoods = (query: string): FoodItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return FOODS_DB.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const getAllFoods = (): FoodItem[] => {
  return FOODS_DB;
};

export const getFoodCategories = (): string[] => {
  return [...new Set(FOODS_DB.map(food => food.category))];
}; 