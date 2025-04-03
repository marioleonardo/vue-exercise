// daylight-app/src/services/apiClient.ts
import axios from 'axios';
import { DaylightResult } from '@/types';

// Use environment variable for base URL, default for local dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchSunlightData = async (lat: number, lng: number, date: string): Promise<DaylightResult> => {
  try {
    const response = await apiClient.get<DaylightResult>('/sunlight', {
      params: { lat, lng, date },
    });
    return response.data;
  } catch (error) {
    // Handle and re-throw specific errors if needed, or log them
    console.error(`API Error fetching data for date ${date}:`, error);
    if (axios.isAxiosError(error) && error.response) {
       // Try to pass the backend's error message
       throw new Error(error.response.data.message || `Failed to fetch data for ${date}`);
    } else if (error instanceof Error) {
        throw new Error(`Network or other error fetching data for ${date}: ${error.message}`);
    } else {
         throw new Error(`An unknown error occurred while fetching data for ${date}`);
    }
  }
};