
// Static map of known video assets keyed by the relative path values used in db/foods.json
// Metro requires static require paths; keep this list in sync with assets/videos/**
const videoSourceMap: Record<string, any> = {
  // Protein
  'assets/videos/Protein/chicken.mp4': require('../assets/videos/Protein/Chicken.mp4'),
  'assets/videos/Protein/pea.mp4': require('../assets/videos/Protein/Pea.mp4'),

  // Carbohydrate
  'assets/videos/Carbohydrate/Butternut.mp4': require('../assets/videos/Carbohydrate/Butternut.mp4'),
  'assets/videos/Carbohydrate/corn.mp4': require('../assets/videos/Carbohydrate/Corn.mp4'),
  'assets/videos/Carbohydrate/Sweetpotato.mp4': require('../assets/videos/Carbohydrate/Sweetpotato.mp4'),

  // Fruit
  'assets/videos/Fruit/Apple.mp4': require('../assets/videos/Fruit/apple.mp4'),
  'assets/videos/Fruit/Apricot.mp4': require('../assets/videos/Fruit/Apricot.mp4'),
  'assets/videos/Fruit/Banana.mp4': require('../assets/videos/Fruit/Banana.mp4'),
  'assets/videos/Fruit/Blackberry.mp4': require('../assets/videos/Fruit/Blackberry.mp4'),
  'assets/videos/Fruit/Blueberry.mp4': require('../assets/videos/Fruit/Blueberry.mp4'),
  'assets/videos/Fruit/Canta.mp4': require('../assets/videos/Fruit/Canta.mp4'),
  'assets/videos/Fruit/Cherries.mp4': require('../assets/videos/Fruit/Cherries.mp4'),
  'assets/videos/Fruit/Figs.mp4': require('../assets/videos/Fruit/Figs.mp4'),
  'assets/videos/Fruit/Grapefruit.mp4': require('../assets/videos/Fruit/Grapefruit.mp4'),
  'assets/videos/Fruit/Kiwi.mp4': require('../assets/videos/Fruit/Kiwi.mp4'),
  'assets/videos/Fruit/Lemon.mp4': require('../assets/videos/Fruit/Lemon.mp4'),
  'assets/videos/Fruit/Limes.mp4': require('../assets/videos/Fruit/Limes.mp4'),
  'assets/videos/Fruit/Mango.mp4': require('../assets/videos/Fruit/Mango.mp4'),
  'assets/videos/Fruit/Nectarine.mp4': require('../assets/videos/Fruit/Nectarine.mp4'),
  'assets/videos/Fruit/Orange.mp4': require('../assets/videos/Fruit/Oranges.mp4'),
  'assets/videos/Fruit/Papaya.mp4': require('../assets/videos/Fruit/Papaya.mp4'),
  'assets/videos/Fruit/Pear.mp4': require('../assets/videos/Fruit/Pear.mp4'),
  'assets/videos/Fruit/Plum.mp4': require('../assets/videos/Fruit/Plum.mp4'),
  'assets/videos/Fruit/Strawberry.mp4': require('../assets/videos/Fruit/Strawberry.mp4'),
  'assets/videos/Fruit/Tangerine.mp4': require('../assets/videos/Fruit/Tangerine.mp4'),
  'assets/videos/Fruit/Watermelon.mp4': require('../assets/videos/Fruit/Watermelon.mp4'),
  'assets/videos/Fruit/Coconut.mp4': require('../assets/videos/Fruit/Coconut.mp4'),

  // Vegetable
  'assets/videos/Vegetable/Asparagus.mp4': require('../assets/videos/Vegetable/Asparagus.mp4'),
  'assets/videos/Vegetable/Beet.mp4': require('../assets/videos/Vegetable/Beet.mp4'),
  'assets/videos/Vegetable/Bellpepper.mp4': require('../assets/videos/Vegetable/BellPepper.mp4'),
  'assets/videos/Vegetable/Broccoli.mp4': require('../assets/videos/Vegetable/Broccoli.mp4'),
  'assets/videos/Vegetable/Cabbage.mp4': require('../assets/videos/Vegetable/Cabbage.mp4'),
  'assets/videos/Vegetable/Cauliflower.mp4': require('../assets/videos/Vegetable/Califlower.mp4'),
  'assets/videos/Vegetable/Cucumber.mp4': require('../assets/videos/Vegetable/Cucumber.mp4'),
  'assets/videos/Vegetable/Eggplant.mp4': require('../assets/videos/Vegetable/Eggplant.mp4'),
  'assets/videos/Vegetable/Garlic.mp4': require('../assets/videos/Vegetable/Garlic.mp4'),
  'assets/videos/Vegetable/Onion.mp4': require('../assets/videos/Vegetable/Onion.mp4'),
  'assets/videos/Vegetable/Pumpkin.mp4': require('../assets/videos/Vegetable/Pumpkin.mp4'),
  'assets/videos/Vegetable/Tomato.mp4': require('../assets/videos/Vegetable/Tomato.mp4'),
  'assets/videos/Vegetable/Zucchini.mp4': require('../assets/videos/Vegetable/Zucchini.mp4'),

  // Dairy
  'assets/videos/Dairy/Milk.mp4': require('../assets/videos/Dairy/milk.mp4'),
};

const normalizePath = (path: string): string => {
  const trimmed = (path || '').trim();
  // Remove leading ../ if present, unify slashes
  const noDot = trimmed.replace(/^\.\/+/, '');
  return noDot.replace(/\\/g, '/');
};

export const getFoodVideoSource = (videoPath: string): any | null => {
  const key = normalizePath(videoPath);
  return videoSourceMap[key] || null;
};

export default getFoodVideoSource;



