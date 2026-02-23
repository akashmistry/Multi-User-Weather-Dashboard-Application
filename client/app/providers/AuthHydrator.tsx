'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { hydrateFromStorage } from '@/features/auth/model/authSlice';
import { STORAGE_KEYS } from '@/lib/constants';
import type { User } from '@/shared/types/api.types';

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!token || !userStr) {
      dispatch(hydrateFromStorage({ user: null, token: null }));
      return;
    }
    try {
      const user = JSON.parse(userStr) as User;
      dispatch(hydrateFromStorage({ user, token }));
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      dispatch(hydrateFromStorage({ user: null, token: null }));
    }
  }, [dispatch]);

  return <>{children}</>;
}
