<template>
    <div class="flex justify-center items-center bg-gray-50 p-8">
        <div v-if="finishLoading" class="w-full max-w-lg bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div v-if="paymentSuccess" class="mb-6">
                <!-- Success Icon -->
                <div class="flex justify-center mb-4">
                    <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <!-- Heading -->
                <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">Payment successful</h1>

                <!-- Message -->
                <p class="text-center text-gray-600 mb-6">
                    Your payment to TOGETHERASONE PTE. LTD. was successful.
                    <br />You can now close this page.
                </p>
            </div>

            <div v-else>
                <!-- Error Icon -->
                <div class="flex justify-center mb-4">
                    <div class="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                <!-- Heading -->
                <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">Payment failed</h1>

                <!-- Message -->
                <p class="text-center text-gray-600 mb-6">
                    Your payment to TOGETHERASONE PTE. LTD. was unsuccessful.
                    <br />No money has been deducted from your account.
                    <br />Please check your payment details and try again.
                </p>
            </div>

            <!-- Payment Details -->
            <div class="border-t border-gray-200 pt-4 mb-6">
                <div class="grid grid-cols-2 py-2">
                    <div class="text-gray-500">Reference</div>
                    <div class="text-right font-medium">{{ reference }}</div>
                </div>

                <div class="grid grid-cols-2 py-2">
                    <div class="text-gray-500">Payment type</div>
                    <div class="text-right font-medium">{{ paymentType }}</div>
                </div>

                <div class="grid grid-cols-2 py-2">
                    <div class="text-gray-500">Total</div>
                    <div class="text-right font-medium">S${{ total }}</div>
                </div>
            </div>

            <!-- Back Button -->
            <UiButton class="w-full" variant="primary" @click="goBackToHome">Home</UiButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import Stripe from "stripe";
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe as StripeJSType } from '@stripe/stripe-js';

const config = useRuntimeConfig();
const pid = ref<string>('');
const charge = ref<Stripe.Charge>({} as Stripe.Charge);
const reference = ref<string>('--');
const paymentType = ref<string>('--');
const total = ref<string>('');
const paymentSuccess = ref<boolean>(false);
const finishLoading = ref<boolean>(false);

const stripe = ref<StripeJSType | null>(null);

const cartStore = useCartStore();

onMounted(async () => {
    const isDevEnv = config.public.ENV === 'development';
    pid.value = localStorage.getItem('pid') || '';

    stripe.value = await loadStripe(isDevEnv ? config.public.STRIPE_KEY_TEST : config.public.STRIPE_KEY_LIVE);

    if (!stripe.value) {
        console.error('Failed to load Stripe');
        return;
    }

    try {
        const paymentIntent = await getPaymentIntent(pid.value);
        if (!paymentIntent) {
            console.error('Payment intent not found');
            return;
        }

        charge.value = await getCharge(paymentIntent.latest_charge as string);
        total.value = charge.value.amount ? (charge.value.amount / 100).toFixed(2) : '--';
        paymentSuccess.value = charge.value.status === 'succeeded';

        if (paymentSuccess.value) {
            cartStore.clearCartQty();
        }

        switch (charge.value.payment_method_details?.type) {
            case 'paynow':
                reference.value = charge.value.id.slice(3) as string || '';
                paymentType.value = 'PayNow';
                break;
        }
    } catch (error) {
        console.error('Error fetching payment intent or charge:', error);
    } finally {
        finishLoading.value = true;
        localStorage.removeItem('pid');
    }
});

function goBackToHome() {
    navigateTo('/');
}
</script>