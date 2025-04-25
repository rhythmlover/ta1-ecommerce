<template>
    <div class="flex items-center justify-center relative">
        <img alt="Banner" class="object-cover object-top h-100 w-full select-none" :src="Banner" />

        <div class="flex flex-col items-start gap-4 absolute w-full max-w-6xl p-8">
            <UiHeading class="text-white">
                Jibbitz <br />
                Collection
            </UiHeading>

            <h2 class="text-slate-200">Show off your style & customize your Crocs with Jibbitz shoe charms!</h2>

            <!-- <UiButton variant="primary" class="text-lg" to="/collections/featured">
                <span class="px-2"> Shop now </span>
            </UiButton> -->
        </div>
    </div>

    <UiCenter>
        <div class="text-center flex flex-col gap-2">
            <UiParagraph class="uppercase tracking-wider"> Best Sellers </UiParagraph>

            <UiHeading> {{ new Date().toLocaleString('default', { month: 'short' }) }} '25 </UiHeading>
        </div>

        <div class="grid place-content-center sm:grid-cols-2 md:grid-cols-3 gap-8">
            <ProductModel :product-value="product" v-for="product in products" />
        </div>
    </UiCenter>
</template>

<script setup lang="ts">
import Banner from "~/assets/crocs_banner.webp";
import type { Product } from '~/types/types';

//const { data } = await useCollection("featured", 6);
const products = ref<Product[]>([]);

onMounted(async () => {
    const allProducts = await getAllProducts();

    // Sort products by priority (1 being the highest priority)
    products.value = allProducts.sort((a, b) => {
        if (a.priority !== null && b.priority !== null) {
            // Both products have a priority, sort by ascending priority
            return (a.priority ?? Infinity) - (b.priority ?? Infinity);
        } else if (a.priority !== null) {
            // Only `a` has a priority, it comes first
            return -1;
        } else if (b.priority !== null) {
            // Only `b` has a priority, it comes first
            return 1;
        } else {
            // Neither has a priority, maintain their original order
            return 0;
        }
    });
});

useSeoMeta({
    title: "Home - Together As One Store",
    description: "Discover the latest TA1 products and collections.",
    keywords: "Home, Together As One Store",
});
</script>
