<template>
    <UiCenter>
        <UiHeading> Your cart </UiHeading>

        <div class="grid md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-4 items-center bg-white border rounded-lg p-8 rounded shadow-md"
                    v-if="isEmpty">
                    <IconShoppingCart width="48" height="48" />

                    <p class="text-xl">Your cart is empty.</p>
                </div>
                <CartLine v-for="item in cartData?.items" :key="item.id" :modelValue="item"
                    @update:cartItem="updateCartItem" @delete:item="removeCartItem"
                    @update:totalCost="calculateTotal" />
            </div>

            <div>
                <div class="flex flex-col gap-4 bg-white border p-8 rounded-lg rounded shadow-md">
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

                    <UiButton @click="goToCheckout" class="text-lg"
                        :disabled="isEmpty || totalCost === '0.00' || updating">
                        Checkout
                    </UiButton>
                </div>
            </div>
        </div>
    </UiCenter>

    <UiAlertError />
    <UiAlertSuccess />
</template>

<script setup lang="ts">
import { IconShoppingCart } from "@tabler/icons-vue";
import type { Cart, CartItem } from "~/types/types";
import debounce from "lodash/debounce";

const cartStore = useCartStore();
const userStore = useUserStore();
const alertStore = useAlertStore();

const cartData = ref<Cart | null>(null);
const isEmpty = computed(() => !cartData.value || cartData.value.items.length === 0);
const updating = ref(false);
const totalCost = ref<string>("0.00");
const userId = userStore.getUserId;
const sessionId = userStore.getSessionId;

const paymentIntentCS = ref<string>('');
const paymentIntentId = ref<string>('');

async function initializeUserCart() {
    const isLoggedIn = userId !== '';
    if (isLoggedIn) {
        cartData.value = await getUserCart(userId);
    } else {
        if (sessionId) {
            cartData.value = await getSessionCart(sessionId);
        } else {
            navigateTo("/login");
        }
    }
}

await initializeUserCart();

onMounted(() => {
    calculateTotal();
});

function updateCartItem(updatedItem: CartItem) {
    updating.value = true;
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
        updating.value = false;
    }
}, 500);

async function goToCheckout() {
    // Check if there is an existing payment intent created previously
    const existingPaymentIntentId = localStorage.getItem("piID");
    const existingPaymentIntentCS = localStorage.getItem("piCS");

    if (existingPaymentIntentId && existingPaymentIntentCS) {
        const existingPaymentIntent = await getPaymentIntent(existingPaymentIntentId);
        // Check if the payment intent's amount is the same as the current total cost so we don't create a new one unnecessarily
        if (existingPaymentIntent && existingPaymentIntent.amount !== parseInt((parseFloat(totalCost.value) * 100).toFixed(0))) {
            const response = await createPaymentIntent(parseInt((parseFloat(totalCost.value) * 100).toFixed(0)));
            if (response) {
                paymentIntentCS.value = response.client_secret || '';
                paymentIntentId.value = response.id;
                localStorage.setItem("piID", paymentIntentId.value);
                localStorage.setItem("piCS", paymentIntentCS.value);
            } else {
                alertStore.showAlert("Checkout Error. Please refresh the page and try again.", "error");
                console.error("Error creating payment intent");
                return;
            }
        } else {
            // If the payment intent exists and the amount is the same, we can use it directly without creating a new one
            paymentIntentCS.value = existingPaymentIntentCS || '';
            paymentIntentId.value = existingPaymentIntentId || '';
        }
    } else {
        // If no payment intent exists, create a new one
        const response = await createPaymentIntent(parseInt((parseFloat(totalCost.value) * 100).toFixed(0)));
        if (response) {
            paymentIntentCS.value = response.client_secret || '';
            paymentIntentId.value = response.id;
            localStorage.setItem("piID", paymentIntentId.value);
            localStorage.setItem("piCS", paymentIntentCS.value);
        } else {
            alertStore.showAlert("Checkout Error. Please refresh the page and try again.", "error");
            console.error("Error creating payment intent");
            return;
        }
    }
    navigateTo("/checkout");
}

useSeoMeta({
    title: "Cart - Together as One Store",
    description: "Your cart page",
    keywords: "cart, checkout, together as one store",
});
</script>
