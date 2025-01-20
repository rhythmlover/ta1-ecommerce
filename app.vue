<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
// const cookie = useCartCookie();
// const { mutate, onDone } = useCreateCart();

// if (!cookie.value) {
//     mutate();
// }

// onDone((response) => (cookie.value = response.data?.cartCreate.cart.id));
</script>

<style>
svg {
    stroke-width: 1.5;
}

p {
    font-family: 'Assistant', sans-serif;
    font-weight: 600;
    font-size: medium;
    line-height: 30px;
}

h1 {
    font-family: 'Assistant', sans-serif;
    font-weight: 700;
    font-size: 2.25rem;
    line-height: 2.5rem;
}

summary {
    font-family: 'Assistant', sans-serif;
    font-weight: 600;
    font-size: 1.125rem;
    line-height: 1.75rem;
}
</style>