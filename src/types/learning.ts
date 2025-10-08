export interface Student {
  id: string;
  name: string;
  email: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  interests: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  durationMinutes: number;
}

export interface StudentInteraction {
  id: string;
  studentId: string;
  courseId: string;
  interactionType: 'view' | 'complete' | 'rate' | 'bookmark';
  rating?: number;
  completionPercentage: number;
  timeSpentMinutes: number;
  timestamp: Date;
}

export interface Recommendation {
  course: Course;
  score: number;
  algorithmType: 'collaborative' | 'content_based' | 'hybrid';
  reasoning: string;
}

export interface RecommendationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  coverage: number;
  diversity: number;
}
