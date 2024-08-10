import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn
} from 'react-native-reanimated';
import { colors } from '../../../../constants/colors';
import { useQuest } from '../context/QuestContext';
import GameScreen from '../quests/GameScreen';
import ResultsScreen from '../quests/ResultsScreen';
import { Round, SubRound } from '../types/navigation';

const { width } = Dimensions.get('window');

interface RoundScreenProps {
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  onBack: () => void;
  onStartQuest?: (levelIndex: number, roundIndex: number, subRoundIndex: number) => void;
}

const RoundScreen: React.FC<RoundScreenProps> = ({ difficulty, onBack, onStartQuest }) => {
  const { questProgress, isLoading, completeSubRound } = useQuest();
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [currentRewards, setCurrentRewards] = useState<any>(null);
  const [currentGameState, setCurrentGameState] = useState<'none' | 'game' | 'results'>('none');
  const [gameParams, setGameParams] = useState<{
    difficulty: 'EASY' | 'NORMAL' | 'HARD';
    levelIndex: number;
    roundIndex: number;
    subRoundIndex: number;
  } | null>(null);
  const [resultsParams, setResultsParams] = useState<{
    score: number;
    totalQuestions: number;
    starsEarned: number;
  } | null>(null);
  const [currentVisibleRound, setCurrentVisibleRound] = useState<number>(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const roundPositions = useRef<{ [key: number]: number }>({});

  // Animation values
  const boxOpenAnimation = useSharedValue(0);
  const starsAnimation = useSharedValue(0);
  const badgeAnimation = useSharedValue(0);

  const handleSubRoundPress = (levelIndex: number, roundIndex: number, subRoundIndex: number) => {
    if (!questProgress) return;
    
    const subRound = questProgress.levels[levelIndex]?.rounds[roundIndex]?.subRounds[subRoundIndex];
    if (!subRound || subRound.isLocked) {
      Alert.alert('Locked', 'Complete previous quests to unlock this one!');
      return;
    }

    // Start game directly with specific sub-round data
    setGameParams({
      difficulty,
      levelIndex,
      roundIndex,
      subRoundIndex
    });
    setCurrentGameState('game');
  };

  const handleBoxPress = (levelIndex: number, roundIndex: number) => {
    if (!questProgress) return;
    
    const round = questProgress.levels[levelIndex]?.rounds[roundIndex];
    if (!round) return;

    const allSubRoundsCompleted = round.subRounds.slice(0, 4).every(sr => sr.isCompleted);

    if (!allSubRoundsCompleted) {
      const completedSubRounds = round.subRounds.slice(0, 4).filter(sr => sr.isCompleted).length;
      Alert.alert('Treasure Locked', `Complete all 4 sub-rounds to unlock this treasure box!\nProgress: ${completedSubRounds}/4`);
      return;
    }

    if (round.isCompleted) {
      setCurrentRewards(round.rewards);
      setShowRewardModal(true);
      animateRewards();
    } else {
      const rewards = {
        stars: 50 + (roundIndex * 10),
        badges: [`Round ${roundIndex + 1} Master`],
        prizes: [`Special prize for completing round ${roundIndex + 1}!`]
      };
      
      setCurrentRewards(rewards);
      setShowRewardModal(true);
      animateRewards();
    }
  };

  const animateRewards = () => {
    boxOpenAnimation.value = withSpring(1);
    setTimeout(() => {
      starsAnimation.value = withSequence(
        withTiming(1, { duration: 500 }),
        withSpring(1.2),
        withSpring(1)
      );
    }, 300);
    setTimeout(() => {
      badgeAnimation.value = withSpring(1);
    }, 600);
  };

  const handleScroll = useCallback((event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const headerHeight = 200; // Approximate header height
    
    // Find which round is currently visible
    let visibleRound = 1;
    for (const [roundIndex, position] of Object.entries(roundPositions.current)) {
      if (scrollY + headerHeight >= position) {
        visibleRound = parseInt(roundIndex) + 1;
      } else {
        break;
      }
    }
    
    if (visibleRound !== currentVisibleRound) {
      setCurrentVisibleRound(visibleRound);
    }
  }, [currentVisibleRound]);

  const onRoundLayout = useCallback((roundIndex: number, event: any) => {
    const { y } = event.nativeEvent.layout;
    roundPositions.current[roundIndex] = y;
  }, []);

  const handleGameComplete = (score: number, totalQuestions: number, starsEarned: number) => {
    setResultsParams({ score, totalQuestions, starsEarned });
    setCurrentGameState('results');
    
    // Update quest progress if game params exist
    if (gameParams) {
      // TODO: Update quest progress with completion data
    }
  };

  const handleGameClose = () => {
    setCurrentGameState('none');
    setGameParams(null);
    setResultsParams(null);
  };

  const handleResultsComplete = async () => {
    // Complete the sub-round in the quest system
    if (gameParams && resultsParams) {
      const { levelIndex, roundIndex, subRoundIndex } = gameParams;
      const starsEarned = Math.min(3, Math.max(1, Math.floor((resultsParams.score / resultsParams.totalQuestions) * 3)));
      
      // Mark sub-round as completed using quest context
      try {
        await completeSubRound(levelIndex, roundIndex, subRoundIndex, starsEarned);
      } catch (error) {
        console.error('Failed to complete sub-round:', error);
      }
    }
    
    handleGameClose();
  };

  const animatedStarsStyle = useAnimatedStyle(() => ({
    opacity: starsAnimation.value,
    transform: [{ scale: starsAnimation.value }]
  }));

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    opacity: badgeAnimation.value,
    transform: [{ scale: badgeAnimation.value }]
  }));

  const renderSubRound = (subRound: SubRound, levelIndex: number, roundIndex: number, subRoundIndex: number, isFirst?: boolean) => {
    const isCompleted = subRound.isCompleted;
    const isLocked = subRound.isLocked;
    const isCurrent = !isCompleted && !isLocked;
    
    return (
      <Animated.View
        key={subRound.id}
        entering={FadeInDown.delay(subRoundIndex * 100).springify()}
        style={styles.pathNodeContainer}
      >
        {!isFirst && (
          <View style={[
            styles.connectionLine,
            (isCompleted || isCurrent) && styles.completedConnectionLine
          ]} />
        )}
        
        {isFirst && isCurrent && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.startLabel}>
            <Text style={styles.startText}>START</Text>
          </Animated.View>
        )}
        
        <TouchableOpacity
          onPress={() => handleSubRoundPress(levelIndex, roundIndex, subRoundIndex)}
          disabled={isLocked}
          style={styles.subRoundButton}
          activeOpacity={0.8}
        >
          <Image
            source={
              isCompleted 
                ? require('../../../../assets/images/characters/complet_sub_round.png')
                : isCurrent
                ? require('../../../../assets/images/characters/complet_sub_round.png') // Use same for current (available)
                : require('../../../../assets/images/characters/sub_round.png')
            }
            style={[
              styles.subRoundImage,
              isLocked && styles.lockedSubRoundImage
            ]}
          />
          
          {/* Progress indicator for current sub-round */}
          {isCurrent && (
            <Animated.View entering={ZoomIn.delay(300)} style={styles.currentIndicator}>
              <View style={styles.currentDot} />
            </Animated.View>
          )}
          
          {isCompleted && (
            <Animated.View entering={ZoomIn.delay(300)} style={styles.completionCheck}>
              <Ionicons name="checkmark" size={24} color="white" />
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTreasureBox = (round: Round, levelIndex: number, roundIndex: number) => {
    const isCompleted = round.isCompleted;
    const allSubRoundsCompleted = round.subRounds.slice(0, 4).every(sr => sr.isCompleted);
    const isUnlocked = allSubRoundsCompleted;
    
    return (
      <Animated.View
        key={`box-${round.id}`}
        entering={FadeInDown.delay(400).springify()}
        style={styles.pathNodeContainer}
      >
        <View style={[
          styles.connectionLine,
          allSubRoundsCompleted && styles.completedConnectionLine
        ]} />
        
        <TouchableOpacity
          onPress={() => handleBoxPress(levelIndex, roundIndex)}
          disabled={!isUnlocked}
          style={styles.treasureBoxButton}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../../../assets/images/characters/box.png')}
            style={[
              styles.treasureBoxImage,
              !isUnlocked && styles.lockedTreasureBoxImage
            ]}
          />
          
          {/* Glow effect for unlocked but not completed treasure box */}
          {isUnlocked && !isCompleted && (
            <Animated.View entering={ZoomIn.delay(300)} style={styles.treasureGlow} />
          )}
          
          {isCompleted && (
            <Animated.View entering={ZoomIn.delay(300)} style={styles.completionCheck}>
              <Ionicons name="checkmark" size={24} color="white" />
            </Animated.View>
          )}
          
          {!isUnlocked && (
            <View style={styles.treasureBoxLock}>
              <Ionicons name="lock-closed" size={20} color="#666" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderRound = (round: Round, levelIndex: number, roundIndex: number) => {
    const completedSubRounds = round.subRounds.slice(0, 4).filter(sr => sr.isCompleted).length;
    
    return (
      <Animated.View
        key={round.id}
        entering={SlideInRight.delay(roundIndex * 50)}
        style={styles.roundContainer}
      >
        <View style={styles.roundHeader}>
          <Text style={styles.roundTitle}>{round.name}</Text>
          <Text style={styles.roundProgress}>
            {completedSubRounds}/4 sub-rounds + treasure
          </Text>
        </View>

        <View style={styles.questPathContainer}>
          <View style={styles.questPath}>
            {round.subRounds.slice(0, 4).map((subRound, subRoundIndex) =>
              renderSubRound(subRound, levelIndex, roundIndex, subRoundIndex, subRoundIndex === 0)
            )}
            {renderTreasureBox(round, levelIndex, roundIndex)}
          </View>
{/* 
          <Animated.View 
            entering={SlideInRight.delay(600).springify()}
            style={styles.characterContainer}
          >
            <Image
              source={require('../../../../assets/images/characters/zicon (26).png')}
              style={styles.characterMascot}
            />
          </Animated.View> */}
        </View>
      </Animated.View>
    );
  };

  // const renderLevelHeader = (level: Level, levelIndex: number) => (
  //   <Animated.View
  //     key={`header-${level.id}`}
  //     entering={FadeInDown.delay(levelIndex * 100)}
  //     style={[styles.levelHeaderContainer, level.isLocked && styles.lockedLevel]}
  //   >
  //     <View style={styles.levelHeader}>
  //       <Text style={[styles.levelTitle, level.isLocked && styles.lockedText]}>
  //         {level.name}
  //       </Text>
  //       <View style={styles.levelStats}>
  //         <View style={styles.statItem}>
  //           <Ionicons name="star" size={16} color="#FFD700" />
  //           <Text style={styles.statText}>{level.totalStars}</Text>
  //         </View>
  //         <View style={styles.statItem}>
  //           <Text style={styles.progressText}>
  //             {level.rounds.filter(r => r.isCompleted).length}/10
  //           </Text>
  //         </View>
  //       </View>
  //     </View>

  //     {level.isLocked && (
  //       <View style={styles.lockedLevelContent}>
  //         <Ionicons name="lock-closed" size={48} color="#999" />
  //         <Text style={styles.lockedMessage}>
  //           Complete previous level to unlock
  //         </Text>
  //       </View>
  //     )}
  //   </Animated.View>
  // );

  const RewardModal = () => (
    <Modal
      visible={showRewardModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setShowRewardModal(false);
        boxOpenAnimation.value = 0;
        starsAnimation.value = 0;
        badgeAnimation.value = 0;
      }}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={styles.rewardModal} entering={ZoomIn}>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setShowRewardModal(false);
              boxOpenAnimation.value = 0;
              starsAnimation.value = 0;
              badgeAnimation.value = 0;
            }}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.rewardTitle}>🎉 Treasure Unlocked! 🎉</Text>
          <Text style={styles.congratsText}>
            Congratulations! You've completed all sub-rounds and unlocked the treasure box!
          </Text>
          
          {currentRewards && (
            <View style={styles.rewardsContent}>
              <Animated.View style={[styles.rewardItem, animatedStarsStyle]}>
                <Ionicons name="star" size={32} color="#FFD700" />
                <Text style={styles.rewardText}>+{currentRewards.stars} Stars</Text>
              </Animated.View>

              <Animated.View style={[styles.rewardItem, animatedBadgeStyle]}>
                <Ionicons name="medal" size={32} color="#FF6B6B" />
                <Text style={styles.rewardText}>
                  {Array.isArray(currentRewards.badges) ? currentRewards.badges[0] : 'New Badge!'}
                </Text>
              </Animated.View>

              <Animated.View style={[styles.rewardItem, animatedBadgeStyle]}>
                <Ionicons name="gift" size={32} color="#4CAF50" />
                <Text style={styles.rewardText}>
                  {Array.isArray(currentRewards.prizes) ? currentRewards.prizes[0] : 'Special Prize!'}
                </Text>
              </Animated.View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );

  if (isLoading || !questProgress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading quests...</Text>
      </View>
    );
  }

  const levelIndex = difficulty === 'EASY' ? 0 : difficulty === 'NORMAL' ? 1 : 2;
  const level = questProgress.levels[levelIndex];

  if (!level) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Level not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View entering={FadeInDown} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBack}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.sectionTitle}>
                 ROUND {currentVisibleRound}
              </Text>
              <Text style={styles.headerTitle}>
                {level?.name || difficulty}
              </Text>
            </View>
          </View>
          
          <View style={styles.totalStats}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{level.totalStars}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.progressText}>
              {level.rounds.filter(r => r.isCompleted).length}/10
            </Text>
          </View>
        </View>
        </Animated.View>

        {/* Level Header */}
        {/* {renderLevelHeader(level, levelIndex)} */}
        
        {/* All Rounds Vertically */}
        {!level.isLocked && level.rounds.map((round, roundIndex) => (
          <View 
            key={`round-wrapper-${round.id}`} 
            style={styles.roundWrapper}
            onLayout={(event) => onRoundLayout(roundIndex, event)}
          >
            {renderRound(round, levelIndex, roundIndex)}
          </View>
        ))}
      </ScrollView>

      <RewardModal />
      
      {/* Game Screen Modal */}
      <Modal
        visible={currentGameState === 'game'}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleGameClose}
      >
        {gameParams && (
          <>
            <GameScreen
              navigation={{
                navigate: (screen: any, params?: any) => {
                  if (screen === 'Results' && params) {
                    handleGameComplete(params.score, params.totalQuestions, params.starsEarned);
                  }
                },
              } as any}
              route={{
                params: {
                  difficulty: gameParams.difficulty,
                  level: gameParams.levelIndex,
                  round: gameParams.roundIndex,
                  subRound: gameParams.subRoundIndex,
                  questions: questProgress?.levels[gameParams.levelIndex]?.rounds[gameParams.roundIndex]?.subRounds[gameParams.subRoundIndex]?.questions
                }
              } as any}
            />
            <TouchableOpacity
              style={styles.closeQuestButton}
              onPress={handleGameClose}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </Modal>

      {/* Results Screen Modal */}
      <Modal
        visible={currentGameState === 'results'}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleResultsComplete}
      >
        {resultsParams && (
          <>
            <ResultsScreen
              navigation={{
                navigate: (screen: any, params?: any) => {
                  handleResultsComplete();
                },
                goBack: () => handleResultsComplete(),
              } as any}
              route={{
                params: resultsParams
              } as any}
            />
            <TouchableOpacity
              style={styles.closeQuestButton}
              onPress={handleResultsComplete}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#58cc02',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 8,
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerStats: {
    padding: 8,
  },
  totalStats: {
    flexDirection: 'row',
    gap: 25,
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalStarsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  totalBadgesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  gemContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemText: {
    fontSize: 16,
  },
  levelHeaderContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lockedLevel: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  lockedText: {
    color: colors.text.secondary,
  },
  levelStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  progressText: {
    fontSize: 14,
    color: 'white',
    letterSpacing: 1,
    fontWeight: '600',
  },
  lockedLevelContent: {
    alignItems: 'center',
    padding: 20,
  },
  lockedMessage: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 10,
    textAlign: 'center',
  },
  roundWrapper: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  roundContainer: {
    width: '100%',
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  roundHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  roundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 5,
  },
  roundProgress: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  questPathContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questPath: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  pathNodeContainer: {
    alignItems: 'center',
    marginBottom: 35,
    position: 'relative',
  },
  connectionLine: {
    position: 'absolute',
    top: -35,
    width: 8,
    height: 35,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  completedConnectionLine: {
    backgroundColor: '#58cc02',
  },
  startLabel: {
    backgroundColor: '#58cc02',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  startText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subRoundButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  subRoundImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  lockedSubRoundImage: {
    opacity: 0.4,
  },
  currentIndicator: {
    position: 'absolute',
    bottom: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#58cc02',
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  completionCheck: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#58cc02',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  treasureBoxButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  completedTreasureBoxButton: {
    opacity: 1,
  },
  unlockedTreasureBoxButton: {
    opacity: 1,
  },
  lockedTreasureBoxButton: {
    opacity: 0.6,
  },
  treasureBoxImage: {
    width: 80,
    height: 80,
  },
  lockedTreasureBoxImage: {
    opacity: 0.5,
  },
  treasureBoxLock: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  treasureGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    backgroundColor: '#ffd700',
    opacity: 0.3,
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 0,
  },
  characterContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  characterMascot: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: width - 60,
    alignItems: 'center',
  },
  closeModalButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  rewardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  congratsText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  rewardsContent: {
    alignItems: 'center',
    gap: 15,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    minWidth: 200,
    justifyContent: 'center',
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeQuestButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1000,
  },
});

export default RoundScreen;
