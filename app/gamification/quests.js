import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { shadowPresets } from '../../utils/shadowUtils';

const { width, height } = Dimensions.get('window');

const QuestsScreen = ({ navigation }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  
  const questPath = [
    { id: 1, type: 'start', status: 'completed', icon: '⭐' },
    { id: 2, type: 'chest', status: 'locked', icon: '🎁' },
    { id: 3, type: 'quest', status: 'locked', icon: '⭐' },
    { id: 4, type: 'challenge', status: 'locked', icon: '📚' },
    { id: 5, type: 'boss', status: 'locked', icon: '🏆' },
    { id: 6, type: 'chest', status: 'locked', icon: '🎁' },
  ];

  const gameStats = {
    streak: 1,
    coins: 505,
    hearts: 5
  };

  const QuestNode = ({ quest, index }) => {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scale.value },
          { rotate: `${rotation.value}deg` }
        ]
      };
    });

    const handlePress = () => {
      if (quest.status === 'available') {
        scale.value = withSpring(0.95, { duration: 150 }, () => {
          scale.value = withSpring(1);
        });
        
        // Handle quest selection
        console.log('Quest selected:', quest.id);
      }
    };

    const getNodeColor = () => {
      switch (quest.status) {
        case 'completed':
          return colors.success;
        case 'available':
          return colors.primary;
        case 'locked':
        default:
          return colors.text.muted;
      }
    };

    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 200)}
        style={[styles.questNode, animatedStyle]}
      >
        <TouchableOpacity
          style={[
            styles.nodeButton,
            { backgroundColor: getNodeColor() },
            quest.status === 'locked' && styles.lockedNode,
            shadowPresets.small
          ]}
          onPress={handlePress}
          disabled={quest.status === 'locked'}
        >
          <Text style={styles.nodeIcon}>{quest.icon}</Text>
        </TouchableOpacity>
        
        {quest.status === 'completed' && (
          <View style={[styles.completedBadge, shadowPresets.small]}>
            <Ionicons name="checkmark" size={12} color="white" />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
        </TouchableOpacity>
        
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color={colors.warning} />
            <Text style={styles.statValue}>{gameStats.streak}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color={colors.warning} />
            <Text style={styles.statValue}>{gameStats.coins}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="heart" size={20} color={colors.error} />
            <Text style={styles.statValue}>{gameStats.hearts}</Text>
          </View>
        </View>
      </View>

      {/* Quest Path */}
      <ScrollView
        style={styles.questPath}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.questPathContent}
      >
        <View style={[styles.pathContainer, { height: questPath.length * 150 + 100 }]}>
          {questPath.map((quest, index) => (
            <QuestNode key={quest.id} quest={quest} index={index} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Badges')}
        >
          <Text style={styles.navButtonText}>Badge</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Badges', { tab: 'stats' })}
        >
          <Text style={styles.navButtonText}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonActive]}
        >
          <Text style={[styles.navButtonText, styles.navButtonTextActive]}>Quests</Text>
          <View style={styles.navIndicator} />
        </TouchableOpacity>
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
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginLeft: 6,
  },
  questPath: {
    flex: 1,
  },
  questPathContent: {
    paddingVertical: 40,
  },
  pathContainer: {
    position: 'relative',
  },
  questNode: {
    position: 'absolute',
    alignItems: 'center',
  },
  nodeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  lockedNode: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  completedBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.success,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeIcon: {
    fontSize: 36,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonActive: {
    position: 'relative',
  },
  navButtonText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  navButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  navIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 40,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

export default QuestsScreen;