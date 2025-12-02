import React from 'react';
import type { LessonContent, LessonProgress } from '../lesson';

interface LessonHeaderProps {
  lesson: LessonContent;
  progress: LessonProgress | null;
}

export function LessonHeader({ lesson, progress }: LessonHeaderProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyTextColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-700';
      case 'intermediate': return 'text-yellow-700';
      case 'advanced': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <h1 
            className="font-bold text-gray-900 mb-2 break-words leading-tight"
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
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Difficulty Badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)} text-white`}>
              {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
            </span>
            
            {/* Duration */}
            <span className="inline-flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.estimatedDuration} min
            </span>
            
            {/* Completion Status */}
            {progress?.completed && (
              <span className="inline-flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed
              </span>
            )}
          </div>
        </div>
        
        {/* Lesson Image */}
        {lesson.imageUrl && (
          <div className="ml-6 flex-shrink-0">
            <img 
              src={lesson.imageUrl} 
              alt={lesson.title}
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
      
      {/* Tags */}
      {lesson.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {lesson.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}