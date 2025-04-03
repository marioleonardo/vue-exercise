// daylight-app/src/store/daylight.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DateTime } from 'luxon';
import { useGeolocation } from '@/composables/useGeolocation';
import { fetchSunlightData } from '@/services/apiClient';
import type { DaylightResult, DisplayResult } from '@/types';

export const useDaylightStore = defineStore('daylight', () => {
    // --- State ---
    const { coords, isLocating, locationError, getPosition } = useGeolocation();
    const currentDate = ref<DateTime>(DateTime.now());
    const daylightResults = ref<DisplayResult[]>([]);
    const isLoading = ref<boolean>(false);
    const fetchError = ref<string | null>(null);

    // --- Getters (Computed) ---
    const location = computed(() => coords.value);
    const hasLocation = computed(() => !!coords.value);
    const hasError = computed(() => !!locationError.value || !!fetchError.value);

    // Generates the 12 target dates based on the *initial* current date
    const targetDates = computed(() => {
        const baseDate = currentDate.value; // Use the date when the app loaded/initialized
        const dayOfMonth = baseDate.day;

        // Array.from creates an array from an iterable (like the length-12 generator)
        // .map is used to transform each index (0-11) into a target date
        return Array.from({ length: 12 }, (_, i) => {
             // Start from current month (i=0), add i months
            let targetMonth = baseDate.plus({ months: i });

            // Handle cases where the original day doesn't exist in the target month (e.g., Feb 31st)
            // Set to the last valid day of that month if needed.
            if (dayOfMonth > targetMonth.daysInMonth!) {
                 targetMonth = targetMonth.set({ day: targetMonth.daysInMonth });
            } else {
                targetMonth = targetMonth.set({ day: dayOfMonth });
            }
            return targetMonth.toFormat('yyyy-MM-dd'); // Format needed for the API
        });
    });

    // --- Actions ---
    async function initialize() {
        console.log('Initializing store...');
        currentDate.value = DateTime.now(); // Set current date on init
        daylightResults.value = []; // Clear previous results
        fetchError.value = null; // Clear previous errors
        locationError.value = null; // Clear location errors too
        await requestLocation(); // Request location on initialization
    }

    async function requestLocation() {
        await getPosition(); // Call the composable's function
        // Automatically fetch data *after* location is successfully obtained
        if (coords.value && !locationError.value) {
            await fetchAllDaylightData();
        }
    }

    async function fetchAllDaylightData() {
        if (!coords.value) {
            fetchError.value = "Location is not available to fetch data.";
            return;
        }
        if (isLoading.value) return; // Prevent concurrent fetches

        isLoading.value = true;
        fetchError.value = null;
        daylightResults.value = []; // Clear previous results before fetching new ones

        const { latitude, longitude } = coords.value;
        const datesToFetch = targetDates.value;

        try {
            // Use Promise.allSettled to handle individual fetch errors without stopping others
             // Use .map() to create an array of Promises from the datesToFetch array
            const promises = datesToFetch.map(date =>
                fetchSunlightData(latitude, longitude, date)
            );

            const results = await Promise.allSettled(promises);

            const successfulResults: DisplayResult[] = [];
            const errors: string[] = [];

            // Process results - using map might be less clear here due to settled results
            results.forEach((result, index) => {
                 const requestedDate = datesToFetch[index]; // Get corresponding date
                if (result.status === 'fulfilled') {
                    const luxonDate = DateTime.fromISO(result.value.date);
                    successfulResults.push({
                        ...result.value,
                         luxonDate: luxonDate,
                         displayDate: luxonDate.toFormat('LLL dd') // Format like "Jul 22"
                    });
                } else {
                    console.error(`Failed to fetch data for ${requestedDate}:`, result.reason);
                    // Try to extract a meaningful error message
                     const errorMessage = result.reason instanceof Error ? result.reason.message : String(result.reason);
                    errors.push(`Date ${requestedDate}: ${errorMessage}`);
                }
            });

             // Sort results by date after fetching
             successfulResults.sort((a, b) => a.luxonDate.toMillis() - b.luxonDate.toMillis());
            daylightResults.value = successfulResults;


            if (errors.length > 0) {
                // Combine errors into a single message or handle differently
                fetchError.value = `Encountered errors fetching data: ${errors.join('; ')}`;
                if (successfulResults.length === 0) {
                   // If ALL fetches failed, make it clear
                   fetchError.value = `Failed to fetch all daylight data. Errors: ${errors.join('; ')}`;
                }
            }

        } catch (error) { // Catch errors outside Promise.allSettled (e.g., network issue before requests start)
            console.error("Error in fetchAllDaylightData:", error);
             fetchError.value = error instanceof Error ? error.message : "An unknown error occurred during data fetching.";
        } finally {
            isLoading.value = false;
        }
    }

    return {
        // State refs
        currentDate,
        daylightResults,
        isLoading,
        fetchError,
        // Geolocation refs (read-only access needed by components)
        location,
        isLocating,
        locationError,
         hasLocation, // computed getter
         hasError, // computed getter
         targetDates, // computed getter

        // Actions
        initialize,
        requestLocation, // Allow component to re-trigger location request
        fetchAllDaylightData, // Allow component to re-trigger data fetch if needed
    };
});