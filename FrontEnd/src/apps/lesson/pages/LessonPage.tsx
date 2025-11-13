import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '../hooks/useLesson';
import { LessonHeader } from '../components/LessonHeader';
import { LessonContent } from '../components/LessonContent';
import { LessonProgress } from '../components/LessonProgress';
import { LessonNavigation } from '../components/LessonNavigation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState<Date>(new Date());
  
  const {
    lesson,
    progress,
    loading,
    error,
    markAsCompleted,
    updateTimeSpent,
  } = useLesson(id || '');

  // Track time spent on lesson
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60); // in minutes
      if (timeSpent > 0 && timeSpent % 5 === 0) { // Update every 5 minutes
        updateTimeSpent(5);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [startTime, updateTimeSpent]);

  // Handle lesson completion
  const handleComplete = async (score?: number) => {
    if (!lesson) return;
    
    const totalTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60);
    await updateTimeSpent(totalTime);
    await markAsCompleted(score);
    
    // Navigate back to landing or show completion message
    navigate('/landing', { 
      state: { 
        message: `Congratulations! You completed "${lesson.title}"!`,
        score 
      } 
    });
  };

  const handleGoBack = () => {
    navigate('/landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorMessage 
          message={error || 'Lesson not found'} 
          onRetry={() => window.location.reload()}
          onGoBack={handleGoBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <LessonNavigation onGoBack={handleGoBack} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Lesson Header */}
        <LessonHeader 
          lesson={lesson}
          progress={progress}
        />
        
        {/* Progress Indicator */}
        <LessonProgress 
          completed={progress?.completed || false}
          timeSpent={progress?.timeSpent || 0}
          estimatedDuration={lesson.estimatedDuration}
        />
        
        {/* Lesson Content */}
        <LessonContent 
          lesson={lesson}
          onComplete={handleComplete}
          isCompleted={progress?.completed || false}
        />
      </div>
    </div>
  );
}