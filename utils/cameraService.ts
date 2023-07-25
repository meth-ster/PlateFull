import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface FoodAnalysisResult {
  foodName: string;
  calories: number;
  confidence: number;
}

class CameraService {
  // Request camera permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  // Take a picture using camera
  async takePicture(): Promise<string | null> {
    try {
      const permission = await this.requestPermissions();
      
      if (!permission) {
        Alert.alert('Permission Required', 'Camera and media library permissions are required to take photos.');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  // Pick image from gallery
  async pickFromGallery(): Promise<string | null> {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is required to select photos.');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery.');
      return null;
    }
  }

  // Analyze food from image (mock implementation)
  async analyzeFoodImage(imageUri: string): Promise<FoodAnalysisResult[]> {
    try {
      // Simulate AI food recognition
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults: FoodAnalysisResult[] = [
        { foodName: 'Apple', calories: 52, confidence: 0.95 },
        { foodName: 'Banana', calories: 89, confidence: 0.87 },
        { foodName: 'Orange', calories: 47, confidence: 0.92 },
      ];
      
      // Return random result
      const randomIndex = Math.floor(Math.random() * mockResults.length);
      return [mockResults[randomIndex]];
    } catch (error) {
      console.error('Error analyzing food image:', error);
      return [];
    }
  }
}

// FIXED: Export as default instead of named export
const cameraService = new CameraService();
export default cameraService; 