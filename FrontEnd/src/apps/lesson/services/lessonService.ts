import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import type { LessonContent, LessonProgress } from '../lesson';

// ===== PLACEHOLDER DATA =====
// This is mock data for UI development. Replace with real Firebase calls when ready.
const PLACEHOLDER_LESSONS: Record<string, LessonContent> = {
  'communication-basics': {
    id: 'communication-basics',
    title: 'Communication Skills',
    description: 'Master the fundamentals of effective communication in social settings',
    content: `Welcome to Communication Skills! 🗣️

In this lesson, you'll learn the essential building blocks of effective communication.

**What is Communication?**
Communication is the exchange of information, ideas, and feelings between people. It's not just about talking—it's about understanding and being understood.

**Key Communication Elements:**
• Active Listening - Pay full attention to the speaker
• Clear Expression - Say what you mean in simple terms
• Body Language - Your gestures and posture matter
• Tone of Voice - How you say something is as important as what you say

**Active Listening Tips:**
1. Make eye contact with the speaker
2. Avoid interrupting
3. Ask clarifying questions
4. Paraphrase to show understanding
5. Show engagement through nodding and facial expressions

**Practice Exercise:**
Next time you have a conversation, try to focus entirely on what the other person is saying. Don't think about your response while they're talking. Notice how this changes the quality of your interaction.

**Remember:** Good communication is a skill that improves with practice. Start small and be patient with yourself!`,
    imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    difficulty: 'beginner',
    estimatedDuration: 15,
    tags: ['communication', 'social-skills', 'listening', 'basics'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'emotional-intelligence': {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    description: 'Develop your ability to understand and manage emotions effectively',
    content: `Understanding Emotional Intelligence 🧠❤️

Emotional Intelligence (EI) is your ability to recognize, understand, and manage emotions—both your own and others'.

**The Five Components of EI:**

1. **Self-Awareness**
Understanding your own emotions, strengths, weaknesses, and triggers. When you're self-aware, you know how your feelings affect your thoughts and behavior.

2. **Self-Regulation**
The ability to control impulsive feelings and behaviors. It's about thinking before you act and managing your emotions in healthy ways.

3. **Motivation**
Being driven to achieve for the sake of accomplishment, not just external rewards. This includes having a passion for your goals.

4. **Empathy**
Understanding and sharing the feelings of others. It's the ability to put yourself in someone else's shoes and see things from their perspective.

5. **Social Skills**
Building and maintaining healthy relationships. This includes communication, conflict resolution, and collaboration.

**Why EI Matters:**
• Better relationships at home and work
• Improved mental health
• Greater success in achieving goals
• Enhanced leadership abilities
• Reduced stress and anxiety

**Daily Practice:**
Keep an emotion journal. Each day, write down:
- What emotions you felt
- What triggered them
- How you responded
- What you learned

**Remember:** Emotional intelligence can be developed at any age. The more you practice, the stronger it becomes!`,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    difficulty: 'intermediate',
    estimatedDuration: 20,
    tags: ['emotions', 'self-awareness', 'empathy', 'growth'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'building-relationships': {
    id: 'building-relationships',
    title: 'Building Relationships',
    description: 'Learn how to create and maintain meaningful connections with others',
    content: `Building Meaningful Relationships 🤝💙

Strong relationships are the foundation of a happy, fulfilling life. Let's learn how to build them!

**What Makes a Good Relationship?**

**Trust**
Trust is the cornerstone of any relationship. It's built through:
• Being reliable and keeping promises
• Being honest, even when it's difficult
• Maintaining confidentiality
• Showing consistency in your actions

**Communication**
Open, honest communication keeps relationships healthy:
• Express your thoughts and feelings clearly
• Listen actively without judgment
• Address conflicts directly but kindly
• Share both good and challenging news

**Mutual Respect**
Healthy relationships are built on mutual respect:
• Value each other's opinions
• Respect boundaries
• Appreciate differences
• Support each other's goals

**Quality Time**
Relationships need nurturing:
• Spend meaningful time together
• Be present (put away distractions)
• Create shared experiences
• Show genuine interest in their life

**The Five Love Languages:**
1. Words of Affirmation - Verbal compliments and encouragement
2. Quality Time - Undivided attention
3. Receiving Gifts - Thoughtful presents
4. Acts of Service - Doing helpful things
5. Physical Touch - Hugs, pats on the back, etc.

**Action Steps:**
- Reach out to someone you haven't talked to in a while
- Practice active listening in your next conversation
- Identify your love language and those of people close to you

**Remember:** Building relationships takes time and effort, but the rewards are immeasurable!`,
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
    difficulty: 'beginner',
    estimatedDuration: 18,
    tags: ['relationships', 'friendship', 'trust', 'connection'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'conflict-resolution': {
    id: 'conflict-resolution',
    title: 'Conflict Resolution',
    description: 'Master advanced techniques for resolving conflicts peacefully and constructively',
    content: `Mastering Conflict Resolution ⚖️🕊️

Conflict is a natural part of relationships. The key is learning how to resolve it constructively.

**Understanding Conflict**

Conflict isn't inherently bad—it can lead to growth, better understanding, and stronger relationships when handled well.

**Common Causes of Conflict:**
• Miscommunication or misunderstanding
• Different values or priorities
• Unmet needs or expectations
• Personality clashes
• Competition for resources

**The Five Conflict Resolution Styles:**

1. **Competing** (I win, you lose)
Assertive but uncooperative. Best when quick decisions are needed.

2. **Avoiding** (Lose-lose)
Neither assertive nor cooperative. Useful when issue is trivial or when you need time to cool down.

3. **Accommodating** (I lose, you win)
Unassertive but cooperative. Good when preserving relationships is more important than the issue.

4. **Compromising** (We both win and lose a little)
Moderate assertiveness and cooperation. Works when time is limited or both parties have equal power.

5. **Collaborating** (Win-win)
Both assertive and cooperative. Best approach for important issues where both parties' needs matter.

**Steps to Resolve Conflict:**

**Step 1: Stay Calm**
Take deep breaths. If you're too upset, take a break before discussing.

**Step 2: Listen Actively**
Let the other person fully express their perspective without interrupting.

**Step 3: Find Common Ground**
Identify what you both agree on or what you both want to achieve.

**Step 4: Focus on the Issue, Not the Person**
Use "I" statements: "I feel frustrated when..." instead of "You always..."

**Step 5: Brainstorm Solutions Together**
Come up with multiple options before deciding on the best one.

**Step 6: Agree on a Solution**
Choose a solution that addresses both parties' needs as much as possible.

**Step 7: Follow Up**
Check in later to ensure the solution is working.

**Advanced Techniques:**

**The "XYZ" Statement:**
"When you do X in situation Y, I feel Z."
Example: "When you cancel plans at the last minute, I feel disrespected."

**The Pause Technique:**
If emotions run high, say "I need a moment" and take a 10-minute break.

**The Third Option:**
When stuck between two choices, brainstorm a creative third option that satisfies both parties.

**Practice Scenario:**
Think of a recent conflict you had. How could you have applied these techniques? What would you do differently?

**Remember:** The goal isn't to win the argument—it's to preserve the relationship while addressing the issue!`,
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400',
    difficulty: 'advanced',
    estimatedDuration: 25,
    tags: ['conflict', 'resolution', 'negotiation', 'advanced'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// ===== PLACEHOLDER SERVICE =====
// Use this for development. Switch to LessonFirebaseService when backend is ready.
export class LessonPlaceholderService {
  static async getLessonById(lessonId: string): Promise<LessonContent | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return PLACEHOLDER_LESSONS[lessonId] || null;
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
    return Object.values(PLACEHOLDER_LESSONS);
  }
}

// ===== FIREBASE SERVICE (for production) =====
export class LessonFirebaseService {
  // Get a specific lesson by ID
  static async getLessonById(lessonId: string): Promise<LessonContent | null> {
    try {
      const lessonRef = doc(db, 'lessons', lessonId);
      const lessonSnap = await getDoc(lessonRef);
      
      if (lessonSnap.exists()) {
        const data = lessonSnap.data();
        return {
          id: lessonSnap.id,
          title: data.title,
          description: data.description,
          content: data.content,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          difficulty: data.difficulty,
          estimatedDuration: data.estimatedDuration,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching lesson:', error);
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
          content: data.content,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          difficulty: data.difficulty,
          estimatedDuration: data.estimatedDuration,
          tags: data.tags || [],
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
          content: data.content,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          difficulty: data.difficulty,
          estimatedDuration: data.estimatedDuration,
          tags: data.tags || [],
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
}

// ===== EXPORT THE SERVICE TO USE =====
// 🔄 Switch between LessonPlaceholderService and LessonFirebaseService here
export const LessonService = LessonPlaceholderService; // Change to LessonFirebaseService when ready