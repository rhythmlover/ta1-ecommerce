<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-30 w-auto" src="/TA1.svg" alt="TA1 Logo" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div class="space-y-6">
                <div>
                    <label for="email" class="block text-sm/6 text-gray-900">Email address</label>
                    <div class="mt-2">
                        <UiInput v-model="email" type="email" name="email" id="email" autocomplete="email" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 text-gray-900">Password</label>
                        <div class="text-sm">
                            <UiLink class="font-semibold text-size-sm text-indigo-600 hover:text-indigo-500"
                                to="/forgot-password">
                                Forgot password?</UiLink>
                        </div>
                    </div>
                    <div class="mt-2">
                        <UiInput v-model="password" type="password" name="password" id="password"
                            autocomplete="current-password" />
                    </div>
                </div>

                <div class="pt-5">
                    <UiButton @click="login" :variant="'primary'"
                        class="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6">Sign in</UiButton>
                </div>
            </div>

            <p class="mt-10 text-center text-sm/6 text-gray-500">
                Don't have an account?
                {{ ' ' }}
                <UiLink class="font-semibold text-size-sm text-indigo-600 hover:text-indigo-500 ml-1" :to="'/signup'">
                    Sign up</UiLink>
            </p>

            <UiErrorAlert />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const cartStore = useCartStore();
const userStore = useUserStore();
const alertStore = useAlertStore();

onMounted(() => {
    alertStore.clearAlert();
});

async function login() {
    try {
        alertStore.clearAlert();
        if (!email.value || !password.value) {
            alertStore.showAlert('Please enter email and password.', 'error');
            return;
        }

        if (!email.value.includes('@') || !email.value.includes('.')) {
            alertStore.showAlert('Please enter a valid email.', 'error');
            return;
        }

        const userDetails = await userLogin(email.value, password.value);

        if ("statusCode" in userDetails) {
            alertStore.showAlert(userDetails.message, 'error');
            return;
        }

        if (userDetails.id === undefined) {
            alertStore.showAlert('No such account found.', 'error');
            return;
        }

        const cart = await getUserCart(userDetails.id);

        if (cart) {
            cartStore.setCartQty(cart.items.length);
        } else {
            cartStore.setCartQty(0);
            await createCart(userDetails.id);
        }
        userStore.setUserId(userDetails.id);

        alertStore.clearAlert();
        window.location.href = '/';
    } catch (error) {
        console.error(error);
        alertStore.showAlert('An error occurred. Please try again.', 'error');
    }
}

useSeoMeta({
    title: 'Login - Together as One Store',
    description: 'Login to your account',
    keywords: 'login, together as one store, ecommerce, online shopping',
});
</script>