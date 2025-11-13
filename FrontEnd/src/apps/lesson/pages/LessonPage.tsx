import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Placeholder lesson data - Replace with actual backend calls later
const PLACEHOLDER_LESSONS: Record<string, any> = {
  'communication-basics': {
    id: 'communication-basics',
    title: 'Communication Skills',
    description: 'Master the fundamentals of effective communication in social settings',
    difficulty: 'beginner',
    estimatedDuration: 15,
    tags: ['communication', 'social-skills', 'listening'],
    sections: [
      {
        title: 'Introduction to Communication',
        content: 'Welcome to Communication Skills! 🗣️\n\nIn this lesson, you\'ll learn the essential building blocks of effective communication. Communication is the exchange of information, ideas, and feelings between people.',
      },
      {
        title: 'Key Communication Elements',
        content: '**Active Listening** - Pay full attention to the speaker\n\n**Clear Expression** - Say what you mean in simple terms\n\n**Body Language** - Your gestures and posture matter\n\n**Tone of Voice** - How you say something is as important as what you say',
      },
      {
        title: 'Active Listening Tips',
        content: '1. Make eye contact with the speaker\n2. Avoid interrupting\n3. Ask clarifying questions\n4. Paraphrase to show understanding\n5. Show engagement through nodding and facial expressions',
      },
      {
        title: 'Practice & Conclusion',
        content: '**Practice Exercise:**\nNext time you have a conversation, try to focus entirely on what the other person is saying. Don\'t think about your response while they\'re talking.\n\n**Remember:** Good communication is a skill that improves with practice!',
      },
    ],
  },
  'emotional-intelligence': {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    description: 'Develop your ability to understand and manage emotions effectively',
    difficulty: 'intermediate',
    estimatedDuration: 20,
    tags: ['emotions', 'self-awareness', 'empathy'],
    sections: [
      {
        title: 'Understanding Emotional Intelligence',
        content: 'Emotional Intelligence (EI) is your ability to recognize, understand, and manage emotions—both your own and others\'. 🧠❤️',
      },
      {
        title: 'The Five Components of EI',
        content: '1. **Self-Awareness** - Understanding your own emotions\n2. **Self-Regulation** - Controlling impulsive feelings\n3. **Motivation** - Being driven to achieve\n4. **Empathy** - Understanding others\' feelings\n5. **Social Skills** - Building healthy relationships',
      },
      {
        title: 'Why EI Matters',
        content: '• Better relationships at home and work\n• Improved mental health\n• Greater success in achieving goals\n• Enhanced leadership abilities\n• Reduced stress and anxiety',
      },
      {
        title: 'Daily Practice',
        content: 'Keep an emotion journal. Each day, write down:\n- What emotions you felt\n- What triggered them\n- How you responded\n- What you learned\n\n**Remember:** Emotional intelligence can be developed at any age!',
      },
    ],
  },
  'building-relationships': {
    id: 'building-relationships',
    title: 'Building Relationships',
    description: 'Learn how to create and maintain meaningful connections with others',
    difficulty: 'beginner',
    estimatedDuration: 18,
    tags: ['relationships', 'friendship', 'trust'],
    sections: [
      {
        title: 'Building Meaningful Relationships',
        content: 'Strong relationships are the foundation of a happy, fulfilling life. Let\'s learn how to build them! 🤝💙',
      },
      {
        title: 'What Makes a Good Relationship?',
        content: '**Trust** - Being reliable and keeping promises\n\n**Communication** - Open, honest dialogue\n\n**Mutual Respect** - Valuing each other\'s opinions\n\n**Quality Time** - Spending meaningful time together',
      },
      {
        title: 'The Five Love Languages',
        content: '1. Words of Affirmation\n2. Quality Time\n3. Receiving Gifts\n4. Acts of Service\n5. Physical Touch\n\nUnderstanding these helps you connect better with others!',
      },
      {
        title: 'Action Steps',
        content: '- Reach out to someone you haven\'t talked to in a while\n- Practice active listening in your next conversation\n- Identify your love language\n\n**Remember:** Building relationships takes time and effort, but the rewards are immeasurable!',
      },
    ],
  },
  'conflict-resolution': {
    id: 'conflict-resolution',
    title: 'Conflict Resolution',
    description: 'Master advanced techniques for resolving conflicts peacefully',
    difficulty: 'advanced',
    estimatedDuration: 25,
    tags: ['conflict', 'resolution', 'negotiation'],
    sections: [
      {
        title: 'Mastering Conflict Resolution',
        content: 'Conflict is a natural part of relationships. The key is learning how to resolve it constructively. ⚖️🕊️',
      },
      {
        title: 'The Five Conflict Styles',
        content: '1. **Competing** (I win, you lose)\n2. **Avoiding** (Lose-lose)\n3. **Accommodating** (I lose, you win)\n4. **Compromising** (We both win and lose a little)\n5. **Collaborating** (Win-win) ✨',
      },
      {
        title: 'Steps to Resolve Conflict',
        content: '1. Stay Calm - Take deep breaths\n2. Listen Actively - Hear their perspective\n3. Find Common Ground\n4. Focus on the Issue, Not the Person\n5. Brainstorm Solutions Together\n6. Agree on a Solution\n7. Follow Up',
      },
      {
        title: 'Advanced Techniques',
        content: '**The "XYZ" Statement:**\n"When you do X in situation Y, I feel Z."\n\n**The Pause Technique:**\nTake a 10-minute break if emotions run high.\n\n**Remember:** The goal isn\'t to win—it\'s to preserve the relationship!',
      },
    ],
  },
};

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Get lesson data (placeholder for now)
  const lesson = id ? PLACEHOLDER_LESSONS[id] : null;

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600 mb-6">This lesson doesn't exist yet.</p>
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

  const totalSections = lesson.sections.length;
  const progressPercentage = ((currentSection + 1) / totalSections) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = () => {
    console.log('✅ Lesson completed! (Connect to backend here)');
    navigate('/landing');
  };

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
            
            <div className="text-sm text-gray-500 hidden sm:block">
              Section {currentSection + 1} of {totalSections}
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
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{lesson.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{lesson.description}</p>
              
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

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-semibold">Progress</span>
            <span className="font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            />
          </div>
        </motion.div>

        {/* Lesson Content */}
        {!isCompleted ? (
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {lesson.sections[currentSection].title}
              </h2>
              
              <div className="prose prose-lg max-w-none">
                {lesson.sections[currentSection].content.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentSection === 0}
                className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex gap-2">
                {lesson.sections.map((_: any, idx: number) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSection
                        ? 'w-8 bg-blue-600'
                        : idx < currentSection
                        ? 'w-2 bg-green-500'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                {currentSection === totalSections - 1 ? 'Finish' : 'Next'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-3">🎉 Congratulations!</h3>
            <p className="text-lg text-gray-600 mb-8">
              You've completed the "{lesson.title}" lesson!
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentSection(0)}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Review Lesson
              </button>
              <button
                onClick={handleComplete}
                className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}