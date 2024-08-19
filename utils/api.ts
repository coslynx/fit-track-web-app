import axios from 'axios';
import { Goal, Progress, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fittrack_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('fittrack_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('fittrack_token', response.data.token);
    return response.data;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials and try again.');
  }
};

export const register = async (user: Partial<User>): Promise<User> => {
  try {
    const response = await api.post('/auth/register', user);
    return response.data;
  } catch (error) {
    throw new Error('Registration failed. Please try again.');
  }
};

export const logout = (): void => {
  localStorage.removeItem('fittrack_token');
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch current user.');
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user profile.');
  }
};

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const response = await api.get('/goals');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch goals.');
  }
};

export const createGoal = async (goalData: Partial<Goal>): Promise<Goal> => {
  try {
    const response = await api.post('/goals', goalData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create goal.');
  }
};

export const updateGoal = async (goalId: string, goalData: Partial<Goal>): Promise<Goal> => {
  try {
    const response = await api.put(`/goals/${goalId}`, goalData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update goal.');
  }
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    await api.delete(`/goals/${goalId}`);
  } catch (error) {
    throw new Error('Failed to delete goal.');
  }
};

export const getProgress = async (goalId: string, startDate: string, endDate: string): Promise<Progress[]> => {
  try {
    const response = await api.get('/progress', {
      params: { goalId, startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch progress data.');
  }
};

export const logProgress = async (progressData: Partial<Progress>): Promise<Progress> => {
  try {
    const response = await api.post('/progress', progressData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to log progress.');
  }
};

export const getSocialFeed = async (page: number = 1, limit: number = 10): Promise<{ posts: any[]; hasMore: boolean }> => {
  try {
    const response = await api.get('/social/feed', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch social feed.');
  }
};

export const createSocialPost = async (content: string, goalId?: string): Promise<any> => {
  try {
    const response = await api.post('/social/posts', { content, goalId });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create social post.');
  }
};

export const getAchievements = async (): Promise<any[]> => {
  try {
    const response = await api.get('/social/achievements');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch achievements.');
  }
};

export const shareAchievement = async (achievementId: string): Promise<any> => {
  try {
    const response = await api.post(`/social/achievements/${achievementId}/share`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to share achievement.');
  }
};

export default api;