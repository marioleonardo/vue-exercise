 // daylight-app/src/components/DaylightList.vue
<template>
   <div v-if="results && results.length > 0">
       <DataTable :value="results" responsiveLayout="scroll" class="p-datatable-sm">
            <template #header>
                <div class="p-text-center p-text-bold">
                    Daylight Duration for Day {{ results[0]?.luxonDate?.day }} of Each Month
                </div>
            </template>

            <Column field="displayDate" header="Date" sortable></Column>
            <Column field="daylightDurationFormatted" header="Daylight Duration (HH:mm:ss)" sortable>
                <template #body="slotProps">
                     <span class="duration">{{ slotProps.data.daylightDurationFormatted }}</span>
                </template>
            </Column>
             <!-- Optional: Add sunrise/sunset columns if desired -->
             <!--
             <Column field="sunrise" header="Sunrise (UTC)">
                <template #body="slotProps">
                     {{ formatTime(slotProps.data.sunrise) }}
                </template>
             </Column>
             <Column field="sunset" header="Sunset (UTC)">
                 <template #body="slotProps">
                     {{ formatTime(slotProps.data.sunset) }}
                </template>
             </Column>
             -->

             <template #empty>
                No daylight data found.
            </template>
       </DataTable>
   </div>
   <div v-else>
       <p class="p-text-center">No results to display.</p>
   </div>
</template>

<script setup lang="ts">
import type { DisplayResult } from '@/types';
import { DateTime } from 'luxon';

interface Props {
  results: DisplayResult[];
}

defineProps<Props>();

// Helper to format ISO time string to HH:mm:ss
const formatTime = (isoString: string): string => {
    const dt = DateTime.fromISO(isoString, { zone: 'utc' }); // Assume UTC from API
    return dt.isValid ? dt.toFormat('HH:mm:ss') : 'Invalid Time';
}
</script>

<style scoped>
.duration {
  font-weight: 500;
  /* Add any specific styling for the duration */
}
.p-datatable-sm :deep(.p-datatable-thead > tr > th) {
   padding: 0.5rem 0.5rem; /* Smaller header padding */
   background-color: var(--surface-b);
}
.p-datatable-sm :deep(.p-datatable-tbody > tr > td) {
     padding: 0.5rem 0.5rem; /* Smaller cell padding */
}
</style>