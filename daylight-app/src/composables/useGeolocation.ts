// daylight-app/src/composables/useGeolocation.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useGeolocation() {
    const coords = ref<{ latitude: number; longitude: number } | null>(null);
    const isLocating = ref<boolean>(false);
    const locationError = ref<string | null>(null);

    let watchId: number | null = null;

    const getPosition = () => {
        if (!navigator.geolocation) {
            locationError.value = 'Geolocation is not supported by your browser.';
            return;
        }

        isLocating.value = true;
        locationError.value = null;
        coords.value = null; // Clear previous coords

        navigator.geolocation.getCurrentPosition(
            (position) => {
                coords.value = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                locationError.value = null; // Clear error on success
                isLocating.value = false;
            },
            (error) => {
                console.error("Geolocation error:", error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        locationError.value = "Location access denied. Please enable location services.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        locationError.value = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        locationError.value = "The request to get user location timed out.";
                        break;
                    default:
                        locationError.value = "An unknown error occurred while getting location.";
                        break;
                }
                coords.value = null; // Ensure coords are null on error
                isLocating.value = false;
            },
            { // Geolocation options
                enableHighAccuracy: false, // Faster, less power-hungry
                timeout: 10000,            // 10 seconds
                maximumAge: 60000          // Allow cached position up to 1 minute old
            }
        );
    };

    // Optional: Watch position (comment out if getCurrentPosition is sufficient)
    /*
    const startWatching = () => {
        if (!navigator.geolocation) {
             locationError.value = 'Geolocation is not supported by your browser.';
            return;
        }
         isLocating.value = true; // Indicate activity
        locationError.value = null;
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                 coords.value = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                locationError.value = null;
                 isLocating.value = false; // Location found
            },
            (error) => {
                console.error("Geolocation watch error:", error);
                locationError.value = `Error watching location: ${error.message}`;
                // Don't set isLocating to false here, as watching might still be attempted
            },
             { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 } // MaxAge 0 for watch
        );
    };

    const stopWatching = () => {
        if (watchId !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            isLocating.value = false; // Stopped actively looking
        }
    };

    onMounted(() => {
        // getPosition(); // Get initial position on mount
        // OR
        // startWatching();
    });

    onUnmounted(() => {
        // stopWatching();
    });
    */

    return {
        coords,
        isLocating,
        locationError,
        getPosition, // Expose the function to trigger manually
    };
}