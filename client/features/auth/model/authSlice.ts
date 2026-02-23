import { createSlice } from '@reduxjs/toolkit';
import type { User } from '@/shared/types/api.types';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: { payload: { user: User; token: string } }) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    },
    setHydrated: (state) => {
      state.isHydrated = true;
    },
    hydrateFromStorage: (
      state,
      action: { payload: { user: User | null; token: string | null } }
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isHydrated = true;
    },
  },
});

export const { setCredentials, logout, setHydrated, hydrateFromStorage } =
  authSlice.actions;
export default authSlice.reducer;
