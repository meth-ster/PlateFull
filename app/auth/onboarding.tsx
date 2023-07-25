import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { shadowPresets } from '../../utils/shadowUtils';
import { safeSetItem } from '../../utils/storage';

// import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: number;
  character: any;
  title: string;
  description: string;
  characterStyle: { width: number; height: number };
}

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    character: require('../../assets/images/icon.png'),
    title: 'Empowering You to Take Control\nof Your Kids Health',
    description: 'Lorem ipsum dolor sit amet consectetur.\nPorttitor egestas venenatis at nibh urna.',
    characterStyle: { width: 200, height: 200 }
  },
  {
    id: 2,
    character: require('../../assets/images/icon.png'),
    title: 'Track Your Child&apos;s Nutrition Journey',
    description: 'Monitor meals, discover healthy foods, and make nutrition fun for your little ones.',
    characterStyle: { width: 200, height: 200 }
  },
  {
    id: 3,
    character: require('../../assets/images/icon.png'),
    title: 'Learn & Grow Together',
    description: 'Educational content and gamified experiences to make healthy eating exciting.',
    characterStyle: { width: 200, height: 200 }
  }
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<any>(null);
  
  // Animation values for transitions
  const fadeOpacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const spinnerRotation = useSharedValue(0);
  const contentScale = useSharedValue(1);
  const titleFontSize = useSharedValue(24);
  const boundarySpinnerProgress = useSharedValue(0);
  const isHovering = useSharedValue(false);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  
  const animateTransition = (nextIndex: number): void => {
    console.log('animateTransition called with nextIndex:', nextIndex);
    // Start loading animation
    setIsLoading(true);
    setIsTransitioning(true);
    spinnerRotation.value = withRepeat(
      withSequence(
        withTiming(360, { duration: 1000 })
      ),
      -1,
      false
    );
    
    // Dynamic transition effects
    contentScale.value = withTiming(0.8, { duration: 200 }, () => {
      fadeOpacity.value = withTiming(0.2, { duration: 300 }, () => {
        // After fade out, scroll to next item
        runOnJS(() => {
          console.log('Scrolling to index:', nextIndex, 'at position:', nextIndex * width);
          scrollRef.current?.scrollTo({
            x: nextIndex * width,
            animated: true
          });
          console.log('Setting currentIndex to:', nextIndex);
          setCurrentIndex(nextIndex);
          
          // Animate font size
          titleFontSize.value = withTiming(28, { duration: 200 }, () => {
            titleFontSize.value = withTiming(28, { duration: 200 });
          });
          
          // Fade in and scale up new content
          fadeOpacity.value = withTiming(1, { duration: 400 }, () => {
            contentScale.value = withTiming(1, { duration: 300 }, () => {
              runOnJS(() => {
                console.log('Animation completed, setting loading to false');
                setIsLoading(false);
                setIsTransitioning(false);
                spinnerRotation.value = 0;
              });
            });
          });
        })();
      });
    });
  };
  
  const handleNext = async (): Promise<void> => {
    console.log('handleNext called, currentIndex:', currentIndex, 'total items:', onboardingData.length);
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      console.log('Transitioning to index:', nextIndex);
      animateTransition(nextIndex);
    } else {
      // Onboarding complete, set flag using web-compatible storage
      await safeSetItem('onboardingComplete', 'true');
      console.log('Navigating to sign-in');
      if (router && router.replace) {
        router.replace('/auth/sign-in');
      } else {
        console.error('Router is not available');
      }
    }
  };
  
  const handleSkip = async (): Promise<void> => {
    // Onboarding skipped, set flag using web-compatible storage
    await safeSetItem('onboardingComplete', 'true');
    if (router && router.replace) {
      router.replace('/auth/sign-in');
    } else {
      console.error('Router is not available');
    }
  };
  
  // Button press animations
  const handleButtonPressIn = (): void => {
    setIsButtonPressed(true);
    buttonScale.value = withTiming(0.95, { duration: 150 });
  };
  
  const handleButtonPressOut = (): void => {
    setIsButtonPressed(false);
    buttonScale.value = withTiming(1, { duration: 150 });
  };
  
  const handleButtonHoverIn = (): void => {
    isHovering.value = true;
    boundarySpinnerProgress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  };
  
  const handleButtonHoverOut = (): void => {
    isHovering.value = false;
    boundarySpinnerProgress.value = withTiming(0, { duration: 200 });
  };
  
  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeOpacity.value,
      transform: [{ scale: contentScale.value }],
    };
  });
  
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      fontSize: titleFontSize.value,
    };
  });
  
  const spinnerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${spinnerRotation.value}deg` }],
    };
  });
  
  const boundarySpinnerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      boundarySpinnerProgress.value,
      [0, 0.5, 1],
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      boundarySpinnerProgress.value,
      [0, 0.5, 1],
      [0.8, 1.2, 0.8],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => (
          <Animated.View key={item.id} style={[styles.slide, contentAnimatedStyle]}>
            <View style={styles.imageContainer}>
              <Image source={item.character} style={[styles.character, item.characterStyle]} />
            </View>
            
            <View style={styles.textContainer}>
              <Animated.Text style={[styles.title, titleAnimatedStyle]}>
                {item.title}
              </Animated.Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive
              ]}
            />
          ))}
        </View>

        <Animated.View style={[buttonAnimatedStyle]}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <Animated.View style={[styles.spinner, spinnerAnimatedStyle]}>
                <Ionicons name="sync" size={24} color="white" />
              </Animated.View>
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Continue'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      {isHovering.value && (
        <Animated.View style={[styles.boundarySpinner, boundarySpinnerAnimatedStyle]}>
          <Ionicons name="pulse" size={40} color={colors.accent} />
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 24,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 160,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...shadowPresets.medium,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  spinner: {
    padding: 2,
  },
  boundarySpinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
});

export default OnboardingScreen; 