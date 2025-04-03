// sunlight-service/src/services/sunriseSunsetService.ts
import axios from 'axios';
import { SunriseSunsetAPIResponse } from '../types';
import { DateTime, Duration } from 'luxon';

const API_URL = 'https://api.sunrise-sunset.org/json';

export async function getSunriseSunsetData(lat: number, lng: number, date: string): Promise<SunriseSunsetAPIResponse> {
    try {
        // date format must be YYYY-MM-DD
        const response = await axios.get<SunriseSunsetAPIResponse>(API_URL, {
            params: {
                lat,
                lng,
                date,
                formatted: 0, // Important: requests ISO 8601 format
            },
        });

        if (response.data.status !== 'OK') {
             // Handle specific API errors if needed
             throw new Error(`Sunrise-Sunset API Error: ${response.data.status}`);
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error fetching sunrise/sunset data:', error.response?.data || error.message);
            throw new Error(`Failed to fetch sunrise/sunset data: ${error.message}`);
        } else {
            console.error('Unknown error fetching sunrise/sunset data:', error);
            throw new Error('An unknown error occurred while fetching sunrise/sunset data.');
        }
    }
}

export function calculateDaylightDuration(apiResult: SunriseSunsetAPIResponse['results']): { durationSeconds: number; durationFormatted: string } {
    // Use the direct day_length from the API
    const durationSeconds = apiResult.day_length;

    // Format it using Luxon for HH:mm:ss
    const duration = Duration.fromObject({ seconds: durationSeconds });
    const durationFormatted = duration.toFormat('hh:mm:ss');

    return {
        durationSeconds,
        durationFormatted,
    };

    /* Alternative calculation using sunrise/sunset times (less precise due to potential rounding)
    const sunrise = DateTime.fromISO(apiResult.sunrise, { zone: 'utc' });
    const sunset = DateTime.fromISO(apiResult.sunset, { zone: 'utc' });

    if (!sunrise.isValid || !sunset.isValid) {
        throw new Error('Invalid sunrise or sunset time received from API');
    }

    const diff = sunset.diff(sunrise, ['hours', 'minutes', 'seconds']);
    const durationSeconds = diff.as('seconds');
    const durationFormatted = diff.toFormat('hh:mm:ss');

    return { durationSeconds, durationFormatted };
    */
}