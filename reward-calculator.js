/**
 * SAT Learning App - Reward Calculator
 * Calculates video game time rewards based on student performance
 */

class RewardCalculator {
  constructor() {
    // Base rewards (in minutes)
    this.BASE_REWARDS = {
      FIRST_ATTEMPT: 5,
      SECOND_ATTEMPT: 3,
      THIRD_ATTEMPT: 1,
      FOURTH_PLUS: 0
    };

    // Streak bonuses (in minutes)
    this.STREAK_BONUSES = {
      3: 1,
      5: 2,
      10: 5,
      20: 10
    };

    // Multipliers
    this.MULTIPLIERS = {
      WEEKEND: 1.5,
      MORNING: 1.25,
      REVIEW: 0.5,
      HARD_MODE: 2.0,
      TIMED: 1.5
    };

    // Achievement rewards (in minutes)
    this.ACHIEVEMENTS = {
      FIRST_CONCEPT: 10,
      FIVE_CONCEPTS: 15,
      TEN_CONCEPTS: 20,
      LEVEL_1_COMPLETE: 30,
      LEVEL_2_COMPLETE: 45,
      LEVEL_3_COMPLETE: 60,
      CONCEPT_MASTERY: 8,
      SKILL_MASTERY: 15,
      PERFECT_TEN: 25
    };

    // Daily caps
    this.DAILY_MIN = 30;
    this.DAILY_MAX = 180;
  }

  /**
   * Calculate reward for a single question attempt
   * @param {number} attemptNumber - Which attempt (1, 2, 3, 4+)
   * @param {number} currentStreak - Current correct answer streak
   * @param {Object} modifiers - Active modifiers (weekend, morning, etc.)
   * @returns {number} Minutes earned
   */
  calculateQuestionReward(attemptNumber, currentStreak = 0, modifiers = {}) {
    // Base reward
    let reward = 0;
    if (attemptNumber === 1) reward = this.BASE_REWARDS.FIRST_ATTEMPT;
    else if (attemptNumber === 2) reward = this.BASE_REWARDS.SECOND_ATTEMPT;
    else if (attemptNumber === 3) reward = this.BASE_REWARDS.THIRD_ATTEMPT;
    else reward = this.BASE_REWARDS.FOURTH_PLUS;

    // Add streak bonus
    const streakBonus = this.getStreakBonus(currentStreak);
    reward += streakBonus;

    // Apply multipliers
    let totalMultiplier = 1.0;
    if (modifiers.weekend) totalMultiplier *= this.MULTIPLIERS.WEEKEND;
    if (modifiers.morning) totalMultiplier *= this.MULTIPLIERS.MORNING;
    if (modifiers.review) totalMultiplier *= this.MULTIPLIERS.REVIEW;
    if (modifiers.hardMode) totalMultiplier *= this.MULTIPLIERS.HARD_MODE;
    if (modifiers.timed) totalMultiplier *= this.MULTIPLIERS.TIMED;

    reward *= totalMultiplier;

    return Math.round(reward * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get streak bonus based on current streak
   * @param {number} streak - Current streak count
   * @returns {number} Bonus minutes
   */
  getStreakBonus(streak) {
    if (streak >= 20) return this.STREAK_BONUSES[20];
    if (streak >= 10) return this.STREAK_BONUSES[10];
    if (streak >= 5) return this.STREAK_BONUSES[5];
    if (streak >= 3) return this.STREAK_BONUSES[3];
    return 0;
  }

  /**
   * Calculate XP earned for a question
   * @param {number} attemptNumber - Which attempt (1, 2, 3+)
   * @returns {number} XP earned
   */
  calculateXP(attemptNumber) {
    if (attemptNumber === 1) return 100;
    if (attemptNumber === 2) return 60;
    if (attemptNumber >= 3) return 30;
    return 0;
  }

  /**
   * Check if user leveled up
   * @param {number} currentXP - Total XP
   * @returns {Object} Level info
   */
  checkLevelUp(currentXP) {
    const levels = [
      { level: 1, threshold: 0, title: 'Beginner' },
      { level: 2, threshold: 500, title: 'Learner' },
      { level: 3, threshold: 1500, title: 'Student' },
      { level: 4, threshold: 3000, title: 'Scholar' },
      { level: 5, threshold: 5000, title: 'Expert' },
      { level: 6, threshold: 8000, title: 'Master' },
      { level: 7, threshold: 12000, title: 'Grandmaster' }
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (currentXP >= levels[i].threshold) {
        return levels[i];
      }
    }
    return levels[0];
  }

  /**
   * Calculate achievement reward
   * @param {string} achievementType - Type of achievement
   * @returns {number} Minutes earned
   */
  getAchievementReward(achievementType) {
    return this.ACHIEVEMENTS[achievementType] || 0;
  }

  /**
   * Apply daily cap to earned time
   * @param {number} totalEarnedToday - Total minutes earned today
   * @param {number} newMinutes - New minutes to add
   * @returns {Object} Capped minutes and overflow
   */
  applyDailyCap(totalEarnedToday, newMinutes) {
    const potentialTotal = totalEarnedToday + newMinutes;

    if (potentialTotal <= this.DAILY_MAX) {
      return {
        awarded: newMinutes,
        overflow: 0,
        cappedOut: false
      };
    } else {
      const awarded = Math.max(0, this.DAILY_MAX - totalEarnedToday);
      return {
        awarded: awarded,
        overflow: newMinutes - awarded,
        cappedOut: true
      };
    }
  }

  /**
   * Check if modifiers apply based on current time
   * @param {Date} now - Current date/time
   * @returns {Object} Active modifiers
   */
  getActiveModifiers(now = new Date()) {
    const modifiers = {
      weekend: false,
      morning: false
    };

    // Check if weekend (Saturday = 6, Sunday = 0)
    const day = now.getDay();
    modifiers.weekend = (day === 0 || day === 6);

    // Check if morning (before noon)
    const hour = now.getHours();
    modifiers.morning = (hour < 12);

    return modifiers;
  }
}

// Example usage
function demonstrateRewards() {
  const calculator = new RewardCalculator();

  console.log('=== SAT Learning App Reward Calculator Demo ===\n');

  // Example 1: First question, first attempt, no streak
  console.log('Example 1: First question of the day');
  const reward1 = calculator.calculateQuestionReward(1, 0);
  console.log(`- Attempt #1, no streak: ${reward1} minutes\n`);

  // Example 2: First attempt with 3-question streak
  console.log('Example 2: Building a streak');
  const reward2 = calculator.calculateQuestionReward(1, 3);
  console.log(`- Attempt #1, 3-question streak: ${reward2} minutes`);
  console.log(`- Breakdown: 5 base + 1 streak bonus = 6 minutes\n`);

  // Example 3: Weekend morning practice with 5-question streak
  console.log('Example 3: Weekend morning practice');
  const modifiers = { weekend: true, morning: true };
  const reward3 = calculator.calculateQuestionReward(1, 5, modifiers);
  console.log(`- Attempt #1, 5-question streak, weekend + morning`);
  console.log(`- Calculation: (5 base + 2 streak) × 1.5 (weekend) × 1.25 (morning)`);
  console.log(`- Result: ${reward3} minutes\n`);

  // Example 4: XP calculation
  console.log('Example 4: XP Calculation');
  console.log(`- First attempt: ${calculator.calculateXP(1)} XP`);
  console.log(`- Second attempt: ${calculator.calculateXP(2)} XP`);
  console.log(`- Third attempt: ${calculator.calculateXP(3)} XP\n`);

  // Example 5: Level progression
  console.log('Example 5: Level Progression');
  console.log(`- 0 XP: ${calculator.checkLevelUp(0).title}`);
  console.log(`- 600 XP: ${calculator.checkLevelUp(600).title}`);
  console.log(`- 2000 XP: ${calculator.checkLevelUp(2000).title}`);
  console.log(`- 5500 XP: ${calculator.checkLevelUp(5500).title}\n`);

  // Example 6: Daily cap
  console.log('Example 6: Daily Cap Enforcement');
  const cap1 = calculator.applyDailyCap(170, 15);
  console.log(`- Already earned 170 min today, trying to add 15 min:`);
  console.log(`- Awarded: ${cap1.awarded} min, Overflow: ${cap1.overflow} min`);
  console.log(`- Capped out: ${cap1.cappedOut}\n`);

  // Example 7: Achievement rewards
  console.log('Example 7: Achievement Rewards');
  console.log(`- First concept learned: ${calculator.getAchievementReward('FIRST_CONCEPT')} min`);
  console.log(`- Complete Level 1: ${calculator.getAchievementReward('LEVEL_1_COMPLETE')} min`);
  console.log(`- Master a skill: ${calculator.getAchievementReward('SKILL_MASTERY')} min\n`);

  // Example 8: Realistic daily session
  console.log('=== Realistic Study Session ===');
  let sessionTotal = 0;
  let sessionStreak = 0;
  let sessionXP = 0;

  console.log('\nMorning practice session (10 questions):');
  const morningMods = { morning: true, weekend: false };

  for (let i = 1; i <= 10; i++) {
    // Simulate mostly correct first attempts with occasional second attempts
    const attemptNum = (i === 4 || i === 7) ? 2 : 1;

    if (attemptNum === 1) {
      sessionStreak++;
    } else {
      sessionStreak = 0;
    }

    const reward = calculator.calculateQuestionReward(attemptNum, sessionStreak, morningMods);
    const xp = calculator.calculateXP(attemptNum);

    sessionTotal += reward;
    sessionXP += xp;

    console.log(`Q${i}: Attempt #${attemptNum}, Streak: ${sessionStreak}, Reward: ${reward.toFixed(2)} min, XP: ${xp}`);
  }

  // Add achievement for completing 10 questions
  const achievementReward = calculator.getAchievementReward('PERFECT_TEN');
  sessionTotal += achievementReward;

  console.log(`\n--- Session Summary ---`);
  console.log(`Total time earned: ${sessionTotal.toFixed(2)} minutes`);
  console.log(`Total XP earned: ${sessionXP} XP`);
  console.log(`Achievement bonus: ${achievementReward} min (Perfect 10 - if all correct)`);
  console.log(`Current level: ${calculator.checkLevelUp(sessionXP).title}`);
  console.log(`\nYou can now play video games for ${Math.floor(sessionTotal)} minutes! 🎮`);
}

// Run demonstration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RewardCalculator;
}

// Auto-run demo if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  demonstrateRewards();
}
