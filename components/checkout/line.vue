<template>
    <div class="flex items-center gap-4">
        <NuxtImg :src="productImageUrl + '.jpg'" :alt="productName" :modifiers="{ roundCorner: '10:10' }"
            layout="responsive" width="70" height="70" class="shadow-md rounded-lg" />
        <div class="flex-1">
            <h3 class="font-semibold">{{ productName }}</h3>
            <p class="text-sm text-gray-600">Option: {{ optionName }}</p>
            <p class="text-sm text-gray-600">Qty: {{ quantity }}</p>
        </div>
        <p class="font-sans">S${{ accumulatedPrice.toFixed(2) }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CartItem, OrderItem } from "~/types/types";

const props = defineProps<{
    cartItem?: CartItem;
    orderItem?: OrderItem;
}>();

const quantity = ref<number>(0);
const accumulatedPrice = ref<number>(0);
const productName = ref<string>("");
const optionName = ref<string>("");
const productImageUrl = ref<string>("");

onMounted(async () => {
    if (props.cartItem) {
        quantity.value = props.cartItem.quantity;
        accumulatedPrice.value = props.cartItem.product.price * quantity.value;
        productName.value = props.cartItem.product.name;
        optionName.value = props.cartItem.option.name;
        productImageUrl.value = props.cartItem.product.imageUrl ?? "";
    } else if (props.orderItem) {
        quantity.value = props.orderItem.quantity;
        await getProduct(props.orderItem.productId).then((product) => {
            productName.value = product.name;
            optionName.value = props.orderItem?.optionId
                ? product.options.find((option) => option.id === props.orderItem?.optionId)?.name ?? "" : "";
            productImageUrl.value = product.options.find((option) => option.id === props.orderItem?.optionId)?.imageUrl ?? product.imageUrl ?? "";
            accumulatedPrice.value = product.price * quantity.value;
        });
    }
});
</script>