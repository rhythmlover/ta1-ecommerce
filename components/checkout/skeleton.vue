<template>
    <div class="grid md:grid-cols-2 gap-8">
        <!-- Left Column -->
        <div class="flex flex-col gap-4 bg-slate-50 rounded-lg p-8">
            <!-- Express Checkout Skeleton -->
            <div>
                <div class="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div class="flex gap-4">
                    <div v-for="n in 3" :key="n" class="flex-1 h-12 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
            </div>

            <!-- Contact Section Skeleton -->
            <div class="space-y-4 mt-6">
                <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div class="space-y-2">
                    <div class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
            </div>

            <!-- Delivery Section Skeleton -->
            <div class="space-y-4 mt-6">
                <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            <!-- Shipping Method Section Skeleton -->
            <div class="space-y-4 mt-6">
                <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div class="grid gap-4">
                    <div v-for="n in 2" :key="n" class="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            <!-- Payment Section Skeleton -->
            <div class="space-y-4 mt-6">
                <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                <div class="h-12 w-full bg-gray-200 rounded animate-pulse mt-3"></div>
            </div>
        </div>

        <!-- Right Column -->
        <div>
            <div class="flex flex-col gap-4 bg-slate-50 p-8 rounded-lg">
                <!-- Cart Items Skeleton -->
                <div v-for="n in 3" :key="n" class="py-4 flex items-center border-b border-gray-200">
                    <div class="h-16 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                    <div class="ml-4 flex-1">
                        <div class="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                    </div>
                    <div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <!-- Subtotal Skeleton -->
                <div class="flex items-center justify-between">
                    <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <!-- Shipping Skeleton -->
                <div class="flex items-center justify-between">
                    <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <!-- Total Skeleton -->
                <div class="flex items-center justify-between">
                    <div class="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
</template>