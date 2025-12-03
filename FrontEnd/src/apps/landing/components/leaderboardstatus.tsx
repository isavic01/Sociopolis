import { useEffect, useState } from 'react';
import { getLeaderboardStatus } from '../../services/xpService';

interface LeaderboardStatusProps {
  userId: string;
}

export function LeaderboardStatus({ userId }: LeaderboardStatusProps) {
  const [status, setStatus] = useState<{
    onLeaderboard: boolean;
    rank?: number;
    xp: number;
    xpToNextRank?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const leaderboardStatus = await getLeaderboardStatus(userId);
        setStatus(leaderboardStatus);
      } catch (error) {
        console.error('Error loading leaderboard status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadStatus();
    }
  }, [userId]);

  if (loading || !status) {
    return null;
  }

  if (status.onLeaderboard) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-sm font-semibold text-yellow-800">
            🎉 You're #{status.rank} on the leaderboard!
          </span>
        </div>
      </div>
    );
  }

  if (status.xpToNextRank !== undefined && status.xpToNextRank > 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="text-center">
          <p className="text-xs text-blue-700 mb-1">
            🎯 {status.xpToNextRank} XP to join the leaderboard
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, ((status.xp) / (status.xp + status.xpToNextRank)) * 100)}%` 
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
