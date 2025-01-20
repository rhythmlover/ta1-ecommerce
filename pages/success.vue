<template>
    <UiCenter>
        <div class="bg-white rounded-lg pt-10 px-10 flex justify-between items-center">
            <div>
                <div class="flex items-center gap-3">
                    <h2 class="text-lg font-bold" v-if="orderId">#{{ orderId.toUpperCase() }}</h2>
                    <h2 class="text-lg font-bold" v-else>...</h2>
                    <!-- <span class="bg-[#FFF3E3] text-[#FF9900] px-3 py-1 rounded-full text-sm">
                        Pending fulfillment
                    </span> -->
                </div>
                <p class="text-gray-600 text-sm" v-if="orderTime">{{ new Date(orderTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }} at {{ new Date(orderTime).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' }) }}</p>
                <p class="text-gray-600 text-sm" v-else>...</p>
            </div>
            <a href="/" class="text-gray-700 hover:text-gray-900 flex items-center gap-2">
                Continue shopping
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
                                <span class="font-medium">Name</span>
                                <p>{{ name }}</p>
                            </div>
                            <div>
                                <span class="font-medium">Address</span>
                                <p>{{ address }},<br />S{{ postalCode }}, Singapore</p>
                            </div>
                            <div>
                                <span class="font-medium">Phone</span>
                                <p>+{{ phoneCountryCode }} {{ phone }}</p>
                            </div>
                            <div>
                                <span class="font-medium">Email</span>
                                <p>{{ email }}</p>
                            </div>
                        </div>
                    </div>
<!-- 
                    <button class="bg-[#FF7171] text-white px-8 py-3 rounded-full hover:bg-[#FF5959] transition-colors">
                        Track Your Order
                    </button> -->
                </div>

                <!-- Right Column -->
                <div class="bg-gray-100 rounded-2xl p-6">
                    <h2 class="text-xl font-bold mb-6">Order Summary</h2>

                    <div class="flex justify-between gap-4 text-sm mb-5">
                        <div>
                            <span class="text-gray-600">Date</span>
                            <p v-if="orderTime">{{ new Date(orderTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}</p>
                            <p v-else>...</p>
                        </div>
                        <div>
                            <span class="text-gray-600">Order Number</span>
                            <p v-if="orderId">{{ orderId }}</p>
                            <p v-else>...</p>
                        </div>
                        <!-- <div>
                            <span class="text-gray-600">Payment Method</span>
                            <p>Mastercard</p>
                        </div> -->
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
                        <CheckoutLine v-for="item in cartData?.items" :key="item.id" :modelValue="item" />
                    </div>

                    <!-- Order Total -->
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Sub Total</span>
                            <span>{{ cartData?.totalCost }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Shipping</span>
                            <span>{{ shippingCost === 0 ? "Free" : shippingCost }}</span>
                        </div>
                        <div class="h-px bg-gray-300 my-4"></div>
                        <div class="flex justify-between text-lg font-bold">
                            <span>Order Total</span>
                            <span>${{ cartData?.totalCost != undefined ? cartData.totalCost + shippingCost : 0.00 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </UiCenter>
</template>

<script setup lang="ts">
import { IconCornerRightUp } from '@tabler/icons-vue';
import type { Cart, Order, OrderItem } from '~/types/types';

const route = useRoute();
const userStore = useUserStore();
const cartData = ref<Cart | null>(null);
const pid = route.query.payment_intent as string;
const name = route.query.name as string;
const email = route.query.email as string;
const phoneCountryCode = route.query.phone_country_code as string;
const phone = route.query.phone as string;
const address = route.query.address as string;
const apartment = route.query.apartment as string;
const postalCode = route.query.postal_code as string;
const shippingCost = 0;
const orderId = ref<string | null>(null);
const orderTime = ref<string | null>(null);

onMounted(async () => {
    const userId = userStore.getUserId;
    if (userId) {
        cartData.value = await getUserCart(userId);
    }

    if (cartData.value) {
        const orderItems: OrderItem[] = cartData.value.items.map((item) => {
            return {
                productId: item.product.id,
                quantity: item.quantity,
                optionId: item.option.id,
            };
        });

        const order: Order = {
            userId: userId ?? '',
            paymentId: pid,
            totalCost: cartData.value.totalCost,
            name: name,
            email: email,
            phone: phoneCountryCode + phone,
            address: address + " #" + apartment,
            postalCode: postalCode,
            items: orderItems,
        };

        await createOrder(order);

        orderId.value = await getOrderId(pid).then((res) => res.id).then((id) => id.slice(0, 13));
        orderTime.value = await getOrderTimestamp(pid).then((res) => res.createdAt);
    } else {
        console.log('Cart is empty');
    }
});
</script>
