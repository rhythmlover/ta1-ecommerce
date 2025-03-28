<template>
    <div class="w-full max-w-xl mx-auto lg:max-w-full mb-8">
        <div class="flex flex-col md:flex-row gap-4 mb-6">
            <!-- Search input -->
            <div class="relative flex-grow">
                <input v-model="searchQuery" type="text" placeholder="Search by ID, customer name or email..."
                    class="w-full px-4 py-3 pl-12 md:pl-15 border border-gray-300 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    @input="emitFilters" />
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-5 pointer-events-none">
                    <IconSearch class="h-5 w-5 md:h-6 md:w-6 text-gray-500" />
                </div>
            </div>

            <!-- Filter options -->
            <div class="flex gap-2 md:gap-3 items-center justify-end">
                <Menu as="div" class="relative inline-block text-left">
                    <MenuButton
                        class="px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                        <IconAdjustmentsHorizontal class="h-5 w-5 md:h-6 md:w-6" />
                    </MenuButton>

                    <MenuItems
                        class="absolute right-0 z-10 mt-2 w-32 md:w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div>
                            <MenuItem v-slot="{ active }">
                            <button @click="statusFilter = 'all'; emitFilters()" :class="[
                                active ? 'bg-gray-100 text-[#C9A0DC]' : 'text-[#C9A0DC]',
                                'block w-full text-left px-4 py-2 text-xs md:text-sm rounded-t-md'
                            ]">
                                All
                            </button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                            <button @click="statusFilter = 'pending'; emitFilters()" :class="[
                                active ? 'bg-[#FED8B1] text-[#FF9900]' : 'bg-[#FFF3E3] text-[#FF9900]',
                                'block w-full text-left px-4 py-2 text-xs md:text-sm'
                            ]">
                                Pending
                            </button>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                            <button @click="statusFilter = 'completed'; emitFilters()" :class="[
                                active ? 'bg-[#E3F9E5] text-[#10B981]' : 'bg-[#F0FFF0] text-[#10B981]',
                                'block w-full text-left px-4 py-2 text-xs md:text-sm rounded-b-md'
                            ]">
                                Completed
                            </button>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>

                <Menu>
                    <MenuButton
                        class="px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        @click="sortBy = sortBy === 'newest' ? 'oldest' : 'newest'; emitFilters()">
                        <IconSortDescending2 v-if="sortBy === 'newest'" class="h-5 w-5 md:h-6 md:w-6" />
                        <IconSortAscending2 v-else-if="sortBy === 'oldest'" class="h-5 w-5 md:h-6 md:w-6" />
                    </MenuButton>
                </Menu>
            </div>
        </div>

        <!-- Order count -->
        <div class="text-xs md:text-sm text-gray-600 ms-1">
            Showing {{ filteredCount }} orders
        </div>
    </div>
</template>

<script setup lang="ts">
import { Menu, MenuItems, MenuItem, MenuButton } from '@headlessui/vue';
import { IconAdjustmentsHorizontal, IconSearch, IconSortAscending2, IconSortDescending2 } from '@tabler/icons-vue';

defineProps<{
    totalOrders: number;
    filteredCount: number;
}>();

const emit = defineEmits(['update-filters']);

const searchQuery = ref('');
const statusFilter = ref('all');
const sortBy = ref('newest');

const emitFilters = () => {
    emit('update-filters', {
        searchQuery: searchQuery.value,
        statusFilter: statusFilter.value,
        sortBy: sortBy.value
    });
};
</script>