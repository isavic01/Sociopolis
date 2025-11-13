import { useState, useEffect } from 'react';
import { useAuthContext } from '../../auth/components/authProvider';
import { LessonFirebaseService } from '../services/lessonService';
import type { LessonContent, LessonProgress } from '../lesson';

export function useLesson(lessonId: string) {
  const { user } = useAuthContext();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLessonData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch lesson content
        const lessonData = await LessonFirebaseService.getLessonById(lessonId);
        if (!lessonData) {
          setError('Lesson not found');
          return;
        }
        setLesson(lessonData);

        // Fetch user progress if user is authenticated
        if (user) {
          const progressData = await LessonFirebaseService.getUserProgress(user.uid, lessonId);
          setProgress(progressData);
        }
      } catch (err) {
        console.error('Error fetching lesson data:', err);
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId, user]);

  const updateProgress = async (progressData: Partial<LessonProgress>) => {
    if (!user || !lessonId) return;

    try {
      await LessonFirebaseService.updateProgress(user.uid, lessonId, progressData);
      
      // Update local state
      setProgress(prev => ({
        lessonId,
        userId: user.uid,
        completed: false,
        timeSpent: 0,
        lastAccessedAt: new Date(),
        ...prev,
        ...progressData,
      }));
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('Failed to update progress');
    }
  };

  const markAsCompleted = async (score?: number) => {
    await updateProgress({
      completed: true,
      completionDate: new Date(),
      score,
    });
  };

  const updateTimeSpent = async (additionalTime: number) => {
    const currentTime = progress?.timeSpent || 0;
    await updateProgress({
      timeSpent: currentTime + additionalTime,
    });
  };

  return {
    lesson,
    progress,
    loading,
    error,
    updateProgress,
    markAsCompleted,
    updateTimeSpent,
  };
}