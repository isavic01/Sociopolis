import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../auth/components/authProvider';
import { getUserXP, resetUserXP } from '../../services/xpService';
import { InteractiveMap } from '../components/InteractiveMap';

export default function LandingPage() {
  const { user } = useAuthContext();
  const [currentXP, setCurrentXP] = useState<number>(0);
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Load user's current XP
  useEffect(() => {
    const loadUserXP = async () => {
      if (user?.uid) {
        try {
          const xp = await getUserXP(user.uid);
          setCurrentXP(xp);
        } catch (error) {
          console.error('Failed to load user XP:', error);
        }
      }
    };

    loadUserXP();
  }, [user]);

  const handleResetProgress = async () => {
    if (!user?.uid) {
      console.error('No user logged in');
      return;
    }

    setIsResetting(true);
    try {
      await resetUserXP(user.uid);
      setCurrentXP(0);
      setShowConfirmDialog(false);
      console.log('Progress reset successfully!');
    } catch (error) {
      console.error('Failed to reset progress:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-page__content">
        <h1 className="landing-page__title">Sociopolis</h1>
        
        {/* Interactive Map with circles behind houses */}
        <div className="landing-page__map">
          <InteractiveMap userId={user?.uid} />
        </div>
        
        {/* XP Display */}
        {user && (
          <div className="landing-page__xp-display">
            <div className="landing-page__xp-info">
              <svg className="landing-page__xp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="landing-page__xp-text">Your XP: {currentXP}</span>
            </div>
            
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="btn-ghost--underline landing-page__reset-btn"
              disabled={isResetting}
            >
              Reset Progress
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="landing-page__dialog-overlay">
          <div className="landing-page__dialog">
            <div className="landing-page__dialog-content">
              <h3 className="landing-page__dialog-title">Reset Progress</h3>
              <p className="landing-page__dialog-text">
                Are you sure you want to reset your progress? This will set your XP to 0 and cannot be undone.
              </p>
              <div className="landing-page__dialog-actions">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="btn-ghost--underline landing-page__dialog-btn landing-page__dialog-btn--cancel"
                  disabled={isResetting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  className="btn-v1 landing-page__dialog-btn landing-page__dialog-btn--confirm"
                  disabled={isResetting}
                >
                  {isResetting ? 'Resetting...' : 'Reset Progress'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
