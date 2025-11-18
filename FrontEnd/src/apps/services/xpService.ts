import { doc, getDoc, updateDoc, serverTimestamp, collection, getDocs, query, orderBy, limit, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function awardXP(userId: string, xpAmount: number): Promise<number> {
  if (xpAmount <= 0) {
    throw new Error('xp amount needs to be positive');
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('user not found');
    }

    const userData = userSnap.data();
    const currentXP = userData.xp || 0;
    const newXP = currentXP + xpAmount;

    await updateDoc(userRef, {
      xp: newXP,
      updatedAt: serverTimestamp(),
    });

    await updateLeaderboard();

    return newXP;
  } catch (err) {
    console.error('error awarding xp:', err);
    throw err;
  }
}

async function updateLeaderboard(): Promise<void> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('xp', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);

    const topUserIds: string[] = [];
    querySnapshot.forEach((doc) => {
      topUserIds.push(doc.id);
    });

    await setDoc(doc(db, 'leaderboard', 'top10'), {
      topUserIds,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('error updating leaderboard:', err);
    throw err;
  }
}
