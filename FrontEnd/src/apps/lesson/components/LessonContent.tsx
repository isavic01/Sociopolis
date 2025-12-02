import React, { useState, useEffect } from 'react';
import type { LessonContent as LessonContentType, LessonCheckIn } from '../lesson';
import { LessonService } from '../services/lessonService';
import { getUserXP, getLeaderboardStatus } from '../../services/xpService';
import { LeaderboardNotification } from './LeaderboardNotification';

interface LessonContentProps {
  lesson: LessonContentType;
  onComplete: (score?: number) => void;
  isCompleted: boolean;
  userId: string; // Add userId prop for XP tracking
}

export function LessonContent({ lesson, onComplete, isCompleted, userId }: LessonContentProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showCheckIns, setShowCheckIns] = useState(false);
  const [currentCheckIn, setCurrentCheckIn] = useState(0);
  const [checkInAnswers, setCheckInAnswers] = useState<Record<string, number>>({});
  const [checkInResults, setCheckInResults] = useState<Record<string, boolean>>({});
  const [totalXP, setTotalXP] = useState(0);
  const [userTotalXP, setUserTotalXP] = useState<number | null>(null);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [leaderboardMessage, setLeaderboardMessage] = useState<string>('');
  const [showLeaderboardNotification, setShowLeaderboardNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'info' | 'warning'>('info');
  const [previousRank, setPreviousRank] = useState<number | null>(null);

  // Use the new structured sections
  const sections = lesson.sections || [];
  const checkIns = lesson.checkIns || [];

  // Load user's current XP and previous check-in progress on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Fetch current user XP from backend
        const currentXP = await getUserXP(userId);
        setUserTotalXP(currentXP);

        // Get initial leaderboard rank
        const initialStatus = await getLeaderboardStatus(userId);
        if (initialStatus.onLeaderboard && initialStatus.rank) {
          setPreviousRank(initialStatus.rank);
        }

        // Load check-in progress
        const progress = await LessonService.getCheckInProgress(userId, lesson.id);
        
        // Restore previous answers and results
        const answers: Record<string, number> = {};
        const results: Record<string, boolean> = {};
        let earnedXP = 0;

        Object.entries(progress).forEach(([checkInId, data]) => {
          const checkIn = checkIns.find(ci => ci.id === checkInId);
          if (checkIn) {
            answers[checkInId] = data.correct ? checkIn.correctIndex : -1; // Mark as answered
            results[checkInId] = data.correct;
            if (data.correct) {
              earnedXP += data.xpEarned;
            }
          }
        });

        setCheckInAnswers(answers);
        setCheckInResults(results);
        setTotalXP(earnedXP);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    if (userId && lesson.id) {
      loadUserData();
    }
  }, [userId, lesson.id, checkIns]);

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // All sections completed, start check-ins
      setShowCheckIns(true);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleCheckInAnswer = async (checkInId: string, selectedAnswer: number) => {
    if (isSubmittingAnswer) return; // Prevent double submission
    
    setIsSubmittingAnswer(true);
    
    try {
      // Submit to backend and get real-time XP update
      const result = await LessonService.submitCheckIn(userId, lesson.id, checkInId, selectedAnswer);
      
      // Update local state
      setCheckInAnswers(prev => ({ ...prev, [checkInId]: selectedAnswer }));
      setCheckInResults(prev => ({ ...prev, [checkInId]: result.correct }));
      
      // Update XP display
      if (result.correct) {
        setTotalXP(prev => prev + result.xpReward);
        
        // Update user's total XP if available from backend
        if (result.totalXP !== undefined) {
          setUserTotalXP(result.totalXP);
          
          // Check leaderboard status after earning XP
          checkLeaderboardStatus(result.totalXP);
        }
      }

      // Auto-advance after showing feedback
      setTimeout(() => {
        if (currentCheckIn < checkIns.length - 1) {
          setCurrentCheckIn(currentCheckIn + 1);
        } else {
          // All check-ins completed
          onComplete(totalXP + (result.correct ? result.xpReward : 0));
        }
        setIsSubmittingAnswer(false);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to submit check-in:', error);
      setIsSubmittingAnswer(false);
      
      // Show error feedback
      // You could add error state here if needed
    }
  };

  const checkLeaderboardStatus = async (currentXP: number) => {
    try {
      const status = await getLeaderboardStatus(userId);
      
      if (status.onLeaderboard && status.rank) {
        // Only show notification if rank changed
        if (previousRank === null) {
          // User just joined the leaderboard
          setLeaderboardMessage(`🎉 Congratulations! You've joined the leaderboard at #${status.rank}!`);
          setNotificationType('success');
          setShowLeaderboardNotification(true);
          setPreviousRank(status.rank);
        } else if (status.rank < previousRank) {
          // User moved up in rank (lower number = better rank)
          const spotsGained = previousRank - status.rank;
          setLeaderboardMessage(`🚀 You moved up ${spotsGained} ${spotsGained === 1 ? 'spot' : 'spots'}! Now #${status.rank}!`);
          setNotificationType('success');
          setShowLeaderboardNotification(true);
          setPreviousRank(status.rank);
        } else if (status.rank > previousRank) {
          // User moved down - just update rank silently, no notification
          setPreviousRank(status.rank);
        }
        // If rank is same as before, don't show notification
      } else if (!status.onLeaderboard && previousRank !== null) {
        // User fell off the leaderboard - just update silently, no notification
        setPreviousRank(null);
      }
    } catch (error) {
      console.error('Error checking leaderboard status:', error);
    }
  };

  const getCheckInFeedback = (checkInId: string) => {
    const checkIn = checkIns.find(ci => ci.id === checkInId);
    const result = checkInResults[checkInId];
    
    if (result === undefined) return null;
    
    return {
      isCorrect: result,
      message: result 
        ? `Correct! +${checkIn?.xpReward} XP` 
        : `Not quite right. The correct answer is: ${checkIn?.options[checkIn.correctIndex]}`
    };
  };

  return (
    <>
      <LeaderboardNotification
        message={leaderboardMessage}
        show={showLeaderboardNotification}
        onClose={() => setShowLeaderboardNotification(false)}
        type={notificationType}
      />
      
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      {/* XP Display Header */}
      {userTotalXP !== null && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mb-6 max-w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="font-semibold text-yellow-800">
                Total XP: {userTotalXP}
              </span>
            </div>
            {totalXP > 0 && (
              <span className="text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                +{totalXP} from this lesson
              </span>
            )}
          </div>
        </div>
      )}

      {/* Video Section */}
      {lesson.videoUrl && !showCheckIns && (
        <div className="mb-6">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={`${lesson.title} Video`}
            />
          </div>
        </div>
      )}

      {/* Lesson Content Sections */}
      {!showCheckIns && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="font-semibold text-gray-900 break-words"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
            >
              {sections[currentSection]?.title || `Section ${currentSection + 1}`}
            </h2>
            <div className="text-sm text-gray-500">
              {Math.round(((currentSection + 1) / sections.length) * 100)}% Complete
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>

          {/* Current Section Content */}
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8">
            <div 
              className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere"
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
              dangerouslySetInnerHTML={{ 
                __html: sections[currentSection]?.content?.replace(/\n/g, '<br />') || '' 
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousSection}
              disabled={currentSection === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              onClick={handleNextSection}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentSection === sections.length - 1 ? 'Start Check-ins' : 'Next'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Check-in Questions */}
      {showCheckIns && currentCheckIn < checkIns.length && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="font-semibold text-gray-900"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
            >
              Knowledge Check
            </h2>
            <div className="text-sm text-gray-500">
              Question {currentCheckIn + 1} of {checkIns.length}
            </div>
          </div>

          {/* Check-in Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCheckIn + 1) / checkIns.length) * 100}%` }}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 overflow-hidden">
            {(() => {
              const currentQ = checkIns[currentCheckIn];
              const hasAnswered = checkInAnswers[currentQ.id] !== undefined;
              const feedback = getCheckInFeedback(currentQ.id);

              return (
                <>
                  <h3 
                    className="font-medium text-gray-900 mb-4 break-words max-w-full"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
                  >
                    {currentQ.prompt}
                  </h3>
                  
                  <div className="space-y-3">
                    {currentQ.options.map((option, index) => {
                      const isSelected = checkInAnswers[currentQ.id] === index;
                      const isCorrect = index === currentQ.correctIndex;
                      
                      let buttonClass = "w-full text-left p-4 rounded-lg border transition-colors ";
                      
                      if (!hasAnswered && !isSubmittingAnswer) {
                        buttonClass += "border-gray-300 hover:border-blue-500 hover:bg-blue-50";
                      } else {
                        if (isSelected) {
                          buttonClass += isCorrect 
                            ? "border-green-500 bg-green-100 text-green-800"
                            : "border-red-500 bg-red-100 text-red-800";
                        } else if (isCorrect) {
                          buttonClass += "border-green-500 bg-green-50 text-green-700";
                        } else {
                          buttonClass += "border-gray-300 bg-gray-50 text-gray-500";
                        }
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => !hasAnswered && !isSubmittingAnswer && handleCheckInAnswer(currentQ.id, index)}
                          disabled={hasAnswered || isSubmittingAnswer}
                          className={buttonClass}
                        >
                          <div className="flex items-center justify-between">
                            <span 
                              className="break-words flex-1 text-left pr-2"
                              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
                            >
                              {option}
                            </span>
                            {isSubmittingAnswer && isSelected && (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {feedback && (
                    <div className={`mt-4 p-3 rounded-lg ${
                      feedback.isCorrect 
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <div className="flex items-center">
                        <svg 
                          className={`w-5 h-5 mr-2 ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          {feedback.isCorrect ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        {feedback.message}
                        {feedback.isCorrect && userTotalXP !== null && (
                          <span className="ml-2 text-sm font-semibold">
                            (Total: {userTotalXP} XP)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Completion Section */}
      {showCheckIns && currentCheckIn >= checkIns.length && (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 
              className="font-bold text-gray-900 mb-2"
              style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}
            >
              Lesson Complete! 🎉
            </h3>
            <p 
              className="text-gray-600 mb-4"
              style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
            >
              You've completed all sections and check-ins for this lesson.
            </p>
            
            {/* XP Summary */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 inline-block">
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-lg font-semibold text-yellow-800">
                  XP Earned This Lesson: {totalXP}
                </span>
              </div>
              {userTotalXP !== null && (
                <div className="text-sm text-yellow-700 mt-1">
                  Your Total XP: {userTotalXP}
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600 mb-6">
              Correct Answers: {Object.values(checkInResults).filter(Boolean).length} / {checkIns.length}
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}