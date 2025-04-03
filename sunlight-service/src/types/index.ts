// sunlight-service/src/types/index.ts
export interface SunriseSunsetAPIResponse {
    results: {
      sunrise: string; // ISO 8601 format e.g., "2024-07-22T05:00:00+00:00"
      sunset: string;  // ISO 8601 format
      solar_noon: string;
      day_length: number; // Seconds
      civil_twilight_begin: string;
      civil_twilight_end: string;
      nautical_twilight_begin: string;
      nautical_twilight_end: string;
      astronomical_twilight_begin: string;
      astronomical_twilight_end: string;
    };
    status: string; // "OK" or error status
    tzid?: string; // Timezone ID e.g. "UTC"
  }
  
  export interface DaylightData {
      date: string; // YYYY-MM-DD
      sunrise: string; // ISO 8601
      sunset: string; // ISO 8601
      daylightDurationSeconds: number;
      daylightDurationFormatted: string; // HH:mm:ss
  }