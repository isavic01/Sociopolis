import React, { useState } from 'react';
import type { LessonContent as LessonContentType } from '../lesson';

interface LessonContentProps {
  lesson: LessonContentType;
  onComplete: (score?: number) => void;
  isCompleted: boolean;
}

export function LessonContent({ lesson, onComplete, isCompleted }: LessonContentProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  // Split content into sections for better readability
  const sections = lesson.content.split('\n\n').filter(section => section.trim());

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleCompleteLesson = () => {
    onComplete();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Video Section */}
      {lesson.videoUrl && (
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

      {/* Content Sections */}
      {!showQuiz && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Section {currentSection + 1} of {sections.length}
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
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: sections[currentSection]?.replace(/\n/g, '<br />') || '' 
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
              {currentSection === sections.length - 1 ? 'Complete Lesson' : 'Next'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Completion Section */}
      {showQuiz && (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isCompleted ? 'Lesson Already Completed!' : 'Congratulations!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isCompleted 
                ? 'You have already completed this lesson. Great job!' 
                : 'You have finished reading all the content. Ready to mark this lesson as complete?'
              }
            </p>
          </div>

          {!isCompleted && (
            <button
              onClick={handleCompleteLesson}
              className="px-8 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Mark as Complete
            </button>
          )}

          {isCompleted && (
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed
            </div>
          )}
        </div>
      )}
    </div>
  );
}