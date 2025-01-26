<template>
    <main id="content" role="main" class="w-full max-w-md mx-auto p-6">
        <div
            class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
            <div class="p-4 sm:p-7">
                <div class="text-center">
                    <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Remember your password?
                        <UiLink class="text-indigo-600 decoration-2 text-size-sm ml-2" to="/login">
                            Login here
                        </UiLink>
                    </p>
                </div>

                <div class="mt-5">
                    <div class="grid gap-y-4">
                        <div>
                            <label for="email" class="block text-sm/6 mb-2 text-gray-900">Email
                                address</label>
                            <div class="relative">
                                <UiInput type="email" id="email" name="email" v-model="email" />
                            </div>
                            <p v-if="emailIsValid" class="text-xs text-red-600">{{ errorMessage }}</p>
                        </div>
                        <UiButton @click="requestReset" type="submit"
                            class="py-3 px-4 mt-2 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                            Request</UiButton>
                    </div>
                </div>
            </div>
        </div>

        <p v-if="confirmationMessage" class="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700 text-green-600 dark:text-green-400">
            {{ confirmationMessage }}
        </p>
    </main>
</template>

<script lang="ts" setup>
const email = ref('');
const emailIsValid = computed(() => {
    return email.value.includes('@') && email.value.includes('.');
});
const errorMessage = ref('');
const confirmationMessage = ref('');

async function requestReset() {
    if (emailIsValid.value === false) {
        errorMessage.value = 'Please enter a valid email';
        return;
    }
    await requestPasswordReset(email.value);
    confirmationMessage.value = 'Password reset link sent to your email';
}
</script>