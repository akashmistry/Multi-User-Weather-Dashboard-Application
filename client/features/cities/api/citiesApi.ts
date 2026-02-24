import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/constants';
import type {
  CitiesListResponse,
  CityCreateResponse,
} from '@/shared/types/api.types';
import type { RootState } from '@/store';

interface CreateCityPayload {
  name: string;
  countryCode?: string;
}

export const citiesApi = createApi({
  reducerPath: 'citiesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/cities`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Cities'],
  endpoints: (builder) => ({
    getCities: builder.query<CitiesListResponse, void>({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
      providesTags: ['Cities'],
    }),
    createCity: builder.mutation<CityCreateResponse, CreateCityPayload>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cities'],
    }),
  }),
});

export const { useGetCitiesQuery, useCreateCityMutation } = citiesApi;

