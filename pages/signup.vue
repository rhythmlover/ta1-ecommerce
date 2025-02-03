<template>
    <div class="min-h-full bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-3xl leading-9 font-bold text-gray-900">
                Create a new account
            </h2>
            <p class="text-center text-sm leading-5 text-gray-500 max-w">
                Or
                <UiButton variant="text" :to="'/login'"
                    class="text-indigo-600 hover:text-indigo-500 font-semibold focus:outline-none focus:underline transition ease-in-out duration-150">
                    login to your account
                </UiButton>
            </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div class="mt-6">
                    <label for="email" class="block text-sm leading-5 text-gray-900 mb-2">
                        Email address
                    </label>
                    <div class="mt-1">
                        <input id="email" placeholder="user@example.com" v-model="email" type="email" name="email"
                            required
                            :class="['w-full bg-white pl-3 pr-7 py-1.5 rounded-md border focus:outline-none focus:ring-2', emailError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                        <p v-if="emailError" class="text-red-500 text-xs italic">Please enter a valid email</p>
                    </div>
                </div>

                <div class="mt-6">
                    <label for="password" class="block text-sm leading-5 text-gray-900 mb-2">
                        Password
                    </label>
                    <div class="mt-1">
                        <input id="password" v-model="password" type="password" name="password" required
                            :class="['w-full bg-white pl-3 pr-7 py-1.5 rounded-md border focus:outline-none focus:ring-2', passwordError ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                        <p v-if="passwordError" class="text-red-500 text-xs italic">Password must contain at least one
                            number, one uppercase letter, one lowercase letter, one special character, and be more than
                            8 characters</p>
                    </div>
                </div>

                <div class="mt-6">
                    <label for="password_confirmation" class="block text-sm leading-5 text-gray-900 mb-2">
                        Confirm Password
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input id="password_confirmation" v-model="confirmPassword" type="password"
                            name="password_confirmation" required
                            :class="['w-full bg-white pl-3 pr-7 py-1.5 rounded-md border focus:outline-none focus:ring-2', !passwordsMatch ? 'border-red-500 focus:ring-red-500 border-2' : 'border-gray-300 focus:ring-blue-500']" />
                        <div class="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg v-if="!passwordsMatch" class="h-5 w-5 text-red-500" fill="currentColor"
                                viewBox="0 0 20 20" title="Passwords do not match">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                    <p v-if="!passwordsMatch" class="text-red-500 text-xs italic">Passwords do not match</p>
                </div>

                <p class="mt-6 text-sm text-gray-500">
                    Password must contain at least:
                    <br> • one number,<br> • one uppercase letter,<br> • one lowercase letter,<br> • one special
                    character,<br> • more than 8 characters
                </p>

                <div class="mt-6">
                    <span class="block w-full rounded-md shadow-sm">
                        <UiButton @click="signUp"
                            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                            Create account
                        </UiButton>
                    </span>
                </div>

                <UiErrorAlert v-if="errorMessage" :message="errorMessage" />
                <UiSuccessAlert v-if="successMessage" :message="successMessage" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordsMatch = computed(() => password.value === confirmPassword.value);
const decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

const errorMessage = ref('');
const successMessage = ref('');
const emailError = ref(false);
const passwordError = ref(false);

async function signUp() {
    try {
        if (!email.value || !password.value) {
            errorMessage.value = 'Please fill in all fields.';
            return;
        } else {
            errorMessage.value = '';
        }

        emailError.value = !email.value.includes('@') || !email.value.includes('.');
        passwordError.value = !decimal.test(password.value);

        if (emailError.value || passwordError.value || !passwordsMatch.value) {
            return;
        }

        const userDetails = await userSignup(email.value, password.value);
        if (userDetails.statusCode === 403) {
            successMessage.value = '';
            errorMessage.value = userDetails.message;
        } else {
            errorMessage.value = '';
            successMessage.value = 'A verification email has been sent to your email address.';
        }
    } catch (error) {
        console.error(error);
        errorMessage.value = 'An error occurred. Please try again.';
    }
}

useSeoMeta({
    title: "Sign Up - Together As One Store",
    description: "Create a new account to start shopping at Together As One Store.",
});
</script>