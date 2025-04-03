// sunlight-service/src/routes/sunlight.ts
import express, { Request, Response, Router } from 'express';
import { getSunriseSunsetData, calculateDaylightDuration } from '../services/sunriseSunsetService';
import { DaylightData } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response) : Promise<void> => {
    const { lat, lng, date } = req.query;

    // Basic Input Validation
    if (!lat || !lng || !date || typeof date !== 'string') {
        res.status(400).json({ message: 'Missing or invalid query parameters: lat, lng, and date (YYYY-MM-DD) are required.' });
        return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        res.status(400).json({ message: 'Invalid latitude or longitude values.' });
    }

    // Validate date format (YYYY-MM-DD) - basic check
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }


    try {
        const apiResponse = await getSunriseSunsetData(latitude, longitude, date);
        const { durationSeconds, durationFormatted } = calculateDaylightDuration(apiResponse.results);

        const result: DaylightData = {
            date: date,
            sunrise: apiResponse.results.sunrise,
            sunset: apiResponse.results.sunset,
            daylightDurationSeconds: durationSeconds,
            daylightDurationFormatted: durationFormatted,
        };

        res.status(200).json(result);

    } catch (error) {
        console.error(`Error processing request for ${date} at (${latitude}, ${longitude}):`, error);
         // Check if error is an instance of Error to access message safely
         const message = error instanceof Error ? error.message : 'An internal server error occurred.';
        // Avoid leaking sensitive details in production
        res.status(500).json({ message: message.startsWith('Sunrise-Sunset API Error:') || message.startsWith('Failed to fetch') ? message : 'Failed to retrieve or process sunlight data.' });
    }
});

export default router;