<template>
    <div class="mb-6 md:mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
            <div>
                <h2 v-if="order.id" class="text-base md:text-lg font-bold">
                    Order #{{ order.id.slice(0, 13).toUpperCase() }}
                </h2>
                <h2 v-else class="text-base md:text-lg font-bold">Order #...</h2>
                <p v-if="order.createdAt" class="text-gray-500 text-xs md:text-sm">
                    Purchased on {{ new Date(order.createdAt).toLocaleDateString('en-SG', {
                        timeZone: "Asia/Singapore",
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }) }}
                </p>
                <p v-else class="text-gray-500 text-xs md:text-sm">...</p>
            </div>
            <!-- <div class="flex space-x-2 md:space-x-4 text-xs md:text-sm">
                <a href="#" class="text-indigo-600 hover:text-indigo-800">Manage order</a>
                <span class="text-gray-300 hidden sm:inline">|</span>
                <a href="#" class="text-indigo-600 hover:text-indigo-800">View Invoice</a>
            </div> -->
        </div>

        <div class="border-b border-gray-200 mt-3 md:mt-5"></div>

        <div class="divide-y divide-gray-200">
            <OrderHistoryItem v-for="item in order.items" :modelValue="item" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Order } from '~/types/types';

const props = defineProps<{
    modelValue: Order;
}>();

const order = props.modelValue;
</script>