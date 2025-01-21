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
                    @update:modelValue="updateCartItem" @delete:item="removeCartItem" />
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
                            <span>$ {{ calculateTotal() }}</span>
                        </strong>
                    </div>

                    <UiButton @click="goToCheckout" class="text-lg" :disabled="isEmpty">
                        Checkout
                    </UiButton>
                </div>
            </div>
        </div>
    </UiCenter>
</template>

<script setup lang="ts">
import { IconShoppingCart } from "@tabler/icons-vue";
import type { Cart, CartItem } from "~/types/types";

const cartStore = useCartStore();
const userStore = useUserStore();
const cartData = ref<Cart | null>(null);
const isEmpty = computed(() => !cartData.value || cartData.value.items.length === 0);

onMounted(async () => {
    const userId = userStore.getUserId;
    if (userId) {
        cartData.value = await getUserCart(userId);
    }
});

function updateCartItem(updatedItem: CartItem) {
    const index = cartData.value?.items.findIndex(item => item.id === updatedItem.id);
    if (index !== undefined && index !== -1) {
        cartData.value!.items[index] = updatedItem;
    }
}

function removeCartItem(itemId: string) {
    if (cartData.value) {
        cartData.value.items = cartData.value.items.filter(item => item.id !== itemId);
        cartStore.decrementCartQty();
    }
}

function calculateTotal() {
    if (cartData.value) {
        const modifiedCost = cartData.value.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);
        updateTotalCost(cartData.value.id, parseFloat(modifiedCost));
        return modifiedCost;
    }
    return 0;
}

function goToCheckout() {
    navigateTo("/checkout");
}

useSeoMeta({
    title: "Cart - Together as One Store",
});
</script>
