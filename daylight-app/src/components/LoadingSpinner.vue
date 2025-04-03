// daylight-app/src/components/LoadingSpinner.vue
<template>
  <div class="loading-spinner p-d-flex p-jc-center p-ai-center">
    <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
        aria-label="Loading"
    />
     <span v-if="message" class="p-ml-2">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
// PrimeVue component used directly in template

interface Props {
    message?: string;
}
defineProps<Props>();

</script>

<style scoped>
.loading-spinner {
  padding: 2rem;
}
</style>