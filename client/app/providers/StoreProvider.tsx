'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthHydrator } from './AuthHydrator';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store);
  return (
    <Provider store={storeRef.current}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}
