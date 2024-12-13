import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ImageSourcePropType,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp
} from 'react-native-reanimated';
import Button from '../../../../components/common/Button';
import { colors } from '../../../../constants/colors';

const { width } = Dimensions.get('window');

interface NavigationProp {
  navigate: (screen: string) => void;
}

interface LearningModuleTabProps {
  navigation?: NavigationProp;
}

interface Module {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  description: string;
  action: string;
}

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  color: string;
}

const LearningModuleTab: React.FC<LearningModuleTabProps> = ({ navigation }) => {
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const modules: Module[] = [
    {
      id: 'quiz',
      title: 'My Quizes',
      icon: require('../../../../assets/images/characters/zicon (40).png'),
      description: 'Lorem ipsum dolor sit amet consectetur.',
      action: 'View Quiz'
    },
    {
      id: 'rewards',
      title: 'Rewards',
      icon: require('../../../../assets/images/characters/zicon (24).png'),
      description: 'Lorem ipsum dolor sit amet consectetur.',
      action: 'View Rewards'
    }
  ];

  const videos: Video[] = [
    {
      id: 'fruits',
      title: 'Fruits',
      duration: '10 Min',
      thumbnail: '🍓',
      color: '#FF6B6B'
    },
    {
      id: 'dairy',
      title: 'Dairy',
      duration: '8 Min',
      thumbnail: '🥛',
      color: '#4ECDC4'
    }
  ];

  const handleModulePress = (moduleId: string): void => {
    if (moduleId === 'quiz') {
      if (navigation) {
        navigation.navigate('Quiz');
      }
    } else if (moduleId === 'rewards') {
      setShowSuccessModal(true);
    }
  };

  const SuccessModal: React.FC = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={FadeIn.springify()}
          style={styles.successModal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSuccessModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.successIcon}>
            <Image 
              source={require('../../../../assets/images/characters/zicon (26).png')} 
              style={styles.successEmoji} 
            />
          </View>

          <Text style={styles.successTitle}>Task Completed successfully</Text>

          <Button
            title="Continue"
            onPress={() => setShowSuccessModal(false)}
            style={styles.continueButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Learning Module</Text>
      <Text style={styles.sectionSubtitle}>
        Let&apos;s Explore What Your Child&apos;s Learning!
      </Text>

      <View style={styles.modulesGrid}>
        {modules.map((module: Module, index: number) => (
          <Animated.View
            key={module.id}
            entering={FadeInUp.delay(index * 100).springify()}
          >
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => handleModulePress(module.id)}
              activeOpacity={0.8}
            >
              <View style={styles.moduleIcon}>
                <Image source={module.icon} style={styles.moduleEmoji} />
              </View>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
              <Button
                title={module.action}
                onPress={() => handleModulePress(module.id)}
                style={styles.moduleButton}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.videoSection}>
        {videos.map((video: Video, index: number) => (
          <TouchableOpacity
            key={video.id}
            style={[styles.videoCard, { backgroundColor: video.color }]}
            activeOpacity={0.8}
          >
            <Text style={styles.videoTitle}>{video.title}</Text>
            <View style={styles.videoThumbnail}>
              <Text style={styles.videoEmoji}>{video.thumbnail}</Text>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={32} color={colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <SuccessModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  modulesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moduleCard: {
    width: (width - 56) / 2,
    backgroundColor: colors.background2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  moduleIcon: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleEmoji: {
    width: 64,
    height: 64,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.green,
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  moduleButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  videoSection: {
    marginBottom: 24,
  },
  videoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 12,
  },
  videoThumbnail: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoEmoji: {
    fontSize: 64,
    position: 'absolute',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 32,
    width: width - 48,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    width: 120,
    height: 120,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24,
  },
  continueButton: {
    width: '100%',
  },
});

export default LearningModuleTab;
