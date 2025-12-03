import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LessonService } from '../../lesson/services/lessonService';

interface LessonArea {
  id: string;
  title: string;
  description: string;
  color: string;
  lessonId: string;
  position: { x: number; y: number };
  completed: boolean;
  progress: number; // 0-100
}

interface InteractiveMapProps {
  userId?: string;
}

export function InteractiveMap({ userId }: InteractiveMapProps) {
  const navigate = useNavigate();
  const [lessonAreas, setLessonAreas] = useState<LessonArea[]>([
    {
      id: 'communication',
      title: 'Communication Skills',
      description: 'Learn the fundamentals of effective communication',
      color: '#6297cb',
      lessonId: 'communication-basics',
      position: { x: 20, y: 30 },
      completed: false,
      progress: 0
    },
    {
      id: 'relationships',
      title: 'Building Relationships',
      description: 'Create and maintain meaningful connections',
      color: '#10B981',
      lessonId: 'building-relationships',
      position: { x: 70, y: 25 },
      completed: false,
      progress: 0
    },
    {
      id: 'emotional',
      title: 'Emotional Intelligence',
      description: 'Understand and manage emotions effectively',
      color: '#EC4899',
      lessonId: 'emotional-intelligence',
      position: { x: 25, y: 70 },
      completed: false,
      progress: 0
    },
    {
      id: 'conflict',
      title: 'Conflict Resolution',
      description: 'Master techniques for resolving conflicts peacefully',
      color: '#F59E0B',
      lessonId: 'conflict-resolution',
      position: { x: 75, y: 65 },
      completed: false,
      progress: 0
    }
  ]);

  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  // Load progress for each lesson area
  useEffect(() => {
    const loadProgress = async () => {
      if (!userId) return;

      try {
        const updatedAreas = await Promise.all(
          lessonAreas.map(async (area) => {
            try {
              const progress = await LessonService.getUserProgress(userId, area.lessonId);
              return {
                ...area,
                completed: progress?.completed || false,
                progress: progress?.completed ? 100 : 0
              };
            } catch (error) {
              console.error(`Failed to load progress for ${area.lessonId}:`, error);
              return area; // Return original area if progress loading fails
            }
          })
        );
        setLessonAreas(updatedAreas);
      } catch (error) {
        console.error('Failed to load lesson progress:', error);
      }
    };

    loadProgress();
  }, [userId]);

  const handleAreaClick = (area: LessonArea) => {
    navigate(`/lesson/${area.lessonId}`);
  };

  return (
    <div className="interactive-map">
      <div className="interactive-map__container">
        <svg 
          className="interactive-map__svg" 
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background gradient */}
          <defs>
            <radialGradient id="mapGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#F0F9FF" />
            </radialGradient>
            
            {/* Glow filters for circles */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100" height="100" fill="url(#mapGradient)" />
          
          {/* Decorative paths connecting areas */}
          <path 
            d="M 30 40 Q 50 30 60 35"
            stroke="#D1D5DB" 
            strokeWidth="0.2"
            fill="none"
            opacity="0.5"
          />
          <path 
            d="M 35 60 Q 50 50 65 55"
            stroke="#D1D5DB" 
            strokeWidth="0.2"
            fill="none"
            opacity="0.5"
          />

          {/* Lesson area circles and houses */}
          {lessonAreas.map((area) => (
            <g key={area.id}>
              {/* Background circle with progress */}
              <circle
                cx={area.position.x}
                cy={area.position.y}
                r="8"
                fill="white"
                stroke={area.color}
                strokeWidth="0.5"
                opacity="0.8"
                className="interactive-map__circle-bg"
              />
              
              {/* Progress circle */}
              <circle
                cx={area.position.x}
                cy={area.position.y}
                r="7"
                fill="none"
                stroke={area.color}
                strokeWidth="1"
                strokeDasharray={`${(area.progress / 100) * 44} 44`}
                strokeDashoffset="11"
                opacity={area.progress > 0 ? 1 : 0.3}
                transform={`rotate(-90 ${area.position.x} ${area.position.y})`}
                className="interactive-map__progress-circle"
              />
              
              {/* Glow effect on hover */}
              {hoveredArea === area.id && (
                <circle
                  cx={area.position.x}
                  cy={area.position.y}
                  r="10"
                  fill={area.color}
                  opacity="0.2"
                  filter="url(#glow)"
                  className="interactive-map__glow"
                />
              )}
              
              {/* House icon (simplified as colored rectangle) */}
              <g
                className="interactive-map__house"
                transform={`translate(${area.position.x - 3}, ${area.position.y - 3})`}
                onClick={() => handleAreaClick(area)}
                onMouseEnter={() => setHoveredArea(area.id)}
                onMouseLeave={() => setHoveredArea(null)}
              >
                {/* House base */}
                <rect
                  x="0"
                  y="2"
                  width="6"
                  height="4"
                  fill={area.color}
                  rx="0.5"
                  className="interactive-map__house-base"
                />
                
                {/* House roof */}
                <polygon
                  points="0,2 3,0 6,2"
                  fill={area.color}
                  opacity="0.8"
                  className="interactive-map__house-roof"
                />
                
                {/* House door */}
                <rect
                  x="2"
                  y="3.5"
                  width="2"
                  height="2.5"
                  fill="white"
                  rx="0.2"
                  opacity="0.8"
                />
                
                {/* Completion checkmark */}
                {area.completed && (
                  <g transform="translate(1, 1)">
                    <circle r="2" fill="white" opacity="0.9" />
                    <path
                      d="M 0.5 0 L 1.5 1 L 3.5 -1"
                      stroke="#10B981"
                      strokeWidth="0.3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </g>
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredArea && (
          <div className="interactive-map__tooltip">
            {(() => {
              const area = lessonAreas.find(a => a.id === hoveredArea);
              if (!area) return null;
              
              return (
                <div className="interactive-map__tooltip-content">
                  <h3 className="interactive-map__tooltip-title">{area.title}</h3>
                  <p className="interactive-map__tooltip-description">{area.description}</p>
                  <div className="interactive-map__tooltip-status">
                    {area.completed ? (
                      <span className="interactive-map__tooltip-completed">✓ Completed</span>
                    ) : (
                      <span className="interactive-map__tooltip-start">Click to start</span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}