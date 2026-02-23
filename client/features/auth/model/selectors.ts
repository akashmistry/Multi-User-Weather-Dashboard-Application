import type { RootState } from '@/store';

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  !!state.auth.user && !!state.auth.token;
export const selectIsAuthHydrated = (state: RootState) => state.auth.isHydrated;
