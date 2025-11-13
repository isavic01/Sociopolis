import React from 'react';

interface LessonNavigationProps {
  onGoBack: () => void;
}

export function LessonNavigation({ onGoBack }: LessonNavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center">
          <button
            onClick={onGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </button>
          
          <div className="ml-4 flex items-center text-sm text-gray-500">
            <span>Sociopolis</span>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Lessons</span>
          </div>
        </div>
      </div>
    </nav>
  );
}