<template>
    <UiCenter>
        <ProductPageSkeleton v-show="!imageLoaded" />
        <div v-show="imageLoaded" class="grid sm:grid-cols-2 gap-8">
            <div class="flex flex-col gap-4">
                <!-- fixed dimensions for image -->
                <NuxtImg provider="cloudinary" :src="currentImageUrl" :alt="product?.name"
                    :modifiers="{ roundCorner: '10:10' }" layout="responsive" width="600" height="600"
                    @load="imageLoaded = true" />

                <!-- <NuxtImg :src="currentImageUrl" :alt="product?.name" :modifiers="{ roundCorner: '10:10' }"
                    layout="responsive" @load="imageLoaded = true" /> -->
            </div>

            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2 justify-between">
                    <UiSubheading class="tracking-tight"> {{ product?.name }} </UiSubheading>
                    <span class="font-semibold text-lg">
                        S${{ product?.price.toFixed(2) }}
                    </span>
                </div>

                <div class="border-b border-gray-900 mt-2" />

                <UiParagraph v-if="product?.description">
                    <p v-html="formattedDescription" />
                </UiParagraph>

                <div v-if="product?.options.length">
                    <h2 class="font-semibold mb-2">
                        Options
                    </h2>
                    <div class="flex gap-2 flex-wrap">
                        <div v-for="option in product?.options" :key="option.id">
                            <div class="flex flex-col gap-2">
                                <div class="flex gap-2 flex-wrap">
                                    <UiButton class="text-sm"
                                        :variant="selectedOptions[option.name] === value ? 'highlight' : 'outline'"
                                        @click="setOption(value, option)" v-for="value in option.name" :key="value">
                                        <span class="px-2 font-normal">
                                            {{ value }}
                                        </span>
                                    </UiButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 flex-wrap">
                    <div class="flex items-center border border-slate-200 rounded-lg">
                        <UiButton variant="text" aria-label="Decrease Product Quantity" @click="changeQuantity(-1)">
                            <IconMinus width="20" height="20" />
                        </UiButton>

                        <input type="number" v-model.number="quantity"
                            class="w-8 text-center border-none outline-none text-sm [&::-webkit-inner-spin-button]:appearance-none"
                            :min="1" :max="10" @input="sanitizeQuantity" @blur="validateQuantity" />

                        <UiButton variant="text" aria-label="Increase Product Quantity" @click="changeQuantity(1)">
                            <IconPlus width="20" height="20" />
                        </UiButton>
                    </div>
                </div>

                <UiButton @click="addItemToCart">
                    {{ "Add to cart" }}
                </UiButton>

                <UiErrorAlert />
                <UiSuccessAlert />
                <UiAddToCartAlert />

                <!-- <UiButton
                    :loading="isLoading"
                    :disabled="!currentVariant || outOfStock"
                    @click="addCartLine"
                >
                    {{ outOfStock ? "Out of stock" : "Add to cart" }}
                </UiButton> -->
            </div>
        </div>
    </UiCenter>
</template>

<script setup lang="ts">
import type { Product, Option } from "~/types/types";
import { IconMinus, IconPlus } from "@tabler/icons-vue";

const route = useRoute();
const userStore = useUserStore();
const cartStore = useCartStore();
const alertStore = useAlertStore();

const product = ref<Product | null>(null);
const selectedOptions = reactive<{ [key: string]: string }>({});
const quantity = ref(1);
const currentImageUrl = ref('');
const formattedDescription = computed(() => product.value?.description ?? '');
const imageLoaded = ref(false);

onMounted(async () => {
    alertStore.clearAlert();
    const slug = route.params.slug as string;
    product.value = await getProductByHandle(slug);
    updateImageUrl();
});

watch(selectedOptions, updateImageUrl, { deep: true });

function setOption(value: string, option: Option) {
    if (selectedOptions[option.name] === value) {
        delete selectedOptions[option.name];
    } else {
        Object.keys(selectedOptions).forEach((key) => {
            if (key !== option.name) {
                delete selectedOptions[key];
            }
        });
        selectedOptions[option.name] = value;
    }
}

function updateImageUrl() {
    if (!product.value) {
        console.error('No product found.');
        return;
    }

    const selectedOption = Object.values(selectedOptions)[0];
    const option = product.value.options.find(opt => opt.name === Object.keys(selectedOptions)[0] && opt.name === selectedOption);

    if (option) {
        currentImageUrl.value = option.imageUrl + '.jpg';
    } else {
        currentImageUrl.value = product.value.imageUrl! + '.jpg';
    }
}


function changeQuantity(amount: number) {
    if (quantity.value + amount > 0 && quantity.value + amount <= 10) {
        quantity.value += amount;
    } else if (quantity.value + amount < 1) {
        quantity.value = 1;
        alertStore.showAlert('Minimum purchase quantity is 1.', 'error');
    } else if (quantity.value + amount > 10) {
        quantity.value = 10;
        alertStore.showAlert('You can only purchase a maximum quantity of 10.', 'error');
    }
}

function sanitizeQuantity(event: Event) {
    const input = event.target as HTMLInputElement;

    // Remove invalid characters (non-numeric, negative signs, plus signs)
    input.value = input.value.replace(/[^0-9]/g, '');

    // Prevent starting with 0
    if (input.value.startsWith('0')) {
        input.value = input.value.replace(/^0+/, "0");
    }

    // Allow the input to remain blank temporarily
    if (input.value === '') {
        quantity.value = 0; // Temporarily set quantity to 0
        return;
    }

    // Update the quantity value
    quantity.value = parseInt(input.value, 10);
}

function validateQuantity() {
    // If the input is blank or invalid, reset it to the minimum value (1)
    if (!quantity.value || isNaN(quantity.value)) {
        quantity.value = 1;
        alertStore.showAlert('Please enter a quantity.', 'error');
    } else if (quantity.value < 1) {
        quantity.value = 1;
        alertStore.showAlert('Minimum purchase quantity is 1.', 'error');
    } else if (quantity.value > 10) {
        quantity.value = 10;
        alertStore.showAlert('You can only purchase a maximum quantity of 10.', 'error');
    }
}

async function addItemToCart() {
    alertStore.clearAlert();

    const userId = userStore.getUserId;

    if (userId === '') {
        navigateTo("/login");
    }

    if (userId) {
        const optionId = Object.keys(selectedOptions).map(optionName => {
            const option = product.value?.options.find(opt => opt.name === optionName);
            return option?.id;
        })[0];

        if (!optionId) {
            alertStore.showAlert('Please select an option.', 'error');
            console.error('No option selected.');
            return;
        }

        const cart = await getUserCart(userId);

        if (cart && cart.items.some(item => item.option.id === optionId)) {
            alertStore.showAlert('Item already in cart.', 'error');
            return;
        }

        if (cart && product.value) {
            await addItemToUserCart(cart.id, product.value.id, optionId, quantity.value);
            cartStore.incrementCartQty();
        }

        alertStore.showAlert('Item added to cart.', 'addToCart');
    }
}

useSeoMeta({
    title: () => {
        const title = product.value?.name ?? '';
        return `${title} - Together As One Store`;
    },
    description: () => {
        const description = product.value?.description ?? '';
        return description;
    },
});
</script>
