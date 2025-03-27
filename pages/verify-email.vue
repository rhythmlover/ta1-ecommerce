<template>
    <main id="content" role="main" class="w-full max-w-md mx-auto p-6">
        <div class="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
            <div class="p-5">
                <div class="text-center">
                    <p v-if="validationSuccess" class="block text-xl font-bold text-green-600 dark:text-white">{{ validationMessage }}</p>
                    <p v-else v-html="errorMessage" class="block text-xl font-bold text-red-600 dark:text-white" />
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
const route = useRoute();
const id = route.query.id as string;
const email = route.query.email as string;
const validationSuccess = ref(false);
const validationMessage = ref('');
const errorMessage = ref('');

onMounted(async () => {
    const res = await verifyEmail(id, email);
    if (res.message === 'Verification Successful') {
        validationSuccess.value = true;
        validationMessage.value = "Email verified successfully.";
    } else if (res.message === 'Request expired') {
        errorMessage.value = res.message + ". <br>A re-verification email has been sent to you.";
        await requestEmailVerification(email);
    } else {
        errorMessage.value = res.message;
    }
});
</script>

<style></style>