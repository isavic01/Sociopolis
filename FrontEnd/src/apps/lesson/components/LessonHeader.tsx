import React from 'react';
import type { LessonContent, LessonProgress } from '../lesson';

interface LessonHeaderProps {
  lesson: LessonContent;
  progress: LessonProgress | null;
}

export function LessonHeader({ lesson, progress }: LessonHeaderProps) {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'lesson-header__difficulty--beginner';
      case 'intermediate': return 'lesson-header__difficulty--intermediate';
      case 'advanced': return 'lesson-header__difficulty--advanced';
      default: return 'lesson-header__difficulty--default';
    }
  };

  return (
    <div className="lesson-header">
      <div className="lesson-header__content">
        <div className="lesson-header__main">
          <h1 className="lesson-header__title">{lesson.title}</h1>
          <p className="lesson-header__description">{lesson.description}</p>
          
          <div className="lesson-header__meta">
            {/* Difficulty Badge */}
            <span className={`lesson-header__difficulty ${getDifficultyClass(lesson.difficulty)}`}>
              {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
            </span>
            
            {/* Duration */}
            <span className="lesson-header__duration">
              <svg className="lesson-header__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lesson.estimatedDuration} min
            </span>
            
            {/* Completion Status */}
            {progress?.completed && (
              <span className="lesson-header__completed">
                <svg className="lesson-header__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed
              </span>
            )}
          </div>
        </div>
        
        {/* Lesson Image */}
        {lesson.imageUrl && (
          <div className="lesson-header__image">
            <img 
              src={lesson.imageUrl} 
              alt={lesson.title}
              className="lesson-header__img"
            />
          </div>
        )}
      </div>
      
      {/* Tags */}
      {lesson.tags.length > 0 && (
        <div className="lesson-header__tags">
          {lesson.tags.map((tag, index) => (
            <span 
              key={index}
              className="lesson-header__tag"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}