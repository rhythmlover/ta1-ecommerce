<template>
    <UiCenter>
        <UiHeading> Your cart </UiHeading>

        <div class="grid md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-4 items-center bg-slate-50 rounded-lg p-8" v-if="isEmpty">
                    <IconShoppingCart width="48" height="48" />

                    <p class="text-xl">Your cart is empty.</p>
                </div>
                <CartLine v-for="item in cartData?.items" :key="item.id" :modelValue="item"
                    @update:cartItem="updateCartItem" @delete:item="removeCartItem"
                    @update:totalCost="calculateTotal" />
            </div>

            <div>
                <div class="flex flex-col gap-4 bg-slate-50 p-8 rounded-lg">
                    <!-- <div class="flex items-center justify-between">
                        <UiParagraph> Taxes </UiParagraph>

                        <strong class="font-semibold">
                            <UiPrice :model-value="data?.cart.cost.totalTaxAmount" />
                        </strong>
                    </div> -->

                    <div class="flex items-center justify-between">
                        <UiParagraph> Shipping </UiParagraph>

                        <UiParagraph> Calculated at checkout </UiParagraph>
                    </div>

                    <div class="flex items-center justify-between">
                        <UiParagraph> Subtotal </UiParagraph>

                        <strong class="font-semibold">
                            <span>${{ totalCost }}</span>
                        </strong>
                    </div>

                    <UiButton @click="goToCheckout" class="text-lg" :disabled="isEmpty">
                        Checkout
                    </UiButton>
                </div>
            </div>
        </div>
    </UiCenter>

    <UiErrorAlert />
    <UiSuccessAlert />
</template>

<script setup lang="ts">
import { IconShoppingCart } from "@tabler/icons-vue";
import type { Cart, CartItem } from "~/types/types";
import debounce from "lodash/debounce";

const cartData = ref<Cart | null>(null);
const isEmpty = computed(() => !cartData.value || cartData.value.items.length === 0);
const totalCost = ref("0.00");

const cartStore = useCartStore();
const userStore = useUserStore();
const alertStore = useAlertStore();

onMounted(async () => {
    const userId = userStore.getUserId;
    if (userId) {
        cartData.value = await getUserCart(userId);
        if (cartData.value) {
            totalCost.value = cartData.value.items
                .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
                .toFixed(2);;
        }
    }
});

function updateCartItem(updatedItem: CartItem) {
    const index = cartData.value?.items.findIndex(item => item.id === updatedItem.id);
    if (index !== undefined && index !== -1) {
        cartData.value!.items[index] = updatedItem;
        calculateTotal();
    }
}

function removeCartItem(itemId: string) {
    if (cartData.value) {
        cartData.value.items = cartData.value.items.filter(item => item.id !== itemId);
        cartStore.decrementCartQty();
        calculateTotal();
        alertStore.showAlert("Item removed from cart", "success");
    }
}

// Applied debounce to avoid unsync due to rapid updates to the cart item quantity
const calculateTotal = debounce(async () => {
    if (cartData.value) {
        totalCost.value = cartData.value.items
            .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
            .toFixed(2);
        await updateTotalCost(cartData.value.id, parseFloat(totalCost.value));
    }
}, 200);

function goToCheckout() {
    navigateTo("/checkout");
}

useSeoMeta({
    title: "Cart - Together as One Store",
    description: "Your cart page",
    keywords: "cart, checkout, together as one store",
});
</script>
