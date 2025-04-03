// daylight-app/src/types/index.ts
import { DateTime } from 'luxon';

// Type expected from the backend API
export interface DaylightResult {
    date: string; // YYYY-MM-DD
    sunrise: string; // ISO 8601
    sunset: string; // ISO 8601
    daylightDurationSeconds: number;
    daylightDurationFormatted: string; // HH:mm:ss
}

// Optional: Type used within the frontend store/components
export interface DisplayResult extends DaylightResult {
    displayDate: string; // Formatted date for UI (e.g., "Jan 15")
    luxonDate: DateTime; // Parsed Luxon DateTime object
}