Here's the complete implementation of `stores/userStore.ts` for the FitTrack MVP:

```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { User } from '@/types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/api/auth/login', { email, password });
          const { user, token } = response.data;
          localStorage.setItem('fittrack_token', token);
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: 'Login failed. Please check your credentials.', isLoading: false });
          throw error;
        }
      },
      logout: () => {
        localStorage.removeItem('fittrack_token');
        set({ user: null });
      },
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/api/auth/register', userData);
          const { user, token } = response.data;
          localStorage.setItem('fittrack_token', token);
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: 'Registration failed. Please try again.', isLoading: false });
          throw error;
        }
      },
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('User not authenticated');
          const response = await axios.put(`/api/users/${user.id}`, userData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('fittrack_token')}` }
          });
          set({ user: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to update profile. Please try again.', isLoading: false });
          throw error;
        }
      },
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get('/api/users/me', {
            headers: { Authorization: `Bearer ${localStorage.getItem('fittrack_token')}` }
          });
          set({ user: response.data, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch user data. Please try again.', isLoading: false, user: null });
          localStorage.removeItem('fittrack_token');
          throw error;
        }
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;