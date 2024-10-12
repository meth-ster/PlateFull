
// Static map of known video assets keyed by the relative path values used in db/foods.json
// Metro requires static require paths; keep this list in sync with assets/videos/**
const videoSourceMap: Record<string, any> = {
  'assets/videos/Protein/chicken.mp4': require('../assets/videos/Protein/Chicken.mp4'),
  'assets/videos/Fruit/Apple.mp4': require('../assets/videos/Fruit/apple.mp4'),

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



