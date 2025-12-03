import { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { getLeaderboardStatus } from '../../services/xpService';
import { LeaderboardNotification } from '../../lesson/components/LeaderboardNotification';

interface LeaderboardRankMonitorProps {
  userId: string;
}

export function LeaderboardRankMonitor({ userId }: LeaderboardRankMonitorProps) {
  const [previousRank, setPreviousRank] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'info' | 'warning'>('info');
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!userId) return;

    console.log('starting leaderboard rank monitor for user:', userId);

    const leaderboardRef = doc(db, 'leaderboard', 'top10');
    
    const unsubscribe = onSnapshot(leaderboardRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      try {
        const status = await getLeaderboardStatus(userId);
        const data = snapshot.data();
        const topUserIds: string[] = data.topUserIds || [];
        
        if (isInitialLoad.current) {
          if (status.onLeaderboard && status.rank) {
            setPreviousRank(status.rank);
            console.log('initial rank:', status.rank);
          }
          isInitialLoad.current = false;
          return;
        }

        if (status.onLeaderboard && status.rank) {
          if (previousRank === null) {
            setNotificationMessage(`congratulations! you've joined the leaderboard at #${status.rank}!`);
            setNotificationType('success');
            setShowNotification(true);
            setPreviousRank(status.rank);
            console.log('user joined leaderboard at rank:', status.rank);
          } else if (status.rank < previousRank) {
            const spotsGained = previousRank - status.rank;
            
            let passedUserName = 'another player';
            if (previousRank <= topUserIds.length) {
              const passedUserId = topUserIds[previousRank - 1];
              const passedUserDoc = await getDoc(doc(db, 'users', passedUserId));
              if (passedUserDoc.exists()) {
                passedUserName = passedUserDoc.data().displayName || 'anonymous';
              }
            }
            
            setNotificationMessage(`you moved up ${spotsGained} ${spotsGained === 1 ? 'spot' : 'spots'}! you passed ${passedUserName} and are now #${status.rank}!`);
            setNotificationType('success');
            setShowNotification(true);
            setPreviousRank(status.rank);
            console.log(`rank improved: ${previousRank} → ${status.rank}`);
          } else if (status.rank > previousRank) {
            console.log(`rank changed: ${previousRank} → ${status.rank}`);
            setPreviousRank(status.rank);
          }
        } else if (!status.onLeaderboard && previousRank !== null) {
          console.log('user fell off leaderboard');
          setPreviousRank(null);
        }
      } catch (error) {
        console.error('Error monitoring leaderboard rank:', error);
      }
    });

    return () => {
      console.log('stopping leaderboard rank monitor');
      unsubscribe();
    };
  }, [userId, previousRank]);

  return (
    <LeaderboardNotification
      message={notificationMessage}
      show={showNotification}
      onClose={() => setShowNotification(false)}
      type={notificationType}
    />
  );
}
