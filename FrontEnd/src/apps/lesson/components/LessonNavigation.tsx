import React from 'react';

interface LessonNavigationProps {
  onGoBack: () => void;
}

export function LessonNavigation({ onGoBack }: LessonNavigationProps) {
  return (
    <nav className="lesson-navigation">
      <div className="lesson-navigation__container">
        <div className="lesson-navigation__content">
          <button
            onClick={onGoBack}
            className="btn-ghost--underline lesson-navigation__back-btn"
          >
            <svg className="lesson-navigation__back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </button>
          
          <div className="lesson-navigation__breadcrumb">
            <span>Sociopolis</span>
            <svg className="lesson-navigation__breadcrumb-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Lessons</span>
          </div>
        </div>
      </div>
    </nav>
  );
}