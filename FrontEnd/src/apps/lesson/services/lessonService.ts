import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import type { LessonContent, LessonProgress } from '../lesson';

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