<template>
    <UiCenter>
        <div class="max-w-full mx-10 md:mx-20 lg:mx-40 px-4 py-6 md:py-8">
            <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-6 md:mb-8">Order History</h1>
            <!-- <p class="text-gray-600 text-sm md:text-base mt-1 mb-6 md:mb-8">
                Here you can view all your past orders.
            </p> -->

            <div v-if="!noOrders" class="space-y-6 md:space-y-8">
                <OrderHistoryCard v-for="order in orders.slice().reverse()" :key="order.id" :modelValue="order" />
            </div>
            <div v-else class="flex flex-col items-center justify-center h-full py-10">
                <p class="text-gray-500 text-center">It seems like you haven't placed any orders yet... <br>
                    Start shopping to see your orders appear here!</p>
                <UiButton class="mt-8 px-10" variant="primary" to="/">Start Shopping</UiButton>
            </div>
        </div>
    </UiCenter>
    <UiErrorAlert />
    <UiSuccessAlert />
    <UiAddToCartAlert />
</template>

<script lang="ts" setup>
import type { Order } from '~/types/types';

const orders = ref<Order[]>([]);
const noOrders = ref(false);

const userStore = useUserStore();
const userLoggedIn = computed(() => userStore.getUserId !== '');

onMounted(async () => {
    if (!userLoggedIn.value) {
        console.error('User not logged in');
        navigateTo('/login');
        return;
    }

    orders.value = await getOrdersByUser(userStore.getUserId);
    if (orders.value.length === 0) {
        noOrders.value = true;
    }
});
</script>