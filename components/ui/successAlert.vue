<template>
    <div
        v-if="alert.show && alert.type === 'success'"
        class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 w-auto"
        role="alert"
    >
        <span class="block sm:inline" v-html="alert.message" />
    </div>
</template>

<script setup lang="ts">
const alertStore = useAlertStore();
const alert = computed(() => alertStore.alert);
</script>