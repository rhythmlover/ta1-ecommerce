<template>
    <UiCenter>
        <div class="rounded-lg pt-10 px-2 xl:px-10 flex justify-between items-center">
            <div>
                <div class="flex items-center gap-3">
                    <h2 class="text-lg font-bold" v-if="finishLoading && orderId">#{{ orderId.toUpperCase() }}</h2>
                    <h2 class="text-lg font-bold" v-else>...</h2>
                    <!-- <span class="bg-[#FFF3E3] text-[#FF9900] px-3 py-1 rounded-full text-sm">
                        Pending fulfillment
                    </span> -->
                </div>
                <p class="text-gray-600 text-sm" v-if="finishLoading && orderTime">{{
                    new Date(orderTime).toLocaleDateString('en-SG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })
                }} at {{
                        new Date(orderTime).toLocaleTimeString('en-SG', {
                            timeZone: "Asia/Singapore",
                            hour: 'numeric',
                            minute: 'numeric'
                        }) }}</p>
                <p class="text-gray-600 text-sm" v-else>...</p>
            </div>
            <a v-if="from === 'history'" @click="goToOrderHistory"
                class="text-gray-700 hover:text-gray-900 flex items-center gap-2 cursor-pointer">
                <span class="max-md:hidden">Back</span>
                <IconCornerRightUp class="h-6 w-6" />
            </a>
            <a v-else @click="goBackToHome"
                class="text-gray-700 hover:text-gray-900 flex items-center gap-2 cursor-pointer">
                <span class="max-md:hidden">Continue shopping</span>
                <IconCornerRightUp class="h-6 w-6" />
            </a>
        </div>
        <div class="flex items-center justify-center">
            <div class="bg-white rounded-3xl shadow-lg p-8 max-w-5xl w-full grid md:grid-cols-2 gap-8">
                <!-- Left Column -->
                <div>
                    <h1 class="text-4xl font-bold mb-4">Thank you for your purchase!</h1>
                    <p class="text-gray-600 mb-8">
                        Your order will be processed within 24 hours during working days.
                        We have sent you a receipt via email with your order details.
                    </p>

                    <div class="mb-8">
                        <h2 class="font-semibold text-lg mb-4">Billing address</h2>
                        <div class="space-y-2">
                            <div>
                                <span class="font-light">Name</span>
                                <p v-if="finishLoading">{{ name }}</p>
                                <p v-else>--</p>
                            </div>
                            <div>
                                <span class="font-light">Address</span>
                                <p v-if="finishLoading">{{ address }}, {{ apartment }}<br />S{{ postalCode }}, Singapore
                                </p>
                                <p v-else>--</p>
                            </div>
                            <div>
                                <span class="font-light">Phone</span>
                                <p v-if="finishLoading">{{ phoneCountryCode }}{{ phone }}</p>
                                <p v-else>--</p>
                            </div>
                            <div>
                                <span class="font-light">Email</span>
                                <p v-if="finishLoading">{{ email }}</p>
                                <p v-else>--</p>
                            </div>
                        </div>
                    </div>
                    <!-- <button class="bg-[#FF7171] text-white px-8 py-3 rounded-full hover:bg-[#FF5959] transition-colors">
                        Track Your Order
                    </button> -->
                </div>

                <!-- Right Column -->
                <div class="bg-gray-100 rounded-2xl p-6">
                    <h2 class="text-xl font-bold mb-6">Order Summary</h2>

                    <div class="flex justify-between gap-4 text-sm mb-5">
                        <div>
                            <span class="text-gray-600">Date</span>
                            <p v-if="finishLoading && orderTime">{{ new Date(orderTime).toLocaleDateString('en-SG', {
                                timeZone: "Asia/Singapore",
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }) }}</p>
                            <p v-else>--</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Payment Status</span>
                            <p v-if="finishLoading">{{ charge.status === 'succeeded' ? "Success" : "Failed" }}</p>
                            <p v-else>--</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Payment Method</span>
                            <p v-if="finishLoading">{{ paymentType }}</p>
                            <p v-else>--</p>
                        </div>
                    </div>
                    <div class="flex justify-between gap-4 text-sm mb-5">
                        <div>
                            <span class="text-gray-600">Payment Reference</span>
                            <p v-if="finishLoading">{{ reference }}</p>
                            <p v-else>--</p>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div class="space-y-4 mb-6">
                        <!-- <div class="flex items-center gap-4">
                            <img :src="'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1wWdI5lydlyX4hQX0ptrjOz96PNPaQ.png'"
                                alt="All In One Chocolate Combo" class="w-16 h-16 rounded-lg object-cover" />
                            <div class="flex-1">
                                <h3 class="font-medium">All In One Chocolate Combo</h3>
                                <p class="text-sm text-gray-600">Pack: Medium</p>
                                <p class="text-sm text-gray-600">Qty: 1</p>
                            </div>
                            <p class="font-medium">$50.00</p>
                        </div>

                        <div class="flex items-center gap-4">
                            <img :src="'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1wWdI5lydlyX4hQX0ptrjOz96PNPaQ.png'"
                                alt="Desire Of Hearts" class="w-16 h-16 rounded-lg object-cover" />
                            <div class="flex-1">
                                <h3 class="font-medium">Desire Of Hearts</h3>
                                <p class="text-sm text-gray-600">Pack: Large</p>
                                <p class="text-sm text-gray-600">Qty: 1</p>
                            </div>
                            <p class="font-medium">$50.00</p>
                        </div> -->
                        <CheckoutLine v-if="cartItems && finishLoading" v-for="item in cartItems?.items" :key="item.id" :cartItem="item" />
                        <CheckoutLine v-if="orderItems && finishLoading" v-for="item in orderItems?.items" :key="`${item.productId}-${item.optionId}`" :orderItem="item" />
                    </div>

                    <!-- Order Total -->
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Sub Total</span>
                            <span v-if="finishLoading">S${{ subTotal }}</span>
                            <span v-else>--</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Shipping</span>
                            <span>S${{ shippingCost === "0.00" ? "0.00" : shippingCost }}</span>
                        </div>
                        <div class="h-px bg-gray-300 my-4"></div>
                        <div class="flex justify-between text-lg font-bold">
                            <span>Order Total</span>
                            <span v-if="finishLoading">S${{ shippingCost === "0.00" ? subTotal : (parseFloat(subTotal) +
                                parseFloat(shippingCost)).toFixed(2) }}</span>
                            <span v-else>--</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </UiCenter>
</template>

<script setup lang="ts">
import Stripe from "stripe";
import { IconCornerRightUp } from '@tabler/icons-vue';
import type { Cart, Order, OrderItem } from '~/types/types';

const route = useRoute();
const userStore = useUserStore();
const cartStore = useCartStore();

const cartItems = ref<Cart | null>(null);
const orderItems = ref<Order | null>(null);
const orderId = ref<string | null>(null);
const orderTime = ref<string | null>(null);
const charge = ref<Stripe.Charge>({} as Stripe.Charge);
const reference = ref<string>('--');
const paymentType = ref<string>('--');
const last4 = ref<string>('--');

const pid = route.query.id as string;
const from = route.query.from as string;
const name = ref<string>('--');
const email = ref<string>('--');
const phoneCountryCode = ref<string>('--');
const phone = ref<string>('--');
const address = ref<string>('--');
const apartment = ref<string>('--');
const postalCode = ref<string>('--');
const subTotal = ref<string>('0.00');

const shippingCost = ref<string>('0.00');
const userId = userStore.getUserId;
const finishLoading = ref<boolean>(false);

onMounted(async () => {
    try {
        if (userId) {
            // make sure it is redirected only from checkout or order history to load the items
            if (from === 'checkout') {
                cartItems.value = await getUserCart(userId);
                cartStore.clearCartQty();
            } else if (from === 'history') {
                orderItems.value = await getOrder(pid);
            }
        } else {
            navigateTo('/login');
        }

        const details = await getPaymentIntent(pid);

        if (details) {
            name.value = details.shipping?.name || '--';
            email.value = details.receipt_email || '--';
            phoneCountryCode.value = details.shipping?.phone?.slice(0, 3) || '--';
            phone.value = details.shipping?.phone?.slice(3) || '--';
            address.value = details.shipping?.address?.line1 || '--';
            apartment.value = details.shipping?.address?.line2 || '--';
            postalCode.value = details.shipping?.address?.postal_code || '--';
            subTotal.value = (details.amount_received / 100).toFixed(2) + '';
        }

        const chargeId = details.latest_charge as string;
        charge.value = await getCharge(chargeId);

        switch (charge.value.payment_method_details?.type) {
            case 'card':
                reference.value = charge.value.id.slice(3) as string || '--';

                let brand = charge.value.payment_method_details?.card?.brand || '--';
                brand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();

                last4.value = charge.value.payment_method_details?.card?.last4 || '--';
                paymentType.value = `${brand} ending in ${last4.value}`;
                localStorage.removeItem('piID');
                localStorage.removeItem('piCS');
                break;
            // piID and piCS local storage is removed in payment-redirect.vue for paynow payment method
            case 'paynow':
                reference.value = charge.value.id.slice(3) as string || '';
                paymentType.value = 'PayNow';
                // clear the local storage for piID and piCS if they exist
                // this is to prevent the user from being able to access the payment-redirect page again with the same piID and piCS
                // in the event that payment-redirect page is not loaded
                if (localStorage.getItem('piID') && localStorage.getItem('piCS')) {
                    localStorage.removeItem('piID');
                    localStorage.removeItem('piCS');
                }
                break;
            default:
                reference.value = charge.value.id.slice(3) as string || '--';
                paymentType.value = charge.value.payment_method_details?.type || '--';
                if (localStorage.getItem('piID') && localStorage.getItem('piCS')) {
                    localStorage.removeItem('piID');
                    localStorage.removeItem('piCS');
                }
                break;
        }

        if (cartItems.value && from === 'checkout') {
            const orderItems: OrderItem[] = cartItems.value.items.map((item) => {
                return {
                    productId: item.product.id,
                    quantity: item.quantity,
                    optionId: item.option.id,
                };
            });


            const order: Order = {
                userId: userId ?? '',
                paymentId: pid,
                totalCost: cartItems.value.totalCost,
                name: name.value,
                email: email.value,
                phone: phoneCountryCode.value + phone.value,
                address: address.value + ' ' + apartment.value || '',
                postalCode: postalCode.value || '',
                items: orderItems,
            };

            await createOrder(order);

            orderId.value = await getOrderId(pid).then((res) => res.id).then((id) => id.slice(0, 13));
            orderTime.value = await getOrderTimestamp(pid).then((res) => res.createdAt);

            await clearCart(cartItems.value.id);
            await updateTotalCost(cartItems.value.id, 0);
        } else if (orderItems.value && from === 'history') {
            orderId.value = await getOrderId(pid).then((res) => res.id).then((id) => id.slice(0, 13));
            orderTime.value = await getOrderTimestamp(pid).then((res) => res.createdAt);
        }
    } catch (error) {
        console.error('Error fetching payment intent or charge: ', error);
    } finally {
        finishLoading.value = true;
    }
});

function goBackToHome() {
    navigateTo('/');
}

function goToOrderHistory() {
    navigateTo('/order-history');
}

useSeoMeta({
    title: "Order Receipt - Together as One Store",
    description: "Order receipt page",
    keywords: "order, receipt, together as one store",
});
</script>
