// types/index.ts

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  goalType: GoalType;
  startDate: Date;
  targetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalType = 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'custom';

export interface Progress {
  id: string;
  goalId: string;
  userId: string;
  value: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  goalId?: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
}

export interface Achievement {
  id: string;
  userId: string;
  goalId: string;
  title: string;
  description: string;
  achievedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  measurementSystem: 'metric' | 'imperial';
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  privacyLevel: 'public' | 'friends' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'goal_reminder' | 'friend_activity' | 'system';
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendConnection {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Challenge {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  goalType: GoalType;
  targetValue: number;
  unit: string;
  participants: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  userId: string;
  currentValue: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workout {
  id: string;
  userId: string;
  title: string;
  description?: string;
  duration: number;
  caloriesBurned?: number;
  workoutType: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  nutritionLogId: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  waistCircumference?: number;
  chestCircumference?: number;
  armCircumference?: number;
  thighCircumference?: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}