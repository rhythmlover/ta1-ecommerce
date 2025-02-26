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
                            <label for="hs-leading-icon" class="block text-sm mb-2 dark:text-white">Email
                                address</label>
                            <div class="relative">
                                <input type="email" placeholder="johndoe@email.com"
                                    :class="['w-full bg-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2', emailError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']"
                                    v-model="email" />
                                <p v-if="emailError" class="text-red-500 text-xs italic">Please enter your email.</p>
                                <label class="block pt-2 text-sm text-gray-700">A receipt will be sent to the
                                    email</label>
                            </div>
                        </div>
                    </div>

                    <!-- Delivery Section -->
                    <div class="space-y-4">
                        <h2 class="text-2xl font-semibold">Delivery</h2>
                        <div class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="first-name" class="block text-sm mb-2 dark:text-white">First
                                        Name</label>
                                    <input id="first-name" placeholder="John" v-model="firstName"
                                        :class="['w-full bg-white pl-3 pr-7 py-2 rounded-md border focus:outline-none focus:ring-2', firstNameError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                                    <p v-if="firstNameError" class="text-red-500 text-xs italic">Please enter your first name.</p>
                                </div>
                                <div>
                                    <label for="last-name" class="block text-sm mb-2 dark:text-white">Last
                                        Name</label>
                                    <input id="last-name" placeholder="Doe" v-model="lastName"
                                        :class="['w-full bg-white pl-3 pr-7 py-2 rounded-md border focus:outline-none focus:ring-2', lastNameError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                                    <p v-if="lastNameError" class="text-red-500 text-xs italic">Please enter your last
                                        name.</p>
                                </div>
                            </div>
                            <div>
                                <label for="address" class="block text-sm mb-2 dark:text-white">Address</label>
                                <input id="address" placeholder="Blk 111 Hougang St 1" v-model="address"
                                    :class="['w-full bg-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2', addressError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                                <p v-if="addressError" class="text-red-500 text-xs italic">Please enter your address.
                                </p>
                            </div>
                            <div>
                                <label for="apartment" class="block text-sm mb-2 dark:text-white">Unit No.</label>
                                <input id="apartment" placeholder="#01-111" v-model="apartment"
                                    :class="['w-full bg-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2', apartmentError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                                <p v-if="apartmentError" class="text-red-500 text-xs italic">Please enter your unit
                                    number.</p>
                            </div>
                            <div>
                                <label for="postal-code" class="block text-sm mb-2 dark:text-white">Postal
                                    Code</label>
                                <input id="postal-code" placeholder="111111" v-model="postalCode"
                                    :class="['w-full bg-white px-3 py-2 rounded-md border focus:outline-none focus:ring-2', postalCodeError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                                <p v-if="postalCodeError" class="text-red-500 text-xs italic">Please enter your postal
                                    code.</p>
                            </div>

                            <div>
                                <label for="phone" class="block text-sm mb-2 dark:text-white">Phone</label>
                                <div class="relative flex">
                                    <select v-model="phoneCountryCode"
                                        class="bg-white px-2 py-2 rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="+65">+65</option>
                                        <option value="+60">+60</option>
                                        <option value="+62">+62</option>
                                    </select>
                                    <input id="phone" placeholder="91234567" v-model="phoneNumber"
                                        :class="['flex-grow bg-white px-3 py-2 rounded-r-md border focus:outline-none focus:ring-2', phoneNumberError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                                </div>
                                <p v-if="phoneNumberError" class="text-red-500 text-xs italic">Please enter your phone
                                    number.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Method Section -->
                    <div class="space-y-4">
                        <h2 class="text-2xl font-semibold">Shipping method</h2>
                        <div class="grid gap-4">
                            <label v-for="option in deliveryOptions" :key="option.id" :for="option.id" :class="[
                                'relative flex items-start p-4 cursor-pointer rounded-lg border',
                                'transition-colors duration-200 hover:bg-gray-50',
                                selected === option.id ? 'border-indigo-600 border-2' : 'border-gray-200'
                            ]">
                                <input type="radio" :id="option.id" name="delivery" :value="option.id"
                                    v-model="selected" class="sr-only" />
                                <div class="grid gap-1.5 w-full">
                                    <div class="flex items-center justify-between">
                                        <div class="font-600 text-size-lg text-gray-900">{{ option.title }}</div>
                                        <div class="flex items-center">
                                            <span class="font-600 text-size-lg text-gray-900">
                                                {{ (option.price !== 0.00 ? '$' : '') }}{{ (option.price !== 0.00 ?
                                                    option.price.toFixed(2) : 'Free') }}
                                            </span>
                                            <div class="h-5 w-5 flex items-center justify-center rounded-full">
                                                <IconCheck v-if="selected === option.id"
                                                    class="h-4 w-4 text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ option.description }}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Payment Section -->
                    <div class="flex flex-col gap-4">
                        <h2 class="text-2xl font-semibold">Payment</h2>
                        <div id="payment-element" class="w-full"></div>
                        <UiButton class="text-lg" @click="confirmPayment">
                            <span v-if="loading"><img :src="Loading" alt="Loading" class="w-7 h-7" /></span>
                            <span v-else>Pay</span>
                        </UiButton>
                        <UiErrorAlert v-if="errorMsg" :message="errorMsg" />
                    </div>
                </div>
            </div>

            <div>
                <div class="flex flex-col gap-4 bg-slate-50 p-8 rounded-lg">
                    <CheckoutLine v-for="item in cartData?.items" :key="item.id" :modelValue="item" />

                    <div class="flex items-center justify-between">
                        <UiParagraph> Subtotal </UiParagraph>

                        <UiParagraph> ${{ subtotalAmount.toFixed(2) }} </UiParagraph>
                    </div>

                    <div class="flex items-center justify-between">
                        <UiParagraph> Shipping </UiParagraph>

                        <UiParagraph> Free </UiParagraph>
                    </div>

                    <div class="flex items-center justify-between">
                        <UiParagraph> Total </UiParagraph>

                        <strong class="font-semibold">
                            <span>SGD ${{ totalAmount.toFixed(2) }}</span>
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    </UiCenter>
</template>

<script lang="ts" setup>
import { loadStripe } from '@stripe/stripe-js';
import { IconCheck, IconSearch } from '@tabler/icons-vue';
import Loading from '~/assets/loading.svg';
import type { Cart } from '~/types/types';
import type { StripeElements, Stripe } from '@stripe/stripe-js';

const config = useRuntimeConfig();
const userStore = useUserStore();
const stripe = ref<Stripe | null>(null);
const successUrl = `${config.public.WEB_URL}/success`;
const loading = ref(false);
const deliveryOptions = [
    {
        id: "standard",
        title: "Standard",
        description: "2–3 business days",
        price: 0.00
    },
    //   {
    //     id: "express",
    //     title: "Express",
    //     description: "2–5 business days",
    //     price: 16.00
    //   }
]

const selected = ref("standard")

const shippingAmount = ref(0.00);
const subtotalAmount = computed(() => cartData.value?.totalCost || 0);
const totalAmount = computed(() => cartData.value?.totalCost ? cartData.value?.totalCost + shippingAmount.value : 0);

const cartData = ref<Cart | null>(null);
const userId = userStore.getUserId;

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
