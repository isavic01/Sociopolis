import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [showTitleSlide, setShowTitleSlide] = useState(true); // New state for title slide
  const [currentSection, setCurrentSection] = useState(0);
  const [showCheckIns, setShowCheckIns] = useState(false);
  const [currentCheckIn, setCurrentCheckIn] = useState(0);
  const [checkInAnswers, setCheckInAnswers] = useState<Record<string, number>>({});
  const [checkInResults, setCheckInResults] = useState<Record<string, boolean>>({});
  const [totalXP, setTotalXP] = useState(0);
  const [userTotalXP, setUserTotalXP] = useState<number | null>(null);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [nextLesson, setNextLesson] = useState<LessonContentType | null>(null);
  const [loadingNextLesson, setLoadingNextLesson] = useState(false);
  // New state for attempt tracking
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<any>(null);
  const [isRetaking, setIsRetaking] = useState(false);

  // Use the new structured sections
  const sections = lesson.sections || [];
  const checkIns = lesson.checkIns || [];

  // Start a new lesson attempt when component mounts
  useEffect(() => {
    const startNewAttempt = async () => {
      if (userId && lesson.id) {
        try {
          // Get existing progress to check completion status
          const progress = await LessonService.getUserProgress(userId, lesson.id);
          setLessonProgress(progress);
          
          if (progress?.completed) {
            setIsRetaking(true);
            console.log(`🔄 Retaking completed lesson: ${lesson.title}`);
          }

          // Always start a new attempt (whether first time or retaking)
          const attemptId = await LessonService.startLessonAttempt(userId, lesson.id);
          setCurrentAttemptId(attemptId);
          console.log(`📚 Started lesson attempt: ${attemptId}`);
        } catch (error) {
          console.error('Failed to start lesson attempt:', error);
        }
      }
    };

    startNewAttempt();
  }, [userId, lesson.id]);

  // Load user's current XP (but don't load previous check-in progress for fresh attempt)
  useEffect(() => {
    const loadUserXP = async () => {
      if (userId) {
        try {
          const currentXP = await getUserXP(userId);
          setUserTotalXP(currentXP);
        } catch (error) {
          console.error('Failed to load user XP:', error);
        }
      }
    };

    loadUserXP();
  }, [userId]);

  // Load next lesson when check-ins are completed
  useEffect(() => {
    const loadNextLesson = async () => {
      if (showCheckIns && currentCheckIn >= checkIns.length && !loadingNextLesson) {
        setLoadingNextLesson(true);
        try {
          const next = await LessonService.getNextLesson(lesson.id);
          setNextLesson(next);
        } catch (error) {
          console.error('Failed to load next lesson:', error);
        } finally {
          setLoadingNextLesson(false);
        }
      }
    };

    loadNextLesson();
  }, [showCheckIns, currentCheckIn, checkIns.length, lesson.id, loadingNextLesson]);

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
    if (isSubmittingAnswer || !currentAttemptId) return;
    
    setIsSubmittingAnswer(true);
    
    try {
      // Update local state immediately for better UX
      setCheckInAnswers(prev => ({ ...prev, [checkInId]: selectedAnswer }));
      
      // Submit to backend with attempt tracking
      const result = await LessonService.submitCheckIn(userId, lesson.id, checkInId, selectedAnswer, currentAttemptId);
      
      // Update results state
      setCheckInResults(prev => ({ ...prev, [checkInId]: result.correct }));
      
      // For retaking, always award XP for correct answers (no previous result checking)
      if (result.correct) {
        setTotalXP(prev => prev + result.xpReward);
        
        if (result.totalXP !== undefined) {
          setUserTotalXP(result.totalXP);
          
          // Check leaderboard status after earning XP
          checkLeaderboardStatus(result.totalXP);
        }
      }

      setIsSubmittingAnswer(false);
      
    } catch (error) {
      console.error('Failed to submit check-in:', error);
      setIsSubmittingAnswer(false);
      
      // Revert the answer if submission failed
      setCheckInAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[checkInId];
        return newAnswers;
      });
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

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    }
  };

  // Complete the lesson attempt (but don't call onComplete yet)
  const completeLessonAttempt = async () => {
    if (!currentAttemptId) return;

    try {
      const finalScore = totalXP;
      await LessonService.completeLessonAttempt(userId, lesson.id, currentAttemptId, finalScore, checkInResults);
      console.log(`✅ Completed lesson attempt with score: ${finalScore}`);
      
      // DON'T call onComplete here - let user stay on completion screen
      // onComplete will be called when they click navigation buttons
    } catch (error) {
      console.error('Failed to complete lesson attempt:', error);
    }
  };

  // Add function to handle moving to next question
  const handleNextQuestion = async () => {
    if (currentCheckIn < checkIns.length - 1) {
      setCurrentCheckIn(currentCheckIn + 1);
    } else {
      // This is the last question - complete the lesson but stay on screen
      await completeLessonAttempt();
      setCurrentCheckIn(currentCheckIn + 1); // This will show the completion screen
    }
  };

  // New function to handle navigation from completion screen
  const handleNavigateFromCompletion = (destination: 'home' | 'next') => {
    // Now call onComplete when user actually navigates away
    onComplete(totalXP);
    
    if (destination === 'next' && nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    } else {
      navigate('/landing');
    }
  };

  const handleStartLesson = () => {
    setShowTitleSlide(false);
    // Don't go directly to questions - start with lesson content sections
  };

  return (
    <div className="lesson-content">
      {/* Title Slide */}
      {showTitleSlide && (
        <div className="lesson-content__title-slide">
          <div className="lesson-content__title-content">
            <h1 className="lesson-content__main-title">{lesson.title}</h1>
            <div className="lesson-content__lesson-meta">
              <div className="lesson-content__duration">
                <svg className="lesson-content__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>~15 min</span>
              </div>
              <div className="lesson-content__hashtags">
                {lesson.hashtags?.map((tag, index) => (
                  <span key={index} className="lesson-content__hashtag">#{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={handleStartLesson} className="btn lesson-content__start-btn">
              Start Lesson
              <svg className="lesson-content__nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* XP Display Header - Only show after title slide */}
      {!showTitleSlide && userTotalXP !== null && (
        <div className="lesson-content__xp-header">
          <div className="lesson-content__xp-display">
            <div className="lesson-content__xp-main">
              <svg className="lesson-content__xp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="lesson-content__xp-text">
                Total XP: {userTotalXP}
              </span>
            </div>
            {totalXP > 0 && (
              <span className="lesson-content__xp-earned">
                +{totalXP} from this lesson
              </span>
            )}
          </div>
        </div>
      )}

      {/* Video Section */}
      {!showTitleSlide && lesson.videoUrl && !showCheckIns && (
        <div className="lesson-content__video-wrapper">
          <div className="lesson-content__video">
            <iframe
              src={lesson.videoUrl}
              className="lesson-content__iframe"
              allowFullScreen
              title={`${lesson.title} Video`}
            />
          </div>
        </div>
      )}

      {/* Lesson Content Sections */}
      {!showTitleSlide && !showCheckIns && (
        <div className="lesson-content__section">
          <div className="lesson-content__section-header">
            <h2 className="lesson-content__section-title">
              {sections[currentSection]?.title || `Section ${currentSection + 1}`}
            </h2>
            <div className="lesson-content__progress-text">
              {Math.round(((currentSection + 1) / sections.length) * 100)}% Complete
            </div>
          </div>

          {/* Progress Bar */}
          <div className="lesson-content__progress-bar">
            <div
              className="lesson-content__progress-fill"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>

          {/* Current Section Content */}
          <div className="lesson-content__text">
            <div 
              className="lesson-content__content"
              dangerouslySetInnerHTML={{ 
                __html: sections[currentSection]?.content?.replace(/\n/g, '<br />') || '' 
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="lesson-content__nav">
            <button
              onClick={handlePreviousSection}
              disabled={currentSection === 0}
              className="btn-ghost--underline lesson-content__nav-btn lesson-content__nav-btn--prev"
            >
              <svg className="lesson-content__nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <button
              onClick={handleNextSection}
              className="btn lesson-content__nav-btn lesson-content__nav-btn--next"
            >
              {currentSection === sections.length - 1 ? 'Start Check-ins' : 'Next'}
              <svg className="lesson-content__nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Check-in Questions - Ultra compact, no white space */}
      {showCheckIns && currentCheckIn < checkIns.length && (
        <div style={{ 
          backgroundColor: '#F5F5F5', 
          height: '100vh', 
          padding: '4px 12px', // Minimal padding
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header with Quit button - Ultra minimal */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginBottom: '4px' // Tiny margin
          }}>
            <button 
              onClick={() => navigate('/landing')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9CA3AF',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '2px 8px' // Tiny padding
              }}
            >
              Quit
            </button>
          </div>

          {/* Progress Bar - Ultra thin */}
          <div style={{ 
            width: '100%', 
            height: '3px', // Ultra thin
            backgroundColor: '#E5E7EB', 
            borderRadius: '2px', 
            marginBottom: '6px', // Tiny margin
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#FB923C',
                borderRadius: '2px',
                width: `${((currentCheckIn + 1) / checkIns.length) * 100}%`,
                transition: 'width 300ms ease'
              }}
            />
          </div>

          {/* Main Content Container - Maximum width, minimal padding */}
          <div style={{
            maxWidth: '1400px', // Even wider
            width: '100%',
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '8px', // Smaller radius
            padding: '16px 32px', // Much less padding
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)', // Lighter shadow
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 0
          }}>
            {(() => {
              const currentQ = checkIns[currentCheckIn];
              const hasAnswered = checkInAnswers[currentQ.id] !== undefined;
              const feedback = getCheckInFeedback(currentQ.id);
              const selectedAnswer = checkInAnswers[currentQ.id];
              const correctAnswer = currentQ.correctIndex;

              return (
                <>
                  {/* Question Section - Compact horizontal layout */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    marginBottom: '12px' // Minimal margin
                  }}>
                    {/* Question Text */}
                    <div style={{ flex: 2 }}> {/* Even more space for text */}
                      <p style={{
                        fontSize: '18px', // Smaller font
                        fontWeight: '500',
                        color: '#374151',
                        lineHeight: '1.2', // Tighter line height
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        {currentQ.prompt}
                      </p>
                      <p style={{
                        fontSize: '14px', // Smaller subtitle
                        color: '#6B7280',
                        fontWeight: '500',
                        margin: 0
                      }}>
                        This is an example of?
                      </p>
                    </div>
                    
                    {/* Illustration - Smaller */}
                    <div style={{
                      width: '100px', // Smaller
                      height: '65px', // Smaller
                      backgroundColor: '#FEF3C7',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <div style={{
                        width: '50px',
                        height: '40px',
                        backgroundColor: '#F59E0B',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '25px',
                          height: '25px',
                          backgroundColor: '#D97706',
                          borderRadius: '50%'
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* Answer Options Grid - Compact */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px', // Smaller gap
                    marginBottom: '8px' // Minimal margin
                  }}>
                    {currentQ.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === correctAnswer;
                      
                      let buttonStyle = {
                        padding: '12px 16px', // Less padding
                        borderRadius: '8px', // Smaller radius
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#FFFFFF',
                        color: '#374151',
                        fontSize: '14px', // Smaller font
                        fontWeight: '500',
                        cursor: hasAnswered ? 'default' : 'pointer',
                        textAlign: 'left' as const,
                        width: '100%',
                        transition: 'all 150ms ease',
                        minHeight: '44px', // Shorter buttons
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', // Lighter shadow
                        position: 'relative' as const,
                        overflow: 'hidden'
                      };

                      // ...existing code... (state styling remains the same)
                      if (hasAnswered) {
                        if (isSelected && isCorrect) {
                          buttonStyle = {
                            ...buttonStyle,
                            backgroundColor: '#10B981',
                            borderColor: '#059669',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                          };
                        } else if (isSelected && !isCorrect) {
                          buttonStyle = {
                            ...buttonStyle,
                            backgroundColor: '#EF4444',
                            borderColor: '#DC2626',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
                          };
                        } else if (!isSelected && isCorrect) {
                          buttonStyle = {
                            ...buttonStyle,
                            backgroundColor: '#F0FDF4',
                            borderColor: '#10B981',
                            color: '#065F46',
                            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)'
                          };
                        } else {
                          buttonStyle = {
                            ...buttonStyle,
                            backgroundColor: '#F9FAFB',
                            borderColor: '#E5E7EB',
                            color: '#9CA3AF',
                            cursor: 'not-allowed',
                            opacity: 0.7
                          };
                        }
                      } else {
                        if (isSelected) {
                          buttonStyle = {
                            ...buttonStyle,
                            backgroundColor: '#EBF8FF',
                            borderColor: '#3B82F6',
                            color: '#1E40AF',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)'
                          };
                        }
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => !hasAnswered && !isSubmittingAnswer && handleCheckInAnswer(currentQ.id, index)}
                          style={buttonStyle}
                          disabled={hasAnswered || isSubmittingAnswer}
                          onMouseEnter={(e) => {
                            if (!hasAnswered && !isSelected) {
                              e.currentTarget.style.borderColor = '#9CA3AF';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!hasAnswered && !isSelected) {
                              e.currentTarget.style.borderColor = '#D1D5DB';
                              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          <span style={{ flex: 1 }}>{option}</span>
                          {isSubmittingAnswer && isSelected && (
                            <div style={{
                              marginLeft: '8px',
                              width: '14px',
                              height: '14px',
                              border: '2px solid transparent',
                              borderTop: '2px solid currentColor',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback and Next Button - Ultra compact row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '36px' // Shorter fixed height
                  }}>
                    {/* Feedback - Compact */}
                    <div style={{ flex: 1, marginRight: '16px' }}>
                      {feedback && (
                        <div style={{
                          backgroundColor: feedback.isCorrect ? '#ECFDF5' : '#FEF2F2',
                          border: `1px solid ${feedback.isCorrect ? '#10B981' : '#EF4444'}`,
                          borderRadius: '6px', // Smaller radius
                          padding: '6px 12px', // Less padding
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <div style={{
                            width: '14px', // Smaller icon
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: feedback.isCorrect ? '#10B981' : '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '9px', // Tiny font
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}>
                            {feedback.isCorrect ? '✓' : '✗'}
                          </div>
                          <span style={{
                            color: feedback.isCorrect ? '#065F46' : '#991B1B',
                            fontWeight: '500',
                            fontSize: '13px' // Smaller text
                          }}>
                            {feedback.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Next Question Button - Compact */}
                    {hasAnswered && !isSubmittingAnswer && (
                      <button
                        onClick={handleNextQuestion}
                        style={{
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '16px', // Smaller radius
                          padding: '8px 20px', // Less padding
                          fontSize: '13px', // Smaller font
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                          transition: 'all 200ms ease',
                          flexShrink: 0
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#2563EB';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#3B82F6';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {currentCheckIn < checkIns.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        <span style={{ fontSize: '9px' }}>→</span>
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Completion Section */}
      {showCheckIns && currentCheckIn >= checkIns.length && (
        <div className="lesson-content__completion">
          <div className="lesson-content__completion-content">
            <div className="lesson-content__completion-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="lesson-content__completion-title">
              {isRetaking ? 'Lesson Retaken! 🔄' : 'Lesson Complete! 🎉'}
            </h3>
            <p className="lesson-content__completion-text">
              {isRetaking 
                ? "Great job going through the lesson again! Your progress is always tracked."
                : "You've completed all sections and check-ins for this lesson."
              }
            </p>

            {/* Completion Status Badge */}
            {lessonProgress?.completed && (
              <div className="lesson-content__completion-badge">
                <svg className="lesson-content__completion-badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Previously Completed</span>
                {lessonProgress.completionCount > 1 && (
                  <span className="lesson-content__completion-count">
                    (Attempt #{lessonProgress.completionCount + 1})
                  </span>
                )}
              </div>
            )}
            
            {/* XP Summary */}
            <div className="lesson-content__xp-summary">
              <div className="lesson-content__xp-summary-content">
                <svg className="lesson-content__xp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="lesson-content__xp-summary-text">
                  XP Earned This Attempt: {totalXP}
                </span>
              </div>
              {userTotalXP !== null && (
                <div className="lesson-content__xp-total">
                  Your Total XP: {userTotalXP}
                </div>
              )}
              {lessonProgress?.bestScore && totalXP > lessonProgress.bestScore && (
                <div className="lesson-content__new-record">
                  🎯 New Personal Best! (Previous: {lessonProgress.bestScore} XP)
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="lesson-content__results">
              Correct Answers: {Object.values(checkInResults).filter(Boolean).length} / {checkIns.length}
            </div>

            {/* Action Buttons */}
            <div className="lesson-content__completion-actions">
              {nextLesson && (
                <button
                  onClick={() => handleNavigateFromCompletion('next')}
                  className="btn lesson-content__next-btn"
                >
                  Next Lesson: {nextLesson.title}
                  <svg className="lesson-content__next-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={() => handleNavigateFromCompletion('home')}
                className={`btn-ghost--underline lesson-content__home-btn ${nextLesson ? '' : 'lesson-content__home-btn--primary'}`}
              >
                {nextLesson ? 'Back to Home' : 'Continue Learning'}
              </button>

              {/* Retake Button */}
              <button
                onClick={() => window.location.reload()}
                className="btn-ghost--underline lesson-content__retake-btn"
              >
                🔄 Retake Lesson
              </button>
            </div>

            {loadingNextLesson && (
              <div className="lesson-content__loading-next">
                <div className="lesson-content__spinner"></div>
                <span>Loading next lesson...</span>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  );
}