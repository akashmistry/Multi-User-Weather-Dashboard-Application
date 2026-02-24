export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface City {
  _id: string;
  user: string;
  name: string;
  countryCode?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface CitiesListResponse {
  success: boolean;
  data: City[];
  message?: string;
}

export interface CityCreateResponse {
  success: boolean;
  data?: City;
  message?: string;
}
