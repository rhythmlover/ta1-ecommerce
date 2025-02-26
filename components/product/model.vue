<template>
    <div class="flex flex-col items-start gap-4">
        <ProductSkeleton v-show="!imageLoaded" />

        <div v-show="imageLoaded" class="flex flex-col items-start gap-4">
            <!-- <img loading="lazy" width="360" height="360"
                    class="rounded-lg aspect-square shadow-sm transition duration-200 hover:scale-104"
                    src="https://i.ibb.co/2SkgknF/A.jpg" /> -->
            <NuxtLink :to="`/products/${productValue.handle}?id=${productValue.id}`">
                <NuxtImg
                    provider="cloudinary"
                    :src="productValue.imageUrl + '.jpg'"
                    :alt="productValue.name"
                    :modifiers="{ roundCorner: '10:10' }"
                    layout="responsive"
                    width="360"
                    height="360"
                    @load="imageLoaded = true"
                />
            </NuxtLink>

            <div class="flex flex-col">
                <UiLink class="text-xl" :to="`/products/${productValue.handle}?id=${productValue.id}`">
                    {{ productValue.name }}
                </UiLink>

                <div>
                    <h3>${{ productValue.price.toFixed(2) }}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/types";

defineProps<{
    productValue: Product;
}>();

const imageLoaded = ref(false);
</script>
