<template>
    <UiCenter>
        <div v-if="isAdmin" class="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
            <h2 class="mb-8 font-bold text-4xl leading-10 text-black text-center">
                Order Backlog
            </h2>

            <!-- Search and filter component -->
            <BacklogSearchFilter :total-orders="ordersList?.length || 0" :filtered-count="filteredOrders.length"
                @update-filters="updateFilters" />

            <!-- No results message -->
            <div v-if="filteredOrders.length === 0 && ordersList && ordersList.length > 0" class="text-center py-10">
                <p class="text-gray-500 text-lg">No orders match your search criteria</p>
            </div>

            <!-- Order list -->
            <BacklogOrderDetails v-for="order in filteredOrders" :key="order.id" :modelValue="order"
                @order-fulfilled="refreshOrders" />
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

// Search and filter state
const filters = ref({
    searchQuery: '',
    statusFilter: 'all',
    sortBy: 'newest'
});

// Update filters from the search component
const updateFilters = (newFilters: { searchQuery: string; statusFilter: string; sortBy: string; }) => {
    filters.value = newFilters;
};

// Filtered and sorted orders
const filteredOrders = computed(() => {
    if (!ordersList.value) return [];

    let result = [...ordersList.value];

    // Filter by search query
    if (filters.value.searchQuery) {
        const query = filters.value.searchQuery.toLowerCase();
        result = result.filter(order =>
            (order.id && order.id.toLowerCase().includes(query)) ||
            (order.name && order.name.toLowerCase().includes(query)) ||
            (order.email && order.email.toLowerCase().includes(query))
        );
    }

    // Filter by status
    if (filters.value.statusFilter !== 'all') {
        const isCompleted = filters.value.statusFilter === 'completed';
        result = result.filter(order => order.orderFulfilled === isCompleted);
    }

    // Sort orders
    result.sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime();
        const dateB = new Date(b.createdAt || '').getTime();

        return filters.value.sortBy === 'newest'
            ? dateB - dateA  // Newest first
            : dateA - dateB; // Oldest first
    });

    return result;
});

// Refresh orders after status change
const refreshOrders = async () => {
    ordersList.value = await getAllOrders();
};

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