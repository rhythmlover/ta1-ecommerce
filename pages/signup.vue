<template>
    <div class="min-h-full bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-3xl leading-9 font-bold text-gray-900">
                Create a new account
            </h2>
            <p class="text-center text-sm leading-5 text-gray-500 max-w">
                Or
                <UiButton variant="text" :to="'/login'"
                    class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                    login to your account
                </UiButton>
            </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <!-- <div>
                    <label for="email" class="block text-sm font-medium leading-5  text-gray-700">Name</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <input id="name" name="name" placeholder="John Doe" type="text"
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                        <div class="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd">
                                </path>
                            </svg>
                        </div>
                    </div>
                </div> -->

                <div class="mt-6">
                    <label for="email" class="block text-sm font-medium leading-5 text-gray-700">
                        Email address
                    </label>
                    <div class="mt-1">
                        <UiInput v-model="email" id="email" name="email" placeholder="user@example.com" type="email" />
                    </div>
                </div>

                <div class="mt-6">
                    <label for="password" class="block text-sm font-medium leading-5 text-gray-700">
                        Password
                    </label>
                    <div class="mt-1">
                        <UiInput v-model="password" id="password" name="password" type="password" />
                    </div>
                </div>

                <div class="mt-6">
                    <label for="password_confirmation" class="block text-sm font-medium leading-5 text-gray-700">
                        Confirm Password
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <UiInput v-model="confirmPassword" id="password_confirmation" name="password_confirmation" type="password" />
                        <div class="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg v-if="!passwordsMatch" class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" title="Passwords do not match">
                                <path fill-rule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <p class="mt-6 text-sm text-gray-500">
                    Password must contain at least: 
                    <br> • one number,<br> • one uppercase letter,<br> • one lowercase letter,<br> • one special character,<br> • more than 8 characters
                </p>

                <div class="mt-6">
                    <span class="block w-full rounded-md shadow-sm">
                        <UiButton @click="signUp"
                            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                            Create account
                        </UiButton>
                    </span>
                </div>

                <p class="mt-10 text-center text-sm/6 text-gray-500">
                <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordsMatch = computed(() => password.value === confirmPassword.value);
const errorMessage = ref('');
const decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

async function signUp() {
    try {
        if (!email.value || !password.value) {
            errorMessage.value = 'Please enter email and password';
            return;
        }

        if (!email.value.includes('@') || !email.value.includes('.')) {
            errorMessage.value = 'Please enter a valid email';
            return;
        }

        if (!password.value.match(decimal)) {
            errorMessage.value = 'Password must contain at least one number, one uppercase letter, one lowercase letter, one special character, and be more than 8 characters';
            return;
        }

        if (!passwordsMatch.value) {
            errorMessage.value = 'Passwords do not match';
            return;
        }

        const userDetails = await userSignup(email.value, password.value);
        if (userDetails.statusCode === 403) {
            errorMessage.value = userDetails.message;
        } else {
            errorMessage.value = '';
            navigateTo('/login');
        }
    } catch (error) {
        errorMessage.value = 'An error occurred. Please try again.';
    }
}
</script>