<template>
    <div class="fixed inset-0 flex items-center justify-center bg-slate-800/80 z-50" @click.self="closePopUp">
        <div v-if="!emailSent" class="bg-white rounded-xl w-11/12 max-w-lg shadow-lg">
            <div class="p-8 text-center">
                <h1 class="text-3xl font-bold text-slate-700">Email not verified</h1>

                <p class="text-md text-slate-600 my-5">
                    Hi! Please verify your email address by clicking the link sent to
                    <span class="font-bold text-slate-700">{{ props.email }}</span>
                </p>

                <UiButton @click="reSendVerificationEmail" variant="primary" class="w-full py-3 text-md">
                    Resend Verification Email
                </UiButton>

                <p class="mt-4 text-sm text-slate-500">
                    Questions? Email us at
                    <span class="text-slate-600">info@ta1-shop.com</span>
                </p>
            </div>
        </div>

        <div v-else class="bg-white rounded-xl w-11/12 max-w-lg shadow-lg">
            <div class="p-8 text-center">
                <h1 class="text-3xl font-bold text-slate-700">Email Sent</h1>

                <p class="text-md text-slate-600 my-6">
                    A verification email has been sent to
                    <span class="font-bold text-slate-700">{{ props.email }}</span>
                </p>

                <UiButton @click="closePopUp" variant="primary" class="w-full py-3 text-md">
                    Close
                </UiButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    email: string;
}>()

const emit = defineEmits(['closePopUp'])

const emailSent = ref(false)

async function reSendVerificationEmail() {
    await requestEmailVerification(props.email).then(() => {
        emailSent.value = true
    }).catch((error) => {
        console.error('Error sending verification email: ', error)
    })
}

function closePopUp() {
    emit('closePopUp')
}
</script>