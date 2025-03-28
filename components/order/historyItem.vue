<template>
    <OrderHistoryItemSkeleton v-show="!imageLoaded" />
    <div class="py-6 flex flex-col sm:flex-row border-b border-gray-200" v-show="imageLoaded">
        <!-- Mobile view: Horizontal layout for image and details -->
        <div class="flex sm:block">
            <NuxtImg :src="option?.imageUrl + '.jpg'" :alt="productDetails?.name" @load="imageLoaded = true"
                class="object-center object-cover h-24 w-24 sm:h-32 sm:w-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0" />

            <div class="ml-4 sm:ml-0 sm:mt-0 flex-1 flex flex-col">
                <div class="sm:hidden">
                    <h3 class="text-base font-semibold text-gray-900">{{ productDetails?.name }}</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        {{ optionName }}
                    </p>
                    <p class="mt-1 text-base font-semibold text-gray-900">
                        ${{ productDetails ? (productDetails?.price * item.quantity).toFixed(2) : '--' }}
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-4 sm:mt-0 sm:ml-6 flex-1 flex flex-col">
            <!-- Desktop view product details (hidden on mobile) -->
            <div class="hidden sm:flex sm:flex-row sm:justify-between">
                <div class="sm:text-left">
                    <h3 class="text-base font-semibold text-gray-900">{{ productDetails?.name }}</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Type:【{{ optionName }}】
                    </p>
                    <p class="mt-1 text-sm text-gray-500">
                        Qty: {{ item.quantity }}
                    </p>
                    <p class="mt-1 text-base font-semibold text-gray-900">
                        ${{ productDetails ? (productDetails?.price * item.quantity).toFixed(2) : '--' }}
                    </p>
                </div>

                <!-- Desktop buttons -->
                <div class="flex flex-col space-y-2">
                    <UiButton @click="goToProductPage" variant="primary" class="text-white px-8 py-2 text-sm">
                        Buy again
                    </UiButton>
                    <UiButton @click="addItemToCart" variant="outline" class="text-gray-700 px-8 py-2 text-sm">
                        Add to cart
                    </UiButton>
                </div>
            </div>

            <!-- Mobile view buttons (full width, stacked) -->
            <div class="sm:hidden mt-4 space-y-2">
                <UiButton @click="goToProductPage" variant="primary" class="text-white py-1.5 text-base w-full mb-2">
                    Buy again
                </UiButton>
                <UiButton @click="addItemToCart" variant="outline" class="text-gray-700 py-1.5 text-base w-full border">
                    Add to cart
                </UiButton>
            </div>
        </div>

        <UiErrorAlert />
        <UiSuccessAlert />
    </div>
</template>

<script lang="ts" setup>
import type { OrderItem, Product, Option } from '~/types/types';

const props = defineProps<{
    modelValue: OrderItem;
}>();

const item = props.modelValue;
const productDetails = ref<Product | null>(null);
const optionName = ref<string | null>(null);
const option = ref<Option | null>(null);
const imageLoaded = ref(false);

const userStore = useUserStore();
const cartStore = useCartStore();
const alertStore = useAlertStore();

onMounted(async () => {
    alertStore.clearAlert();
    productDetails.value = await getProduct(item.productId);

    option.value = productDetails.value?.options.find(opt => opt.id === item.optionId) || null;
    optionName.value = option.value?.name || '';
});

async function addItemToCart() {
    alertStore.clearAlert();

    const userId = userStore.getUserId;

    if (userId === '') {
        navigateTo("/login");
    }

    if (userId) {
        const cart = await getUserCart(userId);

        if (cart && cart.items.some(item => item.option.id === option.value?.id)) {
            alertStore.showAlert('Item already in cart.', 'error');
            return;
        }

        if (cart && productDetails.value) {
            await addItemToUserCart(cart.id, productDetails.value.id, item.optionId, item.quantity);
            cartStore.incrementCartQty();
        }

        alertStore.showAlert('Item added to cart.', 'success');
    }
}

async function goToProductPage() {
    navigateTo(`/products/${productDetails?.value?.handle}?id=${productDetails?.value?.id}`);
}
</script>