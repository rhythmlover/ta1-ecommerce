<template>
    <div class="flex flex-col items-start gap-4">
        <ProductSkeleton v-show="!imageLoaded" />

        <div v-show="imageLoaded" class="flex flex-col items-start gap-4">
            <NuxtLink :to="`/products/${productValue.handle}?id=${productValue.id}`">
                <img loading="lazy" width="360" height="360"
                    class="rounded-lg aspect-square shadow-sm transition duration-200 hover:scale-104"
                    :alt="productValue.name" :src="productValue.imageUrl + '&width=360'" />
            </NuxtLink>

            <div class="flex flex-col">
                <UiLink class="text-xl" :to="`/products/${productValue.handle}?id=${productValue.id}`">
                    {{ productValue.name }}
                </UiLink>

                <div>
                    <h3>${{ productValue.price }}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/types";

const props = defineProps<{
    productValue: Product;
}>();

const imageLoaded = ref(false);

onMounted(() => {
    const img = new Image();
    img.src = props.productValue.imageUrl + "&width=360";

    img.onload = () => {
        imageLoaded.value = true;
    };
});
</script>
