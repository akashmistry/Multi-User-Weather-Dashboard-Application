'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  useLoginMutation,
  useRegisterMutation,
} from '@/features/auth/api/authApi';
import {
  setCredentials,
  logout as logoutAction,
} from '@/features/auth/model/authSlice';
import {
  selectCurrentUser,
  selectIsAuthHydrated,
} from '@/features/auth/model/selectors';
import { citiesApi } from '@/features/cities/api/citiesApi';

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const isHydrated = useAppSelector(selectIsAuthHydrated);
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await loginMutation({ email, password }).unwrap();
        if (result.success && result.user && result.token) {
          dispatch(setCredentials({ user: result.user, token: result.token }));
          router.push('/dashboard');
          return { success: true };
        }
        return {
          success: false,
          message: result.message || 'Login failed',
        };
      } catch (err: unknown) {
        const data = err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data
          : null;
        return {
          success: false,
          message: data?.message || 'Login failed',
        };
      }
    },
    [loginMutation, dispatch, router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const result = await registerMutation({ name, email, password }).unwrap();
        if (result.success && result.user && result.token) {
          dispatch(setCredentials({ user: result.user, token: result.token }));
          router.push('/dashboard');
          return { success: true };
        }
        return {
          success: false,
          message: result.message || 'Registration failed',
        };
      } catch (err: unknown) {
        const data = err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data
          : null;
        return {
          success: false,
          message: data?.message || 'Registration failed',
        };
      }
    },
    [registerMutation, dispatch, router]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(citiesApi.util.resetApiState());
    router.push('/login');
  }, [dispatch, router]);

  return {
    user,
    isHydrated,
    login,
    register,
    logout,
    isAuthLoading: isLoginLoading || isRegisterLoading,
  };
}
