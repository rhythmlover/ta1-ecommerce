<template>
    <UiCenter>
        <div v-if="isAdmin" class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
            <h2 class="mb-11 font-bold text-4xl leading-10 text-black text-center">
                Order Backlog
            </h2>
            <BacklogOrderDetails v-for="order in ordersList?.slice().reverse()" :key="order.id" :modelValue="order" />
        </div>
        <div v-else class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
            <p class="text-center text-red-500">{{ errorMessage }}</p>
        </div>
    </UiCenter>
</template>

<script lang="ts" setup>
import type { Order } from "~/types/types";

const userStore = useUserStore();

const ordersList = ref<Order[] | null>(null);
const userLoggedIn = computed(() => userStore.getUserId !== '');
const errorMessage = ref('');
const isAdmin = ref(false);

onMounted(async () => {
    if (!userLoggedIn.value) {
        console.error('User not logged in');
        navigateTo('/login');
        return;
    }

    const user = await getUserDetails(userStore.getUserId);
    if (user.role !== 'admin') {
        console.error('Insufficient permissions');
        errorMessage.value = 'Insufficient permissions.';
        return;
    } else {
        isAdmin.value = true;
    }

    ordersList.value = await getAllOrders();
});
</script>