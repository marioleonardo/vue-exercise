<template>
  <div id="app-container" class="p-d-flex p-flex-column p-ai-center p-p-3">
    <Card class="app-card p-mb-4">
       <template #title>
         <h1 class="p-text-center">Daylight Duration</h1>
       </template>
       <template #subtitle>
         <p class="p-text-center">Daylight hours for the same day across the next 12 months.</p>
       </template>
       <template #content>
         <!-- Location Status -->
         <div class="location-status p-mb-3 p-text-center">
           <LoadingSpinner v-if="store.isLocating" message="Getting location..." />
           <Message v-else-if="store.locationError" severity="warn" :closable="false">
              {{ store.locationError }}
              <Button
                 label="Retry Location"
                 icon="pi pi-refresh"
                 class="p-button-sm p-button-text p-ml-2"
                 @click="store.requestLocation"
              />
           </Message>
            <div v-else-if="store.location" class="location-info">
               <i class="pi pi-map-marker p-mr-1"></i>
               Location Found:
               <span class="coord">Lat: {{ store.location.latitude.toFixed(4) }}</span>,
               <span class="coord">Lon: {{ store.location.longitude.toFixed(4) }}</span>
            </div>
            <div v-else>
                 <Button
                    label="Get My Location"
                    icon="pi pi-map-marker"
                    @click="store.requestLocation"
                    :loading="store.isLocating"
                 />
            </div>
         </div>

         <hr class="p-my-3" />

         <!-- Data Fetching Status & Results -->
         <div class="results-section">
            <LoadingSpinner v-if="store.isLoading" message="Fetching daylight data..." />
            <Message v-else-if="store.fetchError && !store.daylightResults.length" severity="error" :closable="false">
               {{ store.fetchError }}
               <!-- Optional: Add a retry button for fetching data -->
                <Button
                   v-if="store.hasLocation"
                   label="Retry Fetch"
                   icon="pi pi-refresh"
                   class="p-button-sm p-button-text p-ml-2"
                   @click="store.fetchAllDaylightData"
                   :disabled="store.isLoading"
                />
            </Message>
             <!-- Show partial errors if some data loaded -->
            <Message v-else-if="store.fetchError && store.daylightResults.length > 0" severity="warn" :closable="true" class="p-mb-2">
               {{ store.fetchError }} (Some results may be missing)
            </Message>

            <DaylightList v-else-if="store.daylightResults.length > 0" :results="store.daylightResults" />

            <div v-else-if="!store.isLoading && !store.fetchError && !store.isLocating && store.hasLocation && store.daylightResults.length === 0">
              <!-- State when location found, not loading, no errors, but no results yet (maybe initial state or failed fetch) -->
              <p class="p-text-center p-text-secondary">Ready to fetch data or no data found for the dates.</p>
               <Button
                   label="Fetch Daylight Data"
                   icon="pi pi-cloud-download"
                   @click="store.fetchAllDaylightData"
                   :disabled="store.isLoading || !store.hasLocation"
                   class="p-mt-2"
                />
            </div>
         </div>

       </template>
       <template #footer>
           <div class="p-text-center p-text-xs p-text-secondary">
                Data provided by <a href="https://sunrise-sunset.org/api" target="_blank" rel="noopener noreferrer">sunrise-sunset.org</a>
           </div>
       </template>
    </Card>
     <!-- Install Prompt Placeholder -->
     <!-- vite-plugin-pwa handles the default prompt -->
     <!-- You can create a custom prompt component if needed -->

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDaylightStore } from '@/store/daylight';
import { storeToRefs } from 'pinia'; // Import storeToRefs
import DaylightList from '@/components/DaylightList.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
// PrimeVue components used: Card, Button, Message, ProgressSpinner

const store = useDaylightStore();

// Use storeToRefs to keep reactivity on state properties destructured from the store
// Note: We don't need to destructure actions or non-ref computed properties
// We access them directly via `store.actionName()` or `store.getterName`
// const { isLocating, locationError, location, isLoading, fetchError, daylightResults, hasLocation } = storeToRefs(store);


// Fetch location (and subsequently data) when the component mounts
onMounted(() => {
  store.initialize();
});
</script>

<style>
/* Global or App specific styles */
#app-container {
  min-height: 100vh;
  background-color: var(--surface-ground); /* Use PrimeVue variable */
}

.app-card {
  width: 100%;
  max-width: 700px; /* Max width for larger screens */
  margin: 1rem auto;
}

h1 {
  margin: 0;
  font-size: 1.75rem; /* Adjust as needed */
  color: var(--primary-color); /* Use PrimeVue variable */
}

.location-status .p-message {
   margin: 0 auto; /* Center message */
}

.location-info .coord {
    font-family: monospace;
    background-color: var(--surface-b);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    margin: 0 0.2rem;
}

/* Ensure table fits within card on smaller screens */
.p-datatable {
    width: 100%;
}
</style>