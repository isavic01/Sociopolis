import React from 'react';

interface LessonProgressProps {
  completed: boolean;
  timeSpent: number; // in minutes
  estimatedDuration: number; // in minutes
}

export function LessonProgress({ completed, timeSpent, estimatedDuration }: LessonProgressProps) {
  const progressPercentage = Math.min((timeSpent / estimatedDuration) * 100, 100);
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
        {completed && (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Spent */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
          <div className="text-sm text-gray-500">Time Spent</div>
        </div>
        
        {/* Estimated Duration */}
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">{formatTime(estimatedDuration)}</div>
          <div className="text-sm text-gray-500">Estimated Duration</div>
        </div>
        
        {/* Progress Percentage */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
          <div className="text-sm text-gray-500">Time Progress</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              completed ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}