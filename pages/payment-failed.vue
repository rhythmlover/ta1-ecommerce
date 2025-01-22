<template>
    <div>
        <UiCenter>
            <div class="flex flex-col items-center justify-center space-y-4">
                <div class="text-3xl font-bold text-red-500">Payment Failed</div>
                <div class="text-lg text-center">Your payment has failed. Please try again.</div>
                <div class="text-lg text-center">ID: {{ pid }}</div>
                <div class="text-center">
                    <UiButton to="/" color="primary">Go Back</UiButton>
                </div>
            </div>
        </UiCenter>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const pid = route.query.pid as string;
</script>