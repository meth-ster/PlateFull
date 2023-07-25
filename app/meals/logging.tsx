import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import Button from '../../components/common/Button';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { foods } from '../../constants/foods';
import cameraService from '../../utils/cameraService';

const { width } = Dimensions.get('window');

interface MealData {
  id: string;
  type: string;
  foods: string[];
  image?: string;
  timestamp: string;
}

const MealLoggingScreen = () => {
  const navigation = useNavigation();

  // Hide tab bar when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Hide tab bar when screen is focused
      navigation.setOptions({
        tabBarStyle: { display: 'none' }
      });

      // Show tab bar when screen loses focus
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

  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [mealImage, setMealImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTakePhoto = async (): Promise<void> => {
    try {
      const imageUri = await cameraService.takePicture();
      if (imageUri) {
        setMealImage(imageUri);
        setIsAnalyzing(true);
        
        // Analyze the image for food recognition
        const analysisResults = await cameraService.analyzeFoodImage(imageUri);
        
        if (analysisResults.length > 0) {
          const detectedFoods = analysisResults.map(result => result.foodName);
          setSelectedFoods(prev => [...prev, ...detectedFoods]);
        }
        
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const handlePickImage = async (): Promise<void> => {
    try {
      const imageUri = await cameraService.pickFromGallery();
      if (imageUri) {
        setMealImage(imageUri);
        setIsAnalyzing(true);
        
        // Analyze the image for food recognition
        const analysisResults = await cameraService.analyzeFoodImage(imageUri);
        
        if (analysisResults.length > 0) {
          const detectedFoods = analysisResults.map(result => result.foodName);
          setSelectedFoods(prev => [...prev, ...detectedFoods]);
        }
        
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery.');
      setIsAnalyzing(false);
    }
  };

  const toggleFoodSelection = (foodId: string): void => {
    setSelectedFoods(prev => {
      if (prev.includes(foodId)) {
        return prev.filter(id => id !== foodId);
      } else {
        return [...prev, foodId];
      }
    });
  };

  const handleSaveMeal = (): void => {
    if (selectedFoods.length === 0) {
      Alert.alert('No Foods Selected', 'Please select at least one food item.');
      return;
    }

    const mealData: MealData = {
      id: Date.now().toString(),
      type: 'manual_log',
      foods: selectedFoods,
      image: mealImage || undefined,
      timestamp: new Date().toISOString(),
    };

    // Here you would typically save to AsyncStorage or send to API
    console.log('Saving meal:', mealData);
    
    Alert.alert(
      'Meal Saved!',
      'Your meal has been logged successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Log Meal</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Camera Section */}
        <Animated.View 
          entering={FadeInUp.delay(100)}
          style={styles.cameraSection}
        >
          <Text style={styles.sectionTitle}>Take a Photo</Text>
          
          {mealImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: mealImage }} style={styles.mealImage} />
              {isAnalyzing && (
                <View style={styles.analyzingOverlay}>
                  <Text style={styles.analyzingText}>Analyzing...</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.cameraButtons}>
              <TouchableOpacity style={styles.cameraButton} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={32} color={colors.primary} />
                <Text style={styles.cameraButtonText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage}>
                <Ionicons name="images" size={32} color={colors.primary} />
                <Text style={styles.cameraButtonText}>Pick from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Manual Food Selection */}
        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={styles.foodSelectionSection}
        >
          <Text style={styles.sectionTitle}>Select Foods</Text>
          
          <View style={styles.foodGrid}>
            {Object.values(foods).flat().map((food, index) => {
              const isSelected = selectedFoods.includes(food.id.toString());
              return (
                <Animated.View
                  key={food.id}
                  entering={FadeIn.delay(index * 50)}
                >
                  <TouchableOpacity
                    style={[
                      styles.foodItem,
                      isSelected && styles.selectedFoodItem
                    ]}
                    onPress={() => toggleFoodSelection(food.id.toString())}
                  >
                    <View style={[styles.foodIcon, { backgroundColor: food.color }]}>
                      <Text style={styles.foodEmoji}>🍎</Text>
                    </View>
                    <Text style={styles.foodName}>{food.name}</Text>
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Selected Foods Summary */}
        {selectedFoods.length > 0 && (
          <Animated.View 
            entering={FadeInUp.delay(300)}
            style={styles.summarySection}
          >
            <Text style={styles.sectionTitle}>Selected Foods ({selectedFoods.length})</Text>
            <View style={styles.selectedFoodsList}>
              {selectedFoods.map((foodId, index) => {
                const food = Object.values(foods).flat().find(f => f.id.toString() === foodId);
                return food ? (
                  <View key={index} style={styles.selectedFoodChip}>
                    <Text style={styles.selectedFoodName}>{food.name}</Text>
                    <TouchableOpacity onPress={() => toggleFoodSelection(foodId)}>
                      <Ionicons name="close" size={16} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                ) : null;
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomSection}>
        <Button
          title="Save Meal"
          onPress={handleSaveMeal}
          disabled={selectedFoods.length === 0}
          style={StyleSheet.flatten([
            styles.saveButton,
            selectedFoods.length === 0 && styles.disabledButton
          ])}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cameraSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cameraButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    flex: 0.45,
  },
  cameraButtonText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.text.primary,
    textAlign: 'center',
  },
  foodSelectionSection: {
    marginBottom: 30,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodItem: {
    width: (width - 60) / 3,
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    position: 'relative',
  },
  selectedFoodItem: {
    backgroundColor: colors.primary,
  },
  foodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodEmoji: {
    fontSize: 24,
  },
  foodName: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    backgroundColor: colors.success,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summarySection: {
    marginBottom: 30,
  },
  selectedFoodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedFoodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedFoodName: {
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 8,
  },
  bottomSection: {
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.text.muted,
  },
});

export default MealLoggingScreen; 