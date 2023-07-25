import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import StatusBar from '../../components/common/StatusBar';
import DevNavigator from '../../components/DevNavigator';
import { colors } from '../../constants/colors';
import { navigationRecovery, safeNavigate } from '../../utils/navigationRecovery';
import { shadowPresets } from '../../utils/shadowUtils';

const { width } = Dimensions.get('window');

interface UserData {
  name: string;
  childName: string;
  childAge: string;
  streak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface TodayStats {
  mealsLogged: number;
  foodsIntroduced: number;
  caloriesConsumed: number;
  targetCalories: number;
}

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showDevNavigator, setShowDevNavigator] = useState(false);

  // Record successful navigation to home screen
  useEffect(() => {
    navigationRecovery.recordSuccessfulNavigation('/(tabs)');
  }, []);
  const [userData, setUserData] = useState<UserData>({
    name: 'Sarah',
    childName: 'Emma',
    childAge: '2',
    streak: 7,
    level: 3,
    xp: 1250,
    nextLevelXp: 2000
  });
  
  const [todayStats, setTodayStats] = useState<TodayStats>({
    mealsLogged: 2,
    foodsIntroduced: 1,
    caloriesConsumed: 450,
    targetCalories: 800
  });
  
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };
  
  const getProgressPercentage = (): number => {
    return (userData.xp / userData.nextLevelXp) * 100;
  };
  
  const getCalorieProgress = (): number => {
    return (todayStats.caloriesConsumed / todayStats.targetCalories) * 100;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* 🚀 DEVELOPMENT: Dev Navigator Button - Only shows in development */}
      {__DEV__ && (
        <TouchableOpacity
          style={styles.devButton}
          onPress={() => setShowDevNavigator(true)}
        >
          <Text style={styles.devButtonText}>🚀</Text>
        </TouchableOpacity>
      )}
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Hello, {userData.name}! 👋</Text>
              <Text style={styles.childInfo}>
                {userData.childName} • {userData.childAge} years old
              </Text>
            </View>
            <TouchableOpacity onPress={() => safeNavigate('../profile')}>
              <Image
                source={require('../../assets/images/avatars/user1.jpg')}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
          
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>Level {userData.level}</Text>
              <Text style={styles.xpText}>{userData.xp}/{userData.nextLevelXp} XP</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
            <Text style={styles.streakText}>🔥 {userData.streak} day streak!</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => safeNavigate('../meals/logging')}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.actionGradient}
            >
              <Ionicons name="fast-food" size={32} color="white" />
              <Text style={styles.actionTitle}>Log Meal</Text>
              <Text style={styles.actionSubtitle}>Track what {userData.childName} ate</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => safeNavigate('../food/selection')}
          >
            <LinearGradient
              colors={['#4ECDC4', '#6EE7DF']}
              style={styles.actionGradient}
            >
              <Ionicons name="restaurant" size={32} color="white" />
              <Text style={styles.actionTitle}>Add Food</Text>
              <Text style={styles.actionSubtitle}>Introduce new foods</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Today's Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today&apos;s Progress</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{todayStats.mealsLogged}</Text>
              <Text style={styles.statLabel}>Meals Logged</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{todayStats.foodsIntroduced}</Text>
              <Text style={styles.statLabel}>New Foods</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{todayStats.caloriesConsumed}</Text>
              <Text style={styles.statLabel}>Calories</Text>
              <View style={styles.calorieProgress}>
                <View 
                  style={[
                    styles.calorieProgressFill, 
                    { width: `${getCalorieProgress()}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => safeNavigate('../meals/history')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Breakfast logged</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="star" size={24} color={colors.accent} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New food: Avocado</Text>
                <Text style={styles.activityTime}>Yesterday</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* 🚀 DEVELOPMENT: Dev Navigator Overlay */}
      <DevNavigator
        visible={showDevNavigator}
        onClose={() => setShowDevNavigator(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // 🚀 DEVELOPMENT: Dev button styles
  devButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  devButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  childInfo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  progressSection: {
    marginTop: 10,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  xpText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  streakText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  actionCard: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    ...shadowPresets.medium,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  calorieProgress: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 8,
  },
  calorieProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  activityList: {
    gap: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  activityIcon: {
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});

export default HomeScreen;
