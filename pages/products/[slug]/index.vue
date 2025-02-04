<template>
    <UiCenter>
        <div class="grid sm:grid-cols-2 gap-8">
            <div class="flex flex-col gap-4">
                <NuxtImg 
                    :src="currentImageUrl" 
                    :alt="product?.name" 
                    :modifiers="{ roundCorner: '10:10' }" 
                    layout="responsive" 
                />
            </div>

            <div class="flex flex-col gap-6">
                <UiHeading> {{ product?.name }} </UiHeading>

                <UiParagraph v-if="product?.description">
                    <p v-html="formattedDescription" />
                </UiParagraph>

                <strong class="font-bold text-lg">
                    ${{ product?.price }}
                </strong>

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

                        <span class="text-sm px-4">
                            {{ quantity_selected }}
                        </span>

                        <UiButton variant="text" aria-label="Increase Product Quantity" @click="changeQuantity(1)">
                            <IconPlus width="20" height="20" />
                        </UiButton>
                    </div>
                </div>

                <UiButton @click="addItemToCart">
                    {{ "Add to cart" }}
                </UiButton>

                <UiErrorAlert v-if="errorMessage" :message="errorMessage" />
                <UiSuccessAlert v-if="successMessage" :message="successMessage" />

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
const product = ref<Product | null>(null);
const selectedOptions = reactive<{ [key: string]: string }>({});
const quantity_selected = ref(1);
const currentImageUrl = ref('');
const formattedDescription = computed(() => product.value?.description ?? '');
const errorMessage = ref('');
const successMessage = ref('');

onMounted(async () => {
    const id = route.query.id as string;
    product.value = await getProduct(id);
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
    if (quantity_selected.value + amount > 0 && quantity_selected.value + amount <= 10) {
        quantity_selected.value += amount;
    }
}

async function addItemToCart() {
    errorMessage.value = '';
    successMessage.value = '';

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
            errorMessage.value = 'Please select an option.';
            console.error('No option selected.');
            return;
        }

        const cart = await getUserCart(userId);

        if (cart && cart.items.some(item => item.option.id === optionId)) {
            errorMessage.value = 'Item already in cart.';
            return;
        }

        if (cart && product.value) {
            await addItemToUserCart(cart.id, product.value.id, optionId, quantity_selected.value);
            cartStore.incrementCartQty();
        }

        successMessage.value = 'Item added to cart.';
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
