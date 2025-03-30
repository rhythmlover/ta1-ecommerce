<template>
    <div v-if="alert.show && alert.type === 'addToCart'"
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100 bg-black bg-opacity-50 w-60 h-40 flex items-center justify-center rounded-lg">
        <div class="flex flex-col items-center">
            <div class="bg-teal-500 rounded-full p-2 mb-2">
                <IconCircleCheck class="text-white" width="20" height="20" />
            </div>
            <span class="text-white font-semibold text-size-xl">{{ alert.message }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconCircleCheck } from '@tabler/icons-vue';

const alertStore = useAlertStore();
const alert = computed(() => alertStore.alert);
</script>