// utils/helpers.ts

import { format, parseISO, differenceInDays } from 'date-fns';
import { Goal, Progress } from '@/types';

export const formatDate = (date: string | Date): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy');
};

export const calculateDaysRemaining = (targetDate: string): number => {
  return differenceInDays(parseISO(targetDate), new Date());
};

export const calculateProgress = (goal: Goal, progress: Progress[]): number => {
  const currentValue = progress.find(p => p.goalId === goal.id)?.value || 0;
  const progressPercentage = (currentValue / goal.targetValue) * 100;
  return Math.min(Math.max(progressPercentage, 0), 100);
};

export const getGoalStatusColor = (progress: number): string => {
  if (progress >= 100) return 'green.500';
  if (progress >= 75) return 'yellow.500';
  if (progress >= 50) return 'orange.500';
  return 'red.500';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    return new Promise(resolve => {
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const groupBy = <T>(array: T[], key: keyof T): { [key: string]: T[] } => {
  return array.reduce((result, currentValue) => {
    const groupKey = String(currentValue[key]);
    (result[groupKey] = result[groupKey] || []).push(currentValue);
    return result;
  }, {} as { [key: string]: T[] });
};

export const calculateBMI = (weight: number, height: number): number => {
  return weight / ((height / 100) ** 2);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateCaloriesBurned = (
  weight: number,
  duration: number,
  met: number
): number => {
  return (duration / 60) * (met * 3.5 * weight) / 200;
};

export const validatePassword = (password: string): boolean => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  return re.test(password);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const convertKgToLbs = (kg: number): number => {
  return kg * 2.20462;
};

export const convertLbsToKg = (lbs: number): number => {
  return lbs / 2.20462;
};

export const convertCmToInches = (cm: number): number => {
  return cm / 2.54;
};

export const convertInchesToCm = (inches: number): number => {
  return inches * 2.54;
};

export const calculateTDEE = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
  const bmr = gender === 'male'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  return bmr * activityMultipliers[activityLevel];
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>&"']/g, (match) => {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return match;
    }
  });
};