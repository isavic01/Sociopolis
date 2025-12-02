import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LessonContent } from '../components/LessonContent';
import { LessonService } from '../services/lessonService';
import { useAuthContext } from '../../auth/components/authProvider';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [lesson, setLesson] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadLesson = async () => {
      if (!id) {
        setError('No lesson ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log(`📚 Loading lesson: ${id}`);
        const lessonData = await LessonService.getLessonById(id);
        
        if (!lessonData) {
          setError('Lesson not found');
        } else {
          setLesson(lessonData);
          console.log(`✅ Lesson loaded:`, lessonData.title);
        }
      } catch (err) {
        console.error('❌ Error loading lesson:', err);
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [id]);

  const handleComplete = async (earnedXP?: number) => {
    console.log(`🎉 Lesson "${lesson?.title}" completed! XP earned: ${earnedXP || 0}`);
    
    // Update lesson progress
    if (user && lesson) {
      try {
        await LessonService.updateProgress(user.uid, lesson.id, {
          completed: true,
          completionDate: new Date(),
          score: earnedXP,
        });
        console.log(`✅ Lesson progress saved to backend`);
      } catch (error) {
        console.error('❌ Failed to save lesson progress:', error);
      }
    }
    
    navigate('/landing');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';  
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This lesson doesn\'t exist yet.'}</p>
          <button
            onClick={() => navigate('/landing')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <ErrorMessage message="You must be logged in to take lessons" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/landing')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Lessons
            </button>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:block text-sm text-gray-500">
                {lesson.title}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-4">
              <h1 
                className="font-bold text-gray-900 mb-3 break-words leading-tight"
                style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}
              >
                {lesson.title}
              </h1>
              <p 
                className="text-gray-600 mb-4 break-words"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}
              >
                {lesson.description}
              </p>
              
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)} text-white`}>
                  {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                </span>
                
                <span className="inline-flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.estimatedDuration} min
                </span>
              </div>
            </div>
            
            <div className="ml-6 flex-shrink-0 hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {lesson.tags.map((tag: string, index: number) => (
              <span 
                key={index}
                className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Lesson Content Component with XP Integration */}
        <LessonContent
          lesson={lesson}
          onComplete={handleComplete}
          isCompleted={false}
          userId={user.uid}
        />
      </div>
    </div>
  );
}