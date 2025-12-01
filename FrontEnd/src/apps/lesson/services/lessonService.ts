import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { awardXP } from '../../services/xpService';
import type { LessonContent, LessonProgress } from '../lesson';

// Temporary lesson data until Firebase is populated
const LESSON_DATA: Record<string, any> = {
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
    checkIns: [
      { id: 'comm-q1', section: 0, prompt: 'What is a key part of active listening?', options: ['Interrupt to clarify', 'Maintain eye contact and focus', 'Think about your reply immediately', 'Speak louder'], correctIndex: 1, xpReward: 10 },
      { id: 'comm-q2', section: 1, prompt: 'Which element relates to gestures and posture?', options: ['Tone of voice', 'Body language', 'Active listening', 'Clear expression'], correctIndex: 1, xpReward: 10 },
      { id: 'comm-q3', section: 1, prompt: 'Tone of voice mainly affects:', options: ['What is said', 'How meaning is perceived', 'Grammar rules', 'Vocabulary size'], correctIndex: 1, xpReward: 10 },
      { id: 'comm-q4', section: 2, prompt: 'Paraphrasing shows:', options: ['Disagreement', 'Understanding', 'Disinterest', 'Confusion'], correctIndex: 1, xpReward: 12 },
      { id: 'comm-q5', section: 2, prompt: 'Interrupting usually:', options: ['Builds trust', 'Speeds empathy', 'Breaks listening flow', 'Improves clarity'], correctIndex: 2, xpReward: 12 },
      { id: 'comm-q6', section: 0, prompt: 'Communication is the exchange of:', options: ['Only words', 'Information, ideas, and feelings', 'Just emotions', 'Body movement only'], correctIndex: 1, xpReward: 8 },
      { id: 'comm-q7', section: 3, prompt: 'Suggested exercise focuses on:', options: ['Thinking of replies early', 'Filling silence fast', 'Fully focusing on the speaker', 'Correcting the speaker'], correctIndex: 2, xpReward: 12 },
      { id: 'comm-q8', section: 1, prompt: 'Clear expression means:', options: ['Using jargon', 'Speaking vaguely', 'Saying what you mean simply', 'Talking rapidly'], correctIndex: 2, xpReward: 10 },
      { id: 'comm-q9', section: 0, prompt: 'Listening vs hearing: listening is:', options: ['Passive', 'Intentional and focused', 'Uncontrolled', 'Impossible to improve'], correctIndex: 1, xpReward: 10 },
      { id: 'comm-q10', section: 2, prompt: 'A good follow-up listening action:', options: ['Ignore emotions', 'Ask clarifying questions', 'Talk over them', 'Look away'], correctIndex: 1, xpReward: 12 },
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
    checkIns: [
      { id: 'rel-q1', section: 0, prompt: 'Foundation of strong relationships:', options: ['Trust', 'Distance', 'Silence', 'Competition'], correctIndex: 0, xpReward: 10 },
      { id: 'rel-q2', section: 1, prompt: 'Keeping promises builds:', options: ['Confusion', 'Trust', 'Distance', 'Silence'], correctIndex: 1, xpReward: 10 },
      { id: 'rel-q3', section: 1, prompt: 'Open dialogue represents:', options: ['Competition', 'Communication', 'Withdrawal', 'Isolation'], correctIndex: 1, xpReward: 10 },
      { id: 'rel-q4', section: 2, prompt: 'Love language that values undivided attention:', options: ['Quality Time', 'Gifts', 'Acts of Service', 'Physical Touch'], correctIndex: 0, xpReward: 12 },
      { id: 'rel-q5', section: 2, prompt: 'Saying encouraging words uses:', options: ['Words of Affirmation', 'Acts of Service', 'Gifts', 'Silence'], correctIndex: 0, xpReward: 10 },
      { id: 'rel-q6', section: 3, prompt: 'Suggested action: reach out to:', options: ['Someone you argue with', 'Someone you have not talked to', 'No one', 'Only yourself'], correctIndex: 1, xpReward: 10 },
      { id: 'rel-q7', section: 1, prompt: 'Respecting boundaries shows:', options: ['Control', 'Mutual Respect', 'Competition', 'Distance'], correctIndex: 1, xpReward: 12 },
      { id: 'rel-q8', section: 0, prompt: 'Meaningful time together is called:', options: ['Silence', 'Quality Time', 'Withdrawal', 'Delay'], correctIndex: 1, xpReward: 8 },
      { id: 'rel-q9', section: 2, prompt: 'Acts of Service example:', options: ['Ignoring chores', 'Helping with a task', 'Silent treatment', 'Walking away'], correctIndex: 1, xpReward: 10 },
      { id: 'rel-q10', section: 3, prompt: 'Active listening involves:', options: ['Thinking ahead only', 'Fully focusing', 'Avoiding eye contact', 'Immediate correction'], correctIndex: 1, xpReward: 12 },
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
        content: 'Emotional Intelligence (EI) is your ability to recognize, understand, and manage emotions—both your own and others. 🧠❤️',
      },
      {
        title: 'The Five Components of EI',
        content: '1. **Self-Awareness** - Understanding your own emotions\n2. **Self-Regulation** - Controlling impulsive feelings\n3. **Motivation** - Being driven to achieve\n4. **Empathy** - Understanding others feelings\n5. **Social Skills** - Building healthy relationships',
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
    checkIns: [
      { id: 'ei-q1', section: 0, prompt: 'Emotional Intelligence involves managing:', options: ['Only other people emotions', 'Both your own and others emotions', 'Only stress', 'Only anger'], correctIndex: 1, xpReward: 10 },
      { id: 'ei-q2', section: 1, prompt: 'Recognizing your triggers is part of:', options: ['Empathy', 'Self-Awareness', 'Motivation', 'Social Skills'], correctIndex: 1, xpReward: 10 },
      { id: 'ei-q3', section: 1, prompt: 'Waiting before reacting demonstrates:', options: ['Self-Regulation', 'Motivation', 'Empathy', 'Stress'], correctIndex: 0, xpReward: 12 },
      { id: 'ei-q4', section: 1, prompt: 'Putting yourself in someone shoes is:', options: ['Motivation', 'Empathy', 'Self-Awareness', 'Self-Regulation'], correctIndex: 1, xpReward: 10 },
      { id: 'ei-q5', section: 1, prompt: 'Driving toward goals for internal reasons reflects:', options: ['Motivation', 'Empathy', 'Social Skills', 'Stress'], correctIndex: 0, xpReward: 10 },
      { id: 'ei-q6', section: 2, prompt: 'A benefit of EI is:', options: ['More isolation', 'Worse leadership', 'Better relationships', 'Higher confusion'], correctIndex: 2, xpReward: 10 },
      { id: 'ei-q7', section: 3, prompt: 'Emotion journaling helps build:', options: ['Avoidance', 'Self-Awareness', 'Conflict', 'Denial'], correctIndex: 1, xpReward: 12 },
      { id: 'ei-q8', section: 0, prompt: 'EI can be developed:', options: ['Only in childhood', 'At any age', 'Only by leaders', 'Not at all'], correctIndex: 1, xpReward: 8 },
      { id: 'ei-q9', section: 1, prompt: 'Social Skills contribute to:', options: ['Isolation', 'Relationship building', 'Less trust', 'Avoidance'], correctIndex: 1, xpReward: 10 },
      { id: 'ei-q10', section: 2, prompt: 'Reduced stress comes from improving:', options: ['Conflict only', 'Emotional Intelligence', 'Vocabulary', 'Posture'], correctIndex: 1, xpReward: 12 },
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
        content: '**The "XYZ" Statement:**\n"When you do X in situation Y, I feel Z."\n\n**The Pause Technique:**\nTake a 10-minute break if emotions run high.\n\n**Remember:** The goal is not to win—it is to preserve the relationship!',
      },
    ],
    checkIns: [
      { id: 'conf-q1', section: 0, prompt: 'Conflict can lead to:', options: ['Growth if handled well', 'Only resentment', 'No learning', 'Instant harmony'], correctIndex: 0, xpReward: 10 },
      { id: 'conf-q2', section: 1, prompt: 'Style aiming for win-win:', options: ['Competing', 'Avoiding', 'Collaborating', 'Accommodating'], correctIndex: 2, xpReward: 12 },
      { id: 'conf-q3', section: 1, prompt: 'Avoiding style is:', options: ['Assertive & cooperative', 'Neither assertive nor cooperative', 'Unassertive but cooperative', 'Only cooperative'], correctIndex: 1, xpReward: 10 },
      { id: 'conf-q4', section: 2, prompt: 'First step in resolving conflict:', options: ['Brainstorm', 'Stay Calm', 'Follow Up', 'Compromise'], correctIndex: 1, xpReward: 10 },
      { id: 'conf-q5', section: 2, prompt: 'Focus on the ______ not the person.', options: ['Emotion', 'Issue', 'History', 'Silence'], correctIndex: 1, xpReward: 12 },
      { id: 'conf-q6', section: 2, prompt: 'Generating multiple solutions before choosing:', options: ['Brainstorming', 'Competing', 'Avoiding', 'Judging'], correctIndex: 0, xpReward: 10 },
      { id: 'conf-q7', section: 3, prompt: '"XYZ" statement helps express:', options: ['Blame', 'Clarity & feeling', 'Avoidance', 'Winning'], correctIndex: 1, xpReward: 12 },
      { id: 'conf-q8', section: 3, prompt: 'Taking a break if emotions spike is:', options: ['Avoidance forever', 'Pause Technique', 'Compromise', 'Competition'], correctIndex: 1, xpReward: 10 },
      { id: 'conf-q9', section: 1, prompt: 'Compromising means:', options: ['Both give a little', 'One wins completely', 'No resolution', 'Avoiding forever'], correctIndex: 0, xpReward: 10 },
      { id: 'conf-q10', section: 2, prompt: 'Following up ensures:', options: ['Uncertainty', 'Solution is working', 'More conflict', 'Avoidance'], correctIndex: 1, xpReward: 12 },
    ],
  },
};

// ===== PLACEHOLDER SERVICE =====
// Use this for development. Switch to LessonFirebaseService when backend is ready.
export class LessonPlaceholderService {
  static async getLessonById(lessonId: string): Promise<LessonContent | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // No hardcoded data - return null to force backend usage
    console.log(`⚠️ [PLACEHOLDER] Lesson ${lessonId} not found - switch to LessonFirebaseService for real data`);
    return null;
  }

  static async getUserProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return null for now - no saved progress in placeholder
    return null;
  }

  static async updateProgress(userId: string, lessonId: string, progressData: Partial<LessonProgress>): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In placeholder mode, just log it
    console.log('📝 [PLACEHOLDER] Progress updated:', { userId, lessonId, progressData });
  }

  static async getAllLessons(): Promise<LessonContent[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log('⚠️ [PLACEHOLDER] No lessons available - switch to LessonFirebaseService for real data');
    return [];
  }

  static async submitCheckIn(userId: string, lessonId: string, checkInId: string, selectedAnswer: number): Promise<{ correct: boolean; xpReward: number; totalXP?: number }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`⚠️ [PLACEHOLDER] Cannot submit check-in for lesson ${lessonId} - switch to LessonFirebaseService`);
    throw new Error('Placeholder service cannot process check-ins - switch to LessonFirebaseService');
  }

  static async getCheckInProgress(userId: string, lessonId: string): Promise<Record<string, { correct: boolean; xpEarned: number }>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return empty progress in placeholder mode
    return {};
  }
}

// ===== FIREBASE SERVICE (for production) =====
export class LessonFirebaseService {
  // Get a specific lesson by ID
  static async getLessonById(lessonId: string): Promise<LessonContent | null> {
    try {
      // First try to get from Firebase
      const lessonRef = doc(db, 'lessons', lessonId);
      const lessonSnap = await getDoc(lessonRef);
      
      if (lessonSnap.exists()) {
        const data = lessonSnap.data();
        return {
          id: lessonSnap.id,
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          estimatedDuration: data.estimatedDuration,
          tags: data.tags || [],
          sections: data.sections || [],
          checkIns: data.checkIns || [],
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      
      // Fallback to temporary data if not in Firebase yet
      const lessonData = LESSON_DATA[lessonId];
      if (lessonData) {
        console.log(`📚 Loading lesson from temporary data: ${lessonData.title}`);
        return {
          ...lessonData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      // Fallback to temporary data on error
      const lessonData = LESSON_DATA[lessonId];
      if (lessonData) {
        return { ...lessonData, createdAt: new Date(), updatedAt: new Date() };
      }
      return null;
    }
  }

  // Get user's progress for a specific lesson
  static async getUserProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
    try {
      const progressRef = doc(db, 'userProgress', `${userId}_${lessonId}`);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        const data = progressSnap.data();
        return {
          lessonId: data.lessonId,
          userId: data.userId,
          completed: data.completed,
          completionDate: data.completionDate?.toDate(),
          timeSpent: data.timeSpent || 0,
          score: data.score,
          lastAccessedAt: data.lastAccessedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  // Update or create user progress
  static async updateProgress(userId: string, lessonId: string, progressData: Partial<LessonProgress>): Promise<void> {
    try {
      const progressRef = doc(db, 'userProgress', `${userId}_${lessonId}`);
      const updateData = {
        ...progressData,
        userId,
        lessonId,
        lastAccessedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(progressRef, updateData, { merge: true });
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  // Get all lessons by category
  static async getLessonsByCategory(categoryId: string): Promise<LessonContent[]> {
    try {
      const lessonsRef = collection(db, 'lessons');
      const q = query(
        lessonsRef,
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const lessons: LessonContent[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lessons.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          estimatedDuration: data.estimatedDuration,
          tags: data.tags || [],
          sections: data.sections || [],
          checkIns: data.checkIns || [],
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      
      return lessons;
    } catch (error) {
      console.error('Error fetching lessons by category:', error);
      return [];
    }
  }

  // Get all available lessons
  static async getAllLessons(): Promise<LessonContent[]> {
    try {
      const lessonsRef = collection(db, 'lessons');
      const q = query(lessonsRef, orderBy('createdAt', 'asc'));
      
      const querySnapshot = await getDocs(q);
      const lessons: LessonContent[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lessons.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          estimatedDuration: data.estimatedDuration,
          tags: data.tags || [],
          sections: data.sections || [],
          checkIns: data.checkIns || [],
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      
      return lessons;
    } catch (error) {
      console.error('Error fetching all lessons:', error);
      return [];
    }
  }

  // Enhanced method to handle check-ins and award XP to backend
  static async submitCheckIn(userId: string, lessonId: string, checkInId: string, selectedAnswer: number): Promise<{ correct: boolean; xpReward: number; totalXP?: number }> {
    try {
      const lesson = await this.getLessonById(lessonId);
      if (!lesson) throw new Error('Lesson not found');

      const checkIn = lesson.checkIns.find(ci => ci.id === checkInId);
      if (!checkIn) throw new Error('Check-in not found');

      const correct = selectedAnswer === checkIn.correctIndex;
      let totalXP = 0;
      
      // Award XP to backend if answer is correct
      if (correct) {
        try {
          totalXP = await awardXP(userId, checkIn.xpReward);
          console.log(`✅ User ${userId} earned ${checkIn.xpReward} XP for correct answer. Total XP: ${totalXP}`);
        } catch (error) {
          console.error('Failed to award XP:', error);
          // Continue even if XP award fails
        }
      }

      // Update lesson progress with check-in result
      await this.updateCheckInProgress(userId, lessonId, checkInId, correct, correct ? checkIn.xpReward : 0);

      return { correct, xpReward: correct ? checkIn.xpReward : 0, totalXP };
    } catch (error) {
      console.error('Error submitting check-in:', error);
      throw error;
    }
  }

  // New method to track individual check-in progress
  static async updateCheckInProgress(userId: string, lessonId: string, checkInId: string, correct: boolean, xpEarned: number): Promise<void> {
    try {
      const progressRef = doc(db, 'checkInProgress', `${userId}_${lessonId}_${checkInId}`);
      
      await setDoc(progressRef, {
        userId,
        lessonId,
        checkInId,
        correct,
        xpEarned,
        completedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating check-in progress:', error);
      // Don't throw error - this is supplementary tracking
    }
  }

  // Get user's check-in progress for a lesson
  static async getCheckInProgress(userId: string, lessonId: string): Promise<Record<string, { correct: boolean; xpEarned: number }>> {
    try {
      const progressRef = collection(db, 'checkInProgress');
      const q = query(
        progressRef,
        where('userId', '==', userId),
        where('lessonId', '==', lessonId)
      );
      
      const querySnapshot = await getDocs(q);
      const progress: Record<string, { correct: boolean; xpEarned: number }> = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        progress[data.checkInId] = {
          correct: data.correct,
          xpEarned: data.xpEarned
        };
      });
      
      return progress;
    } catch (error) {
      console.error('Error fetching check-in progress:', error);
      return {};
    }
  }
}

// ===== EXPORT THE SERVICE TO USE =====
// 🔄 Switch between LessonPlaceholderService and LessonFirebaseService here
export const LessonService = LessonFirebaseService; // Switched to Firebase service for real backend data