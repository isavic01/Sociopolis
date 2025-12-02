import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs, query, orderBy, limit, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function awardXP(userId: string, xpAmount: number): Promise<number> {
  if (xpAmount <= 0) {
    throw new Error('xp amount needs to be positive');
  }

  try {
    console.log(`🎯 Starting XP award: ${xpAmount} XP to user ${userId}`);
    
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('user not found');
    }

    const userData = userSnap.data();
    const currentXP = userData.xp || 0;
    const newXP = currentXP + xpAmount;

    console.log(`💰 XP Update: ${currentXP} → ${newXP} (+${xpAmount})`);

    await updateDoc(userRef, {
      xp: newXP,
      updatedAt: serverTimestamp(),
    });

    console.log(`✅ User document updated with new XP: ${newXP}`);

    // Check if user qualifies for leaderboard
    const leaderboardStatus = await checkLeaderboardEligibility(userId, newXP, userData.displayName || 'Anonymous');
    console.log(`🏆 Leaderboard check result:`, leaderboardStatus);

    await updateLeaderboard();
    console.log(`🏆 Leaderboard updated successfully`);

    return newXP;
  } catch (err) {
    console.error('❌ Error awarding XP:', err);
    throw err;
  }
}

export async function getUserXP(userId: string): Promise<number> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return 0; // Return 0 if user doesn't exist yet
    }

    const userData = userSnap.data();
    return userData.xp || 0;
  } catch (err) {
    console.error('error getting user xp:', err);
    return 0; // Return 0 on error to prevent UI breaks
  }
}

/**
 * Checks if a user is eligible for the leaderboard by comparing their XP
 * against the current last place holder
 */
async function checkLeaderboardEligibility(
  userId: string, 
  userXP: number, 
  userName: string
): Promise<{ eligible: boolean; message: string; rank?: number }> {
  try {
    // Get current leaderboard
    const leaderboardRef = doc(db, 'leaderboard', 'top10');
    const leaderboardSnap = await getDoc(leaderboardRef);
    
    if (!leaderboardSnap.exists()) {
      console.log(`📋 No leaderboard exists yet - user automatically qualifies`);
      return { 
        eligible: true, 
        message: `🎉 Congratulations! You're now on the leaderboard!`,
        rank: 1
      };
    }

    const leaderboardData = leaderboardSnap.data();
    const topUserIds: string[] = leaderboardData.topUserIds || [];
    
    // If leaderboard has less than 10 users, user automatically qualifies
    if (topUserIds.length < 10) {
      console.log(`📋 Leaderboard has ${topUserIds.length} users - user automatically qualifies`);
      return { 
        eligible: true, 
        message: `🎉 You've made it onto the leaderboard!`,
        rank: topUserIds.length + 1
      };
    }

    // Get the last place user's XP
    const lastPlaceUserId = topUserIds[topUserIds.length - 1];
    const lastPlaceUserRef = doc(db, 'users', lastPlaceUserId);
    const lastPlaceUserSnap = await getDoc(lastPlaceUserRef);
    
    if (!lastPlaceUserSnap.exists()) {
      console.log(`⚠️ Last place user not found`);
      return { eligible: false, message: 'Unable to check leaderboard status' };
    }

    const lastPlaceUserData = lastPlaceUserSnap.data();
    const lastPlaceXP = lastPlaceUserData.xp || 0;
    const lastPlaceName = lastPlaceUserData.displayName || 'Anonymous';

    console.log(`🔍 Leaderboard check: User ${userName} (${userXP} XP) vs Last Place ${lastPlaceName} (${lastPlaceXP} XP)`);

    // Check if user has more XP than last place
    if (userXP > lastPlaceXP) {
      console.log(`✅ User has more XP than last place! Moving to leaderboard.`);
      return { 
        eligible: true, 
        message: `🎉 Congratulations! You've surpassed ${lastPlaceName} and are now on the leaderboard with ${userXP} XP!`,
        rank: 10
      };
    } else if (userXP === lastPlaceXP) {
      console.log(`⚖️ User tied with last place`);
      return { 
        eligible: false, 
        message: `You're tied with ${lastPlaceName} at ${userXP} XP. Keep earning to move up!`
      };
    } else {
      const xpNeeded = lastPlaceXP - userXP + 1;
      console.log(`❌ User needs ${xpNeeded} more XP to make the leaderboard`);
      return { 
        eligible: false, 
        message: `You need ${xpNeeded} more XP to beat ${lastPlaceName} and join the leaderboard!`
      };
    }
  } catch (err) {
    console.error('❌ Error checking leaderboard eligibility:', err);
    return { eligible: false, message: 'Error checking leaderboard status' };
  }
}

async function updateLeaderboard(): Promise<void> {
  try {
    console.log(`🔄 Updating leaderboard...`);
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('xp', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);

    const topUserIds: string[] = [];
    const userXPs: { id: string, xp: number }[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      topUserIds.push(doc.id);
      userXPs.push({ id: doc.id, xp: data.xp || 0 });
    });

    console.log(`📊 Top 10 users by XP:`, userXPs);

    await setDoc(doc(db, 'leaderboard', 'top10'), {
      topUserIds,
      updatedAt: serverTimestamp(),
    });
    
    console.log(`✅ Leaderboard document updated with top users:`, topUserIds);
  } catch (err) {
    console.error('❌ Error updating leaderboard:', err);
    throw err;
  }
}

/**
 * Public function to check leaderboard status for a user
 * Can be called from UI components to show leaderboard status
 */
export async function getLeaderboardStatus(userId: string): Promise<{ 
  onLeaderboard: boolean; 
  rank?: number; 
  xp: number;
  xpToNextRank?: number;
}> {
  try {
    const userXP = await getUserXP(userId);
    const leaderboardRef = doc(db, 'leaderboard', 'top10');
    const leaderboardSnap = await getDoc(leaderboardRef);
    
    if (!leaderboardSnap.exists()) {
      return { onLeaderboard: false, xp: userXP };
    }

    const topUserIds: string[] = leaderboardSnap.data().topUserIds || [];
    const userRank = topUserIds.indexOf(userId);
    
    if (userRank !== -1) {
      return { 
        onLeaderboard: true, 
        rank: userRank + 1,
        xp: userXP
      };
    }

    // User not on leaderboard - calculate XP needed
    if (topUserIds.length > 0) {
      const lastPlaceUserId = topUserIds[topUserIds.length - 1];
      const lastPlaceXP = await getUserXP(lastPlaceUserId);
      const xpNeeded = Math.max(0, lastPlaceXP - userXP + 1);
      
      return {
        onLeaderboard: false,
        xp: userXP,
        xpToNextRank: xpNeeded
      };
    }

    return { onLeaderboard: false, xp: userXP };
  } catch (err) {
    console.error('Error getting leaderboard status:', err);
    return { onLeaderboard: false, xp: 0 };
  }
}
