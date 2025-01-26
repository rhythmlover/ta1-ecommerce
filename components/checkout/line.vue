<template>
    <div class="flex items-center gap-4">
        <img :src="modelValue.option.imageUrl" :alt="modelValue.product.name" class="w-16 h-16 rounded-lg object-cover" />
        <div class="flex-1">
            <h3 class="font-semibold">{{ modelValue.product.name }}</h3>
            <p class="text-sm text-gray-600">Type:【{{ modelValue.option.name }}】</p>
            <p class="text-sm text-gray-600">Qty: {{ modelValue.quantity }}</p>
        </div>
        <p class="font-sans">${{ accumulatedPrice }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CartItem } from "~/types/types";

const props = defineProps<{
    modelValue: CartItem;
}>();

const quantity = ref(props.modelValue.quantity);
const accumulatedPrice = ref(props.modelValue.product.price * quantity.value);
</script>