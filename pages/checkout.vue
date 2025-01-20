<template>
    <UiCenter>
        <UiHeading> Checkout </UiHeading>

        <div class="grid md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-4 bg-slate-50 rounded-lg p-8">
                <div class="space-y-6">
                    <!-- Contact Section -->
                    <div class="space-y-4">
                        <h2 class="text-2xl font-semibold">Contact</h2>
                        <div class="space-y-2">
                            <input type="email" placeholder="Email"
                                :class="['w-full bg-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2', emailError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']"
                                v-model="email" />
                            <label class="block pt-2 text-sm font-medium text-gray-700">A receipt will be sent to the
                                email</label>
                        </div>
                    </div>

                    <!-- Delivery Section -->
                    <div class="space-y-4">
                        <h2 class="text-2xl font-semibold">Delivery</h2>
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <input placeholder="First name" v-model="firstName"
                                    :class="['bg-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2', firstNameError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                                <input placeholder="Last name" v-model="lastName"
                                    :class="['bg-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2', lastNameError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                            </div>

                            <div class="relative">
                                <input placeholder="Address" v-model="address"
                                    :class="['w-full bg-white px-3 py-2 pr-10 rounded-md border focus:outline-none focus:ring-2', addressError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                                <IconSearch class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>

                            <input placeholder="Unit no." v-model="apartment"
                                :class="['w-full bg-white px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2', apartmentError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />

                            <input placeholder="Postal code" v-model="postalCode"
                                :class="['w-full bg-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2', postalCodeError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />

                            <div class="relative flex">
                                <select v-model="phoneCountryCode"
                                    class="bg-white px-2 py-2 rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="+65">+65</option>
                                    <option value="+60">+60</option>
                                    <option value="+62">+62</option>
                                </select>
                                <input placeholder="Phone" v-model="phoneNumber"
                                    :class="['flex-grow bg-white px-3 py-2 rounded-r-md border focus:outline-none focus:ring-2', phoneNumberError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Method Section -->
                    <div class="space-y-4">
                        <h2 class="text-2xl font-semibold">Shipping method</h2>
                        <p class="text-gray-600 text-sm">
                            Enter your shipping address to view available shipping methods.
                        </p>
                    </div>

                    <!-- Payment Section -->
                    <div class="flex flex-col gap-4">
                        <h2 class="text-2xl font-semibold">Payment</h2>
                        <div id="payment-element" class="w-full"></div>
                        <UiButton class="text-lg" @click="confirmPayment">
                            <span v-if="loading"><img :src="Loading" alt="Loading" class="w-7 h-7" /></span>
                            <span v-else>Pay</span>
                        </UiButton>
                        <p class="text-red-500 text-sm">{{ errorMsg }}</p>
                    </div>
                </div>
            </div>

            <div>
                <div class="flex flex-col gap-4 bg-slate-50 p-8 rounded-lg">
                    <CheckoutLine v-for="item in cartData?.items" :key="item.id" :modelValue="item" />

                    <div class="flex items-center justify-between">
                        <UiParagraph> Subtotal </UiParagraph>

                        <UiParagraph> ${{ subtotalAmount }} </UiParagraph>
                    </div>

                    <div class="flex items-center justify-between">
                        <UiParagraph> Shipping </UiParagraph>

                        <UiParagraph> Free </UiParagraph>
                    </div>

                    <div class="flex items-center justify-between">
                        <UiParagraph> Total </UiParagraph>

                        <strong class="font-semibold">
                            <span>SGD $ {{ totalAmount }}</span>
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    </UiCenter>
</template>

<script lang="ts" setup>
import { loadStripe } from '@stripe/stripe-js';
import { IconSearch } from '@tabler/icons-vue';
import Loading from '~/assets/loading.svg';
import type { Cart } from '~/types/types';
import type { StripeElements, Stripe } from '@stripe/stripe-js';

const config = useRuntimeConfig();
const userStore = useUserStore();
const stripe = ref<Stripe | null>(null);
const successUrl = "http://localhost:3000/success";
const loading = ref(false);

const shippingAmount = ref(0.00);
const subtotalAmount = computed(() => cartData.value?.totalCost || 0);
const totalAmount = computed(() => cartData.value?.totalCost ? cartData.value?.totalCost + shippingAmount.value : 0);

const cartData = ref<Cart | null>(null);

const paymentIntentCS = ref('');
const paymentIntentId = ref('');
const elements = ref<StripeElements | null>(null);

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const address = ref('')
const apartment = ref('')
const postalCode = ref('')
const phoneCountryCode = ref('+65')
const phoneNumber = ref('')

const errorMsg = ref('');
const emailError = ref(false);
const firstNameError = ref(false);
const lastNameError = ref(false);
const addressError = ref(false);
const apartmentError = ref(false);
const postalCodeError = ref(false);
const phoneNumberError = ref(false);

onMounted(async () => {
    const userId = userStore.getUserId;

    if (userId) {
        cartData.value = await getUserCart(userId);
    }

    stripe.value = await loadStripe(config.public.STRIPE_KEY);

    if (!stripe.value) {
        console.error('Failed to load Stripe');
        return;
    }

    const response = await createPaymentIntent(parseInt((totalAmount.value * 100).toFixed(0)));

    paymentIntentCS.value = response.client_secret || '';
    paymentIntentId.value = response.id;

    if (paymentIntentCS.value === '') {
        console.error('Failed to create payment intent');
        return;
    }

    const elementsObj = stripe.value.elements({
        clientSecret: paymentIntentCS.value,
    });

    elements.value = elementsObj;

    const paymentElementObj = elementsObj.create('payment',
        {
            layout: 'accordion',
        }
    );

    paymentElementObj.mount('#payment-element');
});

async function confirmPayment() {
    emailError.value = !email.value;
    firstNameError.value = !firstName.value;
    lastNameError.value = !lastName.value;
    addressError.value = !address.value;
    apartmentError.value = !apartment.value;
    postalCodeError.value = !postalCode.value;
    phoneNumberError.value = !phoneNumber.value;

    if (!email.value || !firstName.value || !lastName.value || !address.value || !apartment.value || !postalCode.value || !phoneNumber.value) {
        errorMsg.value = 'Please fill in all fields';
        return;
    }

    loading.value = true;

    try {
        if (!elements.value || !stripe.value) {
            console.error('Stripe elements or stripe object is not loaded');
            return;
        }

        const elementSubmit = await elements.value!.submit();

        if (elementSubmit.error) {
            console.error(elementSubmit.error);
            return;
        }

        const paymentConfirmation = await stripe.value!.confirmPayment({
            elements: elements.value!,
            clientSecret: paymentIntentCS.value,
            confirmParams: {
                receipt_email: email.value,
                shipping: {
                    address: {
                        line1: address.value,
                        line2: apartment.value,
                        postal_code: postalCode.value,
                        city: 'Singapore',
                        state: 'Singapore',
                        country: 'SG',
                    },
                    name: `${firstName.value} ${lastName.value}`,
                    phone: `${phoneCountryCode.value}${phoneNumber.value}`,
                },
                return_url: successUrl + `?name=${firstName.value} ${lastName.value}&email=${email.value}&phone_country_code=${phoneCountryCode.value.slice(1)}&phone=${phoneNumber.value}&address=${address.value}&apartment=${apartment.value = apartment.value.replace('#', '')}&postal_code=${postalCode.value}`,
            }
        });

        if (paymentConfirmation.error) {
            console.error(paymentConfirmation.error);
            return;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

useSeoMeta({
    title: 'Checkout Cart - Together as One Store',
});
</script>
