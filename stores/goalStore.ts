import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { Goal } from '@/types';

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  fetchGoals: () => Promise<void>;
  createGoal: (goalData: Partial<Goal>) => Promise<void>;
  editGoal: (id: string, goalData: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      isLoading: false,
      error: null,
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g)
      })),
      removeGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),
      fetchGoals: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get('/api/goals', {
            headers: { Authorization: `Bearer ${localStorage.getItem('fittrack_token')}` }
          });
          set({ goals: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch goals. Please try again.', isLoading: false });
          throw error;
        }
      },
      createGoal: async (goalData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/api/goals', goalData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('fittrack_token')}` }
          });
          set((state) => ({ goals: [...state.goals, response.data], isLoading: false }));
        } catch (error) {
          set({ error: 'Failed to create goal. Please try again.', isLoading: false });
          throw error;
        }
      },
      editGoal: async (id, goalData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put(`/api/goals/${id}`, goalData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('fittrack_token')}` }
          });
          set((state) => ({
            goals: state.goals.map((g) => g.id === id ? response.data : g),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to update goal. Please try again.', isLoading: false });
          throw error;
        }
      },
      deleteGoal: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete(`/api/goals/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('fittrack_token')}` }
          });
          set((state) => ({
            goals: state.goals.filter((g) => g.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to delete goal. Please try again.', isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'goal-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useGoalStore;