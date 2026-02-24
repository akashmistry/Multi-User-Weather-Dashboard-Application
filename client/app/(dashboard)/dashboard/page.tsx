'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { Navbar } from '@/components/layout/Navbar';
import {
  useGetCitiesQuery,
  useCreateCityMutation,
} from '@/features/cities/api/citiesApi';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const {
    data,
    isLoading: isCitiesLoading,
    isError,
    error,
  } = useGetCitiesQuery(undefined, {
    skip: !isHydrated || !user,
  });

  const [createCity, { isLoading: isCreating }] = useCreateCityMutation();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) router.replace('/login');
  }, [user, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            Welcome, {user.name}
          </h1>
          <p className="text-slate-400">
            Manage your cities below. Weather & favorites coming next.
          </p>
        </header>

        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Add a city
          </h2>
          <form
            className="flex flex-col md:flex-row gap-3 md:items-end"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim()) return;
              try {
                await createCity({
                  name: name.trim(),
                  countryCode: countryCode.trim() || undefined,
                }).unwrap();
                setName('');
                setCountryCode('');
              } catch {
                // errors handled via RTK Query error state
              }
            }}
          >
            <div className="flex-1">
              <label
                htmlFor="city-name"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                City name
              </label>
              <input
                id="city-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/80 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-40">
              <label
                htmlFor="country-code"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Country (optional)
              </label>
              <input
                id="country-code"
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="IN"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/80 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="md:w-40 inline-flex justify-center px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Adding...' : 'Add city'}
            </button>
          </form>
        </section>

        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Your cities
          </h2>

          {isCitiesLoading && (
            <div className="text-slate-400 text-sm">Loading cities...</div>
          )}

          {isError && (
            <div className="text-sm text-red-400">
              Failed to load cities.
            </div>
          )}

          {!isCitiesLoading &&
            !isError &&
            (!data || data.data.length === 0) && (
              <div className="text-slate-400 text-sm">
                You have not added any cities yet.
              </div>
            )}

          {!isCitiesLoading && !isError && data && data.data.length > 0 && (
            <ul className="divide-y divide-slate-700">
              {data.data.map((city) => (
                <li
                  key={city._id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-slate-100 font-medium">
                      {city.name}
                    </div>
                    {city.countryCode && (
                      <div className="text-slate-400 text-xs uppercase tracking-wide">
                        {city.countryCode}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    Added {new Date(city.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
