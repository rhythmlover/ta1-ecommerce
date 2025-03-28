<template>
    <div class="grid sm:grid-cols-2 gap-8">
        <!-- Image skeleton - takes full width on mobile, half on desktop -->
        <div class="flex flex-col gap-4">
            <div class="w-full aspect-square sm:h-[560px] bg-gray-300 rounded-lg animate-pulse" />
        </div>

        <!-- Product details skeleton -->
        <div class="flex flex-col gap-4 sm:gap-6">
            <!-- Product name skeleton -->
            <div class="w-4/5 h-8 sm:h-16 bg-gray-300 rounded animate-pulse" />

            <!-- Description skeleton - shorter on mobile -->
            <div class="w-full h-32 sm:h-43 bg-gray-300 rounded animate-pulse" />

            <!-- Price skeleton -->
            <div class="w-1/3 h-8 sm:h-10 bg-gray-300 rounded animate-pulse" />

            <!-- Options skeleton -->
            <div class="w-full">
                <!-- Options title skeleton -->
                <div class="w-1/4 h-6 bg-gray-300 rounded animate-pulse mb-3" />

                <!-- Option buttons skeleton -->
                <div class="flex flex-wrap gap-2">
                    <div class="w-20 h-8 bg-gray-300 rounded animate-pulse" />
                    <div class="w-20 h-8 bg-gray-300 rounded animate-pulse" />
                    <div class="w-20 h-8 bg-gray-300 rounded animate-pulse" />
                    <div class="w-20 h-8 bg-gray-300 rounded animate-pulse" />
                </div>
            </div>

            <!-- Quantity selector skeleton -->
            <div class="w-32 h-10 bg-gray-300 rounded animate-pulse" />

            <!-- Add to cart button skeleton -->
            <div class="w-full h-12 bg-gray-300 rounded animate-pulse mt-2" />
        </div>
    </div>
</template>