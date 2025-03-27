<template>
    <UiCenter>
        <div class="max-w-full mx-auto px-4 py-6 md:py-8">
            <h1 class="text-xl md:text-2xl font-bold tracking-tight">Your Order History</h1>
            <p class="text-gray-600 text-sm md:text-base mt-1 mb-6 md:mb-8">
                Check the status of recent orders, manage returns, and discover similar products.
            </p>

            <div v-if="orders" class="space-y-6 md:space-y-8">
                <OrderHistoryCard v-for="order in orders.slice().reverse()" :key="order.id" :modelValue="order" />
            </div>
            <div v-else>
                <p class="text-gray-500">No orders found</p>
            </div>
        </div>
    </UiCenter>
</template>

<script lang="ts" setup>
import type { Order } from '~/types/types';

const orders = ref<Order[]>([]);

const userStore = useUserStore();
const userLoggedIn = computed(() => userStore.getUserId !== '');

onMounted(async () => {
    if (!userLoggedIn.value) {
        console.error('User not logged in');
        navigateTo('/login');
        return;
    }
        
    orders.value = await getOrdersByUser(userStore.getUserId);
});
</script>