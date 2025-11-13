// Types and interfaces for the lesson system
export interface LessonContent {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonProgress {
  lessonId: string;
  userId: string;
  completed: boolean;
  completionDate?: Date;
  timeSpent: number; // in minutes
  score?: number;
  lastAccessedAt: Date;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface LessonCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

// Lesson service functions
export const LessonService = {
  // These will be implemented with Firebase calls
  async getLessonById(lessonId: string): Promise<LessonContent | null> {
    // Implementation will go here
    return null;
  },
  
  async getUserProgress(userId: string, lessonId: string): Promise<LessonProgress | null> {
    // Implementation will go here
    return null;
  },
  
  async updateProgress(progress: Partial<LessonProgress>): Promise<void> {
    // Implementation will go here
  },
  
  async getLessonsByCategory(categoryId: string): Promise<LessonContent[]> {
    // Implementation will go here
    return [];
  }
};

