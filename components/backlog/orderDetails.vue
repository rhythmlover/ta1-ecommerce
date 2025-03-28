<template>
    <div class="border border-gray-300 rounded-xl max-w-xl mx-auto lg:max-w-full mb-3">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between p-4 lg:p-6 border-gray-200 cursor-pointer"
            @click="toggleDropdown">
            <div class="data mb-4 lg:mb-0">
                <p class="font-semibold text-sm lg:text-base leading-6 lg:leading-7 text-black">
                    Order ID: <span class="text-indigo-600 font-medium">{{ orderId?.toUpperCase() }}</span>
                </p>
                <p class="font-semibold text-sm lg:text-base leading-6 lg:leading-7 text-black mt-2 lg:mt-4">
                    Order Payment: <span class="text-gray-500 font-medium">{{ orderDate }}</span>
                </p>
            </div>
            <div class="flex items-center justify-between">
                <span v-if="orderFulfilled === false"
                    class="rounded-full py-2 px-4 lg:py-3 lg:px-7 font-semibold text-xs lg:text-sm leading-6 lg:leading-7 bg-[#FFF3E3] text-[#FF9900] shadow-sm shadow-transparent transition-all duration-500 mr-2 lg:mr-4">
                    Pending
                </span>
                <span v-if="orderFulfilled === true"
                    class="rounded-full py-2 px-4 lg:py-3 lg:px-7 font-semibold text-xs lg:text-sm leading-6 lg:leading-7 bg-[#E3F9E5] text-[#10B981] shadow-sm shadow-transparent transition-all duration-500 mr-2 lg:mr-4">
                    Completed
                </span>
                <IconChevronDown v-if="!isOpen" class="h-5 w-5 lg:h-6 lg:w-6" />
                <IconChevronUp v-else class="h-5 w-5 lg:h-6 lg:w-6" />
            </div>
        </div>
        <div class="transition-all duration-300 ease-in-out overflow-hidden"
            :class="isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'">
            <!-- name, email, address and postal code -->
            <div class="flex flex-col justify-start items-start p-4 lg:p-6 border-b border-gray-200 gap-4 lg:gap-6">
                <h2 class="font-semibold text-lg lg:text-xl leading-7 lg:leading-8 text-black mb-2 lg:mb-3">
                    Customer Details
                </h2>
                <div class="flex max-md:flex-col items-start w-full">
                    <div class="w-auto flex-auto">
                        <p class="font-medium text-sm lg:text-base leading-6 lg:leading-7 text-black mb-2 lg:mb-3">
                            Name: <span class="text-indigo-600">{{ orderCustomerName }}</span>
                        </p>
                        <p class="font-medium text-sm lg:text-base leading-6 lg:leading-7 text-black mb-2 lg:mb-3">
                            Email: <span class="text-indigo-600">{{ orderCustomerEmail }}</span>
                        </p>
                        <p class="font-medium text-sm lg:text-base leading-6 lg:leading-7 text-black mb-2 lg:mb-3">
                            Phone Number: <span class="text-indigo-600">{{ orderPhoneNumber.slice(2) }}</span>
                        </p>
                    </div>
                    <div class="w-auto flex-auto">
                        <p class="font-medium text-sm lg:text-base leading-6 lg:leading-7 text-black mb-2 lg:mb-3">
                            Address: <span class="text-indigo-600">{{ orderAddress }}</span>
                        </p>
                        <p class="font-medium text-sm lg:text-base leading-6 lg:leading-7 text-black mb-2 lg:mb-3">
                            Postal Code:
                            <span class="text-indigo-600">{{ orderPostalCode }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div v-for="item in orderItems" class="w-full px-3 lg:px-6">
                <div
                    class="flex flex-col lg:flex-row items-start lg:items-center py-4 lg:py-6 px-4 lg:px-10 border-b border-gray-200 gap-4 lg:gap-6 w-full">
                    <NuxtImg :src="item.option.imageUrl + '.jpg'" :alt="item.product.name"
                        class="aspect-square w-full max-w-[100px] lg:max-w-[140px] rounded-xl object-cover" />
                    <div class="flex flex-col lg:flex-row items-start lg:items-center w-full">
                        <div class="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 lg:gap-0">
                            <div class="flex flex-col">
                                <h2
                                    class="font-semibold text-lg lg:text-xl leading-7 lg:leading-8 text-black mb-2 lg:mb-3">
                                    {{ item.product.name }}
                                </h2>
                                <div class="flex flex-col lg:flex-row lg:items-center">
                                    <p
                                        class="font-medium text-sm lg:text-base leading-6 lg:leading-7 text-black lg:pr-4 lg:mr-4 lg:border-r lg:border-gray-200">
                                        Option: <span class="text-indigo-600">{{ item.option.name }}</span>
                                    </p>
                                    <p
                                        class="font-medium text-sm lg:text-base leading-6 lg:leading-7 text-black mt-2 lg:mt-0">
                                        Qty: <span class="text-indigo-600">{{ item.quantity }}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
                                <div class="col-span-1 lg:col-span-2 flex flex-col">
                                    <p class="font-medium text-xs lg:text-sm leading-5 lg:leading-6 text-black">Price
                                    </p>
                                    <p
                                        class="font-medium text-sm lg:text-base leading-5 lg:leading-6 text-indigo-600 mt-1">
                                        ${{ (item.product.price * item.quantity).toFixed(2) }}
                                    </p>
                                </div>
                                <div class="col-span-1 lg:col-span-2 flex flex-col">
                                    <p class="font-medium text-xs lg:text-sm leading-5 lg:leading-6 text-black">Deliver
                                        By</p>
                                    <p
                                        class="font-medium text-sm lg:text-base leading-5 lg:leading-6 text-emerald-600 mt-1">
                                        {{ formattedOrderMailBy }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="w-full border-t border-gray-200 p-4 lg:p-6 flex flex-col lg:flex-row items-center justify-between">
                <p class="font-semibold text-base lg:text-lg text-black mb-4 lg:mb-0">
                    Total Price: <span class="text-indigo-600"> ${{ orderCost.toFixed(2) }} </span>
                </p>
                <div class="flex flex-col sm:flex-row items-center w-full lg:w-auto">
                    <button v-if="orderFulfilled === false" @click="changeOrderStatus"
                        class="flex outline-0 py-3 px-4 lg:py-4 lg:px-6 rounded-lg lg:rounded-br-lg border border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold group text-sm lg:text-base text-black bg-[#E3F9E5] transition-all duration-100 hover:text-indigo-600 w-full lg:w-auto">
                        <IconCheck />
                        <span>Mark as Fulfilled</span>
                    </button>
                    <span v-else
                        class="flex outline-0 py-3 px-4 lg:py-4 lg:px-6 rounded-lg lg:rounded-br-lg border border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold group text-sm lg:text-base text-black w-full lg:w-auto">
                        <IconCircleCheck />
                        <span>Order Fulfilled</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { IconChevronDown, IconChevronUp, IconCheck, IconCircleCheck } from "@tabler/icons-vue";
import type { Order, Product, Option } from "~/types/types";

const props = defineProps<{
    modelValue: Order;
}>();

const emit = defineEmits(['orderFulfilled']);

const isOpen = ref(false)
const orderCustomerName = props.modelValue.name
const orderCustomerEmail = props.modelValue.email
const orderAddress = props.modelValue.address
const orderPostalCode = props.modelValue.postalCode
const orderPhoneNumber = props.modelValue.phone
const orderId = props.modelValue.id
const orderDate = new Date(props.modelValue.createdAt ?? '').toLocaleString(
    "en-SG", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
}
)
const orderFulfilled = ref(props.modelValue.orderFulfilled)
const orderCost = props.modelValue.totalCost
const orderMailBy = new Date(props.modelValue.createdAt ?? '')
orderMailBy.setDate(orderMailBy.getDate() + 3)
const formattedOrderMailBy = orderMailBy.toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "short",
    day: "numeric",
})

const orderItems = ref<Array<{ product: Product, option: Option, quantity: number }>>([]);

const fetchOrderItems = async () => {
    for (const item of props.modelValue.items) {
        const product = await getProduct(item.productId);
        const option = product.options.find(opt => opt.id === item.optionId);
        if (option) {
            orderItems.value.push({
                product,
                option,
                quantity: item.quantity
            });
        }
    }
};

const changeOrderStatus = async () => {
    await updateOrderToFulfilled(orderId ?? '');
    orderFulfilled.value = true;
    emit('orderFulfilled');
}

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

onMounted(() => {
    fetchOrderItems();
});
</script>