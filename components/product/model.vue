<template>
    <div class="flex flex-col items-start gap-4">
        <NuxtLink :to="`/products/${productValue.handle}?id=${productValue.id}`">
            <img
                loading="lazy"
                width="360"
                height="360"
                class="rounded-lg aspect-square shadow-sm transition duration-200 hover:scale-104"
                :alt="productValue.name"
                :src="productValue.imageUrl + '&width=360'"
            />
        </NuxtLink>

        <div class="flex flex-col">
            <UiLink class="text-xl" :to="`/products/${productValue.handle}?id=${productValue.id}`">
                {{ productValue.name }}
            </UiLink>

            <div>
                <h3>{{ productValue.price }}</h3>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/types";

defineProps<{
    productValue: Product;
}>();
</script>
