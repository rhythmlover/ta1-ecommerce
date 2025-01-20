<template>
    <main id="content" role="main" class="w-full max-w-md mx-auto p-6">
        <div v-if='validationSuccess && !confirmationMessage'
            class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
            <div class="p-4 sm:p-7">
                <div class="text-center">
                    <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Change Password</h1>
                </div>

                <div class="mt-5">
                    <div class="grid gap-y-4">
                        <div>
                            <label class="block text-sm font-bold ml-1 mb-2 dark:text-white">New
                                Password</label>
                            <div class="relative">
                                <UiInput v-model="password" type="password" id="password" name="password" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-bold ml-1 mb-2 dark:text-white">Confirm
                                Password</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <UiInput v-model="confirmPassword" type="password" id="confirm-password"
                                    name="confirm-password" />
                                <div
                                    class="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg v-if="!passwordsMatch" class="h-5 w-5 text-red-500" fill="currentColor"
                                        viewBox="0 0 20 20" title="Passwords do not match">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                            <p class="text-xs text-red-600 mt-2">{{ errorMessage }}</p>
                        </div>
                        <p class="mb-2 text-sm text-gray-500">
                            Password must contain at least:
                            <br> • one number,<br> • one uppercase letter,<br> • one lowercase letter,<br> • one special
                            character,<br> • more than 8 characters
                        </p>
                        <UiButton @click="resetUserPassword"
                            class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                            Reset Password
                        </UiButton>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="validationSuccess && confirmationMessage"
            class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
            <div class="p-4 sm:p-7">
                <div class="text-center">
                    <p class="block text-2xl font-bold text-green-600 dark:text-white">{{ confirmationMessage }}
                    </p>
                </div>
            </div>
        </div>

        <div v-else
            class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
            <div class="p-4 sm:p-7">
                <div class="text-center">
                    <p class="block text-2xl font-bold text-red-600 dark:text-white">{{ validationMessage }}</p>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
const route = useRoute();
const validationSuccess = ref(false);
const validationMessage = ref('');
const password = ref('');
const confirmPassword = ref('');
const confirmationMessage = ref('');
const passwordsMatch = computed(() => password.value === confirmPassword.value);
const errorMessage = ref('');
const id = route.query.id as string;
const email = route.query.email as string;
const decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

onMounted(async () => {
    const res = await verifyPasswordReset(id);
    if (res.message === 'Verification Successful') {
        validationSuccess.value = true;
    } else {
        validationMessage.value = res.message;
    }
});

async function resetUserPassword() {
    if (!password.value.match(decimal)) {
        errorMessage.value = 'Password must contain at least one number, one uppercase letter, one lowercase letter, one special character, and be more than 8 characters';
        return;
    }

    if (!passwordsMatch.value) {
        errorMessage.value = 'Passwords do not match';
        return;
    }

    await resetPassword({ email: email, password: password.value }, id);

    confirmationMessage.value = 'Password reset successful';

    setTimeout(() => {
        navigateTo('/login');
    }, 2000);
}
</script>