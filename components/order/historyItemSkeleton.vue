<template>
    <div class="py-6 flex flex-col sm:flex-row border-b border-gray-200">
        <!-- Mobile view: Horizontal layout for image and details -->
        <div class="flex sm:block">
            <!-- Image skeleton -->
            <div class="h-24 w-24 sm:h-32 sm:w-32 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 animate-pulse">
            </div>

            <div class="ml-4 sm:ml-0 sm:mt-0 flex-1 flex flex-col">
                <div class="sm:hidden">
                    <!-- Mobile product name skeleton -->
                    <div class="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <!-- Mobile option name skeleton -->
                    <div class="mt-1 h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <!-- Mobile price skeleton -->
                    <div class="mt-1 h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>

        <div class="mt-4 sm:mt-0 sm:ml-6 flex-1 flex flex-col">
            <!-- Desktop view product details (hidden on mobile) -->
            <div class="hidden sm:flex sm:flex-row sm:justify-between">
                <div class="sm:text-left">
                    <!-- Desktop product name skeleton -->
                    <div class="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <!-- Desktop option type skeleton -->
                    <div class="mt-1 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <!-- Desktop quantity skeleton -->
                    <div class="mt-1 h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <!-- Desktop price skeleton -->
                    <div class="mt-1 h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <!-- Desktop buttons skeleton -->
                <div class="flex flex-col space-y-2">
                    <div class="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            <!-- Mobile view buttons skeleton (full width, stacked) -->
            <div class="sm:hidden mt-4 space-y-2">
                <div class="h-10 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    </div>
</template>