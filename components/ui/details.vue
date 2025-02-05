<template>
    <details>
        <summary class="py-2 outline-none cursor-pointer focus:underline">{{ title }}</summary>
        <div class="px-4 pb-4">
            <p v-html="message" />
        </div>
    </details>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
    title: string;
    message: string;
}>();
</script>