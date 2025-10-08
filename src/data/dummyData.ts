import { Student, Course, StudentInteraction } from '../types/learning';

export const students: Student[] = [
  {
    id: 's1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    learningStyle: 'visual',
    interests: ['programming', 'data-science', 'machine-learning']
  },
  {
    id: 's2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    learningStyle: 'kinesthetic',
    interests: ['web-development', 'ui-design', 'mobile']
  },
  {
    id: 's3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    learningStyle: 'reading',
    interests: ['data-science', 'statistics', 'python']
  },
  {
    id: 's4',
    name: 'David Brown',
    email: 'david@example.com',
    learningStyle: 'auditory',
    interests: ['javascript', 'react', 'web-development']
  },
  {
    id: 's5',
    name: 'Emma Davis',
    email: 'emma@example.com',
    learningStyle: 'visual',
    interests: ['machine-learning', 'ai', 'neural-networks']
  }
];

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Python Programming',
    description: 'Learn Python from scratch with hands-on projects and real-world examples.',
    category: 'Programming',
    difficultyLevel: 'beginner',
    tags: ['python', 'programming', 'beginner'],
    durationMinutes: 240
  },
  {
    id: 'c2',
    title: 'Machine Learning Fundamentals',
    description: 'Master the basics of machine learning algorithms and their applications.',
    category: 'Data Science',
    difficultyLevel: 'intermediate',
    tags: ['machine-learning', 'ai', 'python', 'data-science'],
    durationMinutes: 360
  },
  {
    id: 'c3',
    title: 'React.js Complete Guide',
    description: 'Build modern web applications with React, hooks, and state management.',
    category: 'Web Development',
    difficultyLevel: 'intermediate',
    tags: ['react', 'javascript', 'web-development', 'frontend'],
    durationMinutes: 420
  },
  {
    id: 'c4',
    title: 'Data Visualization with D3.js',
    description: 'Create stunning interactive visualizations for data storytelling.',
    category: 'Data Science',
    difficultyLevel: 'advanced',
    tags: ['data-visualization', 'javascript', 'data-science'],
    durationMinutes: 300
  },
  {
    id: 'c5',
    title: 'Deep Learning with Neural Networks',
    description: 'Dive deep into neural networks, CNNs, and RNNs for complex AI tasks.',
    category: 'AI & Machine Learning',
    difficultyLevel: 'advanced',
    tags: ['deep-learning', 'neural-networks', 'ai', 'python'],
    durationMinutes: 480
  },
  {
    id: 'c6',
    title: 'UI/UX Design Principles',
    description: 'Learn the fundamentals of creating beautiful and intuitive user interfaces.',
    category: 'Design',
    difficultyLevel: 'beginner',
    tags: ['ui-design', 'ux', 'design', 'web-development'],
    durationMinutes: 180
  },
  {
    id: 'c7',
    title: 'Statistical Analysis with R',
    description: 'Master statistical methods and data analysis using R programming.',
    category: 'Data Science',
    difficultyLevel: 'intermediate',
    tags: ['statistics', 'data-science', 'r-programming'],
    durationMinutes: 330
  },
  {
    id: 'c8',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile apps using React Native framework.',
    category: 'Mobile Development',
    difficultyLevel: 'intermediate',
    tags: ['mobile', 'react', 'javascript', 'app-development'],
    durationMinutes: 390
  },
  {
    id: 'c9',
    title: 'Natural Language Processing',
    description: 'Process and analyze text data with NLP techniques and transformers.',
    category: 'AI & Machine Learning',
    difficultyLevel: 'advanced',
    tags: ['nlp', 'ai', 'machine-learning', 'python'],
    durationMinutes: 450
  },
  {
    id: 'c10',
    title: 'Full-Stack JavaScript Development',
    description: 'Build complete web applications with Node.js, Express, and MongoDB.',
    category: 'Web Development',
    difficultyLevel: 'advanced',
    tags: ['javascript', 'web-development', 'backend', 'fullstack'],
    durationMinutes: 540
  }
];

export const interactions: StudentInteraction[] = [
  { id: 'i1', studentId: 's1', courseId: 'c1', interactionType: 'complete', rating: 5, completionPercentage: 100, timeSpentMinutes: 250, timestamp: new Date('2024-09-15') },
  { id: 'i2', studentId: 's1', courseId: 'c2', interactionType: 'rate', rating: 5, completionPercentage: 85, timeSpentMinutes: 300, timestamp: new Date('2024-10-01') },
  { id: 'i3', studentId: 's1', courseId: 'c4', interactionType: 'view', completionPercentage: 30, timeSpentMinutes: 90, timestamp: new Date('2024-10-05') },

  { id: 'i4', studentId: 's2', courseId: 'c3', interactionType: 'complete', rating: 4, completionPercentage: 100, timeSpentMinutes: 430, timestamp: new Date('2024-09-20') },
  { id: 'i5', studentId: 's2', courseId: 'c6', interactionType: 'complete', rating: 5, completionPercentage: 100, timeSpentMinutes: 190, timestamp: new Date('2024-09-28') },
  { id: 'i6', studentId: 's2', courseId: 'c8', interactionType: 'rate', rating: 4, completionPercentage: 60, timeSpentMinutes: 240, timestamp: new Date('2024-10-03') },

  { id: 'i7', studentId: 's3', courseId: 'c1', interactionType: 'complete', rating: 4, completionPercentage: 100, timeSpentMinutes: 240, timestamp: new Date('2024-09-10') },
  { id: 'i8', studentId: 's3', courseId: 'c7', interactionType: 'complete', rating: 5, completionPercentage: 100, timeSpentMinutes: 340, timestamp: new Date('2024-09-25') },
  { id: 'i9', studentId: 's3', courseId: 'c2', interactionType: 'rate', rating: 4, completionPercentage: 70, timeSpentMinutes: 250, timestamp: new Date('2024-10-02') },

  { id: 'i10', studentId: 's4', courseId: 'c3', interactionType: 'complete', rating: 5, completionPercentage: 100, timeSpentMinutes: 420, timestamp: new Date('2024-09-18') },
  { id: 'i11', studentId: 's4', courseId: 'c10', interactionType: 'view', completionPercentage: 45, timeSpentMinutes: 240, timestamp: new Date('2024-10-01') },

  { id: 'i12', studentId: 's5', courseId: 'c2', interactionType: 'complete', rating: 5, completionPercentage: 100, timeSpentMinutes: 370, timestamp: new Date('2024-09-22') },
  { id: 'i13', studentId: 's5', courseId: 'c5', interactionType: 'rate', rating: 5, completionPercentage: 80, timeSpentMinutes: 390, timestamp: new Date('2024-10-04') },
  { id: 'i14', studentId: 's5', courseId: 'c9', interactionType: 'bookmark', completionPercentage: 20, timeSpentMinutes: 90, timestamp: new Date('2024-10-06') },
];
