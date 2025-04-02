<template>
    <div class="flex flex-col items-center justify-center h-screen text-center">
        <h1 class="text-8xl font-bold text-red-500">
            <IconExclamationCircle class="w-48 h-48" />
        </h1>
        <p v-if="error?.statusCode === 404" class="text-lg text-gray-600 mt-4">
            {{ error?.statusMessage }}
        </p>
        <p v-else class="text-lg text-gray-600 mt-4">
            An Error Occurred. Please try again later.
        </p>
        <UiButton class="mt-6 px-8 py-2" variant="primary" :to="'/'">
            Go Back to Home
        </UiButton>
    </div>
</template>

<script setup lang="ts">
import { IconExclamationCircle } from '@tabler/icons-vue';
import type { NuxtError } from 'nuxt/app';

defineProps<{
    error: NuxtError;
}>();
</script>