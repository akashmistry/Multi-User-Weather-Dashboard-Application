'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-800/80 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-100">
            Weather Dashboard
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-slate-400">{user.name}</span>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-red-600/80 text-slate-200 hover:text-white font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
